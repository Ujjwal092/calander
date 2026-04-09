"use client";

import { motion } from "framer-motion";
import { Sun, Moon, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";

type Theme = "light" | "dark" | "system";

interface ThemeToggleProps {
  theme: Theme;
  onToggle: () => void;
}

const ICONS: Record<Theme, React.ReactNode> = {
  light: <Sun className="w-3.5 h-3.5" />,
  dark: <Moon className="w-3.5 h-3.5" />,
  system: <Monitor className="w-3.5 h-3.5" />,
};

const LABELS: Record<Theme, string> = {
  light: "Light",
  dark: "Dark",
  system: "System",
};

export default function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  return (
    <motion.button
      type="button"
      aria-label={`Theme: ${LABELS[theme]}. Click to cycle.`}
      onClick={onToggle}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.92 }}
      className={cn(
        "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium",
        "bg-ink-100/70 dark:bg-ink-800/70 border border-ink-200 dark:border-ink-700",
        "text-ink-500 dark:text-ink-400 hover:text-ink-700 dark:hover:text-ink-200",
        "transition-colors duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
      )}
    >
      <motion.span
        key={theme}
        initial={{ rotate: -30, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {ICONS[theme]}
      </motion.span>
      <span className="hidden sm:inline">{LABELS[theme]}</span>
    </motion.button>
  );
}
