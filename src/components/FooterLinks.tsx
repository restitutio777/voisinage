import { Link } from 'react-router-dom';

export function FooterLinks() {
  return (
    <div className="border-t border-stone-200 pt-6 mt-8">
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm">
        <Link to="/mentions-legales" className="text-stone-500 hover:text-primary-600 transition-colors">
          Mentions légales
        </Link>
        <span className="text-stone-300">|</span>
        <Link to="/conditions-utilisation" className="text-stone-500 hover:text-primary-600 transition-colors">
          CGU
        </Link>
        <span className="text-stone-300">|</span>
        <Link to="/politique-confidentialite" className="text-stone-500 hover:text-primary-600 transition-colors">
          Confidentialité
        </Link>
      </div>
    </div>
  );
}
