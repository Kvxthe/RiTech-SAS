import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Coffee, Eye, EyeOff, Loader2, Lock, MapPin, Mail, ShieldCheck, Ship } from 'lucide-react';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const HIGHLIGHTS = [
  { icon: MapPin, text: 'Geolocalización de las parcelas de cada finca' },
  { icon: ShieldCheck, text: 'Declaración de diligencia debida lista para el reglamento EUDR' },
  { icon: Ship, text: 'Seguimiento del envío para tu cliente en la Unión Europea' },
];

export default function LoginView({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const timeoutRef = useRef(null);

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isLoading) return;
    setError('');

    const cleanEmail = email.trim().toLowerCase();
    if (!EMAIL_REGEX.test(cleanEmail)) {
      setError('Ingresa un correo electrónico válido.');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setIsLoading(true);
    timeoutRef.current = setTimeout(() => {
      onLogin({ email: cleanEmail });
    }, 1200);
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <section className="hidden flex-col justify-between bg-stone-900 p-12 text-stone-300 lg:flex">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-500 text-stone-900">
            <Coffee className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="font-display text-xl font-semibold text-white">RiTech SAS</span>
        </div>
        <div>
          <h2 className="max-w-md font-display text-4xl font-medium leading-tight text-white">
            Cada lote, trazable hasta la finca.
          </h2>
          <ul className="mt-8 space-y-4">
            {HIGHLIGHTS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-3 text-sm">
                <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-stone-800 text-amber-400">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="max-w-sm pt-1">{text}</span>
              </li>
            ))}
          </ul>
        </div>
        <p className="text-xs text-stone-500">Exportación de café y cacao desde Nariño hacia la Unión Europea.</p>
      </section>

      <section className="flex items-center justify-center px-4 py-12 sm:px-8">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-roast-700 text-white">
              <Coffee className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="font-display text-xl font-semibold text-slate-900">RiTech SAS</span>
          </div>

          <h1 className="text-3xl font-medium">Inicia sesión</h1>
          <p className="mt-2 text-sm text-slate-500">Accede para registrar y gestionar tus lotes de exportación.</p>

          <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
            {error && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3 text-sm text-rose-700"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                {error}
              </div>
            )}

            <div>
              <label htmlFor="login-email" className="mb-1.5 block text-sm font-medium text-slate-700">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nombre@empresa.com"
                  className="input-base pl-10"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="login-password" className="mb-1.5 block text-sm font-medium text-slate-700">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="input-base pl-10 pr-11"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition hover:text-slate-700"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="btn-primary w-full py-3">
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  Ingresando...
                </>
              ) : (
                'Ingresar'
              )}
            </button>
          </form>

          <p className="mt-6 text-xs text-slate-500">
            Acceso de demostración: cualquier correo válido y una contraseña de 6 o más caracteres.
          </p>
          <p className="mt-6 text-sm text-slate-600">
            ¿Eres cliente y buscas tu envío?{' '}
            <Link to="/seguimiento" className="font-semibold text-roast-700 underline-offset-4 hover:underline">
              Consultar un envío
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
