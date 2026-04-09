"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { DayCellProps, NoteColor } from "@/types";

const NOTE_DOT_COLORS: Record<NoteColor, string> = {
  warm: "bg-orange-400",
  gold: "bg-amber-400",
  sage: "bg-green-500",
  slate: "bg-slate-400",
  rose: "bg-rose-400",
};

const DayCell = memo(function DayCell({
  date,
  isCurrentMonth,
  isToday,
  isStart,
  isEnd,
  isInRange,
  isHoverRange,
  isRangeStart,
  isRangeEnd,
  hasNotes,
  noteCount,
  noteColor,
  isSelected,
  onClick,
  onMouseEnter,
  onMouseLeave,
  tabIndex,
  onKeyDown,
  ariaLabel,
}: DayCellProps) {
  const dayNumber = format(date, "d");

  const isEndpoint = isStart || isEnd;
  const isOnlyStartNoEnd = isStart && !isEnd && !isHoverRange;

  return (
    <motion.button
      type="button"
      role="gridcell"
      aria-label={ariaLabel}
      aria-selected={isSelected}
      tabIndex={tabIndex}
      onClick={() => onClick(date)}
      onMouseEnter={() => onMouseEnter(date)}
      onMouseLeave={onMouseLeave}
      onKeyDown={(e) => onKeyDown(e, date)}
      whileTap={{ scale: 0.88 }}
      className={cn(
        "relative h-9 w-full flex items-center justify-center text-sm font-medium",
        "transition-colors duration-150 outline-none select-none",
        "focus-visible:ring-2 focus-visible:ring-offset-1",
        // Current month vs ghost
        isCurrentMonth
          ? "text-ink-800 dark:text-ink-100"
          : "text-ink-300 dark:text-ink-600",
        // Range background strip
        (isInRange || isHoverRange) && isCurrentMonth && !isEndpoint &&
          "bg-amber-100/80 dark:bg-amber-900/20",
        // Range start/end rounded caps
        isRangeStart && (isInRange || isHoverRange) && !isEnd &&
          "rounded-l-full",
        isRangeEnd && (isInRange || isHoverRange) && !isStart &&
          "rounded-r-full",
        // Hover state (non-selected)
        !isEndpoint && !isInRange && !isHoverRange &&
          "hover:bg-ink-100/70 dark:hover:bg-ink-800/50 rounded-full",
        // Focus ring color
        isEndpoint
          ? "focus-visible:ring-amber-500"
          : "focus-visible:ring-ink-400 dark:focus-visible:ring-ink-500",
      )}
    >
      {/* Range highlight background */}
      {(isInRange || isHoverRange) && isCurrentMonth && !isEndpoint && (
        <span
          className={cn(
            "absolute inset-y-0.5 inset-x-0 -z-10",
            isHoverRange && !isInRange
              ? "bg-amber-100/60 dark:bg-amber-900/15"
              : "bg-gradient-to-r from-amber-100/90 to-amber-100/90 dark:from-amber-900/25 dark:to-amber-900/25"
          )}
        />
      )}

      {/* Endpoint circle */}
      {isEndpoint && isCurrentMonth && (
        <motion.span
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className={cn(
            "absolute inset-0 -z-10",
            isOnlyStartNoEnd ? "rounded-full" : "",
            isRangeStart && !isEnd ? "rounded-l-full" : "",
            isRangeEnd && !isStart ? "rounded-r-full" : "",
            isStart && isEnd ? "rounded-full" : "",
            "bg-gradient-to-br from-amber-500 to-orange-500",
            "shadow-glow-warm"
          )}
        />
      )}

      {/* Today ring */}
      {isToday && !isEndpoint && (
        <span className="absolute inset-1 rounded-full border-2 border-ink-400/50 dark:border-ink-400/40 pointer-events-none" />
      )}

      <span
        className={cn(
          "relative z-10 w-7 h-7 flex items-center justify-center rounded-full",
          "transition-all duration-150",
          isEndpoint && isCurrentMonth
            ? "text-white font-bold"
            : isToday
            ? "font-bold text-amber-700 dark:text-amber-400"
            : "",
        )}
      >
        {dayNumber}
      </span>

      {/* Note indicator dots */}
      {hasNotes && isCurrentMonth && (
        <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 flex gap-0.5">
          {Array.from({ length: Math.min(noteCount, 3) }).map((_, i) => (
            <span
              key={i}
              className={cn(
                "w-1 h-1 rounded-full",
                noteColor ? NOTE_DOT_COLORS[noteColor] : "bg-ink-400 dark:bg-ink-500",
                isEndpoint && "bg-white/80"
              )}
            />
          ))}
        </span>
      )}
    </motion.button>
  );
});

export default DayCell;
