"use client";

import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface MonthHeaderProps {
  currentMonth: Date;
  onPrev: () => void;
  onNext: () => void;
  direction: number;
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const MonthHeader = memo(function MonthHeader({
  currentMonth,
  onPrev,
  onNext,
  direction,
}: MonthHeaderProps) {
  return (
    <div className="space-y-3">
      {/* Month/Year navigation */}
      <div className="flex items-center justify-between px-1">
        <motion.button
          type="button"
          aria-label="Previous month"
          onClick={onPrev}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.92 }}
          className={cn(
            "w-8 h-8 flex items-center justify-center rounded-full",
            "text-ink-500 hover:text-ink-800 dark:text-ink-400 dark:hover:text-ink-100",
            "hover:bg-ink-100 dark:hover:bg-ink-800",
            "transition-colors duration-150",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
          )}
        >
          <ChevronLeft className="w-4 h-4" strokeWidth={2.5} />
        </motion.button>

        <div className="overflow-hidden relative h-7 flex items-center">
          <AnimatePresence mode="wait" initial={false}>
            <motion.h2
              key={format(currentMonth, "yyyy-MM")}
              initial={{ opacity: 0, x: direction > 0 ? 24 : -24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? -24 : 24 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="text-sm font-display font-semibold tracking-wide text-ink-800 dark:text-ink-100 uppercase"
            >
              {format(currentMonth, "MMMM yyyy")}
            </motion.h2>
          </AnimatePresence>
        </div>

        <motion.button
          type="button"
          aria-label="Next month"
          onClick={onNext}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.92 }}
          className={cn(
            "w-8 h-8 flex items-center justify-center rounded-full",
            "text-ink-500 hover:text-ink-800 dark:text-ink-400 dark:hover:text-ink-100",
            "hover:bg-ink-100 dark:hover:bg-ink-800",
            "transition-colors duration-150",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
          )}
        >
          <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
        </motion.button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 text-center" role="row">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            role="columnheader"
            aria-label={day}
            className="text-[10px] font-semibold tracking-widest uppercase text-ink-400 dark:text-ink-500 py-1"
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  );
});

export default MonthHeader;
