import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query } = await req.json();
    // Prefer DeepSeek V4 Flash ($0.14/M tokens) — falls back to Lovable/Gemini
    const DEEPSEEK_API_KEY = Deno.env.get("DEEPSEEK_API_KEY");
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    const useDeepSeek = DEEPSEEK_API_KEY && DEEPSEEK_API_KEY.length > 10;
    const apiUrl = useDeepSeek ? "https://api.deepseek.com/v1/chat/completions" : "https://ai.gateway.lovable.dev/v1/chat/completions";
    const apiKey = useDeepSeek ? DEEPSEEK_API_KEY : LOVABLE_API_KEY;
    
    if (!apiKey) {
      throw new Error("No AI API key configured (set DEEPSEEK_API_KEY or LOVABLE_API_KEY)");
    }

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: useDeepSeek ? "deepseek-v4-flash" : "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: "You are a legal research assistant specializing in civil rights cases. Provide concise, relevant case summaries with citations. Focus on landmark cases, precedents, and their implications for civil rights."
          },
          {
            role: "user",
            content: query
          }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "Failed to search cases" }), {
        status: response.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const result = data.choices[0].message.content;

    return new Response(JSON.stringify({ result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in case-search:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
