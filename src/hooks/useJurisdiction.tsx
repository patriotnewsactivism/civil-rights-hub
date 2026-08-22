import {
  createContext, useContext, useEffect, useMemo, useState,
  useCallback, type ReactNode,
} from "react";
import { DEFAULT_JURISDICTION, JURISDICTION_STORAGE_KEY } from "@/data/usStates";

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

const ABBR_TO_NAME: Record<string, string> = Object.fromEntries(
  Object.entries(STATE_NAME_MAP).map(([name, abbr]) => [abbr, name])
);

const LOCATION_SOURCE_KEY = "crh-location-source";
const CITY_STORAGE_KEY = "crh-preferred-city";

type LocationSource = "manual" | "gps" | "ip" | "default";

interface JurisdictionContextValue {
  state: string;
  city: string;
  setState: (value: string) => void;
  setCity: (value: string) => void;
  detectLocation: () => Promise<void>;
  detecting: boolean;
  locationSource: LocationSource;
}

const JurisdictionContext = createContext<JurisdictionContextValue | null>(null);

function normalizeUSState(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (STATE_NAME_MAP[trimmed]) return trimmed;
  return ABBR_TO_NAME[trimmed.toUpperCase()] ?? null;
}

function safeLocationSource(value: string | null): LocationSource {
  return value === "manual" || value === "gps" || value === "ip" ? value : "default";
}

const readStoredJurisdiction = () => {
  if (typeof window === "undefined") return DEFAULT_JURISDICTION;
  try {
    const stored = window.localStorage.getItem(JURISDICTION_STORAGE_KEY);
    if (!stored || stored === DEFAULT_JURISDICTION) return DEFAULT_JURISDICTION;
    return normalizeUSState(stored) ?? DEFAULT_JURISDICTION;
  } catch {
    return DEFAULT_JURISDICTION;
  }
};

const readStoredCity = (hasUSJurisdiction: boolean) => {
  if (typeof window === "undefined" || !hasUSJurisdiction) return "";
  try {
    return window.localStorage.getItem(CITY_STORAGE_KEY) || "";
  } catch {
    return "";
  }
};

