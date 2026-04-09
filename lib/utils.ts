import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  isBefore,
  isAfter,
  isSameDay,
  addMonths,
  subMonths,
  addDays,
  nextSaturday,
  nextFriday,
  parseISO,
} from "date-fns";
import type { NoteColor } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getCalendarDays(month: Date): Date[] {
  const start = startOfWeek(startOfMonth(month), { weekStartsOn: 0 });
  const end = endOfWeek(endOfMonth(month), { weekStartsOn: 0 });
  return eachDayOfInterval({ start, end });
}

export function formatMonthKey(date: Date): string {
  return format(date, "yyyy-MM");
}

export function formatDateKey(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function parseDateKey(key: string): Date {
  return parseISO(key);
}

export function isInRange(date: Date, start: Date | null, end: Date | null): boolean {
  if (!start || !end) return false;
  const [s, e] = isBefore(start, end) ? [start, end] : [end, start];
  return isAfter(date, s) && isBefore(date, e);
}

export function isRangeEndpoint(date: Date, start: Date | null, end: Date | null): boolean {
  if (!start) return false;
  if (isSameDay(date, start)) return true;
  if (end && isSameDay(date, end)) return true;
  return false;
}

export function normalizeRange(start: Date | null, end: Date | null): { start: Date | null; end: Date | null } {
  if (!start || !end) return { start, end };
  if (isBefore(end, start)) return { start: end, end: start };
  return { start, end };
}

export function getPresetRanges() {
  const today = new Date();
  return [
    {
      label: "Today",
      getRange: () => ({ start: today, end: today }),
    },
    {
      label: "Next 7 days",
      getRange: () => ({ start: today, end: addDays(today, 6) }),
    },
    {
      label: "This weekend",
      getRange: () => {
        const sat = nextSaturday(today);
        return { start: sat, end: addDays(sat, 1) };
      },
    },
    {
      label: "Next 30 days",
      getRange: () => ({ start: today, end: addDays(today, 29) }),
    },
  ];
}

export function getDaysBetween(start: Date | null, end: Date | null): number {
  if (!start || !end) return 0;
  const { start: s, end: e } = normalizeRange(start, end);
  if (!s || !e) return 0;
  const diff = Math.abs(e.getTime() - s.getTime());
  return Math.round(diff / (1000 * 60 * 60 * 24)) + 1;
}

export function formatAriaLabel(date: Date, states: {
  isStart?: boolean;
  isEnd?: boolean;
  isInRange?: boolean;
  isToday?: boolean;
}): string {
  let label = format(date, "EEEE, MMMM d, yyyy");
  if (states.isToday) label += ", today";
  if (states.isStart) label += ", selected start date";
  if (states.isEnd) label += ", selected end date";
  if (states.isInRange) label += ", in selected range";
  return label;
}

export const NOTE_COLORS: Record<NoteColor, { bg: string; border: string; dot: string; text: string }> = {
  warm: {
    bg: "bg-amber-50 dark:bg-amber-950/30",
    border: "border-amber-200 dark:border-amber-800/50",
    dot: "bg-accent-warm",
    text: "text-amber-800 dark:text-amber-200",
  },
  gold: {
    bg: "bg-yellow-50 dark:bg-yellow-950/30",
    border: "border-yellow-200 dark:border-yellow-800/50",
    dot: "bg-accent-gold",
    text: "text-yellow-800 dark:text-yellow-200",
  },
  sage: {
    bg: "bg-green-50 dark:bg-green-950/30",
    border: "border-green-200 dark:border-green-800/50",
    dot: "bg-accent-sage",
    text: "text-green-800 dark:text-green-200",
  },
  slate: {
    bg: "bg-slate-50 dark:bg-slate-950/30",
    border: "border-slate-200 dark:border-slate-700/50",
    dot: "bg-accent-slate",
    text: "text-slate-700 dark:text-slate-200",
  },
  rose: {
    bg: "bg-rose-50 dark:bg-rose-950/30",
    border: "border-rose-200 dark:border-rose-800/50",
    dot: "bg-accent-rose",
    text: "text-rose-800 dark:text-rose-200",
  },
};

export { format, isSameDay, isSameMonth, isToday, addMonths, subMonths, isBefore, isAfter };
