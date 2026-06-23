import { QuoteProvider, useQuotes } from './context/QuoteContext';
import Sidebar from './components/Sidebar';
import QuotePreview from './components/QuotePreview';
import PDFContent from './components/PDFContent';
import LoginGate from './components/LoginGate';
import logo from './assets/logoFamily.png';

function AppContent({ onLogout }) {
  const { quotes, globalTitle, setGlobalTitle } = useQuotes();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-2.5">
              <img
                src={logo}
                alt="Family Viajes"
                className="h-8 w-auto object-contain"
              />
              <h1 className="text-lg font-bold text-gray-800">
                Family Viajes
              </h1>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Título Global de la Cotización
          </label>
          <input
            type="text"
            value={globalTitle}
            onChange={(e) => setGlobalTitle(e.target.value)}
            placeholder="Ej: Paquete Vacacional Verano 2026"
            className="w-full max-w-2xl px-5 py-3 rounded-xl border border-gray-200 bg-white text-base text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-300 transition-all shadow-sm"
          />
          <p className="text-xs text-gray-400 mt-1">
            Este título se usará como nombre del archivo PDF al descargar
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <Sidebar />
          </div>
          <div className="lg:col-span-3">
            <QuotePreview />
          </div>
        </div>
      </main>

      <div className="absolute left-[-9999px] top-0" aria-hidden="true">
        {quotes.map((q) => (
          <PDFContent key={q.id} quote={q} globalTitle={globalTitle} elementId={`pdf-content-${q.id}`} />
        ))}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <QuoteProvider>
      <LoginGate>
        {(onLogout) => <AppContent onLogout={onLogout} />}
      </LoginGate>
    </QuoteProvider>
  );
}
