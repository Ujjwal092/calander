"use client";

import { useState, useRef, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { useCalendar } from "@/hooks/useCalendar";
import { useNotes } from "@/hooks/useNotes";
import { useDarkMode } from "@/hooks/useDarkMode";
import MonthHeader from "./MonthHeader";
import CalendarGrid from "./CalendarGrid";
import RangeSummary from "./RangeSummary";
import NotesPanel from "@/components/notes/NotesPanel";
import HeroImage from "@/components/ui/HeroImage";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function Calendar() {
  const {
    state,
    effectiveEnd,
    handleDateClick,
    handleMouseEnter,
    handleMouseLeave,
    goToNextMonth,
    goToPrevMonth,
    setPresetRange,
    clearSelection,
  } = useCalendar();

  const notes = useNotes();
  const { theme, toggleTheme } = useDarkMode();
  const [direction, setDirection] = useState(0);

  const handleNext = useCallback(() => {
    setDirection(1);
    goToNextMonth();
  }, [goToNextMonth]);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    goToPrevMonth();
  }, [goToPrevMonth]);

  // 3D tilt effect on calendar card
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 150, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 150, damping: 20 });
  const rotateX = useTransform(springY, [-0.5, 0.5], [2, -2]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-2, 2]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  }, [mouseX, mouseY]);

  const handleMouseOut = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  return (
    <div className={cn(
      "min-h-screen w-full",
      "bg-parchment-100 dark:bg-ink-950",
      "transition-colors duration-500",
      // Subtle grain texture overlay
      "relative"
    )}>
      {/* Background texture */}
      <div className="fixed inset-0 opacity-[0.03] dark:opacity-[0.06] pointer-events-none bg-grain" />

      {/* Ambient glow */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-amber-300/10 dark:bg-amber-700/8 blur-[120px] pointer-events-none" />

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="flex items-center justify-between px-4 py-3 lg:px-8 lg:py-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-glow-warm">
              <span className="text-white text-[10px] font-bold font-display">C</span>
            </div>
            <span className="text-xs font-semibold text-ink-600 dark:text-ink-400 font-display tracking-wide hidden sm:block">
              Calendrier
            </span>
          </div>
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </header>

        {/* Main content */}
        <main className="flex-1 px-4 pb-6 lg:px-8 lg:pb-10">
          {/* 3D tilt card wrapper */}
          <motion.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseOut}
            style={{ rotateX, rotateY, transformPerspective: 1000 }}
            className="w-full max-w-5xl mx-auto"
          >
            <div className={cn(
              "rounded-3xl overflow-hidden",
              "bg-white/70 dark:bg-ink-900/70",
              "backdrop-blur-md",
              "border border-white/80 dark:border-ink-800/50",
              "shadow-ink-xl",
              "transition-colors duration-500",
            )}>
              {/* Desktop: side-by-side | Mobile: stacked */}
              <div className="flex flex-col lg:flex-row">
                {/* Hero image column */}
                <div className="lg:w-[38%] lg:flex-shrink-0 p-4 lg:p-5">
                  <HeroImage currentMonth={state.currentMonth} />
                </div>

                {/* Calendar + notes column */}
                <div className="flex-1 flex flex-col lg:flex-row min-w-0">
                  {/* Calendar section */}
                  <div className="flex-1 p-4 lg:p-6 flex flex-col gap-4">
                    <MonthHeader
                      currentMonth={state.currentMonth}
                      onPrev={handlePrev}
                      onNext={handleNext}
                      direction={direction}
                    />

                    <CalendarGrid
                      state={state}
                      effectiveEnd={effectiveEnd}
                      onDateClick={handleDateClick}
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                      hasNotesOnDate={notes.hasNotesOnDate}
                      getNoteCountForDate={notes.getNoteCountForDate}
                      getFirstNoteColor={notes.getFirstNoteColor}
                      direction={direction}
                    />

                    {/* Divider */}
                    <div className="h-px bg-ink-100 dark:bg-ink-800" />

                    <RangeSummary
                      startDate={state.startDate}
                      endDate={state.endDate}
                      onClear={clearSelection}
                      onPreset={setPresetRange}
                    />
                  </div>

                  {/* Notes panel - side on desktop, bottom on mobile */}
                  <div className={cn(
                    "border-t lg:border-t-0 lg:border-l border-ink-100 dark:border-ink-800",
                    "p-4 lg:p-5 lg:w-56 xl:w-64",
                    "bg-ink-50/30 dark:bg-ink-900/30",
                  )}>
                    <NotesPanel
                      currentMonth={state.currentMonth}
                      startDate={state.startDate}
                      endDate={state.endDate}
                      getNotesForDate={notes.getNotesForDate}
                      getNotesForMonth={notes.getNotesForMonth}
                      getNotesForRange={notes.getNotesForRange}
                      addNote={notes.addNote}
                      updateNote={notes.updateNote}
                      deleteNote={notes.deleteNote}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </main>

        {/* Footer */}
        <footer className="text-center pb-4 text-[10px] text-ink-300 dark:text-ink-700 font-body">
          Calendrier · Built with Next.js & Tailwind
        </footer>
      </div>
    </div>
  );
}
