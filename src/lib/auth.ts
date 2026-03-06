const USERNAME_MAX_LENGTH = 30;

const sanitizeUsername = (value: string): string => {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");
};

const createSuffix = (): string => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID().slice(0, 8);
  }

  return Math.random().toString(36).slice(2, 10);
};

export const buildSignupMetadata = (
  email: string,
  displayName?: string,
): { username: string; full_name: string } => {
  const emailPrefix = email.split("@")[0] ?? "user";
  const preferredName = displayName?.trim() || emailPrefix;

  const normalizedBase = sanitizeUsername(emailPrefix) || "user";
  const suffix = createSuffix();
  const maxBaseLength = Math.max(1, USERNAME_MAX_LENGTH - suffix.length - 1);
  const truncatedBase = normalizedBase.slice(0, maxBaseLength);
  const username = `${truncatedBase}_${suffix}`;

  return {
    username,
    full_name: preferredName,
  };
};
