import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, CheckCircle, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { usePageTitle } from '../lib/usePageTitle';
import { Logo } from '../components/Logo';
import { FooterLinks } from '../components/FooterLinks';

export function RegisterPage() {
  usePageTitle('Inscription');
  const navigate = useNavigate();
  const location = useLocation();
  const { signUp, updateProfile } = useAuth();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const from = (location.state as { from?: string })?.from || '/';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      setLoading(false);
      return;
    }

    if (postalCode.length !== 5 || !/^\d{5}$/.test(postalCode)) {
      setError('Veuillez entrer un code postal valide (5 chiffres)');
      setLoading(false);
      return;
    }

    const { error: signUpError } = await signUp(email, password);

    if (signUpError) {
      if (signUpError.message.includes('already registered')) {
        setError('Cette adresse email est déjà utilisée');
      } else {
        setError('Une erreur est survenue. Veuillez réessayer.');
      }
      setLoading(false);
      return;
    }

    await updateProfile({ postal_code: postalCode });

    setSuccess(true);
    setLoading(false);

    setTimeout(() => {
      navigate(from, { replace: true });
    }, 2000);
  }

  if (success) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center">
          <div className="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={48} className="text-primary-600" />
          </div>
          <h2 className="text-2xl font-bold text-stone-900 mb-2">
            Bienvenue !
          </h2>
          <p className="text-lg text-stone-600">
            Votre compte a été créé avec succès.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 bg-white border-b border-stone-200 px-4 py-3">
        <button
          onClick={() => step > 1 ? setStep(step - 1) : navigate(-1)}
          className="flex items-center gap-2 text-stone-600 hover:text-stone-800"
        >
          <ArrowLeft size={24} />
          <span className="text-lg">Retour</span>
        </button>
      </header>

      <div className="px-4 py-8">
        <div className="flex items-center justify-center gap-3 mb-6">
          <Logo size={44} />
          <h1 className="text-2xl font-bold text-stone-900">Inscription</h1>
        </div>

        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`w-12 h-2 rounded-full ${
                s <= step ? 'bg-primary-600' : 'bg-stone-200'
              }`}
            />
          ))}
        </div>

        <form onSubmit={step === 3 ? handleSubmit : (e) => { e.preventDefault(); setStep(step + 1); }}>
          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl text-lg mb-6">
              {error}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-stone-800">
                  Étape 1 : Votre email
                </h2>
                <p className="text-stone-600 mt-1">
                  Pour vous connecter à votre compte
                </p>
              </div>

              <div>
                <label htmlFor="email" className="label">
                  Adresse email
                </label>
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

              <button type="submit" className="btn-primary w-full text-xl">
                Continuer
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-stone-800">
                  Étape 2 : Mot de passe
                </h2>
                <p className="text-stone-600 mt-1">
                  Au moins 6 caractères
                </p>
              </div>

              <div>
                <label htmlFor="password" className="label">
                  Mot de passe
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input pr-14"
                    placeholder="Choisissez un mot de passe"
                    required
                    minLength={6}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-700 p-1"
                  >
                    {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn-primary w-full text-xl">
                Continuer
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-stone-800">
                  Étape 3 : Votre localisation
                </h2>
                <p className="text-stone-600 mt-1">
                  Pour trouver des annonces près de chez vous
                </p>
              </div>

              <div>
                <label htmlFor="postalCode" className="label">
                  Code postal
                </label>
                <input
                  id="postalCode"
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                  className="input"
                  placeholder="75001"
                  required
                  maxLength={5}
                  inputMode="numeric"
                  pattern="\d{5}"
                />
              </div>

              <div className="bg-primary-50 border-2 border-primary-200 rounded-xl p-4">
                <p className="text-primary-800 text-sm leading-relaxed mb-3">
                  En créant un compte, vous acceptez les conditions d'utilisation de Voisinage.
                </p>
                <label className="flex items-start gap-3 cursor-pointer group">
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={acceptedTerms}
                    onClick={() => setAcceptedTerms(!acceptedTerms)}
                    className={`mt-0.5 w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-colors ${
                      acceptedTerms
                        ? 'bg-primary-600 border-primary-600'
                        : 'border-stone-300 bg-white group-hover:border-primary-400'
                    }`}
                  >
                    {acceptedTerms && <Check size={16} className="text-white" />}
                  </button>
                  <span className="text-sm text-primary-800 leading-relaxed">
                    J'accepte les{' '}
                    <Link to="/conditions-utilisation" target="_blank" className="text-primary-600 underline font-medium hover:text-primary-700">
                      conditions générales d'utilisation
                    </Link>
                    {' '}et la{' '}
                    <Link to="/politique-confidentialite" target="_blank" className="text-primary-600 underline font-medium hover:text-primary-700">
                      politique de confidentialite
                    </Link>
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading || !acceptedTerms}
                className="btn-primary w-full text-xl"
              >
                {loading ? (
                  <span className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></span>
                ) : (
                  'Créer mon compte'
                )}
              </button>
            </div>
          )}
        </form>

        <div className="mt-8 text-center space-y-3">
          <div>
            <p className="text-lg text-stone-600">
              Déjà un compte ?
            </p>
            <Link
              to="/connexion"
              state={{ from }}
              className="text-xl font-medium text-primary-600 hover:text-primary-700 mt-2 inline-block"
            >
              Se connecter
            </Link>
          </div>
          <div>
            <Link
              to="/decouvrir-app"
              className="text-base font-medium text-stone-500 hover:text-stone-700 inline-block"
            >
              Comment ça marche ?
            </Link>
          </div>
        </div>

        <FooterLinks />
      </div>
    </div>
  );
}
