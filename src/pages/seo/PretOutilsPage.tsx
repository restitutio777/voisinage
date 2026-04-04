import { SeoLandingPage } from './SeoLandingPage';

export function PretOutilsPage() {
  return (
    <SeoLandingPage
      pageTitle="Prêt d'outils entre voisins"
      metaTitle="Prêt d'outils entre voisins — empruntez au lieu d'acheter | Voisinage.app"
      metaDescription="Empruntez une perceuse, un nettoyeur haute pression ou une tondeuse à vos voisins. Partage de matériel gratuit, local, en confiance. Plus besoin d'acheter ce qu'on utilise une fois."
      canonicalPath="/pret-outils-entre-voisins"
      h1="Empruntez les outils de vos voisins au lieu d'acheter"
      subtitle="Une perceuse sert en moyenne 12 minutes dans toute sa vie. Pourquoi en acheter une quand votre voisin en a une dans son garage ?"
      sections={[
        {
          title: 'Partage de matériel : la fin de la surconsommation',
          text: 'Nettoyeur haute pression, débroussailleuse, scie sauteuse, escabeau, remorque — la plupart des outils dorment 99% du temps. Sur Voisinage, vos voisins prêtent ce qu\'ils n\'utilisent pas. Vous empruntez gratuitement, sans location, sans plateforme intermédiaire.',
        },
        {
          title: 'Prêter entre voisins : comment ça fonctionne ?',
          text: 'Publiez votre outil en choisissant "Prêter". Vos voisins le trouvent par code postal et vous contactent. Vous convenez des modalités (durée, retrait). Le tout repose sur la confiance — celle qui existe naturellement entre voisins d\'un même quartier.',
        },
        {
          title: 'Pourquoi le prêt local change tout',
          text: 'Acheter un outil pour un seul usage, c\'est du gaspillage d\'argent et de ressources. Le prêt entre voisins réduit vos dépenses, libère de l\'espace chez vous, et crée des liens concrets avec les gens autour de vous. C\'est l\'économie circulaire la plus simple qui existe.',
        },
      ]}
      faqs={[
        {
          question: 'Comment emprunter un outil à un voisin ?',
          answer: 'Recherchez par code postal sur Voisinage. Filtrez par "Prêter" pour voir les outils disponibles. Contactez le voisin via la messagerie intégrée et convenez du prêt. C\'est gratuit et direct.',
        },
        {
          question: 'Et si l\'outil est abîmé pendant le prêt ?',
          answer: 'Le prêt repose sur la confiance entre voisins. Nous recommandons de convenir des conditions avant le prêt (durée, état). En cas de problème, la messagerie vous permet de communiquer directement.',
        },
        {
          question: 'Quels outils peut-on prêter sur Voisinage ?',
          answer: 'Tout matériel utile : perceuse, tondeuse, nettoyeur haute pression, escabeau, remorque, outils de jardin, matériel de cuisine, équipement sportif, appareils photo... Si ça dort chez vous, ça peut servir à côté.',
        },
        {
          question: 'C\'est gratuit ? Pas de commission ?',
          answer: 'Le prêt sur Voisinage est entièrement gratuit. Pas de commission, pas d\'abonnement, pas de frais. La plateforme est un projet communautaire, offert à la communauté.',
        },
      ]}
      ctaTitle="Un outil dans votre garage ?"
      ctaText="Proposez-le à vos voisins. Vous leur évitez un achat inutile."
    />
  );
}
