import { v4 as uuidv4 } from 'uuid';
import { useQuotes } from '../context/QuoteContext';
import ImageUploader from './ImageUploader';
import PaymentMethods from './PaymentMethods';
import FlightImageUploader from './FlightImageUploader';

const TIPOS = [
  { value: 'hotel+vuelo', label: 'Hotel + Vuelo' },
  { value: 'solo-hotel', label: 'Solo Hotel' },
  { value: 'solo-vuelo', label: 'Solo Vuelo' },
];

export default function QuoteForm() {
  const { activeQuote, activeQuoteId, updateQuote, updatePaymentMethod } =
    useQuotes();

  const update = (field, value) =>
    updateQuote(activeQuoteId, { [field]: value });

  const tipo = activeQuote.tipoCotizacion || 'hotel+vuelo';
  const showHotel = tipo !== 'solo-vuelo';
  const showFlight = tipo !== 'solo-hotel';
  const showRoomType = tipo !== 'solo-vuelo';
  const showHotelImages = tipo !== 'solo-vuelo';
  const showFlightImage = tipo !== 'solo-hotel';

  const total =
    (showHotel ? activeQuote.hotelPrice || 0 : 0) +
    (showFlight ? activeQuote.flightPrice || 0 : 0);

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tipo de Cotización
        </label>
        <div className="grid grid-cols-3 gap-2">
          {TIPOS.map((t) => {
            const selected = tipo === t.value;
            return (
              <button
                key={t.value}
                type="button"
                onClick={() => {
                  update('tipoCotizacion', t.value);
                  if (t.value === 'solo-vuelo') {
                    update('hotelPrice', 0);
                    update('roomType', '');
                    update('images', []);
                  }
                  if (t.value === 'solo-hotel') {
                    update('flightPrice', 0);
                    update('flightImage', null);
                  }
                }}
                className={`px-3 py-2.5 rounded-xl text-xs font-medium border-2 transition-all ${
                  selected
                    ? 'border-violet-300 bg-violet-50 text-violet-700 shadow-sm'
                    : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {showHotel && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Nombre del Hotel
            </label>
            <input
              type="text"
              value={activeQuote.hotelName}
              onChange={(e) => update('hotelName', e.target.value)}
              placeholder="Ej: Grand Beach Resort"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-300 transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Check-in
              </label>
              <input
                type="date"
                value={activeQuote.checkIn}
                onChange={(e) => update('checkIn', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-300 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Check-out
              </label>
              <input
                type="date"
                value={activeQuote.checkOut}
                onChange={(e) => update('checkOut', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-300 transition-all"
              />
            </div>
          </div>

          {showRoomType && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Tipo de Habitación
              </label>
              <input
                type="text"
                value={activeQuote.roomType}
                onChange={(e) => update('roomType', e.target.value)}
                placeholder="Ej: Suite Vista al Mar"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-300 transition-all"
              />
            </div>
          )}
        </>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Pasajeros
        </label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Adultos</label>
            <input
              type="number"
              min="1"
              value={activeQuote.adultos}
              onChange={(e) => update('adultos', Math.max(1, Number(e.target.value)))}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-300 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Menores</label>
            <input
              type="number"
              min="0"
              value={activeQuote.menores}
              onChange={(e) => update('menores', Math.max(0, Number(e.target.value)))}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-300 transition-all"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {showHotel && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Precio Hotel ($)
            </label>
            <input
              type="number"
              min="0"
              value={activeQuote.hotelPrice || ''}
              onChange={(e) => update('hotelPrice', Number(e.target.value))}
              placeholder="0"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-300 transition-all"
            />
          </div>
        )}
        {showFlight && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Precio Vuelo ($)
            </label>
            <input
              type="number"
              min="0"
              value={activeQuote.flightPrice || ''}
              onChange={(e) => update('flightPrice', Number(e.target.value))}
              placeholder="0"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-300 transition-all"
            />
          </div>
        )}
      </div>

      <div className="bg-gradient-to-r from-violet-50 to-cyan-50 rounded-xl p-4 border border-violet-100">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-700">Total</span>
          <span className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-cyan-500 bg-clip-text text-transparent">
            ${total.toLocaleString()}
          </span>
        </div>
      </div>

      {showFlightImage && (
        <FlightImageUploader
          image={activeQuote.flightImage}
          onChange={(img) => update('flightImage', img)}
        />
      )}

      {showHotelImages && (
        <ImageUploader
          images={activeQuote.images}
          onChange={(images) => update('images', images)}
        />
      )}

      <PaymentMethods
        value={activeQuote.paymentMethods}
        onChange={(method, val) =>
          updatePaymentMethod(activeQuoteId, method, val)
        }
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notas Importantes
        </label>
        <div className="space-y-2">
          {(activeQuote.notas || []).map((nota, idx) => (
            <div key={nota.id} className="flex items-center gap-2">
              <input
                type="text"
                value={nota.text}
                onChange={(e) => {
                  const updated = [...activeQuote.notas];
                  updated[idx] = { ...updated[idx], text: e.target.value };
                  update('notas', updated);
                }}
                placeholder="Ej. No incluye traslados"
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-300 transition-all"
              />
              <button
                type="button"
                onClick={() => {
                  const updated = activeQuote.notas.filter(
                    (_, i) => i !== idx
                  );
                  update('notas', updated);
                }}
                className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() =>
            update('notas', [
              ...(activeQuote.notas || []),
              { id: uuidv4(), text: '' },
            ])
          }
          className="mt-2 w-full py-2.5 rounded-xl border-2 border-dashed border-gray-200 text-sm text-gray-500 hover:text-violet-600 hover:border-violet-300 hover:bg-violet-50 transition-all"
        >
          + Añadir nota
        </button>
      </div>
    </div>
  );
}