/** Reverse geocode coordinates. Non-U.S. results deliberately resolve to Nationwide. */
async function reverseGeocode(lat: number, lng: number): Promise<{ state: string; city: string }> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10`,
      { headers: { "Accept-Language": "en-US" } }
    );
    if (res.ok) {
      const data = await res.json();
      const addr = data.address ?? {};
      const countryCode = String(addr.country_code ?? "").toUpperCase();
      if (countryCode !== "US") return { state: DEFAULT_JURISDICTION, city: "" };

      const state = normalizeUSState(addr.state ?? addr.state_code ?? "");
      const city = String(addr.city ?? addr.town ?? addr.village ?? addr.county ?? "");
      return state ? { state, city } : { state: DEFAULT_JURISDICTION, city: "" };
    }
  } catch {
    // Fall through to a safe nationwide result.
  }
  return { state: DEFAULT_JURISDICTION, city: "" };
}

/** IP-based fallback. Only U.S. results are accepted as a state jurisdiction. */
async function ipLocation(): Promise<{ state: string; city: string }> {
  try {
    const res = await fetch("https://ipapi.co/json/");
    if (res.ok) {
      const data = await res.json();
      const countryCode = String(data.country_code ?? "").toUpperCase();
      if (countryCode !== "US") return { state: DEFAULT_JURISDICTION, city: "" };

      const state = normalizeUSState(data.region_code ?? data.region ?? "");
      const city = String(data.city ?? "");
      return state ? { state, city } : { state: DEFAULT_JURISDICTION, city: "" };
    }
  } catch {
    // Safe fallback below.
  }
  return { state: DEFAULT_JURISDICTION, city: "" };
}

export const JurisdictionProvider = ({ children }: { children: ReactNode }) => {
  const [state, setStateRaw] = useState<string>(DEFAULT_JURISDICTION);
  const [city, setCityRaw] = useState<string>("");
  const [detecting, setDetecting] = useState(false);
  const [locationSource, setLocationSource] = useState<LocationSource>("default");

  const persist = useCallback((newState: string, newCity: string, source: LocationSource) => {
    const normalized = newState === DEFAULT_JURISDICTION ? DEFAULT_JURISDICTION : normalizeUSState(newState);
    const safeState = normalized ?? DEFAULT_JURISDICTION;
    const safeCity = safeState === DEFAULT_JURISDICTION ? "" : newCity;
    const safeSource: LocationSource = safeState === DEFAULT_JURISDICTION ? "default" : source;

    setStateRaw(safeState);
    setCityRaw(safeCity);
    setLocationSource(safeSource);

    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(JURISDICTION_STORAGE_KEY, safeState);
      window.localStorage.setItem(CITY_STORAGE_KEY, safeCity);
      window.localStorage.setItem(LOCATION_SOURCE_KEY, safeSource);
    } catch {
      // Local persistence is optional.
    }
  }, []);

  const autoDetect = useCallback(async () => {
    setDetecting(true);
    try {
      if (typeof navigator !== "undefined" && "geolocation" in navigator) {
        await new Promise<void>((resolve) => {
          navigator.geolocation.getCurrentPosition(
            async (pos) => {
              const gpsResult = await reverseGeocode(pos.coords.latitude, pos.coords.longitude);
              if (gpsResult.state !== DEFAULT_JURISDICTION) {
                persist(gpsResult.state, gpsResult.city, "gps");
              } else {
                const ipResult = await ipLocation();
                persist(ipResult.state, ipResult.city, ipResult.state === DEFAULT_JURISDICTION ? "default" : "ip");
              }
              resolve();
            },
            async () => {
              const ipResult = await ipLocation();
              persist(ipResult.state, ipResult.city, ipResult.state === DEFAULT_JURISDICTION ? "default" : "ip");
              resolve();
            },
            { timeout: 8000, maximumAge: 300_000 }
          );
        });
      } else {
        const ipResult = await ipLocation();
        persist(ipResult.state, ipResult.city, ipResult.state === DEFAULT_JURISDICTION ? "default" : "ip");
      }
    } finally {
      setDetecting(false);
    }
  }, [persist]);

  useEffect(() => {
    const stored = readStoredJurisdiction();
    const hasUSJurisdiction = stored !== DEFAULT_JURISDICTION;
    const storedCity = readStoredCity(hasUSJurisdiction);
    setStateRaw(stored);
    setCityRaw(storedCity);

    if (typeof window !== "undefined" && hasUSJurisdiction) {
      try {
        setLocationSource(safeLocationSource(window.localStorage.getItem(LOCATION_SOURCE_KEY)));
      } catch {
        setLocationSource("manual");
      }
    }

    // A manually selected U.S. state is respected. Auto-detection only occurs
    // when there is no valid U.S. jurisdiction stored.
    if (!hasUSJurisdiction) void autoDetect();
  }, [autoDetect]);

  const handleSetState = (value: string) => {
    if (value === DEFAULT_JURISDICTION) {
      persist(DEFAULT_JURISDICTION, "", "default");
      return;
    }
    const normalized = normalizeUSState(value);
    if (normalized) persist(normalized, city, "manual");
  };

  const handleSetCity = (value: string) => {
    if (state === DEFAULT_JURISDICTION) return;
    setCityRaw(value);
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(CITY_STORAGE_KEY, value);
      } catch {
        // Optional persistence only.
      }
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
  }), [state, city, detecting, locationSource, autoDetect]);

  return <JurisdictionContext.Provider value={value}>{children}</JurisdictionContext.Provider>;
};

export const useJurisdiction = () => {
  const context = useContext(JurisdictionContext);
  if (!context) throw new Error("useJurisdiction must be used within a JurisdictionProvider");
  return context;
};
