import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const FROM_EMAIL = "CivilRightsHub <noreply@civilrightshub.org>";
const SITE_URL = "https://civilrightshub.org";

const STATE_RESPONSE_DAYS: Record<string, number> = {
  "Federal":20,"California":10,"New York":5,"Texas":10,"Florida":10,"Illinois":5,"Pennsylvania":5,
  "Ohio":10,"Georgia":3,"North Carolina":10,"Michigan":5,"New Jersey":7,"Virginia":5,"Washington":5,
  "Arizona":5,"Massachusetts":10,"Tennessee":7,"Indiana":7,"Missouri":3,"Maryland":10,"Wisconsin":10,
  "Colorado":3,"Minnesota":10,"South Carolina":15,"Alabama":10,"Louisiana":3,"Kentucky":3,"Oregon":5,
  "Oklahoma":3,"Connecticut":4,"Utah":10,"Iowa":10,"Nevada":5,"Arkansas":3,"Mississippi":7,"Kansas":3,
  "New Mexico":15,"Nebraska":4,"West Virginia":5,"Idaho":3,"Hawaii":10,"New Hampshire":5,"Maine":5,
  "Montana":5,"Rhode Island":10,"Delaware":15,"South Dakota":5,"North Dakota":5,"Alaska":10,"Vermont":3,"Wyoming":5,
};

async function sendEmail(to: string, subject: string, html: string) {
  if (!RESEND_API_KEY) return;
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Authorization": `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: FROM_EMAIL, to, subject, html }),
    });
  } catch (e) { console.error("Email send failed:", e); }
}

function deadlineReminderHtml(req: any, daysUntil: number) {
  const deadline = new Date(req.response_deadline).toLocaleDateString("en-US", { weekday:"long", year:"numeric", month:"long", day:"numeric" });
  const urgent = daysUntil <= 3;
  return `<div style="font-family:sans-serif;max-width:600px;margin:0 auto">
    <div style="background:${urgent?"#dc2626":"#1e40af"};padding:20px;border-radius:8px 8px 0 0">
      <h1 style="color:white;margin:0;font-size:20px">${urgent?"🚨":"⏰"} FOIA Deadline ${urgent?"Urgent — ":""} ${daysUntil} Day${daysUntil!==1?"s":""} Left</h1>
    </div>
    <div style="padding:24px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px">
      <p style="font-size:16px"><strong>${req.agency_name}</strong> must respond to your request within <strong style="color:${urgent?"#dc2626":"#1e40af"}">${daysUntil} day${daysUntil!==1?"s":""}</strong>.</p>
      <div style="background:#f9fafb;border-radius:8px;padding:16px;margin:16px 0">
        <p style="margin:0 0 4px;color:#6b7280;font-size:12px">REQUEST</p>
        <p style="margin:0;font-weight:600">${req.request_subject}</p>
        <p style="margin:6px 0 0;color:#6b7280;font-size:13px">Deadline: ${deadline}</p>
      </div>
      <p><strong>What to do now:</strong></p>
      <ul style="padding-left:20px;line-height:1.8">
        <li>Send a follow-up to ${req.agency_name} citing the approaching deadline</li>
        <li>If they miss it, you can file an appeal immediately — it's a constructive denial</li>
        <li>Log any correspondence in your request timeline</li>
      </ul>
      <a href="${SITE_URL}/public-records" style="background:#3b82f6;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;display:inline-block;margin-top:16px;font-weight:600">View My Requests →</a>
    </div>
  </div>`;
}

