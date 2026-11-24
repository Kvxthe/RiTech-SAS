# RiTech EUDR

Aplicación web demo para trazabilidad y seguimiento de lotes de café y cacao hacia la Unión Europea.

## Requisitos

- Node.js 20 o superior
- npm

## Ejecutar en VS Code

Abre esta carpeta en VS Code y ejecuta en la terminal:

```bash
npm install
npm run dev
```

Luego abre la URL que muestre Vite, normalmente:

`http://localhost:5173`

## Rutas principales

- `/seguimiento` — seguimiento público de envíos.
- `/login` — acceso de exportadores.
- `/dashboard` — resumen de lotes (requiere iniciar sesión).
- `/lotes` — gestión de lotes (requiere iniciar sesión).
- `/envios` — listado, filtros e historial de movimientos por envío (requiere iniciar sesión).
- `/documentos` — consulta de registros documentales por lote y envío (requiere iniciar sesión).

## Credenciales de demo

No hay usuarios predefinidos. Puedes iniciar sesión con cualquier correo válido y una contraseña de mínimo 6 caracteres.

## Comandos

```bash
npm run dev
npm run build
npm run preview
```

## Pruebas automatizadas

```bash
npm run test:unit
npm run test:integration
npm run test:e2e
npm run test:coverage
```

Las pruebas E2E requieren Chromium. Si no está instalado, ejecuta `npx playwright install chromium`.
