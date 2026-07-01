import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const QuoteContext = createContext(null);

const FLIGHT_KEYS = ['flightDetails', 'flightPrice', 'transportPrice', 'flightImage', 'tipoCotizacion', 'adultos', 'menores', 'menoresAges'];

const deepCloneFlightDetails = (fd) => ({
  departureDate: fd.departureDate,
  returnDate: fd.returnDate,
  ida: { ...fd.ida },
  regreso: { ...fd.regreso },
  baggage: { ...fd.baggage },
});

const createDefaultQuote = () => ({
  id: uuidv4(),
  tipoCotizacion: 'hotel+vuelo',
  hotelName: '',
  checkIn: '',
  checkOut: '',
  roomType: '',
  adultos: 1,
  menores: 0,
  menoresAges: [],
  hotelPrice: 0,
  flightPrice: 0,
  transportPrice: 0,
  images: [],
  flightImage: null,
  notas: [],
  paymentMethods: {
    cash: false,
    debitCard: { enabled: false, months: 0 },
    creditCard: { enabled: false, months: 6 },
    twoCards: { enabled: false, months: 6 },
    deferred: { enabled: false, months: 6 },
  },
  flightDetails: {
    departureDate: '',
    returnDate: '',
    ida: { origin: '', destination: '', departureTime: '', arrivalTime: '', flightType: 'directo' },
    regreso: { origin: '', destination: '', departureTime: '', arrivalTime: '', flightType: 'directo' },
    baggage: { personal: false, carryOn: false, checked: false },
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
    setQuotes((prev) => {
      const hasFlightUpdates = FLIGHT_KEYS.some((key) => key in updates);
      if (!hasFlightUpdates) {
        return prev.map((q) => (q.id === id ? { ...q, ...updates } : q));
      }
      return prev.map((q) => {
        let merged = { ...q };
        for (const key of Object.keys(updates)) {
          if (FLIGHT_KEYS.includes(key)) {
            if (key === 'flightDetails') {
              merged.flightDetails = deepCloneFlightDetails(updates.flightDetails);
            } else if (key === 'flightImage') {
              merged.flightImage = updates.flightImage ? { ...updates.flightImage } : null;
            } else {
              merged[key] = updates[key];
            }
          } else if (q.id === id) {
            merged[key] = updates[key];
          }
        }
        return merged;
      });
    });
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
    setQuotes((prev) => {
      const source = prev.find((q) => q.id === activeQuoteId) || prev[0];
      const newQuote = createDefaultQuote();
      newQuote.flightDetails = deepCloneFlightDetails(source.flightDetails);
      newQuote.flightPrice = source.flightPrice;
      newQuote.transportPrice = source.transportPrice;
      newQuote.flightImage = source.flightImage ? { ...source.flightImage } : null;
      newQuote.tipoCotizacion = source.tipoCotizacion;
      newQuote.adultos = source.adultos;
      newQuote.menores = source.menores;
      newQuote.menoresAges = [...source.menoresAges];
      setActiveQuoteId(newQuote.id);
      return [...prev, newQuote];
    });
  }, [activeQuoteId]);

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
