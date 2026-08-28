import * as Sentry from "@sentry/react";

const parseSampleRate = (value: string | undefined, fallback: number) => {
  if (!value) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 && parsed <= 1 ? parsed : fallback;
};

const SENSITIVE_KEYS = [
  "authorization",
  "cookie",
  "set-cookie",
  "password",
  "token",
  "access_token",
  "refresh_token",
  "service_role",
  "supabase_db_password",
  "message_body",
  "legal_intake",
  "incident_narrative",
];

const redactObject = (value: unknown): unknown => {
  if (!value || typeof value !== "object") return value;
  if (Array.isArray(value)) return value.map(redactObject);

  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).map(([key, item]) => [
      key,
      SENSITIVE_KEYS.some((sensitive) => key.toLowerCase().includes(sensitive))
        ? "[Redacted]"
        : redactObject(item),
    ])
  );
};

export function initSentry() {
  const dsn = import.meta.env.VITE_SENTRY_DSN?.trim();
  if (!dsn) return;

  Sentry.init({
    dsn,
    environment: import.meta.env.VITE_SENTRY_ENVIRONMENT || import.meta.env.MODE,
    release: import.meta.env.VITE_SENTRY_RELEASE || undefined,
    sendDefaultPii: false,
    tracesSampleRate: parseSampleRate(import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE, 0.1),
    beforeSend(event) {
      if (event.request) {
        event.request.cookies = undefined;
        event.request.data = redactObject(event.request.data);
        if (event.request.headers) {
          event.request.headers = redactObject(event.request.headers) as Record<string, string>;
        }
      }

      if (event.extra) event.extra = redactObject(event.extra) as typeof event.extra;
      if (event.contexts) event.contexts = redactObject(event.contexts) as typeof event.contexts;
      return event;
    },
  });
}

export { Sentry };
