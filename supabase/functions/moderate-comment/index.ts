import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const ALLOWED_ORIGINS = new Set([
  "https://civilrightshub.org",
  "https://www.civilrightshub.org",
  "http://localhost:5173",
]);

function corsHeadersFor(req: Request) {
  const origin = req.headers.get("origin") ?? "";
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGINS.has(origin) ? origin : "https://civilrightshub.org",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    Vary: "Origin",
  };
}

function jsonResponse(req: Request, body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeadersFor(req), "Content-Type": "application/json" },
  });
}

// Classifies a comment as troll/bad-faith vs genuine engagement. This only
// assists human moderation; it never removes or hides content automatically.
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

const PROVIDERS: ProviderConfig[] = [
  { name: "cerebras", envVar: "CEREBRAS_API_KEY", url: "https://api.cerebras.ai/v1/chat/completions", model: "gpt-oss-120b" },
  { name: "groq", envVar: "GROQ_API_KEY", url: "https://api.groq.com/openai/v1/chat/completions", model: "llama-3.3-70b-versatile" },
  { name: "cohere", envVar: "COHERE_API_KEY", url: "https://api.cohere.ai/compatibility/v1/chat/completions", model: "command-r-plus-08-2024" },
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
        reasoning: parsed.reasoning.slice(0, 1200),
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
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);

  try {
    const response = await fetch(provider.url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: provider.model,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: `Comment to classify:\n"""${commentContent.slice(0, 12000)}"""` },
        ],
        max_tokens: 200,
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      console.error(`${provider.name} moderation request failed with HTTP ${response.status}`);
      return null;
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content) {
      console.error(`${provider.name} moderation response contained no content`);
      return null;
    }

    return parseVerdict(content);
  } finally {
    clearTimeout(timeout);
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeadersFor(req) });
  }
  if (req.method !== "POST") {
    return jsonResponse(req, { error: "Method not allowed" }, 405);
  }

  try {
    const authorization = req.headers.get("authorization") ?? "";
    const token = authorization.toLowerCase().startsWith("bearer ")
      ? authorization.slice(7).trim()
      : "";

    if (!token) {
      return jsonResponse(req, { error: "Authentication required" }, 401);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !serviceKey) {
      console.error("moderate-comment is missing required Supabase runtime configuration");
      return jsonResponse(req, { error: "Moderation service unavailable" }, 503);
    }

    const service = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data: authData, error: authError } = await service.auth.getUser(token);
    const actor = authData.user;
    if (authError || !actor) {
      return jsonResponse(req, { error: "Invalid or expired session" }, 401);
    }

    let payload: { comment_id?: unknown };
    try {
      payload = await req.json();
    } catch {
      return jsonResponse(req, { error: "Invalid JSON body" }, 400);
    }

    const commentId = typeof payload.comment_id === "string" ? payload.comment_id.trim() : "";
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(commentId)) {
      return jsonResponse(req, { error: "Valid comment_id is required" }, 400);
    }

    const { data: comment, error: commentError } = await service
      .from("comments")
      .select("id, content, user_id")
      .eq("id", commentId)
      .maybeSingle();

    if (commentError) {
      console.error("Failed to load comment for moderation", commentError.message);
      return jsonResponse(req, { error: "Moderation service unavailable" }, 503);
    }
    if (!comment) {
      return jsonResponse(req, { error: "Comment not found" }, 404);
    }

    // The normal browser call happens immediately after the authenticated user
    // creates their own comment. Binding the request to that author prevents an
    // arbitrary caller from spending provider quota or using the service role to
    // inspect/classify another user's comment by guessing its id.
    if (comment.user_id !== actor.id) {
      return jsonResponse(req, { error: "Not authorized to moderate this comment" }, 403);
    }

    // A stored verdict is immutable from this function's caller perspective and
    // also acts as a replay guard against repeated paid/provider invocations.
    const { data: existingVerdict, error: verdictReadError } = await service
      .from("comment_moderation_verdicts")
      .select("label, confidence, reasoning, provider_used")
      .eq("comment_id", comment.id)
      .maybeSingle();

    if (verdictReadError) {
      console.error("Failed to check existing moderation verdict", verdictReadError.message);
      return jsonResponse(req, { error: "Moderation service unavailable" }, 503);
    }
    if (existingVerdict) {
      return jsonResponse(req, {
        verdict: {
          label: existingVerdict.label,
          confidence: existingVerdict.confidence,
          reasoning: existingVerdict.reasoning,
        },
        provider_used: existingVerdict.provider_used,
        cached: true,
      });
    }

    const normalizedContent = typeof comment.content === "string" ? comment.content.trim() : "";
    if (!normalizedContent) {
      return jsonResponse(req, { error: "Comment has no content to classify" }, 422);
    }

    let verdict: Verdict | null = null;
    let providerUsed = "";

    for (const provider of PROVIDERS) {
      const apiKey = Deno.env.get(provider.envVar);
      if (!apiKey || apiKey.length < 10) continue;

      try {
        verdict = await classifyWithProvider(provider, apiKey, normalizedContent);
        if (verdict) {
          providerUsed = provider.name;
          break;
        }
      } catch (error) {
        const reason = error instanceof Error ? error.name : "unknown_error";
        console.error(`${provider.name} moderation provider failed: ${reason}`);
      }
    }

    if (!verdict) {
      console.error("All configured moderation providers failed");
      return jsonResponse(req, { error: "Moderation service temporarily unavailable" }, 502);
    }

    const { error: upsertError } = await service
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
      console.error("Failed to store moderation verdict", upsertError.message);
      return jsonResponse(req, { error: "Moderation result could not be stored" }, 503);
    }

    return jsonResponse(req, { verdict, provider_used: providerUsed, cached: false });
  } catch (error) {
    const reason = error instanceof Error ? error.name : "unknown_error";
    console.error(`Unhandled moderate-comment failure: ${reason}`);
    return jsonResponse(req, { error: "Moderation service unavailable" }, 500);
  }
});