function overdueAlertHtml(req: any, daysOver: number) {
  return `<div style="font-family:sans-serif;max-width:600px;margin:0 auto">
    <div style="background:#dc2626;padding:20px;border-radius:8px 8px 0 0">
      <h1 style="color:white;margin:0;font-size:20px">🚨 OVERDUE — ${daysOver} Day${daysOver!==1?"s":""} Late</h1>
    </div>
    <div style="padding:24px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px">
      <p style="font-size:16px"><strong>${req.agency_name}</strong> is <strong style="color:#dc2626">${daysOver} day${daysOver!==1?"s":""} overdue</strong> on your public records request.</p>
      <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:16px;margin:16px 0">
        <p style="margin:0;font-weight:600;color:#b91c1c">${req.request_subject}</p>
      </div>
      <p><strong>You can act now:</strong></p>
      <ol style="padding-left:20px;line-height:1.8">
        <li>File a formal administrative <strong>appeal</strong> — non-response is a constructive denial</li>
        <li>Contact the agency's Inspector General or oversight body</li>
        <li>Share publicly using CivilRightsHub's Social Content Studio to apply pressure</li>
        <li>For federal agencies, contact OGIS (Office of Government Information Services)</li>
      </ol>
      <a href="${SITE_URL}/public-records" style="background:#dc2626;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;display:inline-block;margin-top:16px;font-weight:600">Generate Appeal Letter →</a>
    </div>
  </div>`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const now = new Date();

    const { data: requests, error } = await supabase
      .from("foia_requests")
      .select("id, user_id, agency_name, request_subject, status, response_deadline, reminder_7day_sent, reminder_3day_sent, reminder_overdue_sent")
      .not("status", "in", '("fulfilled","denied","closed","withdrawn","completed")')
      .not("response_deadline", "is", null);

    if (error) throw error;

    const stats = { checked: requests?.length ?? 0, in_app: 0, emails: 0 };

    for (const r of (requests || [])) {
      const deadline = new Date(r.response_deadline);
      const daysUntil = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      // Get user email
      const { data: { user } } = await supabase.auth.admin.getUserById(r.user_id);
      const email = user?.email;

      let notifTitle: string | null = null;
      let notifMsg: string | null = null;
      let updateCols: Record<string, any> = {};
      let emailSubject: string | null = null;
      let emailHtml: string | null = null;

      if (daysUntil === 7 && !r.reminder_7day_sent) {
        notifTitle = "⏰ FOIA Deadline in 1 Week";
        notifMsg = `${r.agency_name} must respond to "${r.request_subject}" in 7 days.`;
        updateCols = { reminder_7day_sent: true };
        emailSubject = `⏰ Reminder: ${r.agency_name} has 7 days left to respond`;
        emailHtml = deadlineReminderHtml(r, 7);
      } else if (daysUntil === 3 && !r.reminder_3day_sent) {
        notifTitle = "🚨 FOIA Deadline in 3 Days";
        notifMsg = `${r.agency_name} must respond to "${r.request_subject}" in 3 days!`;
        updateCols = { reminder_3day_sent: true };
        emailSubject = `🚨 Urgent: ${r.agency_name} has only 3 days left`;
        emailHtml = deadlineReminderHtml(r, 3);
      } else if (daysUntil < 0 && !r.reminder_overdue_sent) {
        const daysOver = Math.abs(daysUntil);
        notifTitle = "🚨 FOIA Response Overdue";
        notifMsg = `${r.agency_name} is ${daysOver} day${daysOver!==1?"s":""} overdue on "${r.request_subject}". You can file an appeal now.`;
        updateCols = { reminder_overdue_sent: true, status: r.status === "submitted" || r.status === "pending" ? "overdue" : r.status };
        emailSubject = `🚨 OVERDUE: ${r.agency_name} is ${daysOver} days late`;
        emailHtml = overdueAlertHtml(r, daysOver);
      }

      if (notifTitle) {
        // In-app notification
        await supabase.from("notifications").insert({
          user_id: r.user_id,
          title: notifTitle,
          message: notifMsg,
          type: "deadline",
          related_entity_type: "foia_request",
          related_entity_id: r.id,
        });
        stats.in_app++;

        // Email notification
        if (email && emailSubject && emailHtml) {
          await sendEmail(email, emailSubject, emailHtml);
          stats.emails++;
        }

        // Mark as sent
        if (Object.keys(updateCols).length > 0) {
          await supabase.from("foia_requests").update(updateCols).eq("id", r.id);
        }
      }
    }

    return new Response(JSON.stringify({ ok: true, ...stats }), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
