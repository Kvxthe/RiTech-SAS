import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import TrackingView from '../../src/views/TrackingView';

const setup = () => {
  const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
  render(
    <MemoryRouter>
      <TrackingView />
    </MemoryRouter>
  );
  return { user };
};

const search = async (user, code) => {
  await user.type(screen.getByLabelText('Código de seguimiento'), code);
  await user.click(screen.getByRole('button', { name: 'Consultar envío' }));
  act(() => vi.advanceTimersByTime(700));
};

describe('TrackingView (unitaria)', () => {
  beforeEach(() => vi.useFakeTimers({ shouldAdvanceTime: true }));
  afterEach(() => vi.useRealTimers());

  it('mantiene deshabilitado el botón mientras el campo esté vacío', () => {
    setup();
    expect(screen.getByRole('button', { name: 'Consultar envío' })).toBeDisabled();
  });

  it('encuentra un envío en tránsito y muestra su detalle', async () => {
    const { user } = setup();
    await search(user, 'RT-2026-0142');
    expect(screen.getByText('Estado del envío')).toBeInTheDocument();
    expect(screen.getByText('MSC Aurora')).toBeInTheDocument();
    expect(screen.getByText('18.400 kg')).toBeInTheDocument();
    expect(screen.getByText('Llegada estimada')).toBeInTheDocument();
    expect(screen.getByText(/DDS-CO-2026-004217/)).toBeInTheDocument();
  });

  it('normaliza el código a mayúsculas y quita espacios', async () => {
    const { user } = setup();
    await search(user, '  rt-2026-0177 ');
    expect(screen.getByText('Código RT-2026-0177')).toBeInTheDocument();
  });

  it('un envío entregado muestra "Fecha de entrega"', async () => {
    const { user } = setup();
    await search(user, 'RT-2026-0098');
    expect(screen.getByText('Fecha de entrega')).toBeInTheDocument();
  });

  it('un código inexistente muestra el aviso de no encontrado', async () => {
    const { user } = setup();
    await search(user, 'RT-9999-0000');
    expect(screen.getByRole('alert')).toHaveTextContent('No encontramos ningún envío');
    expect(screen.getByRole('alert')).toHaveTextContent('RT-9999-0000');
  });

  it('los botones de ejemplo lanzan la búsqueda', async () => {
    const { user } = setup();
    await user.click(screen.getByRole('button', { name: 'RT-2026-0098' }));
    act(() => vi.advanceTimersByTime(700));
    expect(screen.getByText('CMA CGM Tigris')).toBeInTheDocument();
  });
});
