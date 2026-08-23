// Case-law AI search is intentionally paused.
//
// The previous endpoint sent a legal query directly to a general-purpose LLM
// and returned generated case summaries/citations without retrieving a court or
// government source. That does not meet Civil Rights Hub's source-verification
// standard and can produce fabricated citations or holdings.
//
// A replacement must retrieve authoritative case material first, preserve the
// source URL/document identifier, and limit AI output to summaries grounded in
// those retrieved sources.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve((req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  return new Response(
    JSON.stringify({
      paused: true,
      reason: "Case-law search is paused until results are grounded in retrieved authoritative sources.",
    }),
    {
      status: 503,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    },
  );
});
