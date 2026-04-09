"use client";

import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, isSameDay } from "date-fns";
import {
  StickyNote,
  Plus,
  Trash2,
  Calendar,
  CalendarRange,
  BookOpen,
  Edit3,
  Check,
  X,
} from "lucide-react";
import { cn, formatMonthKey, formatDateKey, NOTE_COLORS } from "@/lib/utils";
import type { NoteEntry, NoteColor } from "@/types";

interface NotesPanelProps {
  currentMonth: Date;
  startDate: Date | null;
  endDate: Date | null;
  getNotesForDate: (date: Date) => NoteEntry[];
  getNotesForMonth: (monthKey: string) => NoteEntry[];
  getNotesForRange: (start: Date | null, end: Date | null) => NoteEntry[];
  addNote: (monthKey: string, note: Omit<NoteEntry, "id" | "createdAt" | "updatedAt">) => string;
  updateNote: (monthKey: string, noteId: string, text: string, color?: NoteColor) => void;
  deleteNote: (monthKey: string, noteId: string) => void;
}

type NoteTab = "date" | "range" | "month";

const COLOR_OPTIONS: NoteColor[] = ["warm", "gold", "sage", "slate", "rose"];
const COLOR_LABELS: Record<NoteColor, string> = {
  warm: "Orange",
  gold: "Gold",
  sage: "Green",
  slate: "Blue",
  rose: "Rose",
};

