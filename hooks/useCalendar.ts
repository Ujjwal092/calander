"use client";

import { useState, useCallback, useMemo } from "react";
import { addMonths, subMonths, isSameDay, isBefore } from "date-fns";
import type { CalendarState } from "@/types";

export function useCalendar() {
  const [state, setState] = useState<CalendarState>({
    currentMonth: new Date(),
    startDate: null,
    endDate: null,
    hoverDate: null,
  });

  const handleDateClick = useCallback((date: Date) => {
    setState((prev) => {
      // Third click or no selection → start fresh
      if (prev.startDate && prev.endDate) {
        return { ...prev, startDate: date, endDate: null, hoverDate: null };
      }

      // No start date yet → set start
      if (!prev.startDate) {
        return { ...prev, startDate: date, endDate: null };
      }

      // Have start but no end → set end (handle same-day)
      if (isSameDay(prev.startDate, date)) {
        // Same date clicked → single-day selection
        return { ...prev, endDate: date };
      }

      // Auto-swap if end before start
      if (isBefore(date, prev.startDate)) {
        return { ...prev, startDate: date, endDate: prev.startDate };
      }

      return { ...prev, endDate: date };
    });
  }, []);

  const handleMouseEnter = useCallback((date: Date) => {
    setState((prev) => {
      if (prev.startDate && !prev.endDate) {
        return { ...prev, hoverDate: date };
      }
      return prev;
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setState((prev) => {
      if (prev.hoverDate !== null) {
        return { ...prev, hoverDate: null };
      }
      return prev;
    });
  }, []);

  const goToNextMonth = useCallback(() => {
    setState((prev) => ({ ...prev, currentMonth: addMonths(prev.currentMonth, 1) }));
  }, []);

  const goToPrevMonth = useCallback(() => {
    setState((prev) => ({ ...prev, currentMonth: subMonths(prev.currentMonth, 1) }));
  }, []);

  const goToMonth = useCallback((date: Date) => {
    setState((prev) => ({ ...prev, currentMonth: date }));
  }, []);

  const setPresetRange = useCallback((start: Date, end: Date) => {
    setState((prev) => ({
      ...prev,
      startDate: start,
      endDate: end,
      hoverDate: null,
      currentMonth: start,
    }));
  }, []);

  const clearSelection = useCallback(() => {
    setState((prev) => ({ ...prev, startDate: null, endDate: null, hoverDate: null }));
  }, []);

  const effectiveEnd = useMemo(() => {
    return state.endDate ?? state.hoverDate ?? null;
  }, [state.endDate, state.hoverDate]);

  return {
    state,
    effectiveEnd,
    handleDateClick,
    handleMouseEnter,
    handleMouseLeave,
    goToNextMonth,
    goToPrevMonth,
    goToMonth,
    setPresetRange,
    clearSelection,
  };
}
