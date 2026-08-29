const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve((req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  return new Response(JSON.stringify({
    error: "Direct agency email delivery is disabled until recipient addresses, request labeling, and delivery claims are backed by reviewed official source data. Download the request and submit it through the agency's verified official channel instead."
  }), {
    status: 503,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
