import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { usePageTitle } from '../lib/usePageTitle';
import { Logo } from '../components/Logo';

export function NotFoundPage() {
  usePageTitle('Page introuvable');
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="flex justify-center mb-6">
          <Logo size={64} />
        </div>
        <h1 className="text-3xl font-bold text-stone-900 mb-2">Page introuvable</h1>
        <p className="text-stone-600 mb-8">
          Cette page n'existe pas ou a ete deplacee.
        </p>
        <Link to="/" className="btn-primary inline-flex items-center gap-2">
          <ArrowLeft size={20} />
          Retour a l'accueil
        </Link>
      </div>
    </div>
  );
}
