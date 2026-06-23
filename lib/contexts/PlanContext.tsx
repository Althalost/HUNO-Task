"use client";

import { createContext, useContext } from "react";

interface PlanContextType {
  isFreeUser: boolean;
  hasProPlan: boolean;
}

const PlanContext = createContext<PlanContextType | undefined>(undefined);

interface PlanProviderProps {
  children: React.ReactNode;
  hasProPlan: boolean;
}

export function PlanProvider({ children, hasProPlan }: PlanProviderProps) {
  return (
    <PlanContext.Provider value={{ hasProPlan, isFreeUser: !hasProPlan }}>
      {children}
    </PlanContext.Provider>
  );
}

export const usePlan = () => {
  const context = useContext(PlanContext);
  if (context === undefined) {
    throw new Error("usePlan needs to be inside the provider");
  }

  return context;
};
