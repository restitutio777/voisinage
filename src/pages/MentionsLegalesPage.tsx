import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, Server, Scale, Shield, Mail } from 'lucide-react';
import { usePageMeta } from '../lib/usePageMeta';
import { FooterLinks } from '../components/FooterLinks';

export function MentionsLegalesPage() {
  usePageMeta({
    title: 'Mentions légales | Voisinage.app',
    description: "Mentions légales de Voisinage.app — informations sur l'éditeur, l'hébergeur et les conditions d'utilisation du service d'entraide entre voisins.",
    canonical: 'https://voisinage.app/mentions-legales',
  });
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white pb-24">
      <header className="sticky top-0 z-10 bg-white border-b border-stone-200 px-4 py-3">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-stone-600 hover:text-stone-800"
        >
          <ArrowLeft size={24} />
          <span className="text-lg">Retour</span>
        </button>
      </header>

      <div className="px-4 py-8 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-stone-900 mb-8">Mentions legales</h1>

        <section className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-primary-100 p-2 rounded-lg">
              <Building2 size={20} className="text-primary-600" />
            </div>
            <h2 className="text-xl font-semibold text-stone-900">Editeur du site</h2>
          </div>
          <div className="bg-stone-50 rounded-xl p-4 space-y-2">
            <p className="text-stone-700"><strong className="text-stone-900">Raison sociale :</strong> Philippe Ramakers</p>
            <p className="text-stone-700"><strong className="text-stone-900">Adresse :</strong> 60 Rue Francois Ier, 75008 Paris, France</p>
            <p className="text-stone-700"><strong className="text-stone-900">SIRET :</strong> 90380475500028</p>
            <p className="text-stone-700"><strong className="text-stone-900">TVA :</strong> FR 0J903804755</p>
            <p className="text-stone-700 flex items-center gap-2">
              <Mail size={16} className="text-stone-500" />
              <strong className="text-stone-900">Email :</strong>
              <a href="mailto:info@image-intuitive.fr" className="text-primary-600 hover:text-primary-700 underline">
                info@image-intuitive.fr
              </a>
            </p>
          </div>
        </section>

        <section className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-primary-100 p-2 rounded-lg">
              <Server size={20} className="text-primary-600" />
            </div>
            <h2 className="text-xl font-semibold text-stone-900">Hebergement</h2>
          </div>
          <div className="bg-stone-50 rounded-xl p-4 space-y-2">
            <p className="text-stone-700"><strong className="text-stone-900">Hebergeur :</strong> Supabase Inc.</p>
            <p className="text-stone-700"><strong className="text-stone-900">Adresse :</strong> 970 Toa Payoh North, #07-04, Singapore 318992</p>
          </div>
        </section>

        <section className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-primary-100 p-2 rounded-lg">
              <Scale size={20} className="text-primary-600" />
            </div>
            <h2 className="text-xl font-semibold text-stone-900">Propriete intellectuelle</h2>
          </div>
          <p className="text-stone-700 leading-relaxed">
            L'ensemble du contenu de ce site (textes, images, logos, icones, mise en page) est la propriete
            exclusive de Philippe Ramakers ou de ses partenaires et est protege par les lois francaises et
            internationales relatives a la propriete intellectuelle. Toute reproduction, representation,
            modification, distribution ou redistribution, partielle ou totale, du contenu de ce site est
            interdite sans l'autorisation prealable ecrite de l'editeur.
          </p>
        </section>

        <section className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-primary-100 p-2 rounded-lg">
              <Shield size={20} className="text-primary-600" />
            </div>
            <h2 className="text-xl font-semibold text-stone-900">Limitation de responsabilite</h2>
          </div>
          <div className="space-y-3 text-stone-700 leading-relaxed">
            <p>
              Voisinage est une plateforme de mise en relation entre particuliers pour l'entraide
              entre voisins. L'editeur ne saurait etre tenu responsable des transactions
              effectuees entre utilisateurs, ni de la qualite ou de la conformite des biens et services
              echanges.
            </p>
            <p>
              L'editeur s'efforce de fournir des informations exactes et a jour, mais ne garantit pas
              l'exhaustivite ni l'exactitude des informations presentes sur le site. L'editeur ne pourra etre
              tenu responsable des dommages directs ou indirects resultant de l'utilisation du site.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-primary-100 p-2 rounded-lg">
              <Scale size={20} className="text-primary-600" />
            </div>
            <h2 className="text-xl font-semibold text-stone-900">Droit applicable</h2>
          </div>
          <p className="text-stone-700 leading-relaxed">
            Les presentes mentions legales sont soumises au droit francais. En cas de litige, les tribunaux
            francais seront seuls competents. Pour toute question relative aux presentes mentions, vous pouvez
            nous contacter a l'adresse{' '}
            <a href="mailto:info@image-intuitive.fr" className="text-primary-600 hover:text-primary-700 underline">
              info@image-intuitive.fr
            </a>.
          </p>
        </section>

        <FooterLinks />
      </div>
    </div>
  );
}
