import { test, expect } from '@playwright/test';

const shot = (page, name) => page.screenshot({ path: `evidencias/${name}.png`, fullPage: true });

test.describe('Seguimiento público', () => {
  test('un cliente consulta un envío en tránsito', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/seguimiento$/);
    await page.getByLabel('Código de seguimiento').fill('rt-2026-0142');
    await page.getByRole('button', { name: 'Consultar envío' }).click();
    await expect(page.getByText('Estado del envío')).toBeVisible();
    await expect(page.getByText('MSC Aurora')).toBeVisible();
    await expect(page.getByText('Declaración de diligencia debida EUDR verificada')).toBeVisible();
    await shot(page, '01-seguimiento-encontrado');
  });

  test('un código inexistente muestra el aviso', async ({ page }) => {
    await page.goto('/seguimiento');
    await page.getByLabel('Código de seguimiento').fill('RT-0000-0000');
    await page.getByRole('button', { name: 'Consultar envío' }).click();
    await expect(page.getByRole('alert')).toContainText('No encontramos ningún envío');
    await shot(page, '02-seguimiento-no-encontrado');
  });
});

test.describe('Acceso de exportadores', () => {
  test('una ruta protegida redirige a /login', async ({ page }) => {
    await page.goto('/lotes');
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole('heading', { name: 'Inicia sesión' })).toBeVisible();
  });

  test('el login rechaza una contraseña corta', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Correo electrónico').fill('exportador@ritech.co');
    await page.getByLabel('Contraseña', { exact: true }).fill('123');
    await page.getByRole('button', { name: 'Ingresar' }).click();
    await expect(page.getByRole('alert')).toContainText('al menos 6 caracteres');
    await shot(page, '03-login-error');
  });

  test('flujo completo: login → registrar lote → filtrar → cerrar sesión', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Correo electrónico').fill('exportador@ritech.co');
    await page.getByLabel('Contraseña', { exact: true }).fill('clave123');
    await page.getByRole('button', { name: 'Ingresar' }).click();

    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByText('Resumen de producción y cumplimiento EUDR')).toBeVisible();
    await shot(page, '04-dashboard');

    await page.getByRole('button', { name: /Registrar Nuevo Lote/ }).click();
    await page.getByLabel('Finca', { exact: true }).fill('Finca E2E Prueba');
    await page.getByLabel('Producto').selectOption('cacao');
    await page.getByLabel('Variedad', { exact: true }).selectOption('Criollo');
    await page.getByLabel('Peso (kg)').fill('2000');
    await page.getByRole('button', { name: 'Guardar lote' }).click();

    await expect(page.getByRole('status')).toContainText('Lote LT-0419 registrado');
    await expect(page.getByRole('cell', { name: /Finca E2E Prueba/ })).toBeVisible();
    await shot(page, '05-lote-registrado');

    await page.getByRole('button', { name: /^Pendientes/ }).click();
    await expect(page.getByText('Mostrando 3 de 9 lotes')).toBeVisible();

    await page.getByRole('button', { name: /Cerrar Sesión/ }).click();
    await expect(page).toHaveURL(/\/login$/);
    expect(await page.evaluate(() => localStorage.getItem('ritech.session'))).toBeNull();
  });

  test('la sesión persiste al recargar la página', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Correo electrónico').fill('persistente@ritech.co');
    await page.getByLabel('Contraseña', { exact: true }).fill('clave123');
    await page.getByRole('button', { name: 'Ingresar' }).click();
    await expect(page).toHaveURL(/\/dashboard$/);
    await page.reload();
    await expect(page).toHaveURL(/\/dashboard$/);
  });
});

test.describe('Versión móvil', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('el menú hamburguesa abre y navega a Lotes', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Correo electrónico').fill('movil@ritech.co');
    await page.getByLabel('Contraseña', { exact: true }).fill('clave123');
    await page.getByRole('button', { name: 'Ingresar' }).click();
    await expect(page).toHaveURL(/\/dashboard$/);
    await page.getByRole('button', { name: 'Abrir menú' }).click();
    await shot(page, '06-movil-menu');
    await page.getByRole('dialog', { name: 'Menú de navegación' }).getByRole('link', { name: 'Lotes' }).click();
    await expect(page).toHaveURL(/\/lotes$/);
    await expect(page.getByRole('dialog', { name: 'Menú de navegación' })).toBeHidden();
  });
});
