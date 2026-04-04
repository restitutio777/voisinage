import { SeoLandingPage } from './SeoLandingPage';

export function EchangeServicesPage() {
  return (
    <SeoLandingPage
      pageTitle="Échange de services entre voisins"
      metaTitle="Échange de services et troc entre voisins — sans argent | Voisinage.app"
      metaDescription="Échangez des services et des objets entre voisins. Bricolage contre cours de cuisine, confiture contre coup de main. Le troc local, sans argent, sans intermédiaire."
      canonicalPath="/echange-services-voisins"
      h1="Échangez services et objets avec vos voisins — sans argent"
      subtitle="Vous savez bricoler ? Votre voisine sait cuisiner ? Le troc entre voisins existe depuis toujours. Voisinage le rend simple."
      sections={[
        {
          title: 'Le troc entre voisins : l\'économie sans argent',
          text: 'Quand le pouvoir d\'achat baisse, l\'échange de services prend tout son sens. Sur Voisinage, publiez ce que vous proposez et ce que vous cherchez. L\'algorithme de matching vous connecte avec les voisins qui ont besoin de vous — et dont vous avez besoin.',
        },
        {
          title: 'Comment échanger entre particuliers ?',
          text: 'Créez une annonce d\'échange : décrivez ce que vous offrez (un service, un objet, un savoir-faire) et ce que vous cherchez en retour. Vos voisins compatibles apparaissent automatiquement. Vous négociez directement par messagerie.',
        },
        {
          title: 'Exemples d\'échanges entre voisins',
          text: 'Cours de guitare contre aide au déménagement. Surplus de tomates du jardin contre pot de confiture maison. Garde de chat pendant les vacances contre arrosage des plantes. Retouche de vêtements contre aide informatique. Les possibilités sont infinies quand on connaît ses voisins.',
        },
      ]}
      faqs={[
        {
          question: 'Comment fonctionne l\'échange sur Voisinage ?',
          answer: 'Publiez ce que vous offrez et ce que vous cherchez. Voisinage trouve automatiquement les voisins compatibles. Vous échangez directement, sans argent et sans intermédiaire.',
        },
        {
          question: 'Peut-on échanger des services en plus des objets ?',
          answer: 'Oui, absolument. Cours particuliers, aide au bricolage, garde d\'animaux, covoiturage, cuisine — tout service peut être échangé. C\'est le principe du troc appliqué aux compétences.',
        },
        {
          question: 'Comment s\'assurer que l\'échange est équitable ?',
          answer: 'L\'échange repose sur l\'accord mutuel entre voisins. Il n\'y a pas de système de points — vous convenez ensemble de ce qui vous semble juste. La proximité et la confiance locale facilitent les choses.',
        },
        {
          question: 'Faut-il déclarer les échanges entre particuliers ?',
          answer: 'Les échanges de services occasionnels entre particuliers dans un cadre d\'entraide de voisinage ne sont généralement pas soumis à déclaration. Pour des activités régulières ou professionnelles, renseignez-vous auprès de l\'administration.',
        },
      ]}
      ctaTitle="Vous avez quelque chose à offrir"
      ctaText="Tout le monde a un talent, un objet ou du temps. Échangez-le avec vos voisins."
    />
  );
}
