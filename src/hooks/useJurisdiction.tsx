import {
  createContext, useContext, useEffect, useMemo, useState,
  useCallback, type ReactNode,
} from "react";
import { DEFAULT_JURISDICTION, JURISDICTION_STORAGE_KEY } from "@/data/usStates";

// Maps full state names to abbr and vice versa
const STATE_NAME_MAP: Record<string, string> = {
  "Alabama":"AL","Alaska":"AK","Arizona":"AZ","Arkansas":"AR","California":"CA",
  "Colorado":"CO","Connecticut":"CT","Delaware":"DE","Florida":"FL","Georgia":"GA",
  "Hawaii":"HI","Idaho":"ID","Illinois":"IL","Indiana":"IN","Iowa":"IA","Kansas":"KS",
  "Kentucky":"KY","Louisiana":"LA","Maine":"ME","Maryland":"MD","Massachusetts":"MA",
  "Michigan":"MI","Minnesota":"MN","Mississippi":"MS","Missouri":"MO","Montana":"MT",
  "Nebraska":"NE","Nevada":"NV","New Hampshire":"NH","New Jersey":"NJ",
  "New Mexico":"NM","New York":"NY","North Carolina":"NC","North Dakota":"ND",
  "Ohio":"OH","Oklahoma":"OK","Oregon":"OR","Pennsylvania":"PA","Rhode Island":"RI",
  "South Carolina":"SC","South Dakota":"SD","Tennessee":"TN","Texas":"TX","Utah":"UT",
  "Vermont":"VT","Virginia":"VA","Washington":"WA","West Virginia":"WV",
  "Wisconsin":"WI","Wyoming":"WY","District of Columbia":"DC",
};

// Reverse map: abbr -> full name
const ABBR_TO_NAME: Record<string, string> = Object.fromEntries(
  Object.entries(STATE_NAME_MAP).map(([k, v]) => [v, k])
);

interface JurisdictionContextValue {
  state: string;
  city: string;
  setState: (value: string) => void;
  setCity: (value: string) => void;
  detectLocation: () => Promise<void>;
  detecting: boolean;
  locationSource: "manual" | "gps" | "ip" | "default";
}

const JurisdictionContext = createContext<JurisdictionContextValue | null>(null);

const readStoredJurisdiction = () => {
  if (typeof window === "undefined") return DEFAULT_JURISDICTION;
  try {
    return window.localStorage.getItem(JURISDICTION_STORAGE_KEY) || DEFAULT_JURISDICTION;
  } catch {
    return DEFAULT_JURISDICTION;
  }
};

const readStoredCity = () => {
  if (typeof window === "undefined") return "";
  try {
    return window.localStorage.getItem("crh-preferred-city") || "";
  } catch {
    return "";
  }
};

