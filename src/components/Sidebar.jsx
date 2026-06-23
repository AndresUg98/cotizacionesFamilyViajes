import QuoteForm from './QuoteForm';
import QuoteTabs from './QuoteTabs';
import { useQuotes } from '../context/QuoteContext';
import { generateSinglePDF, generateConsolidatedPDF } from '../utils/pdfGenerator';

export default function Sidebar() {
  const { quotes, activeQuote, globalTitle } = useQuotes();

  const filename = globalTitle || 'cotizacion-viaje';

  const handleDownloadOne = async () => {
    try {
      await generateSinglePDF(
        activeQuote,
        filename,
        `pdf-content-${activeQuote.id}`
      );
    } catch (err) {
      console.error('Error al generar PDF:', err);
    }
  };

  const handleDownloadAll = async () => {
    try {
      await generateConsolidatedPDF(quotes, filename);
    } catch (err) {
      console.error('Error al generar PDFs:', err);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <QuoteTabs />
        {quotes.length > 1 && (
          <button
            onClick={handleDownloadAll}
            className="shrink-0 ml-2 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-white bg-gradient-to-r from-violet-500 to-cyan-500 hover:from-violet-600 hover:to-cyan-600 shadow-sm transition-all"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17v3a1 1 0 001 1h16a1 1 0 001-1v-3" />
            </svg>
            Descargar Todo
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto space-y-5 pr-1">
        <QuoteForm />
      </div>

      <div className="mt-5 pt-4 border-t border-gray-100">
        <button
          onClick={handleDownloadOne}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-violet-500 to-cyan-500 hover:from-violet-600 hover:to-cyan-600 shadow-md hover:shadow-lg transition-all"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17v3a1 1 0 001 1h16a1 1 0 001-1v-3" />
          </svg>
          Descargar PDF
        </button>
      </div>
    </div>
  );
}
