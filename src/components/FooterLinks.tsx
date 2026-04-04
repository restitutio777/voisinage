import { Link } from 'react-router-dom';

export function FooterLinks() {
  return (
    <div className="border-t border-stone-200 pt-6 mt-8">
      <div className="flex flex-wrap justify-center gap-x-3 gap-y-2 text-xs mb-4">
        <Link to="/don-objets-gratuit" className="text-stone-400 hover:text-primary-600 transition-colors">
          Don d'objets
        </Link>
        <span className="text-stone-200">|</span>
        <Link to="/pret-outils-entre-voisins" className="text-stone-400 hover:text-primary-600 transition-colors">
          Prêt d'outils
        </Link>
        <span className="text-stone-200">|</span>
        <Link to="/echange-services-voisins" className="text-stone-400 hover:text-primary-600 transition-colors">
          Échange de services
        </Link>
        <span className="text-stone-200">|</span>
        <Link to="/entraide-locale" className="text-stone-400 hover:text-primary-600 transition-colors">
          Entraide locale
        </Link>
      </div>
      <div className="flex flex-wrap justify-center gap-x-3 gap-y-2 text-xs">
        <Link to="/mentions-legales" className="text-stone-400 hover:text-primary-600 transition-colors">
          Mentions légales
        </Link>
        <span className="text-stone-200">|</span>
        <Link to="/conditions-utilisation" className="text-stone-400 hover:text-primary-600 transition-colors">
          CGU
        </Link>
        <span className="text-stone-200">|</span>
        <Link to="/politique-confidentialite" className="text-stone-400 hover:text-primary-600 transition-colors">
          Confidentialité
        </Link>
      </div>
    </div>
  );
}
