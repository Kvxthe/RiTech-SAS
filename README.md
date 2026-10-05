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

## Credenciales de demo

No hay usuarios predefinidos. Puedes iniciar sesión con cualquier correo válido y una contraseña de mínimo 6 caracteres.

## Comandos

```bash
npm run dev
npm run build
npm run preview
```
