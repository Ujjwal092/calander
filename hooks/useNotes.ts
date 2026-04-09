"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { format } from "date-fns";
import { formatMonthKey, formatDateKey } from "@/lib/utils";
import type { NotesStore, NoteEntry, NoteColor, MonthData } from "@/types";

const STORAGE_KEY = "wall-calendar-notes";

function loadFromStorage(): NotesStore {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveToStorage(store: NotesStore): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // Silently fail if storage is unavailable
  }
}

export function useNotes() {
  const [store, setStore] = useState<NotesStore>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const loaded = loadFromStorage();
    setStore(loaded);
    setIsLoaded(true);
  }, []);

  // Sync to localStorage on change
  useEffect(() => {
    if (isLoaded) {
      saveToStorage(store);
    }
  }, [store, isLoaded]);

  const addNote = useCallback((
    monthKey: string,
    note: Omit<NoteEntry, "id" | "createdAt" | "updatedAt">
  ) => {
    const newNote: NoteEntry = {
      ...note,
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setStore((prev) => {
      const monthData: MonthData = prev[monthKey] ?? { notes: [] };
      return {
        ...prev,
        [monthKey]: {
          ...monthData,
          notes: [...monthData.notes, newNote],
        },
      };
    });

    return newNote.id;
  }, []);

  const updateNote = useCallback((monthKey: string, noteId: string, text: string, color?: NoteColor) => {
    setStore((prev) => {
      const monthData = prev[monthKey];
      if (!monthData) return prev;
      return {
        ...prev,
        [monthKey]: {
          ...monthData,
          notes: monthData.notes.map((n) =>
            n.id === noteId
              ? { ...n, text, color: color ?? n.color, updatedAt: new Date().toISOString() }
              : n
          ),
        },
      };
    });
  }, []);

  const deleteNote = useCallback((monthKey: string, noteId: string) => {
    setStore((prev) => {
      const monthData = prev[monthKey];
      if (!monthData) return prev;
      return {
        ...prev,
        [monthKey]: {
          ...monthData,
          notes: monthData.notes.filter((n) => n.id !== noteId),
        },
      };
    });
  }, []);

  const getNotesForDate = useCallback((date: Date): NoteEntry[] => {
    const monthKey = formatMonthKey(date);
    const dateKey = formatDateKey(date);
    const monthData = store[monthKey];
    if (!monthData) return [];
    return monthData.notes.filter((n) => n.dateKey === dateKey);
  }, [store]);

  const getNotesForMonth = useCallback((monthKey: string): NoteEntry[] => {
    const monthData = store[monthKey];
    if (!monthData) return [];
    return monthData.notes.filter((n) => n.type === "month");
  }, [store]);

  const getNotesForRange = useCallback((
    startDate: Date | null,
    endDate: Date | null
  ): NoteEntry[] => {
    if (!startDate) return [];
    const monthKey = formatMonthKey(startDate);
    const monthData = store[monthKey];
    if (!monthData) return [];
    const startKey = formatDateKey(startDate);
    const endKey = endDate ? formatDateKey(endDate) : startKey;
    return monthData.notes.filter(
      (n) => n.type === "range" && n.rangeStart === startKey && n.rangeEnd === endKey
    );
  }, [store]);

  const hasNotesOnDate = useCallback((date: Date): boolean => {
    const monthKey = formatMonthKey(date);
    const dateKey = formatDateKey(date);
    const monthData = store[monthKey];
    if (!monthData) return false;
    return monthData.notes.some(
      (n) => n.dateKey === dateKey || 
        (n.type === "range" && n.rangeStart && n.rangeEnd && n.rangeStart <= dateKey && n.rangeEnd >= dateKey)
    );
  }, [store]);

  const getNoteCountForDate = useCallback((date: Date): number => {
    const monthKey = formatMonthKey(date);
    const dateKey = formatDateKey(date);
    const monthData = store[monthKey];
    if (!monthData) return 0;
    return monthData.notes.filter(
      (n) => n.dateKey === dateKey ||
        (n.type === "range" && n.rangeStart && n.rangeEnd && n.rangeStart <= dateKey && n.rangeEnd >= dateKey)
    ).length;
  }, [store]);

  const getFirstNoteColor = useCallback((date: Date): NoteColor | undefined => {
    const notes = getNotesForDate(date);
    return notes[0]?.color;
  }, [getNotesForDate]);

  return {
    store,
    isLoaded,
    addNote,
    updateNote,
    deleteNote,
    getNotesForDate,
    getNotesForMonth,
    getNotesForRange,
    hasNotesOnDate,
    getNoteCountForDate,
    getFirstNoteColor,
  };
}
