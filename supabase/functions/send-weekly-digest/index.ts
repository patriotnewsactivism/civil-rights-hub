// Weekly digest delivery is intentionally paused while Civil Rights Hub rebuilds
// public-data provenance and subscription delivery controls.
//
// The previous implementation queried public attorney, incident, and scanner
// tables with the service-role client. Service-role queries bypass RLS, so a
// legacy verification flag could leak a held record into email even when the
// website itself failed closed. The old endpoint also lacked a dedicated cron
// authentication secret.
//
// Do not restore delivery by simply removing this guard. A replacement must:
//   1. read public datasets through an RLS-enforced client (never service role),
//   2. require the reviewed provenance policies to be applied in production,
//   3. authenticate scheduler invocations with a dedicated secret,
//   4. use the same confirmed subscription source as the public signup flow, and
//   5. provide a tested unsubscribe/preferences path before sending mail.

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
      reason: "Weekly digest delivery is paused pending the verified-data and subscription-delivery rebuild.",
    }),
    {
      status: 503,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    },
  );
});
