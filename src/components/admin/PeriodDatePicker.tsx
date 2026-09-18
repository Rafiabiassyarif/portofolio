import React, { useState, useEffect, useRef } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X, Edit3 } from 'lucide-react';
import { autoTranslateDate } from '../../utils/bilingualHelper';

interface PeriodDatePickerProps {
  label?: string;
  valueId: string;
  valueEn: string;
  onChange: (idValue: string, enValue: string) => void;
  required?: boolean;
}

const MONTH_LOOKUP: Record<string, number> = {
  'jan': 0, 'januari': 0, 'january': 0,
  'feb': 1, 'februari': 1, 'february': 1,
  'mar': 2, 'maret': 2, 'march': 2,
  'apr': 3, 'april': 3,
  'mei': 4, 'may': 4,
  'jun': 5, 'juni': 5, 'june': 5,
  'jul': 6, 'juli': 6, 'july': 6,
  'agu': 7, 'agt': 7, 'agustus': 7, 'aug': 7, 'august': 7,
  'sep': 8, 'september': 8,
  'okt': 9, 'oktober': 9, 'oct': 9, 'october': 9,
  'nov': 10, 'november': 10,
  'des': 11, 'desember': 11, 'dec': 11, 'december': 11,
};

const MONTH_NAMES = [
  { id: 'Jan', idFull: 'Januari', en: 'Jan' },
  { id: 'Feb', idFull: 'Februari', en: 'Feb' },
  { id: 'Mar', idFull: 'Maret', en: 'Mar' },
  { id: 'Apr', idFull: 'April', en: 'Apr' },
  { id: 'Mei', idFull: 'Mei', en: 'May' },
  { id: 'Jun', idFull: 'Juni', en: 'Jun' },
  { id: 'Jul', idFull: 'Juli', en: 'Jul' },
  { id: 'Agu', idFull: 'Agustus', en: 'Aug' },
  { id: 'Sep', idFull: 'September', en: 'Sep' },
  { id: 'Okt', idFull: 'Oktober', en: 'Oct' },
  { id: 'Nov', idFull: 'November', en: 'Nov' },
  { id: 'Des', idFull: 'Desember', en: 'Dec' },
];

interface SelectedDate {
  day?: number;
  month: number; // 0-11
  year: number;
  hasDay: boolean;
}

function parseDateText(text: string): SelectedDate | null {
  if (!text) return null;
  const trimmed = text.trim();

  const yearMatch = trimmed.match(/\b(19\d\d|20\d\d)\b/);
  if (!yearMatch) return null;
  const year = parseInt(yearMatch[1], 10);

  const withoutYear = trimmed.replace(/\b(19\d\d|20\d\d)\b/, '').trim();
  const dayMatch = withoutYear.match(/\b([1-9]|[12]\d|3[01])\b/);
  const day = dayMatch ? parseInt(dayMatch[1], 10) : undefined;

  let month = 0;
  const lower = withoutYear.toLowerCase();
  for (const [key, num] of Object.entries(MONTH_LOOKUP)) {
    const reg = new RegExp(`\\b${key}\\b`, 'i');
    if (reg.test(lower)) {
      month = num;
      break;
    }
  }

  return {
    day,
    month,
    year,
    hasDay: day !== undefined
  };
}

function formatDate(date: SelectedDate | null): { id: string; en: string } {
  if (!date) return { id: '', en: '' };
  const m = MONTH_NAMES[date.month] || MONTH_NAMES[0];
  if (date.hasDay && date.day) {
    return {
      id: `${date.day} ${m.id} ${date.year}`,
      en: `${date.day} ${m.en} ${date.year}`
    };
  }
  return {
    id: `${m.id} ${date.year}`,
    en: `${m.en} ${date.year}`
  };
}

// Elegant Custom Calendar Popup (No OS dropdown overflow)
interface CalendarFieldProps {
  value: SelectedDate | null;
  onChange: (val: SelectedDate | null) => void;
  placeholder?: string;
  disabled?: boolean;
}

