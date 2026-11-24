import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CalendarDays, FileCheck2, FileText, Search, ShieldCheck } from 'lucide-react';
import { SHIPMENTS, formatShipmentDate } from '../data/shipments';

const DOCUMENTS = [
  { id: 'DOC-004217', name: 'Declaración de diligencia debida', type: 'EUDR', reference: 'DDS-CO-2026-004217', status: 'verified', date: '2026-11-12', shipment: 'RT-2026-0142', lot: 'LT-0418', issuer: 'RiTech SAS', note: 'Registro de diligencia debida asociado al lote y al envío.' },
  { id: 'DOC-004218', name: 'Certificado fitosanitario', type: 'Sanitario', reference: 'ICA-2026-88314', status: 'pending', date: '2026-11-18', shipment: 'RT-2026-0142', lot: 'LT-0418', issuer: 'Instituto Colombiano Agropecuario', note: 'Pendiente de completar la revisión documental.' },
  { id: 'DOC-004388', name: 'Declaración de diligencia debida', type: 'EUDR', reference: 'DDS-CO-2026-004388', status: 'verified', date: '2026-11-18', shipment: 'RT-2026-0177', lot: 'LT-0416', issuer: 'RiTech SAS', note: 'Registro de diligencia debida asociado al lote y al envío.' },
  { id: 'DOC-004389', name: 'Certificado de origen', type: 'Origen', reference: 'CCI-2026-27104', status: 'verified', date: '2026-11-17', shipment: 'RT-2026-0177', lot: 'LT-0416', issuer: 'Cámara de Comercio', note: 'Registro de origen para la carga de cacao.' },
  { id: 'DOC-003974', name: 'Declaración de diligencia debida', type: 'EUDR', reference: 'DDS-CO-2026-003974', status: 'verified', date: '2026-08-24', shipment: 'RT-2026-0098', lot: 'LT-0413', issuer: 'RiTech SAS', note: 'Registro de diligencia debida para envío entregado.' },
  { id: 'DOC-003975', name: 'Conocimiento de embarque', type: 'Transporte', reference: 'BL-CGT-2026-11908', status: 'verified', date: '2026-08-25', shipment: 'RT-2026-0098', lot: 'LT-0413', issuer: 'CMA CGM', note: 'Documento de transporte asociado a la carga.' },
];

