export const SHIPMENTS = {
  'RT-2026-0142': {
    code: 'RT-2026-0142',
    product: 'Café especial de Nariño, variedad Castillo',
    productType: 'Café',
    lot: 'LT-0418',
    farm: 'Finca La Esperanza',
    origin: 'Cartagena, Colombia',
    destination: 'Hamburgo, Alemania',
    weightKg: 18400,
    vessel: 'MSC Aurora',
    eta: '2026-12-08',
    status: 'transit',
    eudrRef: 'DDS-CO-2026-004217',
    events: { port: '2026-11-12', transit: '2026-11-15', delivered: null },
  },
  'RT-2026-0177': {
    code: 'RT-2026-0177',
    product: 'Cacao Trinitario fermentado',
    productType: 'Cacao',
    lot: 'LT-0416',
    farm: 'Finca Río Mira',
    origin: 'Buenaventura, Colombia',
    destination: 'Róterdam, Países Bajos',
    weightKg: 12600,
    vessel: 'Maersk Elba',
    eta: '2026-12-16',
    status: 'port',
    eudrRef: 'DDS-CO-2026-004388',
    events: { port: '2026-11-18', transit: null, delivered: null },
  },
  'RT-2026-0098': {
    code: 'RT-2026-0098',
    product: 'Café Caturra lavado',
    productType: 'Café',
    lot: 'LT-0413',
    farm: 'Finca Los Andes',
    origin: 'Cartagena, Colombia',
    destination: 'Amberes, Bélgica',
    weightKg: 9200,
    vessel: 'CMA CGM Tigris',
    eta: '2026-09-18',
    status: 'delivered',
    eudrRef: 'DDS-CO-2026-003974',
    events: { port: '2026-08-24', transit: '2026-08-28', delivered: '2026-09-18' },
  },
};

export const SHIPMENT_STEPS = [
  { key: 'port', label: 'En puerto', description: 'La carga espera embarque en el puerto de origen.' },
  { key: 'transit', label: 'En tránsito', description: 'El contenedor navega hacia el puerto de destino.' },
  { key: 'delivered', label: 'Entregado', description: 'La carga llegó a destino y fue entregada.' },
];

export const SHIPMENT_STATUS = {
  port: { label: 'En puerto', classes: 'bg-amber-50 text-amber-800 ring-amber-600/20' },
  transit: { label: 'En tránsito', classes: 'bg-sky-50 text-sky-700 ring-sky-600/20' },
  delivered: { label: 'Entregado', classes: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' },
};

export const formatShipmentDate = (iso) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' });

export const formatShipmentWeight = (value) => `${new Intl.NumberFormat('es-CO').format(value)} kg`;
