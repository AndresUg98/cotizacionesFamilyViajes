import { useState, useRef, useEffect, useMemo } from 'react';
import { Plane, Backpack, Luggage, Briefcase, ArrowRight, Clock, Search } from 'lucide-react';

const MEXICAN_CITIES = [
  { code: 'CUU', city: 'Chihuahua' },
  { code: 'CUN', city: 'Cancún' },
  { code: 'MEX', city: 'Ciudad de México' },
  { code: 'GDL', city: 'Guadalajara' },
  { code: 'MTY', city: 'Monterrey' },
  { code: 'TIJ', city: 'Tijuana' },
  { code: 'HMO', city: 'Hermosillo' },
  { code: 'SLP', city: 'San Luis Potosí' },
  { code: 'BJX', city: 'León/Guanajuato' },
  { code: 'PVR', city: 'Puerto Vallarta' },
  { code: 'SJD', city: 'Los Cabos' },
  { code: 'MID', city: 'Mérida' },
  { code: 'VER', city: 'Veracruz' },
  { code: 'ACA', city: 'Acapulco' },
  { code: 'OAX', city: 'Oaxaca' },
];

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

function AirportComboBox({ value, onChange, placeholder, exclude }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const ref = useRef(null);
  const inputRef = useRef(null);

  const selected = MEXICAN_CITIES.find((c) => c.code === value);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return MEXICAN_CITIES.filter((c) => {
      if (exclude && c.code === exclude) return false;
      return c.code.toLowerCase().includes(q) || c.city.toLowerCase().includes(q);
    });
  }, [query, exclude]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [open]);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  function handleSelect(code) {
    onChange(code);
    setOpen(false);
    setQuery('');
  }

  function handleInputChange(e) {
    setQuery(e.target.value);
    if (!open) setOpen(true);
  }

  function handleInputFocus() {
    setOpen(true);
  }

  return (
    <div ref={ref} className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={open ? query : (selected ? `${selected.code} - ${selected.city}` : '')}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-300 transition-all"
        />
      </div>
      {open && (
        <div className="absolute top-full left-0 mt-1 z-40 w-full bg-white rounded-xl shadow-lg border border-gray-200 max-h-56 overflow-y-auto">
          {filtered.length === 0 ? (
            <p className="px-4 py-3 text-sm text-gray-400 text-center">Sin resultados</p>
          ) : (
            filtered.map((c) => (
              <button
                key={c.code}
                type="button"
                onClick={() => handleSelect(c.code)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors hover:bg-violet-50 ${
                  value === c.code ? 'bg-violet-50 text-violet-700 font-medium' : 'text-gray-700'
                }`}
              >
                <span className="font-mono font-semibold text-xs bg-gray-100 rounded px-1.5 py-0.5 shrink-0">
                  {c.code}
                </span>
                <span>{c.city}</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function TimePicker({ value, onChange }) {
  const [h, m] = value ? value.split(':') : ['', ''];

  function handleHour(e) {
    const v = e.target.value;
    if (v) {
      onChange(`${v}:${m}`);
    } else if (m) {
      onChange(`:${m}`);
    } else {
      onChange('');
    }
  }

  function handleMinute(e) {
    const v = e.target.value;
    if (v) {
      onChange(`${h}:${v}`);
    } else if (h) {
      onChange(`${h}:`);
    } else {
      onChange('');
    }
  }

  return (
    <div className="flex items-center gap-1">
      <div className="relative">
        <select
          value={h}
          onChange={handleHour}
          className="appearance-none w-16 px-2 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-800 font-mono text-center focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-300 transition-all cursor-pointer"
        >
          <option value="">HH</option>
          {HOURS.map((hh) => (
            <option key={hh} value={hh}>{hh}</option>
          ))}
        </select>
      </div>
      <span className="text-gray-400 font-medium text-sm">:</span>
      <div className="relative">
        <select
          value={m}
          onChange={handleMinute}
          className="appearance-none w-16 px-2 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-800 font-mono text-center focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-300 transition-all cursor-pointer"
        >
          <option value="">MM</option>
          {MINUTES.map((mm) => (
            <option key={mm} value={mm}>{mm}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

function FlightTypeBadge({ value, onChange }) {
  return (
    <div className="flex gap-1.5">
      {['directo', 'escalas'].map((type) => (
        <button
          key={type}
          type="button"
          onClick={() => onChange(type)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            value === type
              ? 'bg-violet-600 text-white shadow-sm'
              : 'bg-gray-50 text-gray-500 border border-gray-200 hover:border-gray-300'
          }`}
        >
          {type === 'directo' ? 'Directo' : 'Con Escalas'}
        </button>
      ))}
    </div>
  );
}

export default function FlightSelector({ flightDetails, onUpdate }) {
  const { ida, regreso, baggage } = flightDetails;

  function updateIda(field, val) {
    onUpdate({ ...flightDetails, ida: { ...ida, [field]: val } });
  }

  function updateRegreso(field, val) {
    onUpdate({ ...flightDetails, regreso: { ...regreso, [field]: val } });
  }

  function updateBaggage(field) {
    onUpdate({ ...flightDetails, baggage: { ...baggage, [field]: !baggage[field] } });
  }

  const hasIdaRoute = ida.origin && ida.destination;
  const invertedRegreso = hasIdaRoute
    ? { origin: ida.destination, destination: ida.origin }
    : null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <Plane className="w-4 h-4 text-violet-500" />
        <span className="text-sm font-semibold text-gray-800">Itinerario de Vuelo</span>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-violet-50 to-violet-100/50 px-4 py-2.5 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-violet-600 text-white text-[10px] font-bold flex items-center justify-center">
              1
            </div>
            <span className="text-xs font-semibold text-violet-700 uppercase tracking-wider">Ida</span>
          </div>
        </div>
        <div className="p-4 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-medium text-gray-500 mb-1">Origen</label>
              <AirportComboBox
                value={ida.origin}
                onChange={(v) => updateIda('origin', v)}
                placeholder="Ej: CUU"
                exclude={ida.destination}
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-gray-500 mb-1">Destino</label>
              <AirportComboBox
                value={ida.destination}
                onChange={(v) => updateIda('destination', v)}
                placeholder="Ej: CUN"
                exclude={ida.origin}
              />
            </div>
          </div>
          {hasIdaRoute && (
            <div className="flex items-center justify-center gap-2 py-1">
              <span className="text-sm font-semibold font-mono text-violet-700">{ida.origin}</span>
              <ArrowRight className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-semibold font-mono text-violet-700">{ida.destination}</span>
            </div>
          )}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-medium text-gray-500 mb-1">
                <Clock className="w-3 h-3 inline mr-1 -mt-0.5 text-gray-400" />
                Hora de Salida
              </label>
              <TimePicker
                value={ida.departureTime}
                onChange={(v) => updateIda('departureTime', v)}
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-gray-500 mb-1">
                <Clock className="w-3 h-3 inline mr-1 -mt-0.5 text-gray-400" />
                Hora de Llegada
              </label>
              <TimePicker
                value={ida.arrivalTime}
                onChange={(v) => updateIda('arrivalTime', v)}
              />
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-medium text-gray-500 mb-1.5">Tipo de Vuelo</label>
            <FlightTypeBadge
              value={ida.flightType}
              onChange={(v) => updateIda('flightType', v)}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-cyan-50 to-cyan-100/50 px-4 py-2.5 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-cyan-600 text-white text-[10px] font-bold flex items-center justify-center">
              2
            </div>
            <span className="text-xs font-semibold text-cyan-700 uppercase tracking-wider">Regreso</span>
          </div>
        </div>
        <div className="p-4 space-y-3">
          {hasIdaRoute ? (
            <>
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-sm font-semibold font-mono text-cyan-700">{invertedRegreso.origin}</span>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-semibold font-mono text-cyan-700">{invertedRegreso.destination}</span>
                </div>
                <p className="text-[10px] text-gray-400 text-center mt-1">Ruta heredada de Ida (automático)</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-gray-500 mb-1">
                    <Clock className="w-3 h-3 inline mr-1 -mt-0.5 text-gray-400" />
                    Hora de Salida
                  </label>
                  <TimePicker
                    value={regreso.departureTime}
                    onChange={(v) => updateRegreso('departureTime', v)}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-gray-500 mb-1">
                    <Clock className="w-3 h-3 inline mr-1 -mt-0.5 text-gray-400" />
                    Hora de Llegada
                  </label>
                  <TimePicker
                    value={regreso.arrivalTime}
                    onChange={(v) => updateRegreso('arrivalTime', v)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-medium text-gray-500 mb-1.5">Tipo de Vuelo</label>
                <FlightTypeBadge
                  value={regreso.flightType}
                  onChange={(v) => updateRegreso('flightType', v)}
                />
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-gray-400">
              <ArrowRight className="w-6 h-6 mb-2" />
              <p className="text-xs">Selecciona origen y destino en Ida primero</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Briefcase className="w-4 h-4 text-violet-500" />
          <span className="text-sm font-semibold text-gray-800">Equipaje Incluido</span>
        </div>
        <div className="flex items-center justify-center gap-6">
          <button
            type="button"
            onClick={() => updateBaggage('personal')}
            className="flex flex-col items-center gap-1.5 group"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
              baggage.personal
                ? 'bg-violet-100 text-violet-600'
                : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
            }`}>
              <Backpack className={`w-5 h-5 transition-colors ${
                baggage.personal ? 'text-violet-600' : 'text-gray-400'
              }`} />
            </div>
            <span className={`text-[10px] font-medium transition-colors ${
              baggage.personal ? 'text-violet-700' : 'text-gray-500'
            }`}>
              Artículo Personal
            </span>
          </button>
          <button
            type="button"
            onClick={() => updateBaggage('carryOn')}
            className="flex flex-col items-center gap-1.5 group"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
              baggage.carryOn
                ? 'bg-violet-100 text-violet-600'
                : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
            }`}>
              <Luggage className={`w-5 h-5 transition-colors ${
                baggage.carryOn ? 'text-violet-600' : 'text-gray-400'
              }`} />
            </div>
            <span className={`text-[10px] font-medium transition-colors ${
              baggage.carryOn ? 'text-violet-700' : 'text-gray-500'
            }`}>
              Equipaje de Mano
            </span>
          </button>
          <button
            type="button"
            onClick={() => updateBaggage('checked')}
            className="flex flex-col items-center gap-1.5 group"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
              baggage.checked
                ? 'bg-violet-100 text-violet-600'
                : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
            }`}>
              <Briefcase className={`w-5 h-5 transition-colors ${
                baggage.checked ? 'text-violet-600' : 'text-gray-400'
              }`} />
            </div>
            <span className={`text-[10px] font-medium transition-colors ${
              baggage.checked ? 'text-violet-700' : 'text-gray-500'
            }`}>
              Equipaje Documentado
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
