import { motion } from 'framer-motion';
import { useQuotes } from '../context/QuoteContext';

export default function QuoteTabs() {
  const {
    quotes,
    activeQuoteId,
    setActiveQuoteId,
    addQuote,
    removeQuote,
  } = useQuotes();

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
      {quotes.map((quote) => {
        const isActive = quote.id === activeQuoteId;
        const idx = quotes.indexOf(quote);
        const label = `Cotización ${idx + 1}`;
        return (
          <motion.button
            key={quote.id}
            layout
            onClick={() => setActiveQuoteId(quote.id)}
            className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              isActive
                ? 'bg-violet-100 text-violet-700 shadow-sm'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute inset-0 rounded-xl bg-violet-100"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{label}</span>
            {quotes.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeQuote(quote.id);
                }}
                className="relative z-10 w-4 h-4 rounded-full flex items-center justify-center text-xs text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              >
                ✕
              </button>
            )}
          </motion.button>
        );
      })}

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={addQuote}
        className="flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium text-gray-400 hover:text-violet-500 hover:bg-violet-50 transition-all"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Añadir
      </motion.button>
    </div>
  );
}
