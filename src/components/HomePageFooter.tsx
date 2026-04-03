import { FooterLinks } from './FooterLinks';

export function HomePageFooter() {
  return (
    <div className="px-4 py-8 bg-primary-50 border-t border-primary-100">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-primary-900 text-center mb-6">
          Donnez, échangez, prêtez et vendez entre voisins
        </h2>

        <div className="space-y-6 text-primary-800 mb-8">
          <p className="text-base leading-relaxed">
            <strong className="text-primary-900">Voisinage</strong> est la plateforme locale d'entraide qui connecte les habitants d'un même quartier. Donnez ce dont vous n'avez plus besoin, échangez des services, prêtez vos outils ou vendez à petit prix — tout se passe près de chez vous.
          </p>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-primary-900 mb-2">Donner et recevoir</h3>
              <p className="text-sm leading-relaxed">
                Offrez gratuitement les objets dont vous n'avez plus l'usage à vos voisins. Meubles, vêtements, électroménager, livres — tout peut trouver une seconde vie près de chez vous. Un geste simple qui évite le gaspillage et renforce la solidarité locale.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-primary-900 mb-2">Échanger entre voisins</h3>
              <p className="text-sm leading-relaxed">
                Troquez des biens et des services avec les habitants de votre quartier. Vous avez un surplus de confiture maison ? Échangez-le contre un coup de main en bricolage. Le troc entre voisins, c'est malin et convivial.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-primary-900 mb-2">Prêter vos outils</h3>
              <p className="text-sm leading-relaxed">
                Pas besoin d'acheter une perceuse pour un seul trou. Prêtez et empruntez du matériel, des outils de jardinage, des appareils de cuisine ou du matériel de sport. Partagez vos équipements avec vos voisins en toute confiance.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-primary-900 mb-2">Vendre à petit prix</h3>
              <p className="text-sm leading-relaxed">
                Vendez localement à des prix justes et raisonnables. Pas de frais d'envoi, pas d'intermédiaire — vous fixez votre prix et la transaction se fait en main propre, entre voisins de confiance.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-primary-900 mb-2">Rechercher ce qu'il vous faut</h3>
              <p className="text-sm leading-relaxed">
                Publiez une annonce de recherche pour trouver exactement ce dont vous avez besoin. Vos voisins verront votre demande et pourront vous proposer ce qu'ils ont à offrir, échanger ou prêter.
              </p>
            </div>
          </div>
        </div>

        <FooterLinks />
      </div>
    </div>
  );
}
