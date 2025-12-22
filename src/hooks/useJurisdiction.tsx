import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from "react";

const STORAGE_KEY = "jurisdiction-state";

type JurisdictionContextValue = {
  state: string | null;
  setState: (value: string | null) => void;
};

const JurisdictionContext = createContext<JurisdictionContextValue | undefined>(undefined);

const getInitialState = () => {
  if (typeof window === "undefined") {
    return null;
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored || null;
};

export const JurisdictionProvider = ({ children }: PropsWithChildren) => {
  const [state, setState] = useState<string | null>(() => getInitialState());

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (state) {
      window.localStorage.setItem(STORAGE_KEY, state);
      return;
    }

    window.localStorage.removeItem(STORAGE_KEY);
  }, [state]);

  const value = useMemo(() => ({
    state,
    setState,
  }), [state]);

  return <JurisdictionContext.Provider value={value}>{children}</JurisdictionContext.Provider>;
};

export const useJurisdiction = () => {
  const context = useContext(JurisdictionContext);

  if (!context) {
    throw new Error("useJurisdiction must be used within a JurisdictionProvider");
  }

  return context;
};
