const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve((req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  return new Response(JSON.stringify({
    error: "Email open tracking is disabled because tracking pixels cannot reliably prove that an agency recipient personally opened a request."
  }), {
    status: 503,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
