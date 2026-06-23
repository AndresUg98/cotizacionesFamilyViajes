import { motion, AnimatePresence } from 'framer-motion';

const MONTH_OPTIONS = [
  { value: 0, label: 'Sin meses' },
  { value: 3, label: '3 meses' },
  { value: 6, label: '6 meses' },
  { value: 9, label: '9 meses' },
  { value: 12, label: '12 meses' },
  { value: 18, label: '18 meses' },
  { value: 24, label: '24 meses' },
];

const METHOD_DEFS = [
  {
    key: 'cash',
    label: 'Pago en Efectivo',
    desc: 'Pago único al contado',
    hasMonths: false,
  },
  {
    key: 'debitCard',
    label: 'Tarjeta de Débito',
    desc: 'Pago único con débito',
    hasMonths: true,
    defaultMonths: 0,
  },
  {
    key: 'creditCard',
    label: 'Tarjeta de Crédito',
    desc: 'Pagos mensuales sin intereses',
    hasMonths: true,
    defaultMonths: 6,
  },
  {
    key: 'twoCards',
    label: '2 Tarjetas de Crédito',
    desc: 'Pago dividido en dos tarjetas, ambas sin intereses',
    hasMonths: true,
    defaultMonths: 6,
  },
  {
    key: 'deferred',
    label: 'Pago Diferido',
    desc: 'Pague después con un depósito',
    hasMonths: true,
    defaultMonths: 6,
  },
];

export default function PaymentMethods({ value, onChange }) {
  const toggle = (key) => {
    const current = value?.[key];
    if (current === undefined || current === null) return;
    if (typeof current === 'boolean') {
      onChange(key, !current);
    } else {
      onChange(key, { ...current, enabled: !current.enabled });
    }
  };

  const setMonths = (key, months) => {
    const current = value?.[key];
    if (!current || typeof current === 'boolean') return;
    onChange(key, { ...current, months });
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Métodos de Pago
      </label>
      <div className="space-y-2">
        {METHOD_DEFS.map(({ key, label, desc, hasMonths, defaultMonths = 6 }) => {
          const val = value?.[key];
          const enabled = typeof val === 'boolean' ? val : !!val?.enabled;
          const months = val?.months ?? defaultMonths;

          return (
            <div key={key}>
              <button
                type="button"
                onClick={() => toggle(key)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-200 text-left cursor-pointer ${
                  enabled
                    ? 'border-violet-300 bg-violet-50/60 shadow-sm'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div
                  className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                    enabled
                      ? 'bg-violet-100 text-violet-600'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  <svg className="w-5 h-5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {key === 'cash' && (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    )}
                    {key === 'deferred' && (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    )}
                    {(key === 'debitCard' || key === 'creditCard' || key === 'twoCards') && (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    )}
                  </svg>
                </div>
                <div className="flex-1 min-w-0 pointer-events-none">
                  <p
                    className={`text-sm font-medium ${
                      enabled ? 'text-violet-700' : 'text-gray-700'
                    }`}
                  >
                    {label}
                  </p>
                  <p className="text-xs text-gray-400 truncate">{desc}</p>
                </div>
                <div
                  className={`shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all pointer-events-none ${
                    enabled
                      ? 'border-violet-500 bg-violet-500'
                      : 'border-gray-300'
                  }`}
                >
                  {enabled && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </button>

              <AnimatePresence>
                {enabled && hasMonths && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="flex items-center gap-2 pt-2 pb-1 pl-[3.25rem]">
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        Meses sin intereses:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {MONTH_OPTIONS.map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => setMonths(key, opt.value)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                              months === opt.value
                                ? 'bg-cyan-50 border-cyan-300 text-cyan-700'
                                : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
