"use client";

import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";

import {
  buildDashboardModel,
  type DashboardModel,
  type DashboardPresenterInput,
} from "@/lib/dashboard/dashboard-presenter";
import { DEMO_DASHBOARD_INPUT } from "@/lib/demo/demo-data";

const DashboardModelContext =
  createContext<DashboardModel | null>(null);

type DashboardProviderProps = {
  children: ReactNode;
  data?: DashboardPresenterInput;
};

export function DashboardProvider({
  children,
  data = DEMO_DASHBOARD_INPUT,
}: DashboardProviderProps) {
  const model = useMemo(
    () => buildDashboardModel(data),
    [data],
  );

  return (
    <DashboardModelContext.Provider value={model}>
      {children}
    </DashboardModelContext.Provider>
  );
}

export function useDashboardModel(): DashboardModel {
  const context = useContext(DashboardModelContext);

  if (!context) {
    throw new Error(
      "useDashboardModel deve ser usado dentro de um DashboardProvider.",
    );
  }

  return context;
}
