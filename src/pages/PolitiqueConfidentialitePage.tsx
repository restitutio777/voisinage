import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Database, Clock, UserCheck, Cookie, Mail } from 'lucide-react';
import { usePageTitle } from '../lib/usePageTitle';
import { FooterLinks } from '../components/FooterLinks';

export function PolitiqueConfidentialitePage() {
  usePageTitle('Politique de confidentialite');
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
        <h1 className="text-2xl font-bold text-stone-900 mb-2">Politique de confidentialite</h1>
        <p className="text-stone-500 mb-8">Derniere mise a jour : 6 fevrier 2026</p>

        <section className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-primary-100 p-2 rounded-lg">
              <Shield size={20} className="text-primary-600" />
            </div>
            <h2 className="text-xl font-semibold text-stone-900">Responsable du traitement</h2>
          </div>
          <div className="bg-stone-50 rounded-xl p-4 space-y-2">
            <p className="text-stone-700"><strong className="text-stone-900">Responsable :</strong> Philippe Ramakers</p>
            <p className="text-stone-700"><strong className="text-stone-900">Adresse :</strong> 60 Rue Francois Ier, 75008 Paris, France</p>
            <p className="text-stone-700"><strong className="text-stone-900">Email :</strong>{' '}
              <a href="mailto:info@image-intuitive.fr" className="text-primary-600 hover:text-primary-700 underline">
                info@image-intuitive.fr
              </a>
            </p>
          </div>
        </section>

        <section className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-primary-100 p-2 rounded-lg">
              <Database size={20} className="text-primary-600" />
            </div>
            <h2 className="text-xl font-semibold text-stone-900">Donnees collectees</h2>
          </div>
          <p className="text-stone-700 mb-3">
            Dans le cadre de l'utilisation de Voisinage, nous collectons les donnees suivantes :
          </p>
          <ul className="space-y-2 text-stone-700">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2.5 shrink-0" />
              <span><strong className="text-stone-900">Adresse email</strong> : pour la creation et la gestion de votre compte</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2.5 shrink-0" />
              <span><strong className="text-stone-900">Code postal</strong> : pour afficher les annonces a proximite</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2.5 shrink-0" />
              <span><strong className="text-stone-900">Nom d'utilisateur et biographie</strong> : informations de profil publiques (optionnel)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2.5 shrink-0" />
              <span><strong className="text-stone-900">Messages</strong> : echanges entre utilisateurs via la messagerie interne</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2.5 shrink-0" />
              <span><strong className="text-stone-900">Annonces</strong> : contenu, photos et informations des annonces publiees</span>
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-primary-100 p-2 rounded-lg">
              <Shield size={20} className="text-primary-600" />
            </div>
            <h2 className="text-xl font-semibold text-stone-900">Base legale du traitement</h2>
          </div>
          <div className="space-y-3 text-stone-700 leading-relaxed">
            <p>Le traitement de vos donnees personnelles repose sur les bases legales suivantes :</p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2.5 shrink-0" />
                <span><strong className="text-stone-900">Consentement</strong> : lors de la creation de votre compte et l'acceptation des conditions d'utilisation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2.5 shrink-0" />
                <span><strong className="text-stone-900">Execution du contrat</strong> : traitement necessaire a la fourniture du service (mise en relation, messagerie)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2.5 shrink-0" />
                <span><strong className="text-stone-900">Interet legitime</strong> : amelioration du service, prevention des abus et securite de la plateforme</span>
              </li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-primary-100 p-2 rounded-lg">
              <Clock size={20} className="text-primary-600" />
            </div>
            <h2 className="text-xl font-semibold text-stone-900">Duree de conservation</h2>
          </div>
          <div className="space-y-3 text-stone-700 leading-relaxed">
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2.5 shrink-0" />
                <span><strong className="text-stone-900">Donnees de compte</strong> : conservees tant que le compte est actif, puis supprimees dans un delai de 30 jours apres la suppression du compte</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2.5 shrink-0" />
                <span><strong className="text-stone-900">Messages</strong> : conserves 12 mois apres le dernier echange</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2.5 shrink-0" />
                <span><strong className="text-stone-900">Annonces</strong> : conservees 6 mois apres expiration</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2.5 shrink-0" />
                <span><strong className="text-stone-900">Donnees analytiques</strong> : anonymisees apres 24 mois</span>
              </li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-primary-100 p-2 rounded-lg">
              <UserCheck size={20} className="text-primary-600" />
            </div>
            <h2 className="text-xl font-semibold text-stone-900">Vos droits (RGPD)</h2>
          </div>
          <p className="text-stone-700 mb-3">
            Conformement au Reglement General sur la Protection des Donnees (RGPD), vous disposez des droits suivants :
          </p>
          <div className="space-y-2">
            {[
              { title: 'Droit d\'acces', desc: 'obtenir une copie de vos donnees personnelles' },
              { title: 'Droit de rectification', desc: 'corriger vos donnees inexactes ou incompletes' },
              { title: 'Droit a l\'effacement', desc: 'demander la suppression de vos donnees' },
              { title: 'Droit a la portabilite', desc: 'recevoir vos donnees dans un format structure et lisible' },
              { title: 'Droit d\'opposition', desc: 'vous opposer au traitement de vos donnees' },
              { title: 'Droit a la limitation', desc: 'demander la limitation du traitement de vos donnees' },
            ].map((right) => (
              <div key={right.title} className="bg-stone-50 rounded-xl p-3 flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2.5 shrink-0" />
                <p className="text-stone-700">
                  <strong className="text-stone-900">{right.title}</strong> : {right.desc}
                </p>
              </div>
            ))}
          </div>
          <p className="text-stone-700 mt-4 leading-relaxed">
            Pour exercer vos droits, contactez-nous a{' '}
            <a href="mailto:info@image-intuitive.fr" className="text-primary-600 hover:text-primary-700 underline">
              info@image-intuitive.fr
            </a>.
            Vous disposez egalement du droit d'introduire une reclamation aupres de la CNIL (Commission
            Nationale de l'Informatique et des Libertes).
          </p>
        </section>

        <section className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-primary-100 p-2 rounded-lg">
              <Cookie size={20} className="text-primary-600" />
            </div>
            <h2 className="text-xl font-semibold text-stone-900">Cookies</h2>
          </div>
          <div className="space-y-3 text-stone-700 leading-relaxed">
            <p>
              Voisinage utilise uniquement des cookies strictement necessaires au fonctionnement du service :
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2.5 shrink-0" />
                <span><strong className="text-stone-900">Cookies d'authentification</strong> : pour maintenir votre session connectee</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2.5 shrink-0" />
                <span><strong className="text-stone-900">Cookies de preferences</strong> : pour sauvegarder vos parametres de notification</span>
              </li>
            </ul>
            <p>
              Aucun cookie publicitaire ou de tracking tiers n'est utilise.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-primary-100 p-2 rounded-lg">
              <Mail size={20} className="text-primary-600" />
            </div>
            <h2 className="text-xl font-semibold text-stone-900">Contact</h2>
          </div>
          <p className="text-stone-700 leading-relaxed">
            Pour toute question relative a la protection de vos donnees personnelles, vous pouvez nous
            contacter a l'adresse{' '}
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
