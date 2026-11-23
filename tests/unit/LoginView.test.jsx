import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import LoginView from '../../src/views/LoginView';

const setup = () => {
  const onLogin = vi.fn();
  const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
  render(
    <MemoryRouter>
      <LoginView onLogin={onLogin} />
    </MemoryRouter>
  );
  return { onLogin, user };
};

describe('LoginView (unitaria)', () => {
  beforeEach(() => vi.useFakeTimers({ shouldAdvanceTime: true }));
  afterEach(() => vi.useRealTimers());

  it('muestra error con un correo inválido', async () => {
    const { user, onLogin } = setup();
    await user.type(screen.getByLabelText('Correo electrónico'), 'correo-malo');
    await user.type(screen.getByLabelText('Contraseña'), '123456');
    await user.click(screen.getByRole('button', { name: 'Ingresar' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Ingresa un correo electrónico válido.');
    expect(onLogin).not.toHaveBeenCalled();
  });

  it('muestra error con contraseña de menos de 6 caracteres', async () => {
    const { user, onLogin } = setup();
    await user.type(screen.getByLabelText('Correo electrónico'), 'a@b.com');
    await user.type(screen.getByLabelText('Contraseña'), '12345');
    await user.click(screen.getByRole('button', { name: 'Ingresar' }));
    expect(screen.getByRole('alert')).toHaveTextContent('al menos 6 caracteres');
    expect(onLogin).not.toHaveBeenCalled();
  });

  it('con datos válidos muestra "Ingresando..." y llama onLogin con el correo limpio', async () => {
    const { user, onLogin } = setup();
    await user.type(screen.getByLabelText('Correo electrónico'), '  Matias@Correo.COM ');
    await user.type(screen.getByLabelText('Contraseña'), 'secreto1');
    await user.click(screen.getByRole('button', { name: 'Ingresar' }));
    expect(screen.getByRole('button', { name: /Ingresando/ })).toBeDisabled();
    expect(onLogin).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(1200));
    expect(onLogin).toHaveBeenCalledWith({ email: 'matias@correo.com' });
  });

  it('el botón del ojo alterna la visibilidad de la contraseña', async () => {
    const { user } = setup();
    const input = screen.getByLabelText('Contraseña');
    expect(input).toHaveAttribute('type', 'password');
    await user.click(screen.getByRole('button', { name: 'Mostrar contraseña' }));
    expect(input).toHaveAttribute('type', 'text');
    await user.click(screen.getByRole('button', { name: 'Ocultar contraseña' }));
    expect(input).toHaveAttribute('type', 'password');
  });
});
