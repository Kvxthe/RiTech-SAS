import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import App from '../../src/App';

const SESSION_KEY = 'ritech.session';

const renderAt = (path, { session } = {}) => {
  window.history.pushState({}, '', path);
  if (session) window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  const user = userEvent.setup();
  render(<App />);
  return { user };
};

const doLogin = async (user, email = 'exportador@ritech.co', password = 'clave123') => {
  await user.type(screen.getByLabelText('Correo electrónico'), email);
  await user.type(screen.getByLabelText('Contraseña'), password);
  await user.click(screen.getByRole('button', { name: 'Ingresar' }));
};

describe('App (integración: rutas + sesión + vistas)', () => {
  it('la raíz "/" redirige al seguimiento público', () => {
    renderAt('/');
    expect(window.location.pathname).toBe('/seguimiento');
    expect(screen.getByText('Tu envío, en cada etapa.')).toBeInTheDocument();
  });

  it('una ruta desconocida también termina en el seguimiento', () => {
    renderAt('/no-existe');
    expect(window.location.pathname).toBe('/seguimiento');
  });

  it('sin sesión, /dashboard redirige a /login', () => {
    renderAt('/dashboard');
    expect(window.location.pathname).toBe('/login');
    expect(screen.getByRole('heading', { name: 'Inicia sesión' })).toBeInTheDocument();
  });

  it('login completo: entra a /dashboard y guarda la sesión en localStorage', async () => {
    const { user } = renderAt('/dashboard');
    await doLogin(user);
    await waitFor(() => expect(window.location.pathname).toBe('/dashboard'), { timeout: 3000 });
    expect(screen.getByText('Resumen de producción y cumplimiento EUDR')).toBeInTheDocument();
    expect(JSON.parse(window.localStorage.getItem(SESSION_KEY))).toEqual({ email: 'exportador@ritech.co' });
  });

  it('con sesión guardada se entra directo a /lotes', () => {
    renderAt('/lotes', { session: { email: 'ya@ritech.co' } });
    expect(window.location.pathname).toBe('/lotes');
    expect(screen.getByText('Registro y trazabilidad de cada lote exportable')).toBeInTheDocument();
  });

  it('con sesión activa, /login redirige al dashboard', () => {
    renderAt('/login', { session: { email: 'ya@ritech.co' } });
    expect(window.location.pathname).toBe('/dashboard');
  });

  it('navega entre Dashboard y Lotes con la barra lateral', async () => {
    const { user } = renderAt('/dashboard', { session: { email: 'ya@ritech.co' } });
    const nav = screen.getByRole('navigation', { name: 'Navegación principal' });
    await user.click(within(nav).getByRole('link', { name: /Lotes/ }));
    expect(window.location.pathname).toBe('/lotes');
    expect(screen.getByText('Registro y trazabilidad de cada lote exportable')).toBeInTheDocument();
  });

  it('abre un producto desde Envíos y muestra sus registros de tránsito', async () => {
    const { user } = renderAt('/envios', { session: { email: 'ya@ritech.co' } });
    const nav = screen.getByRole('navigation', { name: 'Navegación principal' });
    await user.click(within(nav).getByRole('link', { name: /Envíos/ }));
    expect(window.location.pathname).toBe('/envios');
    await user.click(screen.getByRole('link', { name: /RT-2026-0142/ }));
    expect(window.location.pathname).toBe('/envios/RT-2026-0142');
    expect(screen.getByText('Historial y registros')).toBeInTheDocument();
    expect(screen.getAllByText('En tránsito').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Lote LT-0418/)).toBeInTheDocument();
  });

  it('consulta registros documentales y permite abrir el envío relacionado', async () => {
    const { user } = renderAt('/documentos', { session: { email: 'ya@ritech.co' } });
    const nav = screen.getByRole('navigation', { name: 'Navegación principal' });
    await user.click(within(nav).getByRole('link', { name: /Documentación/ }));
    expect(screen.getByText('Mostrando 6 de 6 registros')).toBeInTheDocument();
    await user.click(screen.getByRole('link', { name: /DOC-004217/ }));
    expect(window.location.pathname).toBe('/documentos/DOC-004217');
    expect(screen.getByText('Declaración de diligencia debida')).toBeInTheDocument();
    await user.click(screen.getByRole('link', { name: /RT-2026-0142/ }));
    expect(window.location.pathname).toBe('/envios/RT-2026-0142');
  });

  it('cerrar sesión borra localStorage y devuelve a /login', async () => {
    const { user } = renderAt('/dashboard', { session: { email: 'ya@ritech.co' } });
    await user.click(screen.getByRole('button', { name: /Cerrar Sesión/ }));
    expect(window.localStorage.getItem(SESSION_KEY)).toBeNull();
    expect(window.location.pathname).toBe('/login');
  });

  it('registrar un lote desde el dashboard actualiza los contadores del resumen', async () => {
    const { user } = renderAt('/dashboard', { session: { email: 'ya@ritech.co' } });
    expect(screen.getByText('Lotes registrados', { selector: 'dt' }).nextSibling).toHaveTextContent('8');
    await user.click(screen.getByRole('button', { name: /Registrar Nuevo Lote/ }));
    await user.type(screen.getByLabelText('Finca'), 'Finca Integración');
    await user.type(screen.getByLabelText('Peso (kg)'), '1000');
    await user.click(screen.getByRole('button', { name: 'Guardar lote' }));
    expect(screen.getByText('Lotes registrados', { selector: 'dt' }).nextSibling).toHaveTextContent('9');
    expect(screen.getByText('Por resolver', { selector: 'dt' }).nextSibling).toHaveTextContent('5');
  });

  it('desde el login se puede ir al seguimiento público y consultar un envío', async () => {
    const { user } = renderAt('/login');
    await user.click(screen.getByRole('link', { name: 'Consultar un envío' }));
    expect(window.location.pathname).toBe('/seguimiento');
    await user.type(screen.getByLabelText('Código de seguimiento'), 'RT-2026-0142');
    await user.click(screen.getByRole('button', { name: 'Consultar envío' }));
    expect(await screen.findByText('MSC Aurora', {}, { timeout: 2000 })).toBeInTheDocument();
  });
});
