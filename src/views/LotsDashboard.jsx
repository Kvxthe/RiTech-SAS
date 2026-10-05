import { useEffect, useMemo, useRef, useState } from 'react';
import { AlertCircle, CheckCircle2, Clock, Coffee, MapPin, Plus, Search, ShieldCheck, Sprout, X } from 'lucide-react';

const INITIAL_LOTS = [
  { id: 'LT-0418', farm: 'Finca La Esperanza', product: 'coffee', variety: 'Castillo', weightKg: 2450, harvestDate: '2026-10-02', status: 'review' },
  { id: 'LT-0417', farm: 'Finca El Mirador', product: 'coffee', variety: 'Caturra', weightKg: 1820, harvestDate: '2026-09-29', status: 'compliant' },
  { id: 'LT-0416', farm: 'Finca Río Mira', product: 'cacao', variety: 'Trinitario', weightKg: 3100, harvestDate: '2026-09-27', status: 'compliant' },
  { id: 'LT-0415', farm: 'Finca Villa Nueva', product: 'coffee', variety: 'Geisha', weightKg: 380, harvestDate: '2026-09-24', status: 'compliant' },
  { id: 'LT-0414', farm: 'Finca San Rafael', product: 'coffee', variety: 'Typica', weightKg: 1260, harvestDate: '2026-09-20', status: 'pending' },
  { id: 'LT-0413', farm: 'Finca Los Andes', product: 'coffee', variety: 'Castillo', weightKg: 2975, harvestDate: '2026-09-15', status: 'compliant' },
  { id: 'LT-0412', farm: 'Finca Bajo Mira', product: 'cacao', variety: 'CCN-51', weightKg: 4200, harvestDate: '2026-09-11', status: 'review' },
  { id: 'LT-0411', farm: 'Finca Altamira', product: 'coffee', variety: 'Bourbon', weightKg: 940, harvestDate: '2026-09-06', status: 'pending' },
];

const VARIETIES = {
  coffee: ['Castillo', 'Caturra', 'Typica', 'Geisha', 'Bourbon'],
  cacao: ['CCN-51', 'Trinitario', 'Criollo', 'Nacional'],
};

const PRODUCT_LABEL = { coffee: 'Café', cacao: 'Cacao' };