const STATUS = {
  verified: { label: 'Verificado', classes: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' },
  pending: { label: 'Pendiente', classes: 'bg-amber-50 text-amber-800 ring-amber-600/20' },
};

function StatusBadge({ status }) {
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${STATUS[status].classes}`}>{STATUS[status].label}</span>;
}

function DocumentDetail({ record }) {
  const shipment = SHIPMENTS[record.shipment];
  return (
    <div className="space-y-6">
      <Link to="/documentos" className="inline-flex items-center gap-2 text-sm font-semibold text-roast-700 hover:text-roast-900"><ArrowLeft className="h-4 w-4" aria-hidden="true"/> Volver a documentación</Link>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4"><div className="flex items-start gap-3"><span className="grid h-11 w-11 place-items-center rounded-xl bg-roast-50 text-roast-700"><FileText className="h-5 w-5" aria-hidden="true"/></span><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-roast-700">Ficha documental · {record.id}</p><h2 className="mt-1 text-2xl font-medium">{record.name}</h2><p className="mt-1 text-sm text-slate-500">{record.type} · {record.reference}</p></div></div><StatusBadge status={record.status}/></div>
        <p className="mt-6 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">{record.note}</p>
        <dl className="mt-6 grid gap-5 sm:grid-cols-2">
          <div><dt className="text-xs text-slate-500">Fecha de registro</dt><dd className="mt-1 inline-flex items-center gap-2 text-sm font-medium text-slate-900"><CalendarDays className="h-4 w-4 text-roast-700" aria-hidden="true"/>{formatShipmentDate(record.date)}</dd></div>
          <div><dt className="text-xs text-slate-500">Entidad emisora</dt><dd className="mt-1 text-sm font-medium text-slate-900">{record.issuer}</dd></div>
          <div><dt className="text-xs text-slate-500">Lote relacionado</dt><dd className="mt-1 text-sm font-medium text-slate-900">{record.lot}</dd></div>
          <div><dt className="text-xs text-slate-500">Referencia documental</dt><dd className="mt-1 text-sm font-medium text-slate-900">{record.reference}</dd></div>
        </dl>
      </section>
      {shipment && <Link to={`/envios/${shipment.code}`} className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-soft transition hover:border-roast-300"><div><p className="text-xs text-slate-500">Envío relacionado</p><p className="mt-1 font-semibold text-slate-900">{shipment.code} · {shipment.product}</p></div><ArrowRight className="h-5 w-5 shrink-0 text-roast-700" aria-hidden="true"/></Link>}
    </div>
  );
}

export default function DocumentsView() {
  const { id } = useParams();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const selected = id ? DOCUMENTS.find((record) => record.id.toLowerCase() === id.toLowerCase()) : null;
  const visible = useMemo(() => DOCUMENTS.filter((record) => {
    const term = query.trim().toLocaleLowerCase('es-CO');
    const matchesText = !term || [record.name, record.type, record.reference, record.shipment, record.lot].some((value) => value.toLocaleLowerCase('es-CO').includes(term));
    const matchesStatus = filter === 'all' || record.status === filter;
    return matchesText && matchesStatus;
  }), [query, filter]);

  if (id) return selected ? <DocumentDetail record={selected}/> : <section className="rounded-2xl border border-slate-200 bg-white p-10 text-center"><h2 className="text-xl font-medium">No encontramos ese registro</h2><Link className="btn-primary mt-5" to="/documentos">Ver documentación</Link></section>;

  const verified = DOCUMENTS.filter((record) => record.status === 'verified').length;
  const pending = DOCUMENTS.length - verified;
  return (
    <div className="space-y-6">
      <div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-roast-700">Cumplimiento y respaldo</p><h2 className="mt-1 text-2xl font-medium">Documentación</h2><p className="mt-1 text-sm text-slate-500">Consulta los registros documentales asociados a lotes y envíos.</p></div>
      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3"><div className="rounded-xl border border-slate-200 bg-white p-4 shadow-soft"><dt className="text-sm text-slate-500">Registros</dt><dd className="mt-1 font-display text-2xl font-medium">{DOCUMENTS.length}</dd></div><div className="rounded-xl border border-slate-200 bg-white p-4 shadow-soft"><dt className="text-sm text-slate-500">Verificados</dt><dd className="mt-1 font-display text-2xl font-medium text-emerald-700">{verified}</dd></div><div className="col-span-2 rounded-xl border border-slate-200 bg-white p-4 shadow-soft sm:col-span-1"><dt className="text-sm text-slate-500">Pendientes</dt><dd className="mt-1 font-display text-2xl font-medium text-amber-700">{pending}</dd></div></dl>
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="relative sm:w-80"><label htmlFor="document-search" className="sr-only">Buscar documento</label><Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true"/><input id="document-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Nombre, referencia o envío" className="input-base pl-10"/></div>
          <div className="flex gap-2">{[['all','Todos'],['verified','Verificados'],['pending','Pendientes']].map(([key,label])=><button key={key} type="button" aria-pressed={filter===key} onClick={()=>setFilter(key)} className={`rounded-full border px-3 py-1.5 text-sm font-medium ${filter===key?'border-roast-700 bg-roast-700 text-white':'border-slate-300 bg-white text-slate-600 hover:border-slate-400'}`}>{label}</button>)}</div>
        </div>
        {visible.length ? <ul className="divide-y divide-slate-100">{visible.map((record)=><li key={record.id}><Link to={`/documentos/${record.id}`} className="flex flex-col gap-3 p-4 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between sm:px-5"><div className="flex min-w-0 items-start gap-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-600"><FileCheck2 className="h-4 w-4" aria-hidden="true"/></span><div className="min-w-0"><p className="font-semibold text-slate-900">{record.name}</p><p className="mt-1 truncate text-xs text-slate-500">{record.id} · {record.reference} · Envío {record.shipment} · Lote {record.lot}</p></div></div><div className="flex items-center justify-between gap-4 sm:justify-end"><span className="text-xs text-slate-500">{formatShipmentDate(record.date)}</span><StatusBadge status={record.status}/><ArrowRight className="hidden h-4 w-4 text-slate-400 sm:block" aria-hidden="true"/></div></Link></li>)}</ul> : <div className="px-6 py-12 text-center"><Search className="mx-auto h-6 w-6 text-slate-400" aria-hidden="true"/><p className="mt-3 font-medium text-slate-900">No hay registros que coincidan</p><p className="mt-1 text-sm text-slate-500">Ajusta el texto o el estado seleccionado.</p></div>}
        <p className="border-t border-slate-100 px-5 py-3 text-xs text-slate-500">Mostrando {visible.length} de {DOCUMENTS.length} registros</p>
      </section>
      <div className="flex items-start gap-3 rounded-xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-900"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true"/><p>Los registros se organizan por referencia EUDR, envío y lote para facilitar su consulta y revisión.</p></div>
    </div>
  );
}
