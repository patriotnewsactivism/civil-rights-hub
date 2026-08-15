import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Classifies a comment as troll/bad-faith vs genuine engagement — this ASSISTS
// human moderators (writes a reviewable verdict), it never auto-deletes.
// Disagreement with Don's own reporting, or with other users, is explicitly
// NOT "troll" on its own — only real bad-faith conduct is.
const SYSTEM_PROMPT = `You are a content moderation assistant for a civil rights advocacy platform (CivilRightsHub.org). Your job is to help human moderators triage comments — you do NOT have authority to remove anything yourself.

Classify the comment as one of:
- "genuine": real engagement, even if critical, angry, or disagreeing with the post/other users. Disagreement, harsh criticism, and strong opinions about civil rights issues, police conduct, or the platform's own reporting are NOT troll behavior.
- "troll": bad-faith conduct — harassment or personal attacks on a specific person, off-topic derailment/spam, deliberate provocation with no substantive point, doxxing attempts, or repeated bad-faith arguing (moving goalposts, arguing in circles to waste time rather than engage).
- "uncertain": genuinely ambiguous — err toward this rather than forcing a call when unsure, since a false "troll" label wrongly targeting a genuine critic is a worse outcome than leaving something for human review.

Respond with ONLY a JSON object, no markdown fences, no extra text:
{"label": "genuine" | "troll" | "uncertain", "confidence": 0.0-1.0, "reasoning": "one or two sentences explaining the call"}`;

interface ProviderConfig {
  name: string;
  envVar: string;
  url: string;
  model: string;
}

// Order matches the portfolio-wide confirmed-live chain (Cerebras -> Groq ->
// Cohere), all OpenAI-compatible chat/completions endpoints.
const PROVIDERS: ProviderConfig[] = [
  { name: "cerebras", envVar: "CEREBRAS_API_KEY", url: "https://api.cerebras.ai/v1/chat/completions", model: "gpt-oss-120b" },
  { name: "groq", envVar: "GROQ_API_KEY", url: "https://api.groq.com/openai/v1/chat/completions", model: "llama-3.3-70b-versatile" },
  { name: "cohere", envVar: "COHERE_API_KEY", url: "https://api.cohere.ai/compatibility/v1/chat/completions", model: "command-r-plus-08-2024" },
  // Kept as last-resort fallbacks matching this repo's existing legal-assistant
  // function pattern, in case Don ever configures either of these here too.
  { name: "deepseek", envVar: "DEEPSEEK_API_KEY", url: "https://api.deepseek.com/v1/chat/completions", model: "deepseek-chat" },
  { name: "google", envVar: "GOOGLE_AI_API_KEY", url: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions", model: "gemini-2.0-flash" },
];

interface Verdict {
  label: "genuine" | "troll" | "uncertain";
  confidence: number;
  reasoning: string;
}

function parseVerdict(raw: string): Verdict | null {
  try {
    // Strip markdown fences if the model added them despite instructions.
    const cleaned = raw.trim().replace(/^```(json)?/i, "").replace(/```$/, "").trim();
    const parsed = JSON.parse(cleaned);
    if (
      typeof parsed.label === "string" &&
      ["genuine", "troll", "uncertain"].includes(parsed.label) &&
      typeof parsed.confidence === "number" &&
      typeof parsed.reasoning === "string"
    ) {
      return {
        label: parsed.label,
        confidence: Math.max(0, Math.min(1, parsed.confidence)),
        reasoning: parsed.reasoning,
      };
    }
    return null;
  } catch {
    return null;
  }
}

async function classifyWithProvider(
  provider: ProviderConfig,
  apiKey: string,
  commentContent: string
): Promise<Verdict | null> {
  const response = await fetch(provider.url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: provider.model,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Comment to classify:\n"""${commentContent}"""` },
      ],
      max_tokens: 200,
      temperature: 0.1,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error(`${provider.name} failed: ${response.status} ${errText}`);
    return null;
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) {
    console.error(`${provider.name} returned no content:`, JSON.stringify(data));
    return null;
  }

  return parseVerdict(content);
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { comment_id } = await req.json();
    if (!comment_id) {
      return new Response(JSON.stringify({ error: "comment_id is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    const { data: comment, error: commentError } = await supabase
      .from("comments")
      .select("id, content")
      .eq("id", comment_id)
      .single();

    if (commentError || !comment) {
      return new Response(JSON.stringify({ error: "Comment not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let verdict: Verdict | null = null;
    let providerUsed = "";
    const errors: string[] = [];

    for (const provider of PROVIDERS) {
      const apiKey = Deno.env.get(provider.envVar);
      if (!apiKey || apiKey.length < 10) continue;

      try {
        verdict = await classifyWithProvider(provider, apiKey, comment.content);
        if (verdict) {
          providerUsed = provider.name;
          break;
        }
        errors.push(`${provider.name}: returned unparseable response`);
      } catch (err) {
        errors.push(`${provider.name}: ${err instanceof Error ? err.message : String(err)}`);
      }
    }

    if (!verdict) {
      console.error("All moderation providers failed:", errors.join(" | "));
      return new Response(
        JSON.stringify({ error: "All moderation providers failed", details: errors }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { error: upsertError } = await supabase
      .from("comment_moderation_verdicts")
      .upsert(
        {
          comment_id: comment.id,
          label: verdict.label,
          confidence: verdict.confidence,
          reasoning: verdict.reasoning,
          provider_used: providerUsed,
        },
        { onConflict: "comment_id" }
      );

    if (upsertError) {
      console.error("Failed to store verdict:", upsertError);
      return new Response(JSON.stringify({ error: "Failed to store verdict", details: upsertError.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ verdict, provider_used: providerUsed }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in moderate-comment:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
