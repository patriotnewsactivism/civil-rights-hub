import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { DEFAULT_JURISDICTION, JURISDICTION_STORAGE_KEY } from "@/data/usStates";

interface JurisdictionContextValue {
  state: string;
  setState: (value: string) => void;
}

const JurisdictionContext = createContext<JurisdictionContextValue | null>(null);

const readStoredJurisdiction = () => {
  if (typeof window === "undefined") {
    return DEFAULT_JURISDICTION;
  }

  try {
    return window.localStorage.getItem(JURISDICTION_STORAGE_KEY) || DEFAULT_JURISDICTION;
  } catch (error) {
    console.error("Unable to read stored jurisdiction", error);
    return DEFAULT_JURISDICTION;
  }
};

export const JurisdictionProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<string>(DEFAULT_JURISDICTION);

  useEffect(() => {
    setState(readStoredJurisdiction());
  }, []);

  const handleUpdate = (value: string) => {
    setState(value);
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(JURISDICTION_STORAGE_KEY, value);
    } catch (error) {
      console.error("Unable to persist jurisdiction", error);
    }
  };

  const value = useMemo(() => ({ state, setState: handleUpdate }), [state]);

  return <JurisdictionContext.Provider value={value}>{children}</JurisdictionContext.Provider>;
};

export const useJurisdiction = () => {
  const context = useContext(JurisdictionContext);

  if (!context) {
    throw new Error("useJurisdiction must be used within a JurisdictionProvider");
  }

  return context;
};
