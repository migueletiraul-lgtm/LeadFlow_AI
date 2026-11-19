"use client";

import { useEffect, useState } from "react";

export const DEMO_MODE_STORAGE_KEY = "leadflow-demo-mode";

/**
 * Default vindo do ambiente (definido em .env.local), usado quando o
 * usuário ainda não escolheu uma preferência local.
 */
export function isDemoModeEnabledByDefault(): boolean {
  return process.env.NEXT_PUBLIC_DEMO_MODE === "true";
}

export function getStoredDemoModePreference(): boolean | null {
  if (typeof window === "undefined") {
    return null;
  }

  const stored = window.localStorage.getItem(
    DEMO_MODE_STORAGE_KEY,
  );

  if (stored === "true") {
    return true;
  }

  if (stored === "false") {
    return false;
  }

  return null;
}

export function setDemoModePreference(enabled: boolean): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    DEMO_MODE_STORAGE_KEY,
    enabled ? "true" : "false",
  );
}

export function clearDemoModePreference(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(DEMO_MODE_STORAGE_KEY);
}

/** Preferência local, se existir; caso contrário, o default do ambiente. */
export function resolveDemoMode(): boolean {
  const storedPreference = getStoredDemoModePreference();

  if (storedPreference !== null) {
    return storedPreference;
  }

  return isDemoModeEnabledByDefault();
}

/**
 * Hook para ligar/desligar o modo demo em qualquer componente cliente,
 * sem precisar de rebuild: a escolha fica salva no navegador.
 */
export function useDemoMode() {
  const [isDemoMode, setIsDemoMode] = useState(() =>
    isDemoModeEnabledByDefault(),
  );

  useEffect(() => {
    setIsDemoMode(resolveDemoMode());
  }, []);

  function setDemoMode(enabled: boolean) {
    setDemoModePreference(enabled);
    setIsDemoMode(enabled);
  }

  function toggleDemoMode() {
    setDemoMode(!isDemoMode);
  }

  return {
    isDemoMode,
    setDemoMode,
    toggleDemoMode,
  };
}