function NoteItem({
  note,
  onUpdate,
  onDelete,
  monthKey,
}: {
  note: NoteEntry;
  onUpdate: (id: string, text: string, color?: NoteColor) => void;
  onDelete: (id: string) => void;
  monthKey: string;
}) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(note.text);
  const [editColor, setEditColor] = useState<NoteColor>(note.color ?? "warm");
  const colors = NOTE_COLORS[note.color ?? "warm"];

  const handleSave = () => {
    if (editText.trim()) {
      onUpdate(note.id, editText.trim(), editColor);
      setEditing(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8, scale: 0.96 }}
      transition={{ duration: 0.18 }}
      className={cn(
        "rounded-xl border p-3 transition-colors",
        colors.bg,
        colors.border
      )}
    >
      {editing ? (
        <div className="space-y-2.5">
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            autoFocus
            rows={3}
            className={cn(
              "w-full text-xs resize-none rounded-lg p-2",
              "bg-white/60 dark:bg-black/20 border border-ink-200/50 dark:border-ink-700/50",
              "text-ink-700 dark:text-ink-200 placeholder:text-ink-400",
              "focus:outline-none focus:ring-2 focus:ring-amber-400 dark:focus:ring-amber-600"
            )}
            placeholder="Write your note..."
          />
          {/* Color picker */}
          <div className="flex items-center gap-1.5">
            {COLOR_OPTIONS.map((c) => (
              <button
                key={c}
                type="button"
                title={COLOR_LABELS[c]}
                onClick={() => setEditColor(c)}
                className={cn(
                  "w-5 h-5 rounded-full transition-all",
                  NOTE_COLORS[c].dot,
                  editColor === c ? "ring-2 ring-offset-1 ring-ink-400 scale-110" : "opacity-60 hover:opacity-100"
                )}
              />
            ))}
          </div>
          <div className="flex gap-1.5 justify-end">
            <button
              type="button"
              onClick={() => { setEditing(false); setEditText(note.text); }}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-ink-400 hover:text-ink-700 hover:bg-ink-100/70 dark:hover:bg-ink-800/50 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="w-7 h-7 flex items-center justify-center rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-2">
          <p className={cn("flex-1 text-xs leading-relaxed", colors.text)}>
            {note.text}
          </p>
          <div className="flex gap-1 flex-shrink-0 ml-1">
            <button
              type="button"
              onClick={() => { setEditing(true); setEditText(note.text); setEditColor(note.color ?? "warm"); }}
              className="w-6 h-6 flex items-center justify-center rounded-md text-ink-400 hover:text-ink-700 dark:hover:text-ink-200 hover:bg-ink-100/60 dark:hover:bg-ink-800/40 transition-colors"
            >
              <Edit3 className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(note.id)}
              className="w-6 h-6 flex items-center justify-center rounded-md text-ink-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}

function AddNoteForm({
  onAdd,
  defaultColor = "warm",
}: {
  onAdd: (text: string, color: NoteColor) => void;
  defaultColor?: NoteColor;
}) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [color, setColor] = useState<NoteColor>(defaultColor);

  const handleSubmit = () => {
    if (text.trim()) {
      onAdd(text.trim(), color);
      setText("");
      setColor(defaultColor);
      setOpen(false);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {!open ? (
        <motion.button
          key="add-btn"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          type="button"
          onClick={() => setOpen(true)}
          className={cn(
            "flex items-center gap-2 w-full px-3 py-2 rounded-xl",
            "border border-dashed border-ink-200 dark:border-ink-700",
            "text-xs text-ink-400 dark:text-ink-500 hover:text-ink-600 dark:hover:text-ink-300",
            "hover:border-amber-300 dark:hover:border-amber-700",
            "transition-all duration-150 group"
          )}
        >
          <Plus className="w-3.5 h-3.5 transition-transform group-hover:rotate-90 duration-200" />
          Add note
        </motion.button>
      ) : (
        <motion.div
          key="add-form"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          className={cn(
            "rounded-xl border p-3 space-y-2.5",
            "bg-amber-50/80 dark:bg-amber-950/20",
            "border-amber-200 dark:border-amber-800/40"
          )}
        >
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            autoFocus
            rows={3}
            className={cn(
              "w-full text-xs resize-none rounded-lg p-2",
              "bg-white/70 dark:bg-black/20 border border-ink-200/50 dark:border-ink-700/50",
              "text-ink-700 dark:text-ink-200 placeholder:text-ink-400",
              "focus:outline-none focus:ring-2 focus:ring-amber-400"
            )}
            placeholder="Write your note..."
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.metaKey) handleSubmit();
              if (e.key === "Escape") { setOpen(false); setText(""); }
            }}
          />
          <div className="flex items-center justify-between">
            <div className="flex gap-1.5">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c}
                  type="button"
                  title={COLOR_LABELS[c]}
                  onClick={() => setColor(c)}
                  className={cn(
                    "w-4 h-4 rounded-full transition-all",
                    NOTE_COLORS[c].dot,
                    color === c ? "ring-2 ring-offset-1 ring-ink-400 scale-110" : "opacity-50 hover:opacity-90"
                  )}
                />
              ))}
            </div>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => { setOpen(false); setText(""); }}
                className="px-2.5 py-1 text-xs text-ink-400 hover:text-ink-700 hover:bg-ink-100/60 dark:hover:bg-ink-800/50 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!text.trim()}
                className="px-2.5 py-1 text-xs font-medium bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function NotesPanel({
  currentMonth,
  startDate,
  endDate,
  getNotesForDate,
  getNotesForMonth,
  getNotesForRange,
  addNote,
  updateNote,
  deleteNote,
}: NotesPanelProps) {
  const [activeTab, setActiveTab] = useState<NoteTab>("date");

  const monthKey = formatMonthKey(currentMonth);

  const dateNotes = useMemo(() =>
    startDate ? getNotesForDate(startDate) : [],
    [startDate, getNotesForDate]
  );

  const rangeNotes = useMemo(() =>
    getNotesForRange(startDate, endDate),
    [startDate, endDate, getNotesForRange]
  );

  const monthNotes = useMemo(() =>
    getNotesForMonth(monthKey),
    [monthKey, getNotesForMonth]
  );

  const tabs: { id: NoteTab; label: string; icon: React.ReactNode; count: number }[] = [
    {
      id: "date",
      label: "Date",
      icon: <Calendar className="w-3.5 h-3.5" />,
      count: dateNotes.length,
    },
    {
      id: "range",
      label: "Range",
      icon: <CalendarRange className="w-3.5 h-3.5" />,
      count: rangeNotes.length,
    },
    {
      id: "month",
      label: "Month",
      icon: <BookOpen className="w-3.5 h-3.5" />,
      count: monthNotes.length,
    },
  ];

  const handleAddNote = useCallback((text: string, color: NoteColor) => {
    if (activeTab === "date" && startDate) {
      addNote(monthKey, {
        text,
        color,
        type: "date",
        dateKey: formatDateKey(startDate),
      });
    } else if (activeTab === "range" && startDate) {
      const rangeStart = formatDateKey(startDate);
      const rangeEnd = endDate ? formatDateKey(endDate) : rangeStart;
      addNote(monthKey, {
        text,
        color,
        type: "range",
        rangeStart,
        rangeEnd,
        dateKey: rangeStart,
      });
    } else if (activeTab === "month") {
      addNote(monthKey, {
        text,
        color,
        type: "month",
      });
    }
  }, [activeTab, startDate, endDate, monthKey, addNote]);

  const handleUpdate = useCallback((id: string, text: string, color?: NoteColor) => {
    updateNote(monthKey, id, text, color);
  }, [monthKey, updateNote]);

  const handleDelete = useCallback((id: string) => {
    deleteNote(monthKey, id);
  }, [monthKey, deleteNote]);

  const activeNotes =
    activeTab === "date" ? dateNotes :
    activeTab === "range" ? rangeNotes :
    monthNotes;

  const canAdd =
    activeTab === "month" ||
    (activeTab === "date" && !!startDate) ||
    (activeTab === "range" && !!startDate);

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
          <StickyNote className="w-3.5 h-3.5 text-white" />
        </div>
        <h3 className="text-xs font-semibold tracking-wide uppercase text-ink-600 dark:text-ink-400">
          Notes
        </h3>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-0.5 rounded-lg bg-ink-100/70 dark:bg-ink-900/50">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 py-1.5 px-1 rounded-md text-xs font-medium transition-all duration-150",
              activeTab === tab.id
                ? "bg-white dark:bg-ink-800 text-ink-800 dark:text-ink-100 shadow-ink-sm"
                : "text-ink-400 dark:text-ink-500 hover:text-ink-600 dark:hover:text-ink-300"
            )}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
            {tab.count > 0 && (
              <span className={cn(
                "w-4 h-4 flex items-center justify-center rounded-full text-[10px] font-bold",
                activeTab === tab.id
                  ? "bg-amber-500 text-white"
                  : "bg-ink-200 dark:bg-ink-700 text-ink-500 dark:text-ink-400"
              )}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Context label */}
      <div className="text-[10px] text-ink-400 dark:text-ink-600 px-0.5">
        {activeTab === "date" && (
          startDate ? (
            <span>Notes for <strong className="text-ink-600 dark:text-ink-400">{format(startDate, "MMMM d, yyyy")}</strong></span>
          ) : (
            <span>Select a date to add notes</span>
          )
        )}
        {activeTab === "range" && (
          startDate && endDate ? (
            <span>Notes for <strong className="text-ink-600 dark:text-ink-400">{format(startDate, "MMM d")} – {format(endDate, "MMM d")}</strong></span>
          ) : startDate ? (
            <span>Notes for <strong className="text-ink-600 dark:text-ink-400">{format(startDate, "MMMM d")}</strong> (no end date)</span>
          ) : (
            <span>Select a date range for notes</span>
          )
        )}
        {activeTab === "month" && (
          <span>Notes for <strong className="text-ink-600 dark:text-ink-400">{format(currentMonth, "MMMM yyyy")}</strong></span>
        )}
      </div>

      {/* Notes list */}
      <AnimatePresence mode="popLayout">
        <div className="space-y-2 min-h-[60px]">
          {activeNotes.length === 0 ? (
            <motion.p
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-ink-300 dark:text-ink-600 text-center py-4"
            >
              No notes yet
            </motion.p>
          ) : (
            activeNotes.map((note) => (
              <NoteItem
                key={note.id}
                note={note}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
                monthKey={monthKey}
              />
            ))
          )}
        </div>
      </AnimatePresence>

      {/* Add note */}
      {canAdd && (
        <AddNoteForm onAdd={handleAddNote} />
      )}
    </div>
  );
}
