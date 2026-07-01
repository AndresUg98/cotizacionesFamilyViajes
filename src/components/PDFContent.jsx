import logo from '../assets/logoFamily.png';

const tipoLabel = {
  'hotel+vuelo': 'Hotel + Vuelo',
  'solo-hotel': 'Solo Hotel',
  'solo-vuelo': 'Solo Vuelo',
};

const labelMap = {
  cash: 'Pago en Efectivo (Contado)',
  debitCard: 'Tarjeta de Débito',
  creditCard: 'Tarjeta de Crédito',
  twoCards: '2 Tarjetas de Crédito',
  deferred: 'Pago Diferido',
};

export default function PDFContent({ quote, elementId, globalTitle }) {
  const {
    tipoCotizacion = 'hotel+vuelo',
    hotelName,
    roomType,
    adultos = 1,
    menores = 0,
    hotelPrice = 0,
    flightPrice = 0,
    transportPrice = 0,
    images = [],
    flightImage,
    paymentMethods,
    notas = [],
  } = quote;

  const showHotel = tipoCotizacion !== 'solo-vuelo';
  const showFlight = tipoCotizacion !== 'solo-hotel';
  const total =
    (showHotel ? hotelPrice : 0) + (showFlight ? flightPrice : 0) + transportPrice;

  const selectedMethods = Object.entries(paymentMethods).filter(
    ([, v]) => (typeof v === 'boolean' ? v : v.enabled)
  );

  const galleryRows = (() => {
    if (!showHotel || images.length === 0) return [];
    const totalSlots = 6;
    const slots = [];
    for (let i = 0; i < totalSlots; i++) {
      slots.push(i < images.length ? images[i] : null);
    }
    const rows = [];
    for (let i = 0; i < totalSlots; i += 3) {
      rows.push(slots.slice(i, i + 3));
    }
    return rows;
  })();

  const formatMonths = (val) => {
    if (!val || val.months === undefined) return '';
    if (val.months === 0) return '— Pago único';
    return `— ${val.months} meses sin intereses`;
  };

  const { ida, regreso, baggage, departureDate, returnDate } = quote.flightDetails || {};
  const hasFlightRoute = ida?.origin && ida?.destination;
  const activeBaggage = Object.entries(baggage || {}).filter(([, v]) => v).map(([k]) => k);
  const baggageLabels = { personal: 'Artículo Personal', carryOn: 'Equipaje de Mano', checked: 'Equipaje Documentado' };

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
    const monthCap = monthName.charAt(0).toUpperCase() + monthName.slice(1);
    return { text: `del ${depDay} al ${retDay} de ${monthCap} (${days} días y ${nights} noches)`, days, nights };
  })();
  const airportName = (code) => {
    const airports = {
      CUU: 'Chihuahua', CUN: 'Cancún', MEX: 'Ciudad de México',
      GDL: 'Guadalajara', MTY: 'Monterrey', TIJ: 'Tijuana',
      HMO: 'Hermosillo', SLP: 'San Luis Potosí', BJX: 'León/Guanajuato',
      PVR: 'Puerto Vallarta', SJD: 'Los Cabos', MID: 'Mérida',
      VER: 'Veracruz', ACA: 'Acapulco', OAX: 'Oaxaca',
    };
    return airports[code] || code;
  };

  return (
    <div
      id={elementId || 'pdf-content'}
      style={{
        width: '794px',
        padding: '40px 48px',
        boxSizing: 'border-box',
        position: 'relative',
        fontFamily: 'Inter, system-ui, sans-serif',
        color: '#1f2937',
        background: '#ffffff',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <img
          src={logo}
          alt="Family Viajes"
          style={{ height: '40px', width: 'auto', objectFit: 'contain' }}
        />
        <div style={{ flex: 1, height: '6px', borderRadius: '3px', background: 'linear-gradient(135deg, #a78bfa, #22d3ee)' }} />
      </div>

      <h1
        style={{
          fontSize: '26px',
          fontWeight: '700',
          margin: '0 0 4px',
          color: '#111827',
        }}
      >
        Cotización de Viaje
      </h1>
      <p
        style={{
          fontSize: '12px',
          color: '#9ca3af',
          margin: '0 0 2px',
        }}
      >
        {tipoLabel[tipoCotizacion]}
      </p>
      {globalTitle && (
        <p
          style={{
            fontSize: '14px',
            color: '#6b7280',
            margin: '0 0 4px',
          }}
        >
          {globalTitle}
        </p>
      )}
      {!globalTitle && <div style={{ height: '4px' }} />}
      {tripDuration && (
        <p
          style={{
            fontSize: '15px',
            fontWeight: '600',
            color: '#7c3aed',
            margin: '0 0 24px',
          }}
        >
          {tripDuration.text}
        </p>
      )}
      {!tripDuration && <div style={{ height: '24px' }} />}

      {showFlight && hasFlightRoute && (
        <div
          style={{
            background: 'linear-gradient(135deg, #f5f3ff, #ecfeff)',
            borderRadius: '16px',
            padding: '24px 28px',
            marginBottom: '20px',
            border: '1px solid #e0e7ff',
            pageBreakInside: 'avoid',
            breakInside: 'avoid',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <span style={{ fontSize: '16px', fontWeight: '700', color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Tarjeta de Abordaje
            </span>
            <div style={{ flex: 1, height: '2px', background: 'linear-gradient(90deg, #7c3aed, #22d3ee)' }} />
          </div>

          <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
            <div style={{ flex: 1, background: '#ffffff', borderRadius: '12px', padding: '16px 20px', border: '1px solid #e0e7ff' }}>
              <div style={{ fontSize: '10px', fontWeight: '600', color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                Ida — {airportName(ida.origin)} a {airportName(ida.destination)}
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '8px' }}>
                <span style={{ fontSize: '22px', fontWeight: '800', fontFamily: 'monospace', color: '#5b21b6', letterSpacing: '0.02em' }}>
                  {ida.origin}
                </span>
                <span style={{ fontSize: '14px', color: '#9ca3af' }}>→</span>
                <span style={{ fontSize: '22px', fontWeight: '800', fontFamily: 'monospace', color: '#5b21b6', letterSpacing: '0.02em' }}>
                  {ida.destination}
                </span>
              </div>
              <div style={{ fontSize: '13px', color: '#6b7280', lineHeight: '1.6' }}>
                {departureDate && (
                  <div style={{ marginBottom: '2px' }}>
                    <span style={{ fontWeight: '600', color: '#374151' }}>Fecha:</span>{' '}
                    {new Date(departureDate + 'T12:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                )}
                <div>
                  <span style={{ fontWeight: '600', color: '#374151' }}>Salida:</span>{' '}
                  {ida.departureTime || '—'} <span style={{ color: '#9ca3af' }}>|</span>{' '}
                  <span style={{ fontWeight: '600', color: '#374151' }}>Llegada:</span>{' '}
                  {ida.arrivalTime || '—'}
                </div>
                <div style={{ marginTop: '6px' }}>
                  <span style={{
                    display: 'inline-block',
                    padding: '2px 10px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: '600',
                    background: ida.flightType === 'directo' ? '#d1fae5' : '#fef3c7',
                    color: ida.flightType === 'directo' ? '#065f46' : '#92400e',
                  }}>
                    • {ida.flightType === 'directo' ? 'Vuelo Directo' : 'Vuelo con Escalas'}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ flex: 1, background: '#ffffff', borderRadius: '12px', padding: '16px 20px', border: '1px solid #cffafe' }}>
              <div style={{ fontSize: '10px', fontWeight: '600', color: '#0891b2', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                Regreso — {airportName(regreso.origin || ida.destination)} a {airportName(regreso.destination || ida.origin)}
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '8px' }}>
                <span style={{ fontSize: '22px', fontWeight: '800', fontFamily: 'monospace', color: '#0e7490', letterSpacing: '0.02em' }}>
                  {regreso.origin || ida.destination}
                </span>
                <span style={{ fontSize: '14px', color: '#9ca3af' }}>→</span>
                <span style={{ fontSize: '22px', fontWeight: '800', fontFamily: 'monospace', color: '#0e7490', letterSpacing: '0.02em' }}>
                  {regreso.destination || ida.origin}
                </span>
              </div>
              <div style={{ fontSize: '13px', color: '#6b7280', lineHeight: '1.6' }}>
                {returnDate && (
                  <div style={{ marginBottom: '2px' }}>
                    <span style={{ fontWeight: '600', color: '#374151' }}>Fecha:</span>{' '}
                    {new Date(returnDate + 'T12:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                )}
                <div>
                  <span style={{ fontWeight: '600', color: '#374151' }}>Salida:</span>{' '}
                  {regreso.departureTime || '—'} <span style={{ color: '#9ca3af' }}>|</span>{' '}
                  <span style={{ fontWeight: '600', color: '#374151' }}>Llegada:</span>{' '}
                  {regreso.arrivalTime || '—'}
                </div>
                {regreso.flightType && (
                  <div style={{ marginTop: '6px' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '2px 10px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: '600',
                      background: regreso.flightType === 'directo' ? '#d1fae5' : '#fef3c7',
                      color: regreso.flightType === 'directo' ? '#065f46' : '#92400e',
                    }}>
                      • {regreso.flightType === 'directo' ? 'Vuelo Directo' : 'Vuelo con Escalas'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {activeBaggage.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '10px 16px', background: '#ffffff', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
              <span style={{ fontSize: '10px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Equipaje:
              </span>
              {activeBaggage.map((key) => (
                <span key={key} style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '2px 10px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: '600',
                  background: '#ede9fe',
                  color: '#5b21b6',
                }}>
                  {baggageLabels[key]}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {showHotel && (
        <div
          style={{
            background: '#f9fafb',
            borderRadius: '12px',
            padding: '20px 24px',
            marginBottom: '16px',
            pageBreakInside: 'avoid',
            breakInside: 'avoid',
          }}
        >
          <h2
            style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#7c3aed',
              margin: '0 0 12px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Alojamiento
          </h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td style={{ width: '50%', padding: '4px 0', verticalAlign: 'top' }}>
                  <p style={{ fontSize: '11px', color: '#9ca3af', margin: '0 0 2px' }}>Hotel</p>
                  <p style={{ fontSize: '13px', fontWeight: '500', color: '#1f2937', margin: '0' }}>
                    {hotelName || '—'}
                  </p>
                </td>
                <td style={{ width: '50%', padding: '4px 0', verticalAlign: 'top' }}>
                  <p style={{ fontSize: '11px', color: '#9ca3af', margin: '0 0 2px' }}>Tipo de Habitación</p>
                  <p style={{ fontSize: '13px', fontWeight: '500', color: '#1f2937', margin: '0' }}>
                    {roomType || '—'}
                  </p>
                </td>
              </tr>

            </tbody>
          </table>
        </div>
      )}

      <div
        style={{
          background: '#f9fafb',
          borderRadius: '12px',
          padding: '20px 24px',
          marginBottom: '16px',
          pageBreakInside: 'avoid',
          breakInside: 'avoid',
        }}
      >
        <h2
          style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#7c3aed',
            margin: '0 0 12px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          Pasajeros
        </h2>
        <p style={{ fontSize: '13px', fontWeight: '500', color: '#1f2937', margin: '0' }}>
          {adultos} {adultos === 1 ? 'adulto' : 'adultos'}
          {menores > 0 && ` y ${menores} ${menores === 1 ? 'menor' : 'menores'}`}
        </p>
      </div>

      <div
        style={{
          background: '#f9fafb',
          borderRadius: '12px',
          padding: '20px 24px',
          marginBottom: '16px',
          pageBreakInside: 'avoid',
          breakInside: 'avoid',
        }}
      >
        <h2
          style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#0891b2',
            margin: '0 0 12px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          Desglose de Precios
        </h2>
        <div style={{ marginBottom: '8px' }}>
          {showHotel && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '4px 0',
              }}
            >
              <span style={{ fontSize: '13px', color: '#6b7280' }}>Hotel</span>
              <span style={{ fontSize: '13px', fontWeight: '500', color: '#1f2937' }}>
                ${hotelPrice.toLocaleString()}
              </span>
            </div>
          )}
          {showFlight && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '4px 0 8px',
                borderBottom: '1px solid #e5e7eb',
              }}
            >
              <span style={{ fontSize: '13px', color: '#6b7280' }}>Vuelo</span>
              <span style={{ fontSize: '13px', fontWeight: '500', color: '#1f2937' }}>
                ${flightPrice.toLocaleString()}
              </span>
            </div>
          )}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingTop: '8px',
            }}
          >
            <span style={{ fontSize: '15px', fontWeight: '700', color: '#1f2937' }}>
              Total
            </span>
            <span
              style={{
                fontSize: '18px',
                fontWeight: '700',
                color: '#7c3aed',
              }}
            >
              ${total.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {showFlight && flightImage && (
        <div
          style={{
            marginBottom: '16px',
            pageBreakInside: 'avoid',
            breakInside: 'avoid',
          }}
        >
          <h2
            style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#0891b2',
              margin: '0 0 10px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Imagen del Vuelo
          </h2>
          <div
            style={{
              borderRadius: '8px',
              overflow: 'hidden',
              background: '#f3f4f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              maxHeight: '220px',
            }}
          >
            <img
              src={flightImage.url}
              alt="Vuelo"
              style={{
                maxWidth: '100%',
                maxHeight: '220px',
                objectFit: 'contain',
                display: 'block',
                width: 'auto',
                height: 'auto',
              }}
            />
          </div>
        </div>
      )}

      {showHotel && images.length > 0 && (
        <div
          data-pdf-gallery="true"
          style={{
            marginTop: '32px',
            marginBottom: '20px',
            pageBreakInside: 'avoid',
            breakInside: 'avoid',
          }}
        >
          <h2
            style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#7c3aed',
              margin: '0 0 10px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Galería
          </h2>
          {galleryRows.map((row, rowIdx) => (
            <div
              key={rowIdx}
              style={{
                display: 'flex',
                gap: '6px',
                pageBreakInside: 'avoid',
                breakInside: 'avoid',
                marginBottom: rowIdx < galleryRows.length - 1 ? '6px' : '0',
              }}
            >
              {row.map((slot, slotIdx) => {
                if (slot) {
                  return (
                    <div
                      key={slot.id}
                      style={{
                        width: '32%',
                        borderRadius: '6px',
                        overflow: 'hidden',
                        background: '#f3f4f6',
                        height: '180px',
                      }}
                    >
                      <img
                        src={slot.url}
                        alt="Hotel"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          display: 'block',
                        }}
                      />
                    </div>
                  );
                }
                return (
                  <div
                    key={`empty-${rowIdx}-${slotIdx}`}
                    style={{
                      width: '32%',
                      borderRadius: '6px',
                      background: '#f9fafb',
                      border: '1px dashed #e5e7eb',
                      height: '180px',
                    }}
                  />
                );
              })}
            </div>
          ))}
        </div>
      )}

      {selectedMethods.length > 0 && (
        <div
          style={{
            background: '#f9fafb',
            borderRadius: '12px',
            padding: '20px 24px',
            marginBottom: '16px',
            pageBreakInside: 'avoid',
            breakInside: 'avoid',
          }}
        >
          <h2
            style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#7c3aed',
              margin: '0 0 12px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Métodos de Pago
          </h2>
          {selectedMethods.map(([key, val]) => (
            <div
              key={key}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '3px 0',
                fontSize: '13px',
                color: '#374151',
              }}
            >
              <span style={{ color: '#7c3aed', fontSize: '14px' }}>✓</span>
              <span>{labelMap[key]}</span>
              <span style={{ fontSize: '12px', color: '#9ca3af' }}>
                {formatMonths(val)}
              </span>
            </div>
          ))}
        </div>
      )}

      {notas.length > 0 && (
        <div
          style={{
            background: '#f9fafb',
            borderRadius: '12px',
            padding: '20px 24px',
            marginBottom: '16px',
            pageBreakInside: 'avoid',
            breakInside: 'avoid',
          }}
        >
          <h2
            style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#7c3aed',
              margin: '0 0 12px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Notas Importantes
          </h2>
          <ul style={{ margin: '0', paddingLeft: '18px', fontSize: '12px', color: '#374151', lineHeight: '1.6' }}>
            {notas.map((nota) => (
              <li key={nota.id}>{nota.text}</li>
            ))}
          </ul>
        </div>
      )}

      <div
        style={{
          marginTop: '32px',
          paddingTop: '16px',
          borderTop: '1px solid #f3f4f6',
          textAlign: 'center',
          fontSize: '10px',
          color: '#d1d5db',
        }}
      >
        Generador de Cotizaciones
      </div>
    </div>
  );
}
