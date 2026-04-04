import { FooterLinks } from './FooterLinks';

export function HomePageFooter() {
  return (
    <div className="px-4 pt-2 pb-8">
      <div className="max-w-3xl mx-auto">
        <div className="border-t border-stone-200 pt-8 mb-8">
          <h2 className="text-lg font-bold text-stone-800 text-center mb-4">
            Donnez, échangez, prêtez et vendez entre voisins
          </h2>
          <p className="text-sm text-stone-500 leading-relaxed text-center mb-6">
            <strong className="text-stone-600">Voisinage</strong> connecte les habitants d'un même quartier. Tout se passe près de chez vous.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { title: 'Donner', text: 'Offrez ce dont vous n\'avez plus l\'usage. Un geste simple contre le gaspillage.' },
              { title: 'Échanger', text: 'Troquez biens et services avec vos voisins. Malin et convivial.' },
              { title: 'Prêter', text: 'Partagez outils, matériel et équipements en toute confiance.' },
              { title: 'Vendre', text: 'Prix justes, zéro frais d\'envoi, en main propre entre voisins.' },
            ].map(item => (
              <div key={item.title} className="bg-white rounded-2xl border border-stone-200 p-4">
                <h3 className="text-sm font-semibold text-stone-800 mb-1">{item.title}</h3>
                <p className="text-xs text-stone-400 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        <FooterLinks />
      </div>
    </div>
  );
}
