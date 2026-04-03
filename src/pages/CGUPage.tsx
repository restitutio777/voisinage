import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, UserPlus, ShoppingBag, AlertTriangle, Shield, Scale, RefreshCw } from 'lucide-react';
import { usePageTitle } from '../lib/usePageTitle';
import { FooterLinks } from '../components/FooterLinks';

export function CGUPage() {
  usePageTitle('Conditions generales d\'utilisation');
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
        <h1 className="text-2xl font-bold text-stone-900 mb-2">Conditions generales d'utilisation</h1>
        <p className="text-stone-500 mb-8">Derniere mise a jour : 6 fevrier 2026</p>

        <section className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-primary-100 p-2 rounded-lg">
              <FileText size={20} className="text-primary-600" />
            </div>
            <h2 className="text-xl font-semibold text-stone-900">1. Objet et champ d'application</h2>
          </div>
          <div className="space-y-3 text-stone-700 leading-relaxed">
            <p>
              Les presentes conditions generales d'utilisation (ci-apres "CGU") regissent l'acces et
              l'utilisation de la plateforme Voisinage (ci-apres "le Service"), editee par Philippe
              Ramakers.
            </p>
            <p>
              Voisinage est une plateforme gratuite de mise en relation entre particuliers permettant
              l'entraide entre voisins pour le don, l'echange et la vente de biens et services. L'inscription et
              l'utilisation du Service impliquent l'acceptation pleine et entiere des presentes CGU.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-primary-100 p-2 rounded-lg">
              <UserPlus size={20} className="text-primary-600" />
            </div>
            <h2 className="text-xl font-semibold text-stone-900">2. Inscription et compte utilisateur</h2>
          </div>
          <div className="space-y-3 text-stone-700 leading-relaxed">
            <p>
              L'utilisation du Service necessite la creation d'un compte avec une adresse email valide et
              un mot de passe securise. L'utilisateur s'engage a fournir des informations exactes et a
              maintenir la confidentialite de ses identifiants.
            </p>
            <p>
              L'utilisateur est entierement responsable de toute activite realisee sous son compte. En cas
              d'utilisation non autorisee, l'utilisateur doit en informer immediatement l'editeur a
              l'adresse{' '}
              <a href="mailto:info@image-intuitive.fr" className="text-primary-600 hover:text-primary-700 underline">
                info@image-intuitive.fr
              </a>.
            </p>
            <p>
              L'utilisateur doit etre age d'au moins 18 ans ou disposer de l'autorisation d'un
              representant legal pour utiliser le Service.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-primary-100 p-2 rounded-lg">
              <ShoppingBag size={20} className="text-primary-600" />
            </div>
            <h2 className="text-xl font-semibold text-stone-900">3. Regles relatives aux annonces</h2>
          </div>
          <div className="space-y-3 text-stone-700 leading-relaxed">
            <p>Les annonces publiees sur Voisinage doivent respecter les regles suivantes :</p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2.5 shrink-0" />
                <span>Les biens et services proposes doivent s'inscrire dans un cadre d'entraide entre particuliers</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2.5 shrink-0" />
                <span>Les annonces doivent decrire fidelement ce qui est propose (nature, quantite, etat)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2.5 shrink-0" />
                <span>Les prix de vente doivent etre raisonnables et ne constituent pas une activite commerciale</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2.5 shrink-0" />
                <span>Les photos doivent etre representatives de ce qui est reellement propose</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2.5 shrink-0" />
                <span>Toute annonce doit respecter la reglementation francaise en vigueur</span>
              </li>
            </ul>
            <p>
              L'editeur se reserve le droit de supprimer toute annonce ne respectant pas ces regles, sans
              preavis ni indemnite.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-primary-100 p-2 rounded-lg">
              <AlertTriangle size={20} className="text-primary-600" />
            </div>
            <h2 className="text-xl font-semibold text-stone-900">4. Comportements interdits</h2>
          </div>
          <div className="space-y-3 text-stone-700 leading-relaxed">
            <p>Les utilisateurs s'engagent a ne pas :</p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-vendre mt-2.5 shrink-0" />
                <span>Publier des contenus illegaux, diffamatoires, injurieux ou contraires aux bonnes moeurs</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-vendre mt-2.5 shrink-0" />
                <span>Utiliser le Service a des fins commerciales ou professionnelles</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-vendre mt-2.5 shrink-0" />
                <span>Creer plusieurs comptes ou usurper l'identite d'un tiers</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-vendre mt-2.5 shrink-0" />
                <span>Proposer des biens ou services de maniere frauduleuse</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-vendre mt-2.5 shrink-0" />
                <span>Harceler ou menacer d'autres utilisateurs via la messagerie</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-vendre mt-2.5 shrink-0" />
                <span>Tenter de contourner les mesures de securite de la plateforme</span>
              </li>
            </ul>
            <p>
              Tout manquement a ces regles pourra entrainer la suspension ou la suppression definitive du
              compte de l'utilisateur.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-primary-100 p-2 rounded-lg">
              <Shield size={20} className="text-primary-600" />
            </div>
            <h2 className="text-xl font-semibold text-stone-900">5. Responsabilite</h2>
          </div>
          <div className="space-y-3 text-stone-700 leading-relaxed">
            <p>
              Voisinage agit en tant que simple intermediaire et ne saurait etre tenu responsable :
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2.5 shrink-0" />
                <span>De la qualite ou de la conformite des biens et services proposes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2.5 shrink-0" />
                <span>Des litiges pouvant survenir entre utilisateurs</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2.5 shrink-0" />
                <span>Des interruptions de service pour maintenance ou raisons techniques</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2.5 shrink-0" />
                <span>Des consequences resultant de l'utilisation des informations publiees</span>
              </li>
            </ul>
            <p>
              Les utilisateurs sont seuls responsables du respect de la reglementation applicable aux
              echanges entre particuliers.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-primary-100 p-2 rounded-lg">
              <RefreshCw size={20} className="text-primary-600" />
            </div>
            <h2 className="text-xl font-semibold text-stone-900">6. Modification des CGU</h2>
          </div>
          <p className="text-stone-700 leading-relaxed">
            L'editeur se reserve le droit de modifier les presentes CGU a tout moment. Les utilisateurs
            seront informes des modifications par une notification sur la plateforme. La poursuite de
            l'utilisation du Service apres modification vaut acceptation des nouvelles conditions.
          </p>
        </section>

        <section className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-primary-100 p-2 rounded-lg">
              <Scale size={20} className="text-primary-600" />
            </div>
            <h2 className="text-xl font-semibold text-stone-900">7. Droit applicable et juridiction</h2>
          </div>
          <p className="text-stone-700 leading-relaxed">
            Les presentes CGU sont regies par le droit francais. Tout litige relatif a l'interpretation
            ou a l'execution des presentes CGU sera soumis a la competence exclusive des tribunaux de Paris,
            sauf disposition legale contraire.
          </p>
        </section>

        <section className="mb-8">
          <div className="bg-primary-50 border-2 border-primary-200 rounded-xl p-4">
            <p className="text-primary-800 leading-relaxed">
              Pour toute question concernant les presentes CGU, vous pouvez nous contacter a l'adresse{' '}
              <a href="mailto:info@image-intuitive.fr" className="text-primary-600 hover:text-primary-700 underline font-medium">
                info@image-intuitive.fr
              </a>.
            </p>
          </div>
        </section>

        <FooterLinks />
      </div>
    </div>
  );
}
