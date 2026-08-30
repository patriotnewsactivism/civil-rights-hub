import { Sentry } from "@/lib/sentry";

type SocialSurface = "feed" | "discussions" | "events" | "network" | "stories" | "messages" | "notifications";

type SocialErrorContext = {
  surface: SocialSurface;
  operation: string;
  table?: string;
  code?: string | null;
  status?: number | string | null;
};

function errorCode(error: unknown): string | null {
  if (!error || typeof error !== "object") return null;
  const candidate = (error as Record<string, unknown>).code;
  return typeof candidate === "string" ? candidate.slice(0, 64) : null;
}

function errorStatus(error: unknown): number | string | null {
  if (!error || typeof error !== "object") return null;
  const candidate = (error as Record<string, unknown>).status;
  if (typeof candidate === "number") return candidate;
  if (typeof candidate === "string") return candidate.slice(0, 32);
  return null;
}

/**
 * Report social/community failures without sending user-authored content,
 * profile identifiers, locations, message bodies, or Supabase credentials.
 */
export function captureSocialError(error: unknown, context: SocialErrorContext) {
  const code = context.code ?? errorCode(error);
  const status = context.status ?? errorStatus(error);

  Sentry.withScope((scope) => {
    scope.setTag("area", "community");
    scope.setTag("social.surface", context.surface);
    scope.setTag("social.operation", context.operation);
    if (context.table) scope.setTag("social.table", context.table);
    if (code) scope.setTag("social.error_code", code);
    if (status !== null && status !== undefined) scope.setTag("social.status", String(status));

    // Deliberately do not attach raw Supabase error objects: constraint/error
    // messages can echo user-provided values. Sentry receives only bounded
    // operational metadata plus a generic exception name.
    const reportable = error instanceof Error
      ? new Error(error.name || "Community operation failed")
      : new Error("Community operation failed");

    Sentry.captureException(reportable);
  });
}
