import { useQuotes } from '../context/QuoteContext';

function formatDate(dateStr) {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr + 'T12:00:00').toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

const tipoLabel = {
  'hotel+vuelo': 'Hotel + Vuelo',
  'solo-hotel': 'Solo Hotel',
  'solo-vuelo': 'Solo Vuelo',
};

const methodLabels = {
  cash: 'Pago en Efectivo',
  debitCard: 'Tarjeta de Débito',
  creditCard: 'Tarjeta de Crédito',
  twoCards: '2 Tarjetas de Crédito',
  deferred: 'Pago Diferido',
};

export default function QuotePreview() {
  const { activeQuote, globalTitle } = useQuotes();
  const {
    tipoCotizacion = 'hotel+vuelo',
    hotelName,
    checkIn,
    checkOut,
    roomType,
    adultos = 1,
    menores = 0,
    hotelPrice = 0,
    flightPrice = 0,
    images = [],
    flightImage,
    paymentMethods,
  } = activeQuote;

  const showHotel = tipoCotizacion !== 'solo-vuelo';
  const showFlight = tipoCotizacion !== 'solo-hotel';
  const total =
    (showHotel ? hotelPrice : 0) + (showFlight ? flightPrice : 0);

  const selectedMethods = Object.entries(paymentMethods).filter(
    ([, v]) => (typeof v === 'boolean' ? v : v.enabled)
  );

  const formatMonths = (val) => {
    if (!val || val.months === undefined) return '';
    if (val.months === 0) return '— Pago único';
    return `— ${val.months} meses sin intereses`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="h-2 bg-gradient-to-r from-violet-400 to-cyan-400" />

      <div className="p-6 space-y-5">
        <div>
          <h2 className="text-lg font-bold text-gray-800">
            {globalTitle || 'Cotización de Viaje'}
          </h2>
          {globalTitle && (
            <p className="text-xs text-gray-400 mt-0.5">
              {tipoLabel[tipoCotizacion]} — Cotización de Viaje
            </p>
          )}
          {!globalTitle && (
            <p className="text-xs text-gray-400 mt-0.5">
              {tipoLabel[tipoCotizacion]}
            </p>
          )}
        </div>

        {showHotel && (
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="text-xs font-semibold text-violet-600 uppercase tracking-wider mb-3">
              Alojamiento
            </h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              <div>
                <p className="text-[11px] text-gray-400">Hotel</p>
                <p className="text-sm font-medium text-gray-800">
                  {hotelName || '—'}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-gray-400">Tipo de Habitación</p>
                <p className="text-sm font-medium text-gray-800">
                  {roomType || '—'}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-gray-400">Check-in</p>
                <p className="text-sm font-medium text-gray-800">
                  {formatDate(checkIn)}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-gray-400">Check-out</p>
                <p className="text-sm font-medium text-gray-800">
                  {formatDate(checkOut)}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-gray-50 rounded-xl p-4">
          <h3 className="text-xs font-semibold text-violet-600 uppercase tracking-wider mb-3">
            Pasajeros
          </h3>
          <p className="text-sm text-gray-700">
            {adultos} {adultos === 1 ? 'adulto' : 'adultos'}
            {menores > 0 && ` y ${menores} ${menores === 1 ? 'menor' : 'menores'}`}
          </p>
        </div>

        <div className="bg-gray-50 rounded-xl p-4">
          <h3 className="text-xs font-semibold text-cyan-600 uppercase tracking-wider mb-3">
            Desglose de Precios
          </h3>
          <div className="space-y-2">
            {showHotel && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Hotel</span>
                <span className="font-medium text-gray-800">
                  ${hotelPrice.toLocaleString()}
                </span>
              </div>
            )}
            {showFlight && (
              <div className="flex justify-between text-sm pb-2 border-b border-gray-200">
                <span className="text-gray-500">Vuelo</span>
                <span className="font-medium text-gray-800">
                  ${flightPrice.toLocaleString()}
                </span>
              </div>
            )}
            <div className="flex justify-between items-center pt-1">
              <span className="text-sm font-semibold text-gray-700">Total</span>
              <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-cyan-500 bg-clip-text text-transparent">
                ${total.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {showFlight && flightImage && (
          <div>
            <h3 className="text-xs font-semibold text-cyan-600 uppercase tracking-wider mb-3">
              Imagen del Vuelo
            </h3>
            <div className="rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
              <img
                src={flightImage.url}
                alt="Vuelo"
                className="w-full h-48 object-cover"
              />
            </div>
          </div>
        )}

        {showHotel && images.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-violet-600 uppercase tracking-wider mb-3">
              Galería
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {images.map((img) => (
                <div
                  key={img.id}
                  className="aspect-square rounded-lg overflow-hidden bg-gray-100"
                >
                  <img
                    src={img.url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedMethods.length > 0 && (
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="text-xs font-semibold text-violet-600 uppercase tracking-wider mb-3">
              Métodos de Pago
            </h3>
            <div className="space-y-2">
              {selectedMethods.map(([key, val]) => (
                <div
                  key={key}
                  className="flex items-center gap-2 text-sm text-gray-700"
                >
                  <svg
                    className="w-4 h-4 text-violet-500 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>{methodLabels[key]}</span>
                  <span className="text-xs text-gray-400">
                    {formatMonths(val)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {!hotelName && !roomType && !checkIn && !checkOut && total === 0 && images.length === 0 && !flightImage && selectedMethods.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 text-gray-400">
            <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
            <p className="text-sm">Complete el formulario para ver la vista previa</p>
          </div>
        )}
      </div>
    </div>
  );
}
