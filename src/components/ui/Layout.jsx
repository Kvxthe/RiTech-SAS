import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { Coffee, ExternalLink, LayoutDashboard, LogOut, Menu, Package, X } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/lotes', label: 'Lotes', icon: Package },
];

const PAGE_META = {
  '/dashboard': { title: 'Dashboard', subtitle: 'Resumen de producción y cumplimiento EUDR' },
  '/lotes': { title: 'Lotes', subtitle: 'Registro y trazabilidad de cada lote exportable' },
};

const getInitials = (email = '') => (email.split('@')[0] || 'U').slice(0, 2).toUpperCase();

function SidebarContent({ user, onLogout, onNavigate }) {
  return (
    <div className="flex h-full flex-col bg-stone-900 text-stone-300">
      <div className="flex h-16 items-center gap-3 border-b border-stone-800 px-5">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-amber-500 text-stone-900">
          <Coffee className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="leading-tight">
          <p className="font-display text-lg font-semibold text-white">RiTech</p>
          <p className="text-xs text-stone-500">Café y cacao a la UE</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4" aria-label="Navegación principal">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? 'bg-stone-800 text-white'
                  : 'text-stone-400 hover:bg-stone-800/60 hover:text-stone-100'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className="h-5 w-5" aria-hidden="true" />
                {label}
                {isActive && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-amber-400" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-stone-800 p-3">
        <div className="mb-2 flex items-center gap-3 px-3 py-2">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-amber-500/15 text-sm font-semibold text-amber-300">
            {getInitials(user?.email)}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-stone-100">{user?.email}</p>
            <p className="text-xs text-stone-500">Exportador</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-stone-400 transition hover:bg-stone-800/60 hover:text-white"
        >
          <LogOut className="h-5 w-5" aria-hidden="true" />
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}

export default function Layout({ user, onLogout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const meta = PAGE_META[pathname] || PAGE_META['/dashboard'];

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isMenuOpen) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setIsMenuOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  return (
    <div className="min-h-screen lg:pl-64">
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:block lg:w-64">
        <SidebarContent user={user} onLogout={onLogout} />
      </aside>

      {isMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true" aria-label="Menú de navegación">
          <div className="absolute inset-0 animate-fade-in bg-slate-900/50" onClick={() => setIsMenuOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[85%] animate-drawer-in shadow-xl">
            <button
              type="button"
              onClick={() => setIsMenuOpen(false)}
              aria-label="Cerrar menú"
              className="absolute right-3 top-4 z-10 rounded-lg p-1.5 text-stone-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
            <SidebarContent user={user} onLogout={onLogout} onNavigate={() => setIsMenuOpen(false)} />
          </div>
        </div>
      )}

      <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/90 px-4 backdrop-blur sm:px-6">
        <button
          type="button"
          onClick={() => setIsMenuOpen(true)}
          aria-label="Abrir menú"
          className="-ml-2 rounded-xl p-2 text-slate-600 transition hover:bg-slate-100 lg:hidden"
        >
          <Menu className="h-6 w-6" />
        </button>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-lg font-semibold">{meta.title}</h1>
          <p className="hidden truncate text-sm text-slate-500 sm:block">{meta.subtitle}</p>
        </div>
        <Link
          to="/seguimiento"
          className="hidden items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 sm:inline-flex"
        >
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
          Seguimiento público
        </Link>
        <span
          className="grid h-9 w-9 place-items-center rounded-full bg-roast-100 text-sm font-semibold text-roast-800"
          title={user?.email}
        >
          {getInitials(user?.email)}
        </span>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:py-8">
        <Outlet />
      </main>
    </div>
  );
}
