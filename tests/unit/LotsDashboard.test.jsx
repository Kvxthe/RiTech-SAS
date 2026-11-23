import { render, screen, within, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import LotsDashboard from '../../src/views/LotsDashboard';

const setup = (props = {}) => {
  const user = userEvent.setup();
  render(<LotsDashboard {...props} />);
  return { user };
};

const rowsInTable = () => within(screen.getByRole('table')).getAllByRole('row').length - 1;

describe('LotsDashboard (unitaria)', () => {
  it('lista los 8 lotes iniciales', () => {
    setup();
    expect(rowsInTable()).toBe(8);
    expect(screen.getByText('Mostrando 8 de 8 lotes')).toBeInTheDocument();
  });

  it('el resumen solo aparece con showSummary y calcula las cifras', () => {
    const { unmount } = render(<LotsDashboard />);
    expect(screen.queryByText('Lotes registrados', { selector: 'dt' })).not.toBeInTheDocument();
    unmount();
    render(<LotsDashboard showSummary />);
    expect(screen.getByText('Peso total')).toBeInTheDocument();
    expect(screen.getByText('17,1 t')).toBeInTheDocument();
    expect(screen.getByText('50 % del total')).toBeInTheDocument();
  });

  it('filtra por estado "Conformes"', async () => {
    const { user } = setup();
    await user.click(screen.getByRole('button', { name: /Conformes/ }));
    expect(rowsInTable()).toBe(4);
    expect(screen.getByText('Mostrando 4 de 8 lotes')).toBeInTheDocument();
  });

  it('busca por nombre de finca sin distinguir mayúsculas', async () => {
    const { user } = setup();
    await user.type(screen.getByLabelText('Buscar por finca o variedad'), 'mirador');
    expect(rowsInTable()).toBe(1);
    expect(within(screen.getByRole('table')).getByText('Finca El Mirador')).toBeInTheDocument();
  });

  it('sin coincidencias muestra el estado vacío y "Limpiar filtros" lo revierte', async () => {
    const { user } = setup();
    await user.type(screen.getByLabelText('Buscar por finca o variedad'), 'zzzz');
    expect(screen.getByText('No hay lotes que coincidan')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Limpiar filtros' }));
    expect(rowsInTable()).toBe(8);
  });

  describe('modal "Registrar nuevo lote"', () => {
    const openModal = async (user) =>
      user.click(screen.getByRole('button', { name: /Registrar Nuevo Lote/ }));

    it('valida los campos obligatorios', async () => {
      const { user } = setup();
      await openModal(user);
      await user.click(screen.getByRole('button', { name: 'Guardar lote' }));
      expect(screen.getByText('Ingresa el nombre de la finca.')).toBeInTheDocument();
      expect(screen.getByText('Ingresa un peso mayor a 0 kg.')).toBeInTheDocument();
    });

    it('rechaza una fecha de cosecha futura', async () => {
      const { user } = setup();
      await openModal(user);
      await user.type(screen.getByLabelText('Finca'), 'Finca Prueba');
      await user.type(screen.getByLabelText('Peso (kg)'), '500');
      const date = screen.getByLabelText('Fecha de cosecha');
      await user.clear(date);
      await user.type(date, '2999-01-01');
      await user.click(screen.getByRole('button', { name: 'Guardar lote' }));
      expect(screen.getByText('La fecha no puede ser futura.')).toBeInTheDocument();
    });

    it('al cambiar a cacao actualiza las variedades disponibles', async () => {
      const { user } = setup();
      await openModal(user);
      await user.selectOptions(screen.getByLabelText('Producto'), 'cacao');
      const options = within(screen.getByLabelText('Variedad')).getAllByRole('option').map((o) => o.textContent);
      expect(options).toEqual(['CCN-51', 'Trinitario', 'Criollo', 'Nacional']);
    });

    it('guarda un lote nuevo como pendiente con el siguiente ID y muestra aviso', async () => {
      const { user } = setup();
      await openModal(user);
      await user.type(screen.getByLabelText('Finca'), 'Finca Prueba');
      await user.type(screen.getByLabelText('Peso (kg)'), '1500');
      await user.click(screen.getByRole('button', { name: 'Guardar lote' }));
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      expect(rowsInTable()).toBe(9);
      expect(screen.getByRole('status')).toHaveTextContent('Lote LT-0419 registrado');
      expect(within(screen.getByRole('table')).getByText('Finca Prueba')).toBeInTheDocument();
    });

    it('Escape cierra el modal', async () => {
      const { user } = setup();
      await openModal(user);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      await user.keyboard('{Escape}');
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });
});
