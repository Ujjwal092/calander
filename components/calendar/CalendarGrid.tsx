"use client";

import { useMemo, useCallback, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { format, isSameMonth, isToday, isSameDay, isBefore, isAfter } from "date-fns";
import { getCalendarDays, isInRange, formatAriaLabel } from "@/lib/utils";
import DayCell from "./DayCell";
import type { CalendarState } from "@/types";

interface CalendarGridProps {
  state: CalendarState;
  effectiveEnd: Date | null;
  onDateClick: (date: Date) => void;
  onMouseEnter: (date: Date) => void;
  onMouseLeave: () => void;
  hasNotesOnDate: (date: Date) => boolean;
  getNoteCountForDate: (date: Date) => number;
  getFirstNoteColor: (date: Date) => string | undefined;
  direction: number;
}

export default function CalendarGrid({
  state,
  effectiveEnd,
  onDateClick,
  onMouseEnter,
  onMouseLeave,
  hasNotesOnDate,
  getNoteCountForDate,
  getFirstNoteColor,
  direction,
}: CalendarGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const { currentMonth, startDate, endDate, hoverDate } = state;

  const days = useMemo(() => getCalendarDays(currentMonth), [currentMonth]);
  const isPreview = !endDate && !!hoverDate;

  const normalizedStart = useMemo(() => {
    if (!startDate || !effectiveEnd) return startDate;
    return isBefore(startDate, effectiveEnd) ? startDate : effectiveEnd;
  }, [startDate, effectiveEnd]);

  const normalizedEnd = useMemo(() => {
    if (!startDate || !effectiveEnd) return effectiveEnd;
    return isBefore(startDate, effectiveEnd) ? effectiveEnd : startDate;
  }, [startDate, effectiveEnd]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, date: Date) => {
      const cells = gridRef.current?.querySelectorAll<HTMLElement>("[role='gridcell']");
      if (!cells) return;
      const arr = Array.from(cells);
      const idx = arr.indexOf(e.currentTarget as HTMLElement);
      let newIdx = idx;
      if (e.key === "ArrowRight") newIdx = Math.min(idx + 1, arr.length - 1);
      else if (e.key === "ArrowLeft") newIdx = Math.max(idx - 1, 0);
      else if (e.key === "ArrowDown") newIdx = Math.min(idx + 7, arr.length - 1);
      else if (e.key === "ArrowUp") newIdx = Math.max(idx - 7, 0);
      else if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onDateClick(date); return; }
      else return;
      e.preventDefault();
      arr[newIdx]?.focus();
    },
    [onDateClick]
  );

  const cellData = useMemo(() => {
    return days.map((date, idx) => {
      const isCurrentMonth = isSameMonth(date, currentMonth);
      const isTodayDate = isToday(date);
      const isStart = startDate ? isSameDay(date, startDate) : false;
      const isEnd =
        (endDate ? isSameDay(date, endDate) : false) ||
        (!endDate && hoverDate ? isSameDay(date, hoverDate) : false);
      const inRange =
        normalizedStart && normalizedEnd
          ? isAfter(date, normalizedStart) && isBefore(date, normalizedEnd)
          : false;
      const isHoverRange = isPreview && inRange;
      const isSelected = isStart || isEnd || inRange;

      const isDayHighlighted = (d: Date | null) => {
        if (!d) return false;
        if (normalizedStart && isSameDay(d, normalizedStart)) return true;
        if (normalizedEnd && isSameDay(d, normalizedEnd)) return true;
        return normalizedStart && normalizedEnd
          ? isAfter(d, normalizedStart) && isBefore(d, normalizedEnd)
          : false;
      };

      const prevDay = idx > 0 ? days[idx - 1] : null;
      const nextDay = idx < days.length - 1 ? days[idx + 1] : null;
      const prevHighlighted = isDayHighlighted(prevDay);
      const nextHighlighted = isDayHighlighted(nextDay);
      const isWeekStart = date.getDay() === 0;
      const isWeekEnd = date.getDay() === 6;

      const isRangeStart = isStart || (inRange && (!prevHighlighted || isWeekStart));
      const isRangeEnd = isEnd || (inRange && (!nextHighlighted || isWeekEnd));

      const hasNotes = isCurrentMonth ? hasNotesOnDate(date) : false;
      const noteCount = isCurrentMonth ? getNoteCountForDate(date) : 0;
      const noteColor = isCurrentMonth ? (getFirstNoteColor(date) as any) : undefined;
      const ariaLabel = formatAriaLabel(date, {
        isStart,
        isEnd: endDate ? isSameDay(date, endDate) : false,
        isInRange: inRange,
        isToday: isTodayDate,
      });

      return { date, isCurrentMonth, isTodayDate, isStart, isEnd, inRange, isHoverRange, isRangeStart, isRangeEnd, hasNotes, noteCount, noteColor, isSelected, ariaLabel };
    });
  }, [days, currentMonth, startDate, endDate, hoverDate, normalizedStart, normalizedEnd, isPreview, hasNotesOnDate, getNoteCountForDate, getFirstNoteColor]);

  return (
    <div className="overflow-hidden relative">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={format(currentMonth, "yyyy-MM")}
          initial={{ opacity: 0, x: direction > 0 ? 28 : -28 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction > 0 ? -28 : 28 }}
          transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
          ref={gridRef}
          role="grid"
          aria-label={format(currentMonth, "MMMM yyyy")}
          className="grid grid-cols-7"
        >
          {cellData.map(({ date, isCurrentMonth, isTodayDate, isStart, isEnd, inRange, isHoverRange, isRangeStart, isRangeEnd, hasNotes, noteCount, noteColor, isSelected, ariaLabel }) => (
            <DayCell
              key={format(date, "yyyy-MM-dd")}
              date={date}
              isCurrentMonth={isCurrentMonth}
              isToday={isTodayDate}
              isStart={isStart}
              isEnd={isEnd}
              isInRange={inRange}
              isHoverRange={isHoverRange}
              isRangeStart={isRangeStart}
              isRangeEnd={isRangeEnd}
              hasNotes={hasNotes}
              noteCount={noteCount}
              noteColor={noteColor}
              isSelected={isSelected}
              onClick={onDateClick}
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave}
              tabIndex={isCurrentMonth ? 0 : -1}
              onKeyDown={handleKeyDown}
              ariaLabel={ariaLabel}
            />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
