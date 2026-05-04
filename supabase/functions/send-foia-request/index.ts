import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const APP_URL = Deno.env.get("APP_URL") || "https://civilrightshub.org";
const FROM_EMAIL = "Civil Rights Hub <requests@civilrightshub.org>";

interface SendFOIAPayload {
  requestId: string;
  agencyEmail: string;
  subject: string;
  requestBody: string;
  requesterName: string;
  requesterEmail: string;
  agencyName: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify user
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const anonClient = createClient(SUPABASE_URL, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: authError } = await anonClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const payload: SendFOIAPayload = await req.json();
    const { requestId, agencyEmail, subject, requestBody, requesterName, requesterEmail, agencyName } = payload;

    // Verify the request belongs to this user
    const { data: foiaRequest, error: reqError } = await supabase
      .from("foia_requests")
      .select("*")
      .eq("id", requestId)
      .eq("user_id", user.id)
      .single();

    if (reqError || !foiaRequest) {
      return new Response(JSON.stringify({ error: "Request not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Generate tracking token
    const trackingToken = crypto.randomUUID();
    const trackingPixelUrl = `${APP_URL}/api/track/${trackingToken}`;

    // Build email HTML
    const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    const emailHtml = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><style>
  body { font-family: Georgia, serif; font-size: 14px; line-height: 1.6; color: #1a1a1a; max-width: 700px; margin: 0 auto; padding: 40px 20px; }
  .header { border-bottom: 2px solid #1a1a1a; padding-bottom: 16px; margin-bottom: 24px; }
  .footer { border-top: 1px solid #ccc; padding-top: 16px; margin-top: 24px; font-size: 12px; color: #666; }
  pre { white-space: pre-wrap; font-family: Georgia, serif; }
</style></head>
<body>
<div class="header">
  <strong>FREEDOM OF INFORMATION ACT REQUEST</strong><br>
  <small>Submitted via Civil Rights Hub — civilrightshub.org</small>
</div>

<p>${today}</p>
<p><strong>${agencyName}</strong><br>
FOIA/Records Division</p>

<p>Dear FOIA Officer:</p>

<pre>${requestBody}</pre>

<p>Sincerely,</p>
<p><strong>${requesterName}</strong><br>
${requesterEmail}</p>

<div class="footer">
  <p>This request was submitted electronically via <a href="${APP_URL}">Civil Rights Hub</a>. 
  Please reply to <strong>${requesterEmail}</strong> with your tracking number and acknowledgment.</p>
  <p>Request ID: ${requestId}</p>
</div>

<img src="${trackingPixelUrl}.gif" width="1" height="1" style="display:none;" alt="" />
</body>
</html>`;

    // Send via Resend
    if (!RESEND_API_KEY) {
      return new Response(JSON.stringify({ error: "Email service not configured. Please add RESEND_API_KEY." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [agencyEmail],
        reply_to: requesterEmail,
        subject: `FOIA Request: ${subject}`,
        html: emailHtml,
        tags: [{ name: "type", value: "foia_request" }, { name: "request_id", value: requestId }],
      }),
    });

    const emailResult = await emailResponse.json();

    if (!emailResponse.ok) {
      console.error("Resend error:", emailResult);
      return new Response(JSON.stringify({ error: `Email failed: ${emailResult.message || "Unknown error"}` }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const now = new Date().toISOString();

    // Store tracking token
    await supabase.from("foia_email_tracking").insert({
      foia_request_id: requestId,
      tracking_token: trackingToken,
      sent_at: now,
      recipient_email: agencyEmail,
    });

    // Update FOIA request status
    await supabase
      .from("foia_requests")
      .update({
        status: "submitted",
        submitted_date: now,
        email_sent_at: now,
        email_tracking_id: trackingToken,
        agency_email: agencyEmail,
        updated_at: now,
      })
      .eq("id", requestId);

    // Log the update
    await supabase.from("foia_request_updates").insert({
      request_id: requestId,
      update_type: "email_sent",
      old_status: foiaRequest.status || "draft",
      new_status: "submitted",
      message: `Request emailed to ${agencyEmail} on ${today}`,
      created_by: user.id,
    });

    // Send confirmation email to requester
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [requesterEmail],
        subject: `✅ FOIA Request Sent — ${subject}`,
        html: `<!DOCTYPE html>
<html><body style="font-family:-apple-system,sans-serif;max-width:560px;margin:0 auto;padding:32px 20px;color:#1a1a1a;">
  <div style="background:#1d4ed8;color:white;padding:24px;border-radius:8px 8px 0 0;">
    <h1 style="margin:0;font-size:20px;">⚖️ Civil Rights Hub</h1>
    <p style="margin:8px 0 0;opacity:0.9;font-size:14px;">Your FOIA Request Has Been Sent</p>
  </div>
  <div style="border:1px solid #e2e8f0;border-top:none;padding:24px;border-radius:0 0 8px 8px;">
    <h2 style="margin-top:0;">Request confirmed</h2>
    <p>Your Freedom of Information Act request has been submitted to <strong>${agencyName}</strong>.</p>
    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      <tr><td style="padding:8px 0;color:#64748b;">Agency</td><td style="padding:8px 0;"><strong>${agencyName}</strong></td></tr>
      <tr><td style="padding:8px 0;color:#64748b;">Subject</td><td style="padding:8px 0;"><strong>${subject}</strong></td></tr>
      <tr><td style="padding:8px 0;color:#64748b;">Sent to</td><td style="padding:8px 0;">${agencyEmail}</td></tr>
      <tr><td style="padding:8px 0;color:#64748b;">Sent on</td><td style="padding:8px 0;">${today}</td></tr>
      <tr><td style="padding:8px 0;color:#64748b;">Request ID</td><td style="padding:8px 0;font-family:monospace;font-size:12px;">${requestId.slice(0, 8).toUpperCase()}</td></tr>
    </table>
    <p style="background:#fef3c7;padding:12px;border-radius:6px;font-size:13px;margin:16px 0;">
      <strong>⏱️ Next step:</strong> Most agencies must acknowledge your request within a few business days. 
      We'll remind you if the deadline approaches without a response.
    </p>
    <a href="${APP_URL}/tools#foia-tracker" style="display:inline-block;background:#1d4ed8;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600;">
      Track Your Request →
    </a>
  </div>
  <p style="font-size:12px;color:#94a3b8;margin-top:16px;text-align:center;">Civil Rights Hub · civilrightshub.org</p>
</body></html>`,
      }),
    });

    return new Response(JSON.stringify({
      success: true,
      emailId: emailResult.id,
      trackingToken,
      sentAt: now,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("send-foia-request error:", error);
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
