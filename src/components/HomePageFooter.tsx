import { FooterLinks } from './FooterLinks';

export function HomePageFooter() {
  return (
    <div className="px-4 pt-2 pb-8">
      <div className="max-w-3xl mx-auto">
        <div className="border-t border-stone-200 pt-8 mb-8">
          <h2 className="text-lg font-bold text-stone-800 text-center mb-4">
            On n'a pas besoin de plus de choses. On a besoin de plus de liens.
          </h2>
          <p className="text-sm text-stone-500 leading-relaxed text-center mb-6">
            Le pouvoir d'achat baisse, les objets s'accumulent, les voisins ne se connaissent plus. <strong className="text-stone-600">Voisinage</strong> inverse la tendance — quartier par quartier.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { title: 'Donner', text: 'Ce qui dort chez vous peut servir à côté. Moins de gaspillage, plus de solidarité.' },
              { title: 'Échanger', text: 'Troquez un savoir-faire contre un objet. L\'économie de quartier, sans intermédiaire.' },
              { title: 'Prêter', text: 'Une perceuse sert 12 minutes dans sa vie. Partagez-la avec vos voisins.' },
              { title: 'Vendre', text: 'Prix juste, zéro frais, en main propre. L\'argent reste dans le quartier.' },
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
