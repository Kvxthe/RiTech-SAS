import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Anchor, ArrowLeft, ArrowRight, CalendarDays, Check, Circle, Clock3, MapPin, Package, Search, Ship, ShieldCheck } from 'lucide-react';
import { formatShipmentDate, formatShipmentWeight, SHIPMENT_STATUS, SHIPMENT_STEPS, SHIPMENTS } from '../data/shipments';

const FILTERS = [
  { key: 'all', label: 'Todos' },
  { key: 'active', label: 'En curso' },
  { key: 'delivered', label: 'Entregados' },
];

function StatusBadge({ status }) {
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${SHIPMENT_STATUS[status].classes}`}>{SHIPMENT_STATUS[status].label}</span>;
}

function ShipmentTimeline({ shipment }) {
  const currentIndex = SHIPMENT_STEPS.findIndex((step) => step.key === shipment.status);
  return (
    <ol className="space-y-0">
      {SHIPMENT_STEPS.map((step, index) => {
        const date = shipment.events[step.key];
        const complete = Boolean(date) && index < currentIndex;
        const current = index === currentIndex;
        return (
          <li key={step.key} className="relative flex gap-4 pb-7 last:pb-0">
            {index < SHIPMENT_STEPS.length - 1 && <span aria-hidden="true" className={`absolute bottom-0 left-[15px] top-8 w-px ${complete ? 'bg-emerald-300' : 'bg-slate-200'}`} />}
            <span className={`relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full ${complete ? 'bg-emerald-100 text-emerald-700' : current ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-400'}`}>
              {complete ? <Check className="h-4 w-4" aria-hidden="true" /> : current ? <Clock3 className="h-4 w-4" aria-hidden="true" /> : <Circle className="h-3 w-3" aria-hidden="true" />}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold text-slate-900">{step.label}</p>
                <p className="text-sm text-slate-500">{date ? formatShipmentDate(date) : 'Pendiente'}</p>
              </div>
              <p className="mt-1 text-sm text-slate-500">{step.description}</p>
              {date && <p className="mt-1 text-xs text-slate-400">Registro confirmado · {shipment.code}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function ShipmentDetail({ shipment }) {
  const delivered = shipment.status === 'delivered';
  return (
    <div className="space-y-6">
      <Link to="/envios" className="inline-flex items-center gap-2 text-sm font-semibold text-roast-700 hover:text-roast-900">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Volver a envíos
      </Link>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-roast-700">Detalle del envío</p>
            <h2 className="mt-2 text-2xl font-medium">{shipment.product}</h2>
            <p className="mt-1 text-sm text-slate-500">Referencia {shipment.code} · Lote {shipment.lot}</p>
          </div>
          <StatusBadge status={shipment.status} />
        </div>
        <div className="mt-7 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs text-slate-500">Origen</p><p className="mt-1 font-medium text-slate-900">{shipment.origin}</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs text-slate-500">Destino</p><p className="mt-1 font-medium text-slate-900">{shipment.destination}</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs text-slate-500">Llegada estimada</p><p className="mt-1 font-medium text-slate-900">{formatShipmentDate(shipment.eta)}</p>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-600">
          <span className="inline-flex items-center gap-2"><Package className="h-4 w-4 text-roast-700" aria-hidden="true" />{formatShipmentWeight(shipment.weightKg)}</span>
          <span className="inline-flex items-center gap-2"><Ship className="h-4 w-4 text-roast-700" aria-hidden="true" />{shipment.vessel}</span>
          <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 text-roast-700" aria-hidden="true" />{shipment.farm}</span>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft sm:p-7">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div><h3 className="text-xl font-medium">Historial y registros</h3><p className="mt-1 text-sm text-slate-500">Movimientos registrados para este envío.</p></div>
          <Clock3 className="h-5 w-5 text-slate-400" aria-hidden="true" />
        </div>
        <ShipmentTimeline shipment={shipment} />
      </section>

      <section className="flex flex-col gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" aria-hidden="true" />
          <div><p className="font-semibold text-emerald-950">Referencia de diligencia debida</p><p className="mt-1 text-sm text-emerald-800">{shipment.eudrRef}</p></div>
        </div>
        <Link to={`/seguimiento?codigo=${shipment.code}`} className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-900 hover:underline">
          Abrir seguimiento público <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </section>
    </div>
  );
}

export default function ShipmentsView() {
  const { code } = useParams();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const selected = code ? SHIPMENTS[code.toUpperCase()] : null;

  const shipments = useMemo(() => Object.values(SHIPMENTS).filter((shipment) => {
    const term = query.trim().toLocaleLowerCase('es-CO');
    const matchesText = !term || [shipment.code, shipment.product, shipment.destination, shipment.farm].some((value) => value.toLocaleLowerCase('es-CO').includes(term));
    const matchesStatus = filter === 'all' || (filter === 'active' ? shipment.status !== 'delivered' : shipment.status === filter);
    return matchesText && matchesStatus;
  }), [query, filter]);

  if (code) {
    return selected ? <ShipmentDetail shipment={selected} /> : (
      <section className="rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center shadow-soft">
        <h2 className="text-xl font-medium">No encontramos ese envío</h2>
        <p className="mt-2 text-sm text-slate-500">Revisa el código o vuelve al listado de envíos.</p>
        <Link to="/envios" className="btn-primary mt-5">Ver envíos</Link>
      </section>
    );
  }

  const total = Object.keys(SHIPMENTS).length;
  const inProgress = Object.values(SHIPMENTS).filter((shipment) => shipment.status !== 'delivered').length;
  const delivered = total - inProgress;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-roast-700">Logística</p><h2 className="mt-1 text-2xl font-medium">Envíos</h2><p className="mt-1 text-sm text-slate-500">Consulta el estado de cada carga y revisa sus registros de tránsito.</p></div>
        <Link to="/seguimiento" className="btn-secondary w-full sm:w-auto"><ExternalLinkIcon /> Seguimiento público</Link>
      </div>

      <dl className="grid grid-cols-3 gap-3">
        {[['Total de envíos', total], ['En curso', inProgress], ['Entregados', delivered]].map(([label, value]) => (
          <div key={label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-soft"><dt className="text-xs text-slate-500 sm:text-sm">{label}</dt><dd className="mt-1 font-display text-2xl font-medium text-slate-900">{value}</dd></div>
        ))}
      </dl>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative sm:w-80"><label htmlFor="shipment-search" className="sr-only">Buscar envío</label><Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" /><input id="shipment-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Código, producto o destino" className="input-base pl-10" /></div>
        <div className="flex gap-2" aria-label="Filtrar envíos">
          {FILTERS.map(({ key, label }) => <button key={key} type="button" aria-pressed={filter === key} onClick={() => setFilter(key)} className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${filter === key ? 'border-roast-700 bg-roast-700 text-white' : 'border-slate-300 bg-white text-slate-600 hover:border-slate-400'}`}>{label}</button>)}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {shipments.map((shipment) => (
          <Link key={shipment.code} to={`/envios/${shipment.code}`} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:border-roast-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-roast-300 sm:p-6">
            <div className="flex items-start justify-between gap-4"><div className="flex min-w-0 items-start gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-roast-50 text-roast-700"><Package className="h-5 w-5" aria-hidden="true" /></span><div className="min-w-0"><p className="truncate font-semibold text-slate-900">{shipment.product}</p><p className="mt-1 text-xs text-slate-500">{shipment.code} · Lote {shipment.lot}</p></div></div><StatusBadge status={shipment.status} /></div>
            <div className="my-5 flex items-center gap-3 text-sm text-slate-600"><span className="truncate">{shipment.origin.split(',')[0]}</span><span className="h-px flex-1 bg-slate-200"/><ArrowRight className="h-4 w-4 shrink-0 text-roast-600" aria-hidden="true"/><span className="truncate">{shipment.destination.split(',')[0]}</span></div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 text-xs text-slate-500"><span className="inline-flex items-center gap-1.5"><Ship className="h-3.5 w-3.5" aria-hidden="true"/>{shipment.vessel}</span><span className="inline-flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" aria-hidden="true"/>Llegada {formatShipmentDate(shipment.eta)}</span><span className="font-semibold text-roast-700 group-hover:underline">Ver registros</span></div>
          </Link>
        ))}
        {shipments.length === 0 && <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center lg:col-span-2"><Search className="mx-auto h-6 w-6 text-slate-400" aria-hidden="true"/><p className="mt-3 font-medium text-slate-900">No hay envíos que coincidan</p><p className="mt-1 text-sm text-slate-500">Cambia el término de búsqueda o el filtro.</p></div>}
      </div>
    </div>
  );
}

function ExternalLinkIcon() {
  return <Anchor className="h-4 w-4" aria-hidden="true" />;
}
