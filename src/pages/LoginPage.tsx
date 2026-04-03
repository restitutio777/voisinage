import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, Leaf, Mail } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { usePageTitle } from '../lib/usePageTitle';
import { FooterLinks } from '../components/FooterLinks';

export function LoginPage() {
  usePageTitle('Connexion');
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [forgotMode, setForgotMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const from = (location.state as { from?: string })?.from || '/';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        setError('Email ou mot de passe incorrect');
      } else {
        setError('Une erreur est survenue. Veuillez réessayer.');
      }
      setLoading(false);
      return;
    }

    navigate(from, { replace: true });
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    if (!email) {
      setError('Veuillez entrer votre adresse email');
      return;
    }
    setError('');
    setLoading(true);
    const { error } = await resetPassword(email);
    if (error) {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } else {
      setResetSent(true);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 bg-white border-b border-stone-200 px-4 py-3">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-stone-600 hover:text-stone-800"
        >
          <ArrowLeft size={24} />
          <span className="text-lg">Retour</span>
        </button>
      </header>

      <div className="px-4 py-8">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="bg-primary-100 p-3 rounded-xl">
            <Leaf size={32} className="text-primary-600" />
          </div>
          <h1 className="text-2xl font-bold text-stone-900">Connexion</h1>
        </div>

        {forgotMode ? (
          resetSent ? (
            <div className="text-center py-8 animate-fade-in">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail size={32} className="text-primary-600" />
              </div>
              <h2 className="text-xl font-semibold text-stone-900 mb-2">Email envoyé</h2>
              <p className="text-stone-600 mb-6">
                Si un compte existe avec cette adresse, vous recevrez un lien de réinitialisation.
              </p>
              <button
                onClick={() => { setForgotMode(false); setResetSent(false); setError(''); }}
                className="text-primary-600 font-medium hover:text-primary-700"
              >
                Retour à la connexion
              </button>
            </div>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-6 animate-fade-in">
              {error && (
                <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl text-lg">
                  {error}
                </div>
              )}

              <p className="text-stone-600 text-center">
                Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
              </p>

              <div>
                <label htmlFor="email" className="label">Adresse email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input"
                  placeholder="exemple@email.fr"
                  required
                  autoComplete="email"
                />
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full text-xl">
                {loading ? (
                  <span className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></span>
                ) : (
                  'Envoyer le lien'
                )}
              </button>

              <button
                type="button"
                onClick={() => { setForgotMode(false); setError(''); }}
                className="w-full text-center text-primary-600 font-medium hover:text-primary-700"
              >
                Retour à la connexion
              </button>
            </form>
          )
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl text-lg">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="label">Adresse email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="exemple@email.fr"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="password" className="label">Mot de passe</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pr-14"
                  placeholder="Votre mot de passe"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-700 p-1"
                >
                  {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
                </button>
              </div>
              <button
                type="button"
                onClick={() => { setForgotMode(true); setError(''); }}
                className="mt-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                Mot de passe oublié ?
              </button>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full text-xl">
              {loading ? (
                <span className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></span>
              ) : (
                'Se connecter'
              )}
            </button>
          </form>
        )}

        <div className="mt-8 text-center">
          <p className="text-lg text-stone-600">
            Pas encore de compte ?
          </p>
          <Link
            to="/decouvrir-app"
            className="text-xl font-medium text-primary-600 hover:text-primary-700 mt-2 inline-block"
          >
            Découvrir l'application
          </Link>
        </div>

        <FooterLinks />
      </div>
    </div>
  );
}
