/**
 * Post-build script: generates per-route HTML files with correct meta tags.
 * Vercel serves static files before applying the SPA rewrite, so each route
 * gets its own index.html with the right <title>, description, canonical, and
 * Open Graph tags — no Puppeteer required.
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = resolve(__dirname, '..', 'dist');
const BASE_URL = 'https://voisinage.app';

// Read the built index.html as template
const template = readFileSync(resolve(DIST, 'index.html'), 'utf-8');

// Default meta values (from index.html / homepage)
const DEFAULT_TITLE = "Don d'objets, prêt d'outils et échange de services entre voisins | Voisinage.app";
const DEFAULT_DESC = "Inflation, isolement, surconsommation — la réponse est locale. Donnez, prêtez, échangez ou vendez entre voisins près de chez vous. Gratuit, sans intermédiaire, par code postal.";

/**
 * All public indexable routes with their meta data.
 * Homepage ("/") already has correct meta in index.html — skip it.
 */
const routes = [
  {
    path: '/echanger',
    title: "Échanger entre voisins — troc d'objets et de services | Voisinage.app",
    description: "Proposez ou cherchez un échange entre voisins. Troc d'objets, services, coups de main — sans argent, par code postal. Trouvez des voisins compatibles près de chez vous.",
  },
  {
    path: '/creer',
    title: "Publier une annonce gratuite entre voisins | Voisinage.app",
    description: "Créez une annonce en 30 secondes. Donnez, prêtez, échangez ou vendez un objet ou un service à vos voisins. Gratuit, local, sans intermédiaire.",
  },
  {
    path: '/decouvrir-app',
    title: "Découvrir Voisinage.app — entraide locale entre voisins | Voisinage.app",
    description: "Découvrez comment Voisinage.app vous connecte à vos voisins. Don, prêt, échange, vente — tout se passe par code postal, gratuitement.",
  },
  // SEO landing pages
  {
    path: '/don-objets-gratuit',
    title: "Don d'objets gratuit entre voisins — donner au lieu de jeter | Voisinage.app",
    description: "Donnez vos objets gratuitement à vos voisins. Meubles, vêtements, électroménager — tout peut trouver une seconde vie près de chez vous. Sans frais, sans envoi, en main propre.",
  },
  {
    path: '/pret-outils-entre-voisins',
    title: "Prêt d'outils entre voisins — empruntez au lieu d'acheter | Voisinage.app",
    description: "Empruntez une perceuse, un nettoyeur haute pression ou une tondeuse à vos voisins. Partage de matériel gratuit, local, en confiance. Plus besoin d'acheter ce qu'on utilise une fois.",
  },
  {
    path: '/echange-services-voisins',
    title: "Échange de services et troc entre voisins — sans argent | Voisinage.app",
    description: "Échangez des services et des objets entre voisins. Bricolage contre cours de cuisine, confiture contre coup de main. Le troc local, sans argent, sans intermédiaire.",
  },
  {
    path: '/entraide-locale',
    title: "Entraide locale et solidarité de quartier — réseau de voisins | Voisinage.app",
    description: "Rejoignez le réseau d'entraide de votre quartier. Donnez, prêtez, échangez et vendez entre voisins. Solidarité locale, gratuite, par code postal. L'alternative concrète à l'isolement.",
  },
  // Legal pages
  {
    path: '/mentions-legales',
    title: "Mentions légales | Voisinage.app",
    description: "Mentions légales de Voisinage.app — informations sur l'éditeur, l'hébergeur et les conditions d'utilisation du service d'entraide entre voisins.",
  },
  {
    path: '/conditions-utilisation',
    title: "Conditions générales d'utilisation | Voisinage.app",
    description: "Conditions générales d'utilisation de Voisinage.app — règles d'utilisation du service de don, prêt et échange entre voisins.",
  },
  {
    path: '/politique-confidentialite',
    title: "Politique de confidentialité | Voisinage.app",
    description: "Politique de confidentialité de Voisinage.app — traitement des données personnelles et protection de la vie privée.",
  },
];

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

let count = 0;

for (const route of routes) {
  let html = template;

  // Replace <title>
  html = html.replace(
    /<title>[^<]*<\/title>/,
    `<title>${escapeHtml(route.title)}</title>`
  );

  // Replace meta description
  html = html.replace(
    /<meta name="description" content="[^"]*"/,
    `<meta name="description" content="${escapeHtml(route.description)}"`
  );

  // Replace canonical
  html = html.replace(
    /<link rel="canonical" href="[^"]*"/,
    `<link rel="canonical" href="${BASE_URL}${route.path}"`
  );

  // Replace OG tags
  html = html.replace(
    /<meta property="og:title" content="[^"]*"/,
    `<meta property="og:title" content="${escapeHtml(route.title)}"`
  );
  html = html.replace(
    /<meta property="og:description" content="[^"]*"/,
    `<meta property="og:description" content="${escapeHtml(route.description)}"`
  );
  html = html.replace(
    /<meta property="og:url" content="[^"]*"/,
    `<meta property="og:url" content="${BASE_URL}${route.path}"`
  );

  // Replace Twitter tags
  html = html.replace(
    /<meta name="twitter:title" content="[^"]*"/,
    `<meta name="twitter:title" content="${escapeHtml(route.title)}"`
  );
  html = html.replace(
    /<meta name="twitter:description" content="[^"]*"/,
    `<meta name="twitter:description" content="${escapeHtml(route.description)}"`
  );

  // Write to dist/{route}/index.html
  const outDir = resolve(DIST, route.path.slice(1)); // remove leading /
  mkdirSync(outDir, { recursive: true });
  writeFileSync(resolve(outDir, 'index.html'), html);
  count++;
}

console.log(`Prerendered meta tags for ${count} routes.`);
