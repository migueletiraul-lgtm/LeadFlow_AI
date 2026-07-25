"use client";

import { useEffect, useState, type ReactNode } from "react";

import AppHeader from "@/components/layout/AppHeader";
import AppSidebar from "@/components/layout/AppSidebar";
import MobileNavDrawer from "@/components/layout/MobileNavDrawer";

const THEME_STORAGE_KEY = "leadflow-theme";

type AppShellProps = {
  children: ReactNode;
};

function getInitialIsDarkMode() {
  if (typeof window === "undefined") {
    return false;
  }

  const storedTheme = window.localStorage.getItem(
    THEME_STORAGE_KEY,
  );

  if (storedTheme === "dark") {
    return true;
  }

  if (storedTheme === "light") {
    return false;
  }

  return window.matchMedia(
    "(prefers-color-scheme: dark)",
  ).matches;
}

export default function AppShell({ children }: AppShellProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] =
    useState(false);

  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    setIsDarkMode(getInitialIsDarkMode());
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle(
      "dark",
      isDarkMode,
    );

    window.localStorage.setItem(
      THEME_STORAGE_KEY,
      isDarkMode ? "dark" : "light",
    );
  }, [isDarkMode]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="grid min-h-screen lg:grid-cols-[auto_minmax(0,1fr)]">
        <AppSidebar
          collapsed={isSidebarCollapsed}
          onToggleCollapse={() =>
            setIsSidebarCollapsed((current) => !current)
          }
        />

        <MobileNavDrawer
          open={isMobileNavOpen}
          onOpenChange={setIsMobileNavOpen}
        />

        <div className="min-w-0">
          <AppHeader
            search={search}
            onSearchChange={setSearch}
            onOpenMobileNav={() => setIsMobileNavOpen(true)}
            isDarkMode={isDarkMode}
            onToggleDarkMode={() =>
              setIsDarkMode((current) => !current)
            }
          />

          <main className="min-h-[calc(100vh-88px)]">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
