import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

// 1x1 transparent GIF
const PIXEL_GIF = new Uint8Array([
  71, 73, 70, 56, 57, 97, 1, 0, 1, 0, 128, 0, 0, 0, 0, 0, 255, 255, 255,
  33, 249, 4, 1, 0, 0, 0, 0, 44, 0, 0, 0, 0, 1, 0, 1, 0, 0, 2, 2, 68, 1, 0, 59,
]);

serve(async (req) => {
  const url = new URL(req.url);
  // Path: /track-foia-open/{token}.gif  or  /track-foia-open/{token}
  const pathParts = url.pathname.split("/").filter(Boolean);
  const tokenRaw = pathParts[pathParts.length - 1];
  const token = tokenRaw.replace(/\.gif$/, "");

  if (token && token.length > 10) {
    try {
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
      );

      const now = new Date().toISOString();

      // Update tracking record
      const { data: tracking } = await supabase
        .from("foia_email_tracking")
        .select("id, foia_request_id, opened_at, open_count")
        .eq("tracking_token", token)
        .single();

      if (tracking) {
        // Update tracking row
        await supabase
          .from("foia_email_tracking")
          .update({
            opened_at: tracking.opened_at || now,
            open_count: (tracking.open_count || 0) + 1,
          })
          .eq("tracking_token", token);

        // Update foia_request if first open
        if (!tracking.opened_at) {
          await supabase
            .from("foia_requests")
            .update({ email_opened_at: now })
            .eq("id", tracking.foia_request_id);

          // Log it
          await supabase.from("foia_request_updates").insert({
            request_id: tracking.foia_request_id,
            update_type: "email_opened",
            old_status: null,
            new_status: null,
            message: `Agency opened the FOIA email on ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`,
          });
        }
      }
    } catch (e) {
      console.error("Tracking error:", e);
    }
  }

  return new Response(PIXEL_GIF, {
    headers: {
      "Content-Type": "image/gif",
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "Pragma": "no-cache",
      "Expires": "0",
    },
  });
});
