import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const ALLOWED_ORIGINS = new Set([
  "https://civilrightshub.org",
  "https://www.civilrightshub.org",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
]);

const MAX_BYTES = 50 * 1024 * 1024;

type DetectedFile = { mime: string; extension: string };

function corsHeaders(req: Request) {
  const origin = req.headers.get("origin") ?? "";
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGINS.has(origin) ? origin : "https://civilrightshub.org",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    Vary: "Origin",
  };
}

function startsWith(bytes: Uint8Array, signature: number[], offset = 0) {
  return signature.every((value, index) => bytes[offset + index] === value);
}

function ascii(bytes: Uint8Array, offset: number, length: number) {
  return new TextDecoder("ascii").decode(bytes.slice(offset, offset + length));
}

function detectFile(bytes: Uint8Array): DetectedFile | null {
  if (bytes.length < 4) return null;

  if (startsWith(bytes, [0xff, 0xd8, 0xff])) return { mime: "image/jpeg", extension: "jpg" };
  if (startsWith(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return { mime: "image/png", extension: "png" };
  if (ascii(bytes, 0, 4) === "RIFF" && ascii(bytes, 8, 4) === "WEBP") return { mime: "image/webp", extension: "webp" };
  if (ascii(bytes, 0, 5) === "%PDF-") return { mime: "application/pdf", extension: "pdf" };
  if (bytes.length >= 12 && ascii(bytes, 4, 4) === "ftyp") return { mime: "video/mp4", extension: "mp4" };
  if (startsWith(bytes, [0x1a, 0x45, 0xdf, 0xa3])) return { mime: "video/webm", extension: "webm" };
  if (ascii(bytes, 0, 4) === "OggS") return { mime: "audio/ogg", extension: "ogg" };
  if (ascii(bytes, 0, 3) === "ID3" || (bytes[0] === 0xff && (bytes[1] & 0xe0) === 0xe0)) {
    return { mime: "audio/mpeg", extension: "mp3" };
  }

  // Plain text is accepted only when the first sample has no NUL bytes and is
  // valid UTF-8. This is deliberately the final fallback, not MIME trust.
  const sample = bytes.slice(0, Math.min(bytes.length, 8192));
  if (!sample.includes(0)) {
    try {
      new TextDecoder("utf-8", { fatal: true }).decode(sample);
      return { mime: "text/plain", extension: "txt" };
    } catch {
      // fall through
    }
  }

  return null;
}

function cleanFilename(name: string) {
  const base = name.split(/[\\/]/).pop() || "evidence";
  return base.replace(/[^a-zA-Z0-9._ -]/g, "_").slice(0, 255);
}

function hex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer), (b) => b.toString(16).padStart(2, "0")).join("");
}

function json(req: Request, body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(req), "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders(req) });
  if (req.method !== "POST") return json(req, { error: "Method not allowed" }, 405);

  const authorization = req.headers.get("authorization") ?? "";
  const token = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
  if (!token) return json(req, { error: "Authentication required" }, 401);

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceKey) return json(req, { error: "Evidence service is not configured" }, 503);

  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: userData, error: userError } = await admin.auth.getUser(token);
  const user = userData.user;
  if (userError || !user) return json(req, { error: "Invalid session" }, 401);

  try {
    const form = await req.formData();
    const reportId = String(form.get("report_id") ?? "").trim();
    const description = String(form.get("description") ?? "").trim().slice(0, 2000) || null;
    const file = form.get("file");

    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(reportId)) {
      return json(req, { error: "Invalid report_id" }, 400);
    }
    if (!(file instanceof File)) return json(req, { error: "file is required" }, 400);
    if (file.size <= 0 || file.size > MAX_BYTES) return json(req, { error: "Evidence file must be between 1 byte and 50 MB" }, 413);

    const { data: report, error: reportError } = await admin
      .from("incident_reports")
      .select("id, reporter_id, status")
      .eq("id", reportId)
      .eq("reporter_id", user.id)
      .maybeSingle();

    if (reportError) {
      console.error("incident report lookup failed", reportError.message);
      return json(req, { error: "Unable to verify incident report" }, 500);
    }
    if (!report || !["draft", "needs_info"].includes(report.status)) {
      return json(req, { error: "Incident report is not editable" }, 403);
    }

    const bytes = new Uint8Array(await file.arrayBuffer());
    const detected = detectFile(bytes);
    if (!detected) {
      return json(req, { error: "Unsupported or unrecognized evidence file type" }, 415);
    }

    const digest = hex(await crypto.subtle.digest("SHA-256", bytes));
    const storagePath = `${user.id}/${reportId}/${crypto.randomUUID()}.${detected.extension}`;
    const originalFilename = cleanFilename(file.name);

    const { error: uploadError } = await admin.storage
      .from("incident-evidence")
      .upload(storagePath, bytes, {
        contentType: detected.mime,
        upsert: false,
        cacheControl: "0",
      });

    if (uploadError) {
      console.error("incident evidence upload failed", uploadError.message);
      return json(req, { error: "Evidence upload failed" }, 500);
    }

    const { data: evidence, error: metadataError } = await admin
      .from("incident_report_evidence")
      .insert({
        report_id: reportId,
        owner_id: user.id,
        storage_path: storagePath,
        original_filename: originalFilename,
        mime_type: detected.mime,
        byte_size: file.size,
        sha256: digest,
        description,
      })
      .select("id, report_id, original_filename, mime_type, byte_size, sha256, description, created_at")
      .single();

    if (metadataError) {
      console.error("incident evidence metadata insert failed", metadataError.message);
      await admin.storage.from("incident-evidence").remove([storagePath]);
      return json(req, { error: "Evidence registration failed" }, 500);
    }

    return json(req, { evidence }, 201);
  } catch (error) {
    console.error("upload-incident-evidence failure", error instanceof Error ? error.message : String(error));
    return json(req, { error: "Unable to process evidence upload" }, 500);
  }
});
