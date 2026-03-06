const hashToResourceIdMap: Record<string, string> = {
  "foia": "foia-builder",
  "foia-builder": "foia-builder",
  "foia-tracker": "foia-tracker",
  "scanner": "police-scanner",
  "police-scanner": "police-scanner",
  "map": "interactive-map",
  "interactive-map": "interactive-map",
  "state-selector": "state-selector",
  "states": "state-selector",
};

export const getResourceIdFromHash = (hash: string): string | null => {
  const normalizedHash = hash.trim().replace(/^#/, "").trim().toLowerCase();
  if (!normalizedHash) {
    return null;
  }

  return hashToResourceIdMap[normalizedHash] ?? null;
};