const STATUS = {
  compliant: { label: 'Conforme EUDR', icon: ShieldCheck, classes: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' },
  review: { label: 'En revisión', icon: Clock, classes: 'bg-amber-50 text-amber-800 ring-amber-600/20' },
  pending: { label: 'Pendiente de geodatos', icon: MapPin, classes: 'bg-zinc-100 text-zinc-700 ring-zinc-500/20' },
};

const FILTERS = [
  { key: 'all', label: 'Todos' },
  { key: 'compliant', label: 'Conformes' },
  { key: 'review', label: 'En revisión' },
  { key: 'pending', label: 'Pendientes' },
];

const numberFormat = new Intl.NumberFormat('es-CO');
const formatKg = (value) => `${numberFormat.format(value)} kg`;
const formatDate = (iso) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' });

const todayISO = () => {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

function StatusBadge({ status }) {
  const { label, icon: Icon, classes } = STATUS[status];
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${classes}`}>
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {label}
    </span>
  );
}

function ProductCell({ product, variety }) {
  const Icon = product === 'coffee' ? Coffee : Sprout;
  return (
    <div className="flex items-center gap-2.5">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-roast-50 text-roast-700">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <div className="leading-tight">
        <p className="font-medium text-slate-900">{variety}</p>
        <p className="text-xs text-slate-500">{PRODUCT_LABEL[product]}</p>
      </div>
    </div>
  );
}

function NewLotModal({ onClose, onSubmit }) {
  const [farm, setFarm] = useState('');
  const [product, setProduct] = useState('coffee');
  const [variety, setVariety] = useState(VARIETIES.coffee[0]);
  const [weight, setWeight] = useState('');
  const [harvestDate, setHarvestDate] = useState(todayISO());
  const [errors, setErrors] = useState({});
  const farmRef = useRef(null);

  useEffect(() => {
    farmRef.current?.focus();
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const handleProductChange = (value) => {
    setProduct(value);
    setVariety(VARIETIES[value][0]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (farm.trim().length < 3) nextErrors.farm = 'Ingresa el nombre de la finca.';
    if (!(Number(weight) > 0)) nextErrors.weight = 'Ingresa un peso mayor a 0 kg.';
    if (!harvestDate) nextErrors.harvestDate = 'Selecciona la fecha de cosecha.';
    else if (harvestDate > todayISO()) nextErrors.harvestDate = 'La fecha no puede ser futura.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    onSubmit({ farm: farm.trim(), product, variety, weightKg: Math.round(Number(weight)), harvestDate });
  };

  const FieldError = ({ message }) =>
    message ? (
      <p className="mt-1.5 flex items-center gap-1.5 text-xs text-rose-600">
        <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
        {message}
      </p>
    ) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <div className="absolute inset-0 animate-fade-in bg-slate-900/50" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-lot-title"
        className="relative z-10 max-h-[92vh] w-full max-w-lg animate-sheet-in overflow-y-auto rounded-t-2xl bg-white p-5 shadow-xl sm:rounded-xl sm:p-6"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 id="new-lot-title" className="text-xl font-medium">Registrar nuevo lote</h2>
            <p className="mt-1 text-sm text-slate-500">El lote queda pendiente hasta cargar los geodatos de sus parcelas.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Cerrar" className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label htmlFor="lot-farm" className="mb-1.5 block text-sm font-medium text-slate-700">Finca</label>
            <input
              id="lot-farm"
              ref={farmRef}
              type="text"
              value={farm}
              onChange={(e) => setFarm(e.target.value)}
              placeholder="Ej. Finca La Esperanza"
              className="input-base"
              aria-invalid={Boolean(errors.farm)}
            />
            <FieldError message={errors.farm} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="lot-product" className="mb-1.5 block text-sm font-medium text-slate-700">Producto</label>
              <select id="lot-product" value={product} onChange={(e) => handleProductChange(e.target.value)} className="input-base">
                <option value="coffee">Café</option>
                <option value="cacao">Cacao</option>
              </select>
            </div>
            <div>
              <label htmlFor="lot-variety" className="mb-1.5 block text-sm font-medium text-slate-700">Variedad</label>
              <select id="lot-variety" value={variety} onChange={(e) => setVariety(e.target.value)} className="input-base">
                {VARIETIES[product].map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="lot-weight" className="mb-1.5 block text-sm font-medium text-slate-700">Peso (kg)</label>
              <input
                id="lot-weight"
                type="number"
                inputMode="numeric"
                min="1"
                step="1"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="Ej. 1500"
                className="input-base"
                aria-invalid={Boolean(errors.weight)}
              />
              <FieldError message={errors.weight} />
            </div>
            <div>
              <label htmlFor="lot-date" className="mb-1.5 block text-sm font-medium text-slate-700">Fecha de cosecha</label>
              <input
                id="lot-date"
                type="date"
                max={todayISO()}
                value={harvestDate}
                onChange={(e) => setHarvestDate(e.target.value)}
                className="input-base"
                aria-invalid={Boolean(errors.harvestDate)}
              />
              <FieldError message={errors.harvestDate} />
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button type="button" onClick={onClose} className="btn-secondary">Cancelar</button>
            <button type="submit" className="btn-primary">Guardar lote</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function LotsDashboard({ showSummary = false }) {
  const [lots, setLots] = useState(INITIAL_LOTS);
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(''), 5000);
    return () => clearTimeout(timer);
  }, [toast]);

  const counts = useMemo(
    () => ({
      all: lots.length,
      compliant: lots.filter((l) => l.status === 'compliant').length,
      review: lots.filter((l) => l.status === 'review').length,
      pending: lots.filter((l) => l.status === 'pending').length,
    }),
    [lots]
  );

  const totalWeight = useMemo(() => lots.reduce((sum, l) => sum + l.weightKg, 0), [lots]);

  const visibleLots = useMemo(() => {
    const term = query.trim().toLowerCase();
    return lots.filter((lot) => {
      const matchesStatus = filter === 'all' || lot.status === filter;
      const matchesQuery = !term || lot.farm.toLowerCase().includes(term) || lot.variety.toLowerCase().includes(term);
      return matchesStatus && matchesQuery;
    });
  }, [lots, filter, query]);

  const handleCreateLot = (data) => {
    const nextNumber = Math.max(...lots.map((l) => Number(l.id.split('-')[1]))) + 1;
    const id = `LT-${String(nextNumber).padStart(4, '0')}`;
    setLots((prev) => [{ id, status: 'pending', ...data }, ...prev]);
    setFilter('all');
    setQuery('');
    setIsModalOpen(false);
    setToast(`Lote ${id} registrado. Carga los geodatos de sus parcelas para iniciar la verificación EUDR.`);
  };

  const clearFilters = () => {
    setFilter('all');
    setQuery('');
  };

  const stats = [
    { label: 'Lotes registrados', value: counts.all, hint: 'En todas las fincas' },
    { label: 'Peso total', value: `${(totalWeight / 1000).toLocaleString('es-CO', { maximumFractionDigits: 1 })} t`, hint: 'Café y cacao' },
    {
      label: 'Conformes EUDR',
      value: counts.compliant,
      hint: `${counts.all ? Math.round((counts.compliant / counts.all) * 100) : 0} % del total`,
      tone: 'text-emerald-600',
    },
    { label: 'Por resolver', value: counts.review + counts.pending, hint: 'En revisión o sin geodatos', tone: 'text-amber-700' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-medium">Lotes registrados</h2>
          <p className="mt-1 text-sm text-slate-500">Cada lote se vincula a su finca para generar la declaración EUDR.</p>
        </div>
        <button type="button" onClick={() => setIsModalOpen(true)} className="btn-primary w-full sm:w-auto">
          <Plus className="h-4 w-4" aria-hidden="true" />
          Registrar Nuevo Lote
        </button>
      </div>

      {showSummary && (
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-slate-200 bg-slate-200 shadow-soft lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white p-4 sm:p-5">
              <dt className="text-sm text-slate-500">{stat.label}</dt>
              <dd className={`mt-1 font-display text-3xl font-medium ${stat.tone || 'text-slate-900'}`}>{stat.value}</dd>
              <p className="mt-1 text-xs text-slate-500">{stat.hint}</p>
            </div>
          ))}
        </dl>
      )}

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative lg:w-80">
          <label htmlFor="lot-search" className="sr-only">Buscar por finca o variedad</label>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
          <input
            id="lot-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por finca o variedad"
            className="input-base pl-10"
          />
        </div>
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
          {FILTERS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              aria-pressed={filter === key}
              onClick={() => setFilter(key)}
              className={`whitespace-nowrap rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
                filter === key
                  ? 'border-roast-700 bg-roast-700 text-white'
                  : 'border-slate-300 bg-white text-slate-600 hover:border-slate-400'
              }`}
            >
              {label} <span className={filter === key ? 'text-roast-200' : 'text-slate-400'}>{counts[key]}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-soft">
        {visibleLots.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-14 text-center">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-slate-100 text-slate-400">
              <Search className="h-5 w-5" aria-hidden="true" />
            </span>
            <p className="mt-4 font-medium text-slate-900">No hay lotes que coincidan</p>
            <p className="mt-1 text-sm text-slate-500">Prueba con otro nombre de finca o cambia el estado seleccionado.</p>
            <button type="button" onClick={clearFilters} className="btn-secondary mt-5">Limpiar filtros</button>
          </div>
        ) : (
          <>
            <ul className="divide-y divide-slate-100 md:hidden">
              {visibleLots.map((lot) => (
                <li key={lot.id} className="space-y-3 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-slate-900">{lot.farm}</p>
                      <p className="text-xs text-slate-500">{lot.id}</p>
                    </div>
                    <StatusBadge status={lot.status} />
                  </div>
                  <ProductCell product={lot.product} variety={lot.variety} />
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>{formatKg(lot.weightKg)}</span>
                    <span>Cosecha {formatDate(lot.harvestDate)}</span>
                  </div>
                </li>
              ))}
            </ul>

            <div className="hidden overflow-x-auto md:block">
              <table className="min-w-full divide-y divide-slate-100 text-sm">
                <thead className="bg-slate-50 text-left text-slate-500">
                  <tr>
                    <th scope="col" className="px-5 py-3 font-medium">Finca</th>
                    <th scope="col" className="px-5 py-3 font-medium">Variedad</th>
                    <th scope="col" className="px-5 py-3 text-right font-medium">Peso</th>
                    <th scope="col" className="px-5 py-3 font-medium">Fecha de cosecha</th>
                    <th scope="col" className="px-5 py-3 font-medium">Estado EUDR</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {visibleLots.map((lot) => (
                    <tr key={lot.id} className="transition hover:bg-slate-50/70">
                      <td className="px-5 py-4">
                        <p className="font-medium text-slate-900">{lot.farm}</p>
                        <p className="text-xs text-slate-500">{lot.id}</p>
                      </td>
                      <td className="px-5 py-4"><ProductCell product={lot.product} variety={lot.variety} /></td>
                      <td className="whitespace-nowrap px-5 py-4 text-right tabular-nums text-slate-700">{formatKg(lot.weightKg)}</td>
                      <td className="whitespace-nowrap px-5 py-4 text-slate-600">{formatDate(lot.harvestDate)}</td>
                      <td className="px-5 py-4"><StatusBadge status={lot.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="border-t border-slate-100 px-5 py-3 text-xs text-slate-500">
              Mostrando {visibleLots.length} de {lots.length} lotes
            </p>
          </>
        )}
      </div>

      {isModalOpen && <NewLotModal onClose={() => setIsModalOpen(false)} onSubmit={handleCreateLot} />}

      {toast && (
        <div role="status" aria-live="polite" className="fixed inset-x-4 bottom-4 z-[60] animate-sheet-in sm:left-auto sm:right-6 sm:w-96">
          <div className="flex items-start gap-3 rounded-xl bg-stone-900 p-4 text-sm text-stone-100 shadow-xl">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" aria-hidden="true" />
            <p className="flex-1">{toast}</p>
            <button type="button" onClick={() => setToast('')} aria-label="Cerrar aviso" className="text-stone-400 transition hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
