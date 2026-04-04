import { SeoLandingPage } from './SeoLandingPage';

export function EntraideLocalePage() {
  return (
    <SeoLandingPage
      pageTitle="Entraide locale entre voisins"
      metaTitle="Entraide locale et solidarité de quartier — réseau de voisins | Voisinage.app"
      metaDescription="Rejoignez le réseau d'entraide de votre quartier. Donnez, prêtez, échangez et vendez entre voisins. Solidarité locale, gratuite, par code postal. L'alternative concrète à l'isolement."
      canonicalPath="/entraide-locale"
      h1="L'entraide locale : la réponse concrète à la crise"
      subtitle="Inflation, isolement, perte de lien social — la solution n'est pas en ligne, elle est à côté de chez vous. Vos voisins ont ce qu'il vous faut. Et vous avez ce qu'il leur faut."
      sections={[
        {
          title: 'Pourquoi l\'entraide de quartier est urgente',
          text: 'En France, un habitant sur trois ne connaît pas ses voisins. Le coût de la vie augmente chaque mois. Les objets s\'accumulent dans les placards pendant que d\'autres en manquent. Voisinage inverse cette logique : chaque quartier devient un réseau de solidarité où l\'on donne, prête, échange et s\'entraide — sans attendre que ça vienne d\'en haut.',
        },
        {
          title: 'Un réseau de voisins, pas un réseau social',
          text: 'Pas de likes, pas de fil d\'actualité, pas de publicité. Voisinage connecte les habitants d\'un même quartier autour d\'actions concrètes : un meuble à donner, un outil à prêter, un service à échanger. Chaque interaction crée un lien réel entre des gens qui vivent côte à côte.',
        },
        {
          title: 'Comment rejoindre l\'entraide de votre quartier',
          text: 'Entrez votre code postal. Découvrez ce que vos voisins proposent. Publiez votre première annonce. C\'est tout. Pas de validation, pas d\'attente — vous faites partie du réseau dès la première minute. Plus vous êtes nombreux, plus le quartier s\'entraide.',
        },
      ]}
      faqs={[
        {
          question: 'Voisinage est-il disponible dans ma ville ?',
          answer: 'Voisinage fonctionne partout en France, par code postal. Si personne n\'a encore publié dans votre quartier, soyez le premier — c\'est comme ça que ça commence.',
        },
        {
          question: 'En quoi Voisinage est différent de Nextdoor ou Facebook ?',
          answer: 'Voisinage est centré sur l\'action, pas la discussion. Pas de fils d\'actualité, pas de commentaires, pas de pub. Chaque annonce est un geste concret : donner, prêter, échanger ou vendre. Et la plateforme est entièrement gratuite, sans modèle publicitaire.',
        },
        {
          question: 'Comment Voisinage se finance-t-il ?',
          answer: 'Voisinage est un projet communautaire offert à la communauté. Il n\'y a pas de publicité, pas de données revendues, pas d\'abonnement premium. Le projet existe parce que l\'entraide locale mérite un outil simple et gratuit.',
        },
        {
          question: 'Est-ce sécurisé ?',
          answer: 'Les échanges se font entre voisins identifiés par code postal. La messagerie intégrée vous permet de communiquer sans partager vos coordonnées. Vous pouvez signaler tout comportement inapproprié. Mais la meilleure sécurité, c\'est la proximité — on se comporte mieux avec ses voisins.',
        },
      ]}
      ctaTitle="Votre quartier n'attend que vous"
      ctaText="Chaque annonce publiée renforce le réseau. Soyez celui qui lance le mouvement dans votre quartier."
    />
  );
}
