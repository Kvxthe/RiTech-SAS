import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  AlertCircle,
  Anchor,
  CalendarDays,
  Coffee,
  Loader2,
  Lock,
  MapPin,
  Package,
  PackageCheck,
  Scale,
  Search,
  ShieldCheck,
  Ship,
} from 'lucide-react';
import { SHIPMENTS, SHIPMENT_STEPS, formatShipmentDate, formatShipmentWeight } from '../data/shipments';

const STEPS = SHIPMENT_STEPS.map((step, index) => ({
  ...step,
  icon: [Anchor, Ship, PackageCheck][index],
}));

const STATUS_INDEX = { port: 0, transit: 1, delivered: 2 };

const formatDate = formatShipmentDate;
const formatKg = formatShipmentWeight;

function Timeline({ shipment }) {
  const currentIndex = STATUS_INDEX[shipment.status];
  const lastIndex = STEPS.length - 1;

  return (
    <ol className="grid gap-8 md:grid-cols-3 md:gap-0">
      {STEPS.map((step, index) => {
        const isDone = index < currentIndex || currentIndex === lastIndex;
        const isCurrent = !isDone && index === currentIndex;
        const segmentDone = index < currentIndex;
        const Icon = step.icon;
        const date = shipment.events[step.key];
        const segmentColor = segmentDone ? 'bg-emerald-500' : 'bg-slate-200';

        return (
          <li
            key={step.key}
            aria-current={isCurrent ? 'step' : undefined}
            className="relative flex gap-4 md:flex-col md:items-center md:gap-3 md:text-center"
          >
            {index < lastIndex && (
              <>
                <span
                  aria-hidden="true"
                  className={`absolute -bottom-8 left-6 top-12 w-0.5 -translate-x-1/2 md:hidden ${segmentColor}`}
                />
                <span
                  aria-hidden="true"
                  className={`absolute left-1/2 top-6 hidden h-0.5 w-full -translate-y-1/2 md:block ${segmentColor}`}
                />
              </>
            )}
            <span
              className={`relative z-10 grid h-12 w-12 shrink-0 place-items-center rounded-full ${
                isDone
                  ? 'bg-emerald-500 text-white'
                  : isCurrent
                  ? 'bg-amber-500 text-white'
                  : 'bg-white text-slate-400 ring-2 ring-slate-200'
              }`}
            >
              {isCurrent && (
                <span aria-hidden="true" className="absolute inset-0 -z-10 rounded-full bg-amber-400/40 motion-safe:animate-ping" />
              )}
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="md:px-3">
              <p className={`font-semibold ${isDone || isCurrent ? 'text-slate-900' : 'text-slate-400'}`}>{step.label}</p>
              <p className="mt-0.5 text-sm font-medium text-slate-600">{date ? formatDate(date) : 'Pendiente'}</p>
              <p className="mt-1 text-sm text-slate-500 md:mx-auto md:max-w-[14rem]">{step.description}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function Detail({ icon: Icon, label, children }) {
  return (
    <div className="flex items-start gap-3">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-roast-50 text-roast-700">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <dt className="text-xs text-slate-500">{label}</dt>
        <dd className="text-sm font-medium text-slate-900">{children}</dd>
      </div>
    </div>
  );
}

export default function TrackingView() {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('codigo') || '');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [searchedCode, setSearchedCode] = useState('');
  const timeoutRef = useRef(null);

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  const runSearch = (rawCode) => {
    const code = rawCode.trim().toUpperCase();
    if (!code || isLoading) return;
    setIsLoading(true);
    setResult(null);
    setSearchedCode('');
    timeoutRef.current = setTimeout(() => {
      setResult(SHIPMENTS[code] || null);
      setSearchedCode(code);
      setIsLoading(false);
    }, 700);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    runSearch(query);
  };

  const useExample = (code) => {
    setQuery(code);
    runSearch(code);
  };

  const notFound = searchedCode && !result;
  const isDelivered = result?.status === 'delivered';

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-roast-700 text-white">
              <Coffee className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="font-display text-lg font-semibold text-slate-900">RiTech</span>
          </div>
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
          >
            <Lock className="h-4 w-4" aria-hidden="true" />
            Acceso exportadores
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <div className="max-w-2xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-roast-700">Trazabilidad de origen a destino</p>
          <h1 className="text-4xl font-medium leading-tight sm:text-5xl">Tu envío, en cada etapa.</h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
            Ingresa el código de seguimiento que recibiste con tu factura y revisa el estado de tu envío de café o cacao.
          </p>
        </div>

        <form onSubmit={handleSubmit} role="search" className="relative mt-8 rounded-2xl border border-slate-200 bg-white p-3 shadow-soft sm:p-4">
          <label htmlFor="tracking-code" className="sr-only">
            Código de seguimiento
          </label>
          <Search className="pointer-events-none absolute left-4 top-7 h-5 w-5 -translate-y-1/2 text-slate-400" aria-hidden="true" />
          <input
            id="tracking-code"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ej. RT-2026-0142"
            autoComplete="off"
            className="h-14 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-base uppercase transition placeholder:normal-case placeholder:text-slate-400 focus:border-roast-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-roast-200 sm:pr-48 sm:text-lg"
          />
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="btn-primary mt-3 h-12 w-full sm:absolute sm:right-4 sm:top-4 sm:mt-0 sm:h-10 sm:w-auto"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Buscando...
              </>
            ) : (
              'Consultar envío'
            )}
          </button>
        </form>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-slate-500">
          <span>Consultar envío:</span>
          {Object.keys(SHIPMENTS).map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => useExample(code)}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 font-medium text-slate-700 transition hover:border-roast-300 hover:text-roast-800"
            >
              {code}
            </button>
          ))}
        </div>

        <div aria-live="polite" className="mt-10">
          {notFound && (
            <div role="alert" className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
              <p>
                No encontramos ningún envío con el código <strong>{searchedCode}</strong>. Revisa que esté completo y
                tenga el formato RT-2026-0000.
              </p>
            </div>
          )}

          {result && (
            <div className="space-y-6">
              <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-soft sm:p-8">
                <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-medium">Estado del envío</h2>
                    <p className="text-sm text-slate-500">Código {result.code}</p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-semibold ${
                      isDelivered ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-800'
                    }`}
                  >
                    {STEPS[STATUS_INDEX[result.status]].label}
                  </span>
                </div>
                <Timeline shipment={result} />
              </section>

              <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-soft sm:p-8">
                <h2 className="mb-5 text-xl font-medium">Detalle de la carga</h2>
                <dl className="grid gap-5 sm:grid-cols-2">
                  <Detail icon={Package} label="Producto">{result.product}</Detail>
                  <Detail icon={Scale} label="Peso total">{formatKg(result.weightKg)}</Detail>
                  <Detail icon={MapPin} label="Puerto de origen">{result.origin}</Detail>
                  <Detail icon={Anchor} label="Puerto de destino">{result.destination}</Detail>
                  <Detail icon={Ship} label="Buque">{result.vessel}</Detail>
                  <Detail icon={CalendarDays} label={isDelivered ? 'Fecha de entrega' : 'Llegada estimada'}>
                    {formatDate(result.eta)}
                  </Detail>
                </dl>
                <div className="mt-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-semibold text-emerald-900">Declaración de diligencia debida EUDR verificada</p>
                    <p className="text-sm text-emerald-800">Referencia {result.eudrRef}</p>
                  </div>
                </div>
              </section>
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        RiTech SAS. Exportación de café y cacao desde Colombia hacia la Unión Europea.
      </footer>
    </div>
  );
}
