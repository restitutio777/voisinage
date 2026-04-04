import { SeoLandingPage } from './SeoLandingPage';

export function DonObjetsPage() {
  return (
    <SeoLandingPage
      pageTitle="Don d'objets gratuit entre voisins"
      metaTitle="Don d'objets gratuit entre voisins — donner au lieu de jeter | Voisinage.app"
      metaDescription="Donnez vos objets gratuitement à vos voisins. Meubles, vêtements, électroménager — tout peut trouver une seconde vie près de chez vous. Sans frais, sans envoi, en main propre."
      canonicalPath="/don-objets-gratuit"
      h1="Donnez vos objets gratuitement à vos voisins"
      subtitle="Tout coûte plus cher. Plutôt que jeter, donnez à quelqu'un qui en a besoin — juste à côté de chez vous. Zéro frais, zéro envoi, zéro gaspillage."
      sections={[
        {
          title: 'Donner au lieu de jeter : un geste simple contre l\'inflation',
          text: 'Chaque année, des millions d\'objets en bon état finissent à la déchetterie. Pendant ce temps, vos voisins cherchent exactement ce dont vous n\'avez plus besoin. Sur Voisinage, publiez une annonce en 30 secondes et donnez directement, en main propre, sans intermédiaire ni frais de port.',
        },
        {
          title: 'Don entre particuliers : comment ça marche ?',
          text: 'Prenez une photo, décrivez votre objet, choisissez "Donner". Vos voisins reçoivent une notification et vous contactent par messagerie. Vous convenez d\'un lieu et d\'un horaire de retrait. C\'est tout. Pas de compte premium, pas de commission — Voisinage est gratuit.',
        },
        {
          title: 'Ce que vos voisins donnent le plus',
          text: 'Meubles, vêtements, jouets, petit électroménager, livres, matériel de bricolage, plantes, nourriture en surplus. Tout ce qui peut encore servir a sa place sur Voisinage. Chaque don évite un déchet et crée un lien de confiance dans votre quartier.',
        },
      ]}
      faqs={[
        {
          question: 'Est-ce vraiment gratuit de donner sur Voisinage ?',
          answer: 'Oui, totalement. Pas de frais cachés, pas d\'abonnement. L\'inscription, la publication d\'annonces et la messagerie sont 100% gratuites. Voisinage est un projet communautaire.',
        },
        {
          question: 'Comment donner un objet à un voisin ?',
          answer: 'Créez un compte, cliquez sur "Proposer", prenez une photo de votre objet, sélectionnez "Donner" et publiez. Vos voisins proches verront votre annonce et pourront vous contacter directement.',
        },
        {
          question: 'Quelle est la différence avec Le Bon Coin ou Geev ?',
          answer: 'Voisinage est 100% local — pas d\'envoi postal, pas de marketplace nationale. Tout se passe dans votre quartier, entre voisins de confiance. Et contrairement aux grandes plateformes, il n\'y a aucune publicité.',
        },
        {
          question: 'Quels types d\'objets peut-on donner ?',
          answer: 'Tout ce qui est en état d\'être utilisé : meubles, vêtements, électroménager, jouets, livres, outils, plantes, nourriture non périmée. Les objets dangereux, illégaux ou en mauvais état ne sont pas acceptés.',
        },
      ]}
      ctaTitle="Un objet à donner ?"
      ctaText="Publiez votre annonce en 30 secondes. Votre voisin vous remerciera."
    />
  );
}
