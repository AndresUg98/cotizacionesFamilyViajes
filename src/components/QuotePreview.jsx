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

const baggageLabels = {
  personal: 'Artículo Personal',
  carryOn: 'Equipaje de Mano',
  checked: 'Equipaje Documentado',
};

export default function QuotePreview() {
  const { activeQuote, globalTitle } = useQuotes();
  const {
    tipoCotizacion = 'hotel+vuelo',
    hotelName,
    roomType,
    adultos = 1,
    menores = 0,
    menoresAges = [],
    hotelPrice = 0,
    flightPrice = 0,
    transportPrice = 0,
    images = [],
    flightImage,
    paymentMethods,
    flightDetails,
  } = activeQuote;

  const showHotel = tipoCotizacion !== 'solo-vuelo';
  const showFlight = tipoCotizacion !== 'solo-hotel';
  const total =
    (showHotel ? hotelPrice : 0) + (showFlight ? flightPrice : 0) + transportPrice;

  const selectedMethods = Object.entries(paymentMethods).filter(
    ([, v]) => (typeof v === 'boolean' ? v : v.enabled)
  );

  const formatMonths = (val) => {
    if (!val || val.months === undefined) return '';
    if (val.months === 0) return '— Pago único';
    return `— ${val.months} meses sin intereses`;
  };

  const formatAges = (ages) => {
    const labels = ages
      .filter((a) => a !== '' && a !== undefined && a !== null)
      .map((a) => `${a} ${Number(a) === 1 ? 'año' : 'años'}`);
    if (labels.length === 0) return '';
    if (labels.length === 1) return ` (${labels[0]})`;
    return ` (${labels.slice(0, -1).join(', ')} y ${labels[labels.length - 1]})`;
  };

  const { ida, regreso, baggage, departureDate, returnDate } = flightDetails || {};
  const hasFlightRoute = ida?.origin && ida?.destination;
  const activeBaggage = Object.entries(baggage || {}).filter(([, v]) => v).map(([k]) => k);

  const tripDuration = (() => {
    if (!departureDate || !returnDate) return null;
    const dep = new Date(departureDate + 'T12:00:00');
    const ret = new Date(returnDate + 'T12:00:00');
    if (isNaN(dep) || isNaN(ret)) return null;
    const nights = Math.round((ret - dep) / (1000 * 60 * 60 * 24));
    const days = nights + 1;
    if (nights < 0) return null;
    const depDay = dep.getDate();
    const retDay = ret.getDate();
    const monthName = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(dep);
    return { text: `del ${depDay} al ${retDay} de ${monthName.charAt(0).toUpperCase() + monthName.slice(1)} (${days} días y ${nights} noches)`, days, nights };
  })();

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="h-2 bg-gradient-to-r from-violet-400 to-cyan-400" />

      <div className="p-6 space-y-5">
        <div>
          <h2 className="text-lg font-bold text-gray-800">
            {globalTitle || 'Cotización de Viaje'}
          </h2>
          <div className="mt-0.5 space-y-0.5">
            {globalTitle && (
              <p className="text-xs text-gray-400">
                {tipoLabel[tipoCotizacion]} — Cotización de Viaje
              </p>
            )}
            {!globalTitle && (
              <p className="text-xs text-gray-400">
                {tipoLabel[tipoCotizacion]}
              </p>
            )}
            {tripDuration && (
              <p className="text-sm font-medium text-violet-600">
                {tripDuration.text}
              </p>
            )}
          </div>
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
            </div>
          </div>
        )}

        {showFlight && hasFlightRoute && (
          <div className="bg-gradient-to-br from-violet-50 to-cyan-50 rounded-xl p-4 border border-violet-100">
            <h3 className="text-xs font-semibold text-violet-600 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
              Itinerario de Vuelo
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-white rounded-lg p-3 border border-violet-100">
                <div className="text-[10px] font-semibold text-violet-500 uppercase tracking-wider mb-2">Ida</div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg font-bold font-mono text-violet-700">{ida.origin}</span>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  <span className="text-lg font-bold font-mono text-violet-700">{ida.destination}</span>
                </div>
                <div className="text-xs text-gray-500 space-y-0.5">
                  {departureDate && <p>Salida: {formatDate(departureDate)}</p>}
                  {ida.departureTime && <p>Salida: {ida.departureTime} | Llegada: {ida.arrivalTime || '—'}</p>}
                  <p className="mt-1">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium ${ida.flightType === 'directo' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                      {ida.flightType === 'directo' ? 'Directo' : 'Con Escalas'}
                    </span>
                  </p>
                </div>
              </div>
              <div className="bg-white rounded-lg p-3 border border-cyan-100">
                <div className="text-[10px] font-semibold text-cyan-600 uppercase tracking-wider mb-2">Regreso</div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg font-bold font-mono text-cyan-700">{regreso.origin || ida.destination}</span>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  <span className="text-lg font-bold font-mono text-cyan-700">{regreso.destination || ida.origin}</span>
                </div>
                <div className="text-xs text-gray-500 space-y-0.5">
                  {returnDate && <p>Regreso: {formatDate(returnDate)}</p>}
                  {regreso.departureTime && <p>Salida: {regreso.departureTime} | Llegada: {regreso.arrivalTime || '—'}</p>}
                  {regreso.flightType && (
                    <p className="mt-1">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium ${regreso.flightType === 'directo' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                        {regreso.flightType === 'directo' ? 'Directo' : 'Con Escalas'}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            </div>
            {activeBaggage.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-violet-100">
                <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Equipaje:</span>
                {activeBaggage.map((key) => (
                  <span key={key} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-violet-100 text-[10px] font-medium text-violet-700">
                    {baggageLabels[key]}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="bg-gray-50 rounded-xl p-4">
          <h3 className="text-xs font-semibold text-violet-600 uppercase tracking-wider mb-3">
            Pasajeros
          </h3>
          <p className="text-sm text-gray-700">
            {adultos} {adultos === 1 ? 'adulto' : 'adultos'}
            {menores > 0 && (
              <> y {menores} {menores === 1 ? 'menor' : 'menores'}
                {formatAges(menoresAges)}
              </>
            )}
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
            <div className="rounded-xl overflow-hidden bg-gray-50/50 border border-gray-200 flex items-center justify-center max-h-[200px]">
              <img
                src={flightImage.url}
                alt="Vuelo"
                className="w-full h-auto max-h-[200px] object-contain"
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

        {!hotelName && !roomType && total === 0 && images.length === 0 && !flightImage && selectedMethods.length === 0 && (
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
