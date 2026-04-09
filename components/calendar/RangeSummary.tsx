"use client";

import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, isSameDay } from "date-fns";
import { CalendarDays, X, Sparkles } from "lucide-react";
import { getDaysBetween, getPresetRanges, cn } from "@/lib/utils";

interface RangeSummaryProps {
  startDate: Date | null;
  endDate: Date | null;
  onClear: () => void;
  onPreset: (start: Date, end: Date) => void;
}

const RangeSummary = memo(function RangeSummary({
  startDate,
  endDate,
  onClear,
  onPreset,
}: RangeSummaryProps) {
  const hasRange = !!startDate;
  const dayCount = getDaysBetween(startDate, endDate);
  const presets = getPresetRanges();

  return (
    <div className="space-y-3">
      {/* Preset buttons */}
      <div className="flex flex-wrap gap-1.5">
        {presets.map((preset) => {
          const range = preset.getRange();
          const isActive =
            startDate &&
            endDate &&
            isSameDay(startDate, range.start) &&
            isSameDay(endDate, range.end);

          return (
            <motion.button
              key={preset.label}
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => onPreset(range.start, range.end)}
              className={cn(
                "px-2.5 py-1 text-xs font-medium rounded-full border transition-all duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500",
                isActive
                  ? "bg-amber-500 border-amber-500 text-white shadow-glow-warm"
                  : "bg-parchment-50 dark:bg-ink-900 border-ink-200 dark:border-ink-700",
                  "text-ink-600 dark:text-ink-300 hover:border-amber-400 hover:text-amber-700 dark:hover:text-amber-400"
              )}
            >
              {preset.label}
            </motion.button>
          );
        })}
      </div>

      {/* Range display */}
      <AnimatePresence>
        {hasRange && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "relative flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl",
              "bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30",
              "border border-amber-200/70 dark:border-amber-800/30"
            )}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-glow-warm">
                <CalendarDays className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-ink-700 dark:text-ink-200 truncate">
                  {startDate && !endDate
                    ? format(startDate, "MMM d, yyyy")
                    : startDate && endDate
                    ? isSameDay(startDate, endDate)
                      ? format(startDate, "MMM d, yyyy")
                      : `${format(startDate, "MMM d")} – ${format(endDate, "MMM d, yyyy")}`
                    : ""}
                </p>
                <p className="text-[10px] text-ink-400 dark:text-ink-500 mt-0.5">
                  {endDate && !isSameDay(startDate!, endDate)
                    ? `${dayCount} day${dayCount !== 1 ? "s" : ""} selected`
                    : startDate && !endDate
                    ? "Click another date to complete range"
                    : "Single day"}
                </p>
              </div>
            </div>

            <motion.button
              type="button"
              aria-label="Clear selection"
              onClick={onClear}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-6 h-6 flex-shrink-0 flex items-center justify-center rounded-full text-ink-400 hover:text-ink-700 dark:hover:text-ink-200 hover:bg-ink-100 dark:hover:bg-ink-800 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

export default RangeSummary;
