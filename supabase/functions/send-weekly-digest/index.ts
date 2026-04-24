// Weekly digest sender — emails subscribers a "what's happening in your state" summary.
// Trigger via cron (e.g., pg_cron Monday 9am):
//   SELECT net.http_post('https://<project>.functions.supabase.co/send-weekly-digest', '{}'::jsonb);
// Or hit it manually with curl + the SUPABASE_SERVICE_ROLE_KEY for testing.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const FROM_EMAIL = Deno.env.get("DIGEST_FROM_EMAIL") || "Civil Rights Hub <onboarding@resend.dev>";

interface DigestSubscription {
  id: string;
  user_id: string;
  state: string | null;
  frequency: string;
  last_sent_at: string | null;
}

interface DigestPayload {
  state: string | null;
  violations: Array<{ title: string; location_city: string | null; location_state: string; created_at: string }>;
  foiaCount: number;
  scanners: Array<{ scanner_name: string; city: string | null; state: string }>;
  attorneys: Array<{ name: string; firm_name: string | null; city: string | null; state: string }>;
}

function buildHtml(payload: DigestPayload, recipientName: string | null): string {
  const where = payload.state ?? "the United States";
  const violationItems = payload.violations
    .map(
      (v) =>
        `<li style="margin:8px 0;"><strong>${escapeHtml(v.title)}</strong><br><span style="color:#64748b;font-size:13px;">${escapeHtml(
          [v.location_city, v.location_state].filter(Boolean).join(", "),
        )}</span></li>`,
    )
    .join("");
  const scannerItems = payload.scanners
    .map(
      (s) =>
        `<li style="margin:6px 0;">${escapeHtml(s.scanner_name)} <span style="color:#64748b;font-size:13px;">— ${escapeHtml(
          [s.city, s.state].filter(Boolean).join(", "),
        )}</span></li>`,
    )
    .join("");
  const attorneyItems = payload.attorneys
    .map(
      (a) =>
        `<li style="margin:6px 0;"><strong>${escapeHtml(a.name)}</strong> <span style="color:#64748b;font-size:13px;">— ${escapeHtml(
          a.firm_name ?? "Independent",
        )}, ${escapeHtml([a.city, a.state].filter(Boolean).join(", "))}</span></li>`,
    )
    .join("");

  return `<!doctype html>
<html><body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f8fafc;margin:0;padding:24px;color:#0f172a;">
  <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:12px;padding:32px;border:1px solid #e2e8f0;">
    <p style="font-size:12px;font-weight:700;color:#3b82f6;letter-spacing:0.08em;text-transform:uppercase;margin:0 0 8px;">Civil Rights Hub · Weekly</p>
    <h1 style="font-size:24px;margin:0 0 8px;line-height:1.2;">${recipientName ? `Hi ${escapeHtml(recipientName)}, ` : ""}here's ${escapeHtml(where)} this week</h1>
    <p style="color:#64748b;margin:0 0 24px;">A quick look at civil-rights activity in your area.</p>

    <h2 style="font-size:14px;text-transform:uppercase;letter-spacing:0.06em;color:#64748b;margin:24px 0 8px;">🚨 Recent reports (${payload.violations.length})</h2>
    <ul style="padding-left:18px;margin:0;">${violationItems || "<li style='color:#94a3b8;'>No new reports this week.</li>"}</ul>

    ${
      payload.foiaCount > 0
        ? `<h2 style="font-size:14px;text-transform:uppercase;letter-spacing:0.06em;color:#64748b;margin:24px 0 8px;">⏰ Your FOIA requests</h2>
           <p style="margin:0;">You have <strong>${payload.foiaCount}</strong> open FOIA request${payload.foiaCount === 1 ? "" : "s"}.</p>`
        : ""
    }

    <h2 style="font-size:14px;text-transform:uppercase;letter-spacing:0.06em;color:#64748b;margin:24px 0 8px;">📻 Top scanners</h2>
    <ul style="padding-left:18px;margin:0;">${scannerItems || "<li style='color:#94a3b8;'>No active scanners.</li>"}</ul>

    <h2 style="font-size:14px;text-transform:uppercase;letter-spacing:0.06em;color:#64748b;margin:24px 0 8px;">⚖️ Attorneys to know</h2>
    <ul style="padding-left:18px;margin:0;">${attorneyItems || "<li style='color:#94a3b8;'>No new attorney listings.</li>"}</ul>

    <hr style="border:none;border-top:1px solid #e2e8f0;margin:32px 0;">
    <p style="font-size:12px;color:#94a3b8;margin:0;">You're getting this because you subscribed to weekly civil-rights updates. <a href="${Deno.env.get("PUBLIC_SITE_URL") || "https://civilrights.lovable.app"}/profile" style="color:#3b82f6;">Manage preferences</a>.</p>
  </div>
</body></html>`;
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

async function sendEmail(to: string, subject: string, html: string): Promise<{ ok: boolean; error?: string }> {
  if (!RESEND_API_KEY) {
    return { ok: false, error: "RESEND_API_KEY not configured" };
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: FROM_EMAIL, to, subject, html }),
  });
  if (!res.ok) {
    const text = await res.text();
    return { ok: false, error: `Resend ${res.status}: ${text}` };
  }
  return { ok: true };
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const admin = createClient(supabaseUrl, serviceKey);

    let body: { dryRun?: boolean; userId?: string } = {};
    try {
      body = await req.json();
    } catch {
      // empty body is fine
    }

    // Pick subscribers due for a send (>= 6 days since last send for weekly).
    const cutoff = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString();
    let query = admin
      .from("digest_subscriptions")
      .select("id, user_id, state, frequency, last_sent_at")
      .eq("enabled", true);

    if (body.userId) {
      query = query.eq("user_id", body.userId);
    } else {
      query = query.or(`last_sent_at.is.null,last_sent_at.lte.${cutoff}`);
    }

    const { data: subs, error: subsErr } = await query;
    if (subsErr) throw subsErr;

    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const results: Array<{ user_id: string; ok: boolean; error?: string }> = [];

    for (const sub of (subs ?? []) as DigestSubscription[]) {
      // Resolve recipient email + name
      const { data: userRes } = await admin.auth.admin.getUserById(sub.user_id);
      const email = userRes?.user?.email;
      const recipientName =
        (userRes?.user?.user_metadata?.display_name as string | undefined) ?? null;
      if (!email) {
        results.push({ user_id: sub.user_id, ok: false, error: "no email" });
        continue;
      }

      // Pull payload data
      const violationsQ = admin
        .from("violations")
        .select("title, location_city, location_state, created_at")
        .gte("created_at", since)
        .order("created_at", { ascending: false })
        .limit(5);
      if (sub.state) violationsQ.eq("location_state", sub.state);

      const scannersQ = admin
        .from("scanner_links")
        .select("scanner_name, city, state")
        .eq("is_active", true)
        .order("listener_count", { ascending: false, nullsFirst: false })
        .limit(3);
      if (sub.state) scannersQ.eq("state", sub.state);

      const attorneysQ = admin
        .from("attorneys")
        .select("name, firm_name, city, state")
        .order("created_at", { ascending: false })
        .limit(3);
      if (sub.state) attorneysQ.eq("state", sub.state);

      const foiaCountQ = admin
        .from("foia_requests")
        .select("id", { count: "exact", head: true })
        .eq("user_id", sub.user_id)
        .not("status", "in", "(completed,denied)");

      const [vRes, sRes, aRes, fRes] = await Promise.all([violationsQ, scannersQ, attorneysQ, foiaCountQ]);

      const payload: DigestPayload = {
        state: sub.state,
        violations: (vRes.data ?? []) as DigestPayload["violations"],
        scanners: (sRes.data ?? []) as DigestPayload["scanners"],
        attorneys: (aRes.data ?? []) as DigestPayload["attorneys"],
        foiaCount: fRes.count ?? 0,
      };

      // Skip if nothing to say
      if (payload.violations.length === 0 && payload.foiaCount === 0 && payload.scanners.length === 0 && payload.attorneys.length === 0) {
        results.push({ user_id: sub.user_id, ok: true, error: "skipped: no content" });
        continue;
      }

      const subject = `📍 ${sub.state ?? "Civil Rights"} weekly: ${payload.violations.length} new report${payload.violations.length === 1 ? "" : "s"}`;
      const html = buildHtml(payload, recipientName);

      if (body.dryRun) {
        results.push({ user_id: sub.user_id, ok: true, error: "dry run" });
        continue;
      }

      const send = await sendEmail(email, subject, html);
      results.push({ user_id: sub.user_id, ...send });

      if (send.ok) {
        await admin
          .from("digest_subscriptions")
          .update({ last_sent_at: new Date().toISOString() })
          .eq("id", sub.id);
      }
    }

    return new Response(JSON.stringify({ processed: results.length, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