const CalendarField: React.FC<CalendarFieldProps> = ({
  value,
  onChange,
  placeholder = "Pilih tanggal...",
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewYear, setViewYear] = useState<number>(value ? value.year : new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState<number>(value ? value.month : new Date().getMonth());
  const [viewMode, setViewMode] = useState<'days' | 'months' | 'years'>('days');
  const [decadeStart, setDecadeStart] = useState<number>(Math.floor((value ? value.year : new Date().getFullYear()) / 12) * 12);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      setViewYear(value.year);
      setViewMonth(value.month);
      setDecadeStart(Math.floor(value.year / 12) * 12);
    }
  }, [value]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setViewMode('days');
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay();
  const startDay = (firstDayIndex + 6) % 7; // Monday = 0

  const handlePrev = () => {
    if (viewMode === 'days') {
      if (viewMonth === 0) {
        setViewMonth(11);
        setViewYear(y => y - 1);
      } else {
        setViewMonth(m => m - 1);
      }
    } else if (viewMode === 'years') {
      setDecadeStart(d => Math.max(1900, d - 12));
    } else if (viewMode === 'months') {
      setViewYear(y => y - 1);
    }
  };

  const handleNext = () => {
    if (viewMode === 'days') {
      if (viewMonth === 11) {
        setViewMonth(0);
        setViewYear(y => y + 1);
      } else {
        setViewMonth(m => m + 1);
      }
    } else if (viewMode === 'years') {
      setDecadeStart(d => Math.min(2088, d + 12));
    } else if (viewMode === 'months') {
      setViewYear(y => y + 1);
    }
  };

  const formatted = formatDate(value);

  return (
    <div className={`relative ${disabled ? 'opacity-40 pointer-events-none' : ''}`} ref={containerRef}>
      {/* Input Field matching admin theme */}
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-left flex items-center justify-between hover:border-indigo-500/50 cursor-pointer transition-all text-sm group"
      >
        <div className="flex items-center gap-2.5 truncate">
          <CalendarIcon className="w-4 h-4 text-muted-foreground group-hover:text-indigo-400 transition-colors shrink-0" />
          <span className={formatted.id ? 'text-foreground font-medium' : 'text-muted-foreground'}>
            {formatted.id || placeholder}
          </span>
        </div>
        {value && !disabled && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange(null);
            }}
            className="p-1 hover:bg-white/10 rounded-full text-muted-foreground hover:text-foreground transition-colors"
            title="Hapus"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Calendar Popover */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 z-50 w-72 bg-card border border-border rounded-2xl shadow-2xl p-3.5 animate-in fade-in zoom-in-95 duration-100 select-none">
          {/* Header */}
          <div className="flex items-center justify-between gap-1 mb-3 pb-2 border-b border-border">
            <button
              type="button"
              onClick={handlePrev}
              className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1">
              {/* Month Toggle */}
              <button
                type="button"
                onClick={() => setViewMode(viewMode === 'months' ? 'days' : 'months')}
                className="px-2 py-1 hover:bg-muted rounded-lg text-xs font-bold text-foreground transition-colors hover:text-indigo-400"
              >
                {MONTH_NAMES[viewMonth].idFull}
              </button>

              {/* Year Toggle */}
              <button
                type="button"
                onClick={() => {
                  setDecadeStart(Math.floor(viewYear / 12) * 12);
                  setViewMode(viewMode === 'years' ? 'days' : 'years');
                }}
                className="px-2 py-1 hover:bg-muted rounded-lg text-xs font-bold text-foreground transition-colors hover:text-indigo-400"
              >
                {viewMode === 'years' ? `${decadeStart} - ${decadeStart + 11}` : viewYear}
              </button>
            </div>

            <button
              type="button"
              onClick={handleNext}
              className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* View: Days */}
          {viewMode === 'days' && (
            <>
              <div className="grid grid-cols-7 gap-1 text-center mb-1.5">
                {['Sn', 'Sl', 'Rb', 'Km', 'Jm', 'Sb', 'Mn'].map(d => (
                  <span key={d} className="text-[10px] font-bold text-muted-foreground uppercase">
                    {d}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1 text-center mb-3">
                {Array.from({ length: startDay }).map((_, idx) => (
                  <div key={`empty-${idx}`} className="h-7" />
                ))}
                {Array.from({ length: daysInMonth }).map((_, idx) => {
                  const dayNum = idx + 1;
                  const isSelected =
                    value &&
                    value.hasDay &&
                    value.day === dayNum &&
                    value.month === viewMonth &&
                    value.year === viewYear;

                  return (
                    <button
                      key={dayNum}
                      type="button"
                      onClick={() => {
                        onChange({ day: dayNum, month: viewMonth, year: viewYear, hasDay: true });
                        setIsOpen(false);
                      }}
                      className={`h-7 rounded-lg text-xs font-medium transition-all flex items-center justify-center ${
                        isSelected
                          ? 'bg-indigo-600 text-white font-bold'
                          : 'text-foreground hover:bg-indigo-500/20 hover:text-indigo-300'
                      }`}
                    >
                      {dayNum}
                    </button>
                  );
                })}
              </div>

              {/* Bottom Quick Button */}
              <div className="pt-2 border-t border-border flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onChange({ month: viewMonth, year: viewYear, hasDay: false });
                    setIsOpen(false);
                  }}
                  className="flex-1 py-1.5 px-2 rounded-lg bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/20 text-indigo-400 text-xs font-semibold transition-all text-center truncate"
                >
                  Pilih {MONTH_NAMES[viewMonth].id} {viewYear} saja
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const now = new Date();
                    onChange({ month: now.getMonth(), year: now.getFullYear(), hasDay: false });
                    setIsOpen(false);
                  }}
                  className="py-1.5 px-2 rounded-lg bg-muted hover:bg-muted/80 text-muted-foreground text-xs font-medium transition-colors"
                >
                  Bulan Ini
                </button>
              </div>
            </>
          )}

          {/* View: Months (3x4 Grid) */}
          {viewMode === 'months' && (
            <div className="grid grid-cols-3 gap-1.5 py-1">
              {MONTH_NAMES.map((m, idx) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    setViewMonth(idx);
                    setViewMode('days');
                  }}
                  className={`py-2.5 rounded-lg text-xs font-medium transition-colors ${
                    viewMonth === idx
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'hover:bg-muted text-foreground'
                  }`}
                >
                  {m.idFull}
                </button>
              ))}
            </div>
          )}

          {/* View: Years (3x4 Grid from 1900 to 2100) */}
          {viewMode === 'years' && (
            <div className="grid grid-cols-3 gap-1.5 py-1">
              {Array.from({ length: 12 }).map((_, idx) => {
                const y = decadeStart + idx;
                if (y < 1900 || y > 2100) return null;
                return (
                  <button
                    key={y}
                    type="button"
                    onClick={() => {
                      setViewYear(y);
                      setViewMode('months');
                    }}
                    className={`py-2.5 rounded-lg text-xs font-medium transition-colors ${
                      viewYear === y
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'hover:bg-muted text-foreground'
                    }`}
                  >
                    {y}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const PeriodDatePicker: React.FC<PeriodDatePickerProps> = ({
  label = "Periode",
  valueId,
  valueEn,
  onChange,
  required = false
}) => {
  const [startDate, setStartDate] = useState<SelectedDate | null>(null);
  const [endDate, setEndDate] = useState<SelectedDate | null>(null);
  const [isCurrent, setIsCurrent] = useState(false);
  const [manualMode, setManualMode] = useState(false);

  // Parse existing values
  useEffect(() => {
    if (!valueId) {
      setStartDate(null);
      setEndDate(null);
      setIsCurrent(false);
      return;
    }

    const isRange = /[-–—]|sampai|s\/d|hingga|\bto\b/i.test(valueId);
    if (isRange) {
      const parts = valueId.split(/[-–—]|sampai|s\/d|hingga|\bto\b/i);
      const startStr = parts[0]?.trim() || '';
      const endStr = parts[1]?.trim() || '';

      setStartDate(parseDateText(startStr));

      if (/saat ini|sekarang|present|current/i.test(endStr)) {
        setIsCurrent(true);
        setEndDate(null);
      } else {
        setIsCurrent(false);
        setEndDate(parseDateText(endStr));
      }
    } else {
      setStartDate(parseDateText(valueId));
      setEndDate(null);
      setIsCurrent(false);
    }
  }, [valueId]);

  const emitChange = (newStart: SelectedDate | null, newEnd: SelectedDate | null, newIsCurrent: boolean) => {
    const startFmt = formatDate(newStart);

    if (newIsCurrent) {
      const finalId = startFmt.id ? `${startFmt.id} - Saat ini` : 'Saat ini';
      const finalEn = startFmt.en ? `${startFmt.en} - Present` : 'Present';
      onChange(finalId, finalEn);
    } else {
      const endFmt = formatDate(newEnd);
      if (startFmt.id && endFmt.id) {
        onChange(`${startFmt.id} - ${endFmt.id}`, `${startFmt.en} - ${endFmt.en}`);
      } else if (startFmt.id) {
        // Only 1 date filled
        onChange(startFmt.id, startFmt.en);
      } else if (endFmt.id) {
        onChange(endFmt.id, endFmt.en);
      } else {
        onChange('', '');
      }
    }
  };

  const handleStartChange = (val: SelectedDate | null) => {
    setStartDate(val);
    emitChange(val, endDate, isCurrent);
  };

  const handleEndChange = (val: SelectedDate | null) => {
    setEndDate(val);
    setIsCurrent(false);
    emitChange(startDate, val, false);
  };

  const handleCurrentToggle = (checked: boolean) => {
    setIsCurrent(checked);
    if (checked) setEndDate(null);
    emitChange(startDate, null, checked);
  };

  return (
    <div>
      {/* Label */}
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs text-muted-foreground uppercase tracking-widest block font-semibold">
          {label}
        </label>
        <button
          type="button"
          onClick={() => setManualMode(!manualMode)}
          className="text-[11px] text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
        >
          <Edit3 className="w-3 h-3" />
          {manualMode ? "Pakai Kalender" : "Ketik Manual"}
        </button>
      </div>

      {manualMode ? (
        <input
          type="text"
          value={valueId}
          onChange={e => onChange(e.target.value, autoTranslateDate(e.target.value))}
          placeholder="Jan 2024 - Saat ini"
          required={required}
          className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-foreground text-sm placeholder-white/20 focus:outline-none focus:border-indigo-500/50 transition-all"
        />
      ) : (
        <div className="space-y-2">
          {/* Two Input Fields: Mulai & Selesai (matching rest of the form) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <span className="text-[11px] text-muted-foreground block mb-1">Tanggal Mulai</span>
              <CalendarField
                value={startDate}
                onChange={handleStartChange}
                placeholder="Pilih Tanggal Mulai"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] text-muted-foreground block">Tanggal Selesai</span>
                <span className="text-[10px] text-muted-foreground/70">(Opsional / kosongkan jika 1 tgl)</span>
              </div>
              <CalendarField
                value={endDate}
                onChange={handleEndChange}
                placeholder={isCurrent ? "Saat Ini (Present)" : "Pilih Tanggal Selesai"}
                disabled={isCurrent}
              />
            </div>
          </div>

          {/* Sub-bar: Checkbox & Result */}
          <div className="flex items-center justify-between flex-wrap gap-2 pt-0.5">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-muted-foreground hover:text-foreground transition-colors select-none">
              <input
                type="checkbox"
                checked={isCurrent}
                onChange={e => handleCurrentToggle(e.target.checked)}
                className="rounded border-border bg-background text-indigo-600 focus:ring-indigo-500/50 w-3.5 h-3.5"
              />
              <span>Masih berlangsung (Saat ini)</span>
            </label>

            {valueId && (
              <span className="text-xs text-muted-foreground">
                Tersimpan: <span className="text-indigo-400 font-semibold">{valueId}</span>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
