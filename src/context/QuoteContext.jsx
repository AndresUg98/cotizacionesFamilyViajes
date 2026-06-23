import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const QuoteContext = createContext(null);

const createDefaultQuote = () => ({
  id: uuidv4(),
  tipoCotizacion: 'hotel+vuelo',
  hotelName: '',
  checkIn: '',
  checkOut: '',
  roomType: '',
  adultos: 1,
  menores: 0,
  hotelPrice: 0,
  flightPrice: 0,
  images: [],
  flightImage: null,
  paymentMethods: {
    cash: false,
    debitCard: { enabled: false, months: 0 },
    creditCard: { enabled: false, months: 6 },
    twoCards: { enabled: false, months: 6 },
    deferred: { enabled: false, months: 6 },
  },
});

export function QuoteProvider({ children }) {
  const initialQuote = useMemo(() => createDefaultQuote(), []);
  const [quotes, setQuotes] = useState(() => [initialQuote]);
  const [activeQuoteId, setActiveQuoteId] = useState(() => initialQuote.id);
  const [globalTitle, setGlobalTitle] = useState('');

  useEffect(() => {
    if (quotes.length === 0) {
      const fresh = createDefaultQuote();
      setQuotes([fresh]);
      setActiveQuoteId(fresh.id);
      return;
    }
    if (!quotes.find((q) => q.id === activeQuoteId)) {
      setActiveQuoteId(quotes[quotes.length - 1].id);
    }
  }, [quotes, activeQuoteId]);

  const activeQuote = useMemo(
    () => quotes.find((q) => q.id === activeQuoteId) || quotes[0],
    [quotes, activeQuoteId]
  );

  const updateQuote = useCallback((id, updates) => {
    setQuotes((prev) =>
      prev.map((q) => (q.id === id ? { ...q, ...updates } : q))
    );
  }, []);

  const updatePaymentMethod = useCallback((id, method, value) => {
    setQuotes((prev) =>
      prev.map((q) =>
        q.id === id
          ? { ...q, paymentMethods: { ...q.paymentMethods, [method]: value } }
          : q
      )
    );
  }, []);

  const addQuote = useCallback(() => {
    const newQuote = createDefaultQuote();
    setQuotes((prev) => [...prev, newQuote]);
    setActiveQuoteId(newQuote.id);
  }, []);

  const removeQuote = useCallback((id) => {
    setQuotes((prev) => prev.filter((q) => q.id !== id));
  }, []);

  const getQuoteById = useCallback(
    (id) => quotes.find((q) => q.id === id),
    [quotes]
  );

  const value = useMemo(
    () => ({
      quotes,
      activeQuote,
      activeQuoteId,
      globalTitle,
      setActiveQuoteId,
      setGlobalTitle,
      updateQuote,
      updatePaymentMethod,
      addQuote,
      removeQuote,
      getQuoteById,
    }),
    [
      quotes,
      activeQuote,
      activeQuoteId,
      globalTitle,
      updateQuote,
      updatePaymentMethod,
      addQuote,
      removeQuote,
      getQuoteById,
    ]
  );

  return (
    <QuoteContext.Provider value={value}>{children}</QuoteContext.Provider>
  );
}

export const useQuotes = () => {
  const ctx = useContext(QuoteContext);
  if (!ctx) throw new Error('useQuotes must be used within QuoteProvider');
  return ctx;
};
