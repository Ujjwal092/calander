export interface CalendarState {
  currentMonth: Date;
  startDate: Date | null;
  endDate: Date | null;
  hoverDate: Date | null;
}

export interface NoteEntry {
  id: string;
  text: string;
  createdAt: string;
  updatedAt: string;
  type: "date" | "range" | "month";
  dateKey?: string;       // "YYYY-MM-DD" for date notes
  rangeStart?: string;    // "YYYY-MM-DD" for range notes
  rangeEnd?: string;      // "YYYY-MM-DD" for range notes
  color?: NoteColor;
}

export type NoteColor = "warm" | "gold" | "sage" | "slate" | "rose";

export interface MonthData {
  notes: NoteEntry[];
}

export interface NotesStore {
  [monthKey: string]: MonthData; // key: "YYYY-MM"
}

export interface DayCellProps {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isStart: boolean;
  isEnd: boolean;
  isInRange: boolean;
  isHoverRange: boolean;
  isRangeStart: boolean;
  isRangeEnd: boolean;
  hasNotes: boolean;
  noteCount: number;
  noteColor?: NoteColor;
  isSelected: boolean;
  onClick: (date: Date) => void;
  onMouseEnter: (date: Date) => void;
  onMouseLeave: () => void;
  tabIndex: number;
  onKeyDown: (e: React.KeyboardEvent, date: Date) => void;
  ariaLabel: string;
}

export interface PresetRange {
  label: string;
  icon: string;
  getRange: () => { start: Date; end: Date };
}
