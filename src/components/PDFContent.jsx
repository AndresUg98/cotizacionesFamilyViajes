import logo from '../assets/logoFamily.png';

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
    notas = [],
  } = quote;

  const showHotel = tipoCotizacion !== 'solo-vuelo';
  const showFlight = tipoCotizacion !== 'solo-hotel';
  const total =
    (showHotel ? hotelPrice : 0) + (showFlight ? flightPrice : 0);

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
            margin: '0 0 24px',
          }}
        >
          {globalTitle}
        </p>
      )}
      {!globalTitle && <div style={{ height: '38px' }} />}

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
              <tr>
                <td style={{ padding: '4px 0', verticalAlign: 'top' }}>
                  <p style={{ fontSize: '11px', color: '#9ca3af', margin: '0 0 2px' }}>Check-in</p>
                  <p style={{ fontSize: '13px', fontWeight: '500', color: '#1f2937', margin: '0' }}>
                    {formatDate(checkIn)}
                  </p>
                </td>
                <td style={{ padding: '4px 0', verticalAlign: 'top' }}>
                  <p style={{ fontSize: '11px', color: '#9ca3af', margin: '0 0 2px' }}>Check-out</p>
                  <p style={{ fontSize: '13px', fontWeight: '500', color: '#1f2937', margin: '0' }}>
                    {formatDate(checkOut)}
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
