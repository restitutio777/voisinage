import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, Lock, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { usePageTitle } from '../lib/usePageTitle';

export function ResetPasswordPage() {
  usePageTitle('Nouveau mot de passe');
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError('Impossible de mettre à jour le mot de passe. Veuillez réessayer.');
      setLoading(false);
      return;
    }

    setSuccess(true);
    setTimeout(() => navigate('/'), 3000);
  }

  if (success) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center">
          <div className="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={48} className="text-primary-600" />
          </div>
          <h2 className="text-2xl font-bold text-stone-900 mb-2">
            Mot de passe mis à jour
          </h2>
          <p className="text-lg text-stone-600">
            Vous allez être redirigé vers l'accueil.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 bg-white border-b border-stone-200 px-4 py-3">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-stone-600 hover:text-stone-800"
        >
          <ArrowLeft size={24} />
          <span className="text-lg">Accueil</span>
        </button>
      </header>

      <div className="px-4 py-8">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="bg-primary-100 p-3 rounded-xl">
            <Lock size={32} className="text-primary-600" />
          </div>
          <h1 className="text-2xl font-bold text-stone-900">Nouveau mot de passe</h1>
        </div>

        <p className="text-stone-600 text-center mb-8">
          Choisissez un nouveau mot de passe pour votre compte.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl text-lg">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="password" className="label">Nouveau mot de passe</label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input pr-14"
                placeholder="6 caractères minimum"
                required
                autoComplete="new-password"
                minLength={6}
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

          <div>
            <label htmlFor="confirmPassword" className="label">Confirmer le mot de passe</label>
            <input
              id="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input"
              placeholder="Retapez votre mot de passe"
              required
              autoComplete="new-password"
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full text-xl">
            {loading ? (
              <span className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></span>
            ) : (
              'Mettre à jour'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
