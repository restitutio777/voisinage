import { useEffect } from 'react';

const BASE_TITLE = 'Voisinage.app — Entraide entre voisins';
const HOME_TITLE = 'Don d\'objets, prêt d\'outils et échange entre voisins — entraide locale | Voisinage.app';

export function usePageTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} | Voisinage.app` : HOME_TITLE;
    return () => { document.title = HOME_TITLE; };
  }, [title]);
}
