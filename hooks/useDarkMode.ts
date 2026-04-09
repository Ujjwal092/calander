"use client";

import { useState, useEffect, useCallback } from "react";

type Theme = "light" | "dark" | "system";

export function useDarkMode() {
  const [theme, setTheme] = useState<Theme>("system");
  const [resolvedDark, setResolvedDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("calendar-theme") as Theme | null;
    const initial = stored ?? "system";
    setTheme(initial);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    const resolve = () => {
      if (theme === "system") {
        setResolvedDark(mediaQuery.matches);
      } else {
        setResolvedDark(theme === "dark");
      }
    };

    resolve();
    mediaQuery.addEventListener("change", resolve);
    return () => mediaQuery.removeEventListener("change", resolve);
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    if (resolvedDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [resolvedDark]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : prev === "light" ? "system" : "dark";
      localStorage.setItem("calendar-theme", next);
      return next;
    });
  }, []);

  return { theme, resolvedDark, toggleTheme };
}