/** Reverse geocode lat/lng to state name via a free API (no key needed) */
async function reverseGeocode(lat: number, lng: number): Promise<{ state: string; city: string }> {
  // Try Nominatim (OSM) first — completely free, no key
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10`,
      { headers: { "Accept-Language": "en-US" } }
    );
    if (res.ok) {
      const data = await res.json();
      const addr = data.address ?? {};
      const stateRaw: string = addr.state ?? "";
      const cityRaw: string = addr.city ?? addr.town ?? addr.county ?? addr.village ?? "";
      const stateNorm = STATE_NAME_MAP[stateRaw] ? stateRaw : (ABBR_TO_NAME[stateRaw.toUpperCase()] ?? stateRaw);
      return { state: stateNorm || DEFAULT_JURISDICTION, city: cityRaw };
    }
  } catch { /* fall through */ }
  return { state: DEFAULT_JURISDICTION, city: "" };
}

/** IP-based location fallback — no key needed */
async function ipLocation(): Promise<{ state: string; city: string }> {
  try {
    const res = await fetch("https://ipapi.co/json/");
    if (res.ok) {
      const data = await res.json();
      const stateRaw: string = data.region ?? "";
      const cityRaw: string = data.city ?? "";
      const stateNorm = STATE_NAME_MAP[stateRaw] ? stateRaw : (ABBR_TO_NAME[(data.region_code ?? "").toUpperCase()] ?? stateRaw);
      return { state: stateNorm || DEFAULT_JURISDICTION, city: cityRaw };
    }
  } catch { /* fall through */ }
  // Secondary fallback
  try {
    const res = await fetch("https://ip-api.com/json/?fields=regionName,city");
    if (res.ok) {
      const data = await res.json();
      const stateRaw: string = data.regionName ?? "";
      const cityRaw: string = data.city ?? "";
      const stateNorm = STATE_NAME_MAP[stateRaw] ? stateRaw : (ABBR_TO_NAME[stateRaw.toUpperCase()] ?? stateRaw);
      return { state: stateNorm || DEFAULT_JURISDICTION, city: cityRaw };
    }
  } catch { /* ignore */ }
  return { state: DEFAULT_JURISDICTION, city: "" };
}

export const JurisdictionProvider = ({ children }: { children: ReactNode }) => {
  const [state, setStateRaw] = useState<string>(DEFAULT_JURISDICTION);
  const [city, setCityRaw] = useState<string>("");
  const [detecting, setDetecting] = useState(false);
  const [locationSource, setLocationSource] = useState<"manual" | "gps" | "ip" | "default">("default");

  // Hydrate from localStorage on mount, then auto-detect if still on default
  useEffect(() => {
    const stored = readStoredJurisdiction();
    const storedCity = readStoredCity();
    setStateRaw(stored);
    setCityRaw(storedCity);

    // Only auto-detect if user hasn't picked a state yet
    if (stored === DEFAULT_JURISDICTION || stored === "Mississippi") {
      void autoDetect();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const persist = (newState: string, newCity: string, source: "manual"|"gps"|"ip"|"default") => {
    setStateRaw(newState);
    setCityRaw(newCity);
    setLocationSource(source);
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(JURISDICTION_STORAGE_KEY, newState);
      window.localStorage.setItem("crh-preferred-city", newCity);
      window.localStorage.setItem("crh-location-source", source);
    } catch { /* ignore */ }
  };

  const autoDetect = useCallback(async () => {
    setDetecting(true);
    try {
      // Try GPS first
      if ("geolocation" in navigator) {
        await new Promise<void>((resolve) => {
          navigator.geolocation.getCurrentPosition(
            async (pos) => {
              const { state: s, city: c } = await reverseGeocode(pos.coords.latitude, pos.coords.longitude);
              if (s && s !== DEFAULT_JURISDICTION) {
                persist(s, c, "gps");
                resolve();
                return;
              }
              // GPS worked but geocode didn't — fall to IP
              const ipResult = await ipLocation();
              persist(ipResult.state, ipResult.city, "ip");
              resolve();
            },
            async () => {
              // User denied or error — fall to IP
              const ipResult = await ipLocation();
              persist(ipResult.state, ipResult.city, "ip");
              resolve();
            },
            { timeout: 8000, maximumAge: 300_000 }
          );
        });
      } else {
        // No geolocation API — fall to IP
        const ipResult = await ipLocation();
        persist(ipResult.state, ipResult.city, "ip");
      }
    } catch {
      // Silently fail — keep existing state
    } finally {
      setDetecting(false);
    }
  }, []);

  const handleSetState = (value: string) => {
    persist(value, city, "manual");
  };

  const handleSetCity = (value: string) => {
    setCityRaw(value);
    if (typeof window !== "undefined") {
      try { window.localStorage.setItem("crh-preferred-city", value); } catch { /* ignore */ }
    }
  };

  const value = useMemo(() => ({
    state,
    city,
    setState: handleSetState,
    setCity: handleSetCity,
    detectLocation: autoDetect,
    detecting,
    locationSource,
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [state, city, detecting, locationSource]);

  return <JurisdictionContext.Provider value={value}>{children}</JurisdictionContext.Provider>;
};

export const useJurisdiction = () => {
  const context = useContext(JurisdictionContext);
  if (!context) throw new Error("useJurisdiction must be used within a JurisdictionProvider");
  return context;
};
