import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { DayPicker } from 'react-day-picker';
import { CalendarDays } from 'lucide-react';

function isInRange(date, from, to) {
  if (!from || !to) return false;
  const d = new Date(date);
  const f = new Date(from);
  const t = new Date(to);
  return d > f && d < t;
}

function formatDateLabel(date) {
  if (!date) return '';
  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

function CalendarPopover({ anchorRef, onClose, onDayClick, disabled, defaultMonth, modifiers, modifiersStyles, classNames, labels, hoverBg }) {
  const popoverRef = useRef(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  const updatePosition = useCallback(() => {
    if (anchorRef.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const popoverH = 380;
      if (spaceBelow < popoverH && rect.top > popoverH) {
        setPos({ top: rect.top - popoverH - 8, left: rect.left + rect.width / 2 });
      } else {
        setPos({ top: rect.bottom + 8, left: rect.left + rect.width / 2 });
      }
    }
  }, [anchorRef]);

  useEffect(() => {
    updatePosition();
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [updatePosition]);

  useEffect(() => {
    function handleMouseDown(e) {
      if (popoverRef.current && !popoverRef.current.contains(e.target) &&
          anchorRef.current && !anchorRef.current.contains(e.target)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [onClose, anchorRef]);

  return createPortal(
    <div
      ref={popoverRef}
      style={{
        position: 'fixed',
        top: `${pos.top}px`,
        left: `${pos.left}px`,
        transform: 'translateX(-50%)',
        zIndex: 9999,
      }}
    >
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4 min-w-[320px]">
        <DayPicker
          mode="single"
          selected={undefined}
          onDayClick={onDayClick}
          disabled={disabled}
          defaultMonth={defaultMonth}
          modifiers={modifiers}
          modifiersStyles={modifiersStyles}
          classNames={{
            ...classNames,
            day_button: `${hoverBg} w-10 h-10 text-sm font-medium text-gray-700 rounded-full transition-all duration-150 mx-auto block`,
          }}
          labels={labels}
        />
      </div>
    </div>,
    document.body
  );
}

export default function DatePicker({ departureDate, returnDate, onDepartureChange, onReturnChange }) {
  const [open, setOpen] = useState(null);
  const depBtnRef = useRef(null);
  const retBtnRef = useRef(null);

  const depDate = departureDate ? new Date(departureDate + 'T12:00:00') : undefined;
  const retDate = returnDate ? new Date(returnDate + 'T12:00:00') : undefined;

  function handleDayClick(date) {
    if (open === 'departure') {
      onDepartureChange(date);
      setOpen(null);
    } else if (open === 'return') {
      if (depDate && date <= depDate) {
        onDepartureChange(date);
        onReturnChange(undefined);
        setOpen(null);
      } else {
        onReturnChange(date);
        setOpen(null);
      }
    }
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const calendarClassNames = {
    month_caption: 'flex items-center justify-between px-1 py-2',
    caption_label: 'text-sm font-semibold text-gray-800',
    month_grid: 'w-full border-collapse',
    weekdays: 'grid grid-cols-7',
    weekday: 'text-[11px] font-semibold text-gray-400 py-2 text-center tracking-wider uppercase',
    weeks: 'grid grid-cols-7 gap-0',
    week: 'contents',
    day: 'p-0',
    outside: 'text-gray-300',
    today: 'font-semibold',
    disabled: 'text-gray-300 cursor-not-allowed',
    nav: 'flex items-center gap-1',
    button_previous: 'p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors',
    button_next: 'p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors',
  };

  const sharedModifiers = {
    depDay: depDate,
    retDay: retDate,
    rangeDay: (date) => isInRange(date, depDate, retDate),
  };

  const sharedModifierStyles = {
    depDay: {
      backgroundColor: '#7c3aed',
      color: '#fff',
      fontWeight: '700',
      borderRadius: '50%',
      boxShadow: '0 2px 8px rgba(124,58,237,0.3)',
    },
    retDay: {
      backgroundColor: '#7c3aed',
      color: '#fff',
      fontWeight: '700',
      borderRadius: '50%',
      boxShadow: '0 2px 8px rgba(124,58,237,0.3)',
    },
    rangeDay: {
      backgroundColor: '#ede9fe',
      borderRadius: '0',
    },
  };

  const labels = {
    labelMonthDropdown: () => 'Mes',
    labelYearDropdown: () => 'Año',
    labelNext: () => 'Siguiente mes',
    labelPrevious: () => 'Mes anterior',
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Fechas del Vuelo
      </label>
      <div className="flex gap-3">
        <div className="relative flex-1">
          <button
            ref={depBtnRef}
            type="button"
            onClick={() => setOpen(open === 'departure' ? null : 'departure')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-sm transition-all ${
              open === 'departure'
                ? 'border-violet-300 ring-2 ring-violet-200 bg-violet-50 shadow-md'
                : 'border-gray-200 bg-white hover:border-violet-300 hover:shadow-sm'
            }`}
          >
            <div className="w-9 h-9 rounded-lg bg-violet-100 flex items-center justify-center shrink-0">
              <CalendarDays className="w-4 h-4 text-violet-600" />
            </div>
            <div className="text-left flex-1 min-w-0">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider leading-tight">Salida</p>
              <p className={`text-sm truncate mt-0.5 ${depDate ? 'font-semibold text-gray-800' : 'text-gray-400'}`}>
                {depDate ? formatDateLabel(depDate) : 'Seleccionar fecha'}
              </p>
            </div>
          </button>
          {open === 'departure' && (
            <CalendarPopover
              anchorRef={depBtnRef}
              onClose={() => setOpen(null)}
              onDayClick={handleDayClick}
              disabled={{ before: today }}
              defaultMonth={depDate || today}
              modifiers={sharedModifiers}
              modifiersStyles={sharedModifierStyles}
              classNames={calendarClassNames}
              labels={labels}
              hoverBg="hover:bg-cyan-100"
            />
          )}
        </div>

        <div className="relative flex-1">
          <button
            ref={retBtnRef}
            type="button"
            onClick={() => setOpen(open === 'return' ? null : 'return')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-sm transition-all ${
              open === 'return'
                ? 'border-cyan-300 ring-2 ring-cyan-200 bg-cyan-50 shadow-md'
                : 'border-gray-200 bg-white hover:border-cyan-300 hover:shadow-sm'
            }`}
          >
            <div className="w-9 h-9 rounded-lg bg-cyan-100 flex items-center justify-center shrink-0">
              <CalendarDays className="w-4 h-4 text-cyan-600" />
            </div>
            <div className="text-left flex-1 min-w-0">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider leading-tight">Regreso</p>
              <p className={`text-sm truncate mt-0.5 ${retDate ? 'font-semibold text-gray-800' : 'text-gray-400'}`}>
                {retDate ? formatDateLabel(retDate) : 'Seleccionar fecha'}
              </p>
            </div>
          </button>
          {open === 'return' && (
            <CalendarPopover
              anchorRef={retBtnRef}
              onClose={() => setOpen(null)}
              onDayClick={handleDayClick}
              disabled={[{ before: depDate || today }]}
              defaultMonth={retDate || depDate || today}
              modifiers={sharedModifiers}
              modifiersStyles={sharedModifierStyles}
              classNames={calendarClassNames}
              labels={labels}
              hoverBg="hover:bg-cyan-100"
            />
          )}
        </div>
      </div>
    </div>
  );
}
