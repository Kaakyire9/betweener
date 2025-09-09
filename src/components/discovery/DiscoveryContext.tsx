import React, { createContext, useContext, useState } from "react";

// Filter types
export type DiscoveryFilters = {
  ageRange: [number, number];
  region: string;
  tribe: string;
  religion: string;
  interests: string[];
};

const defaultFilters: DiscoveryFilters = {
  ageRange: [18, 35],
  region: "",
  tribe: "",
  religion: "",
  interests: [],
};

// Context
const DiscoveryContext = createContext<{
  filters: DiscoveryFilters;
  setFilters: React.Dispatch<React.SetStateAction<DiscoveryFilters>>;
} | undefined>(undefined);

export function DiscoveryProvider({ children }: { children: React.ReactNode }) {
  const [filters, setFilters] = useState<DiscoveryFilters>(defaultFilters);
  return (
    <DiscoveryContext.Provider value={{ filters, setFilters }}>
      {children}
    </DiscoveryContext.Provider>
  );
}

export function useDiscovery() {
  const ctx = useContext(DiscoveryContext);
  if (!ctx) throw new Error("useDiscovery must be used within DiscoveryProvider");
  return ctx;
}
