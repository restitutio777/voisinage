import { useEffect } from 'react';

const HOME_TITLE = "Don d'objets, prêt d'outils et échange entre voisins — entraide locale | Voisinage.app";

interface PageMeta {
  title: string;
  description: string;
  canonical: string;
  ogTitle?: string;
  ogDescription?: string;
  ogUrl?: string;
  jsonLd?: Record<string, unknown>;
}

function setMeta(name: string, content: string, attr = 'name') {
  let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
  if (el) {
    el.content = content;
  } else {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    el.content = content;
    document.head.appendChild(el);
  }
}

function setCanonical(href: string) {
  let el = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (el) {
    el.href = href;
  } else {
    el = document.createElement('link');
    el.rel = 'canonical';
    el.href = href;
    document.head.appendChild(el);
  }
}

const JSON_LD_ID = 'page-json-ld';

function setJsonLd(data: Record<string, unknown> | undefined) {
  let el = document.getElementById(JSON_LD_ID) as HTMLScriptElement | null;
  if (data) {
    if (!el) {
      el = document.createElement('script');
      el.id = JSON_LD_ID;
      el.type = 'application/ld+json';
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(data);
  } else if (el) {
    el.remove();
  }
}

// Snapshot defaults on first load so we can restore them on unmount
const defaults = {
  title: HOME_TITLE,
  description: document.querySelector('meta[name="description"]')?.getAttribute('content') ?? '',
  canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? 'https://voisinage.app/',
  ogTitle: document.querySelector('meta[property="og:title"]')?.getAttribute('content') ?? '',
  ogDescription: document.querySelector('meta[property="og:description"]')?.getAttribute('content') ?? '',
  ogUrl: document.querySelector('meta[property="og:url"]')?.getAttribute('content') ?? '',
  twitterTitle: document.querySelector('meta[name="twitter:title"]')?.getAttribute('content') ?? '',
  twitterDescription: document.querySelector('meta[name="twitter:description"]')?.getAttribute('content') ?? '',
};

export function usePageMeta(meta: PageMeta) {
  useEffect(() => {
    document.title = meta.title;
    setMeta('description', meta.description);
    setCanonical(meta.canonical);
    setMeta('og:title', meta.ogTitle ?? meta.title, 'property');
    setMeta('og:description', meta.ogDescription ?? meta.description, 'property');
    setMeta('og:url', meta.ogUrl ?? meta.canonical, 'property');
    setMeta('twitter:title', meta.ogTitle ?? meta.title);
    setMeta('twitter:description', meta.ogDescription ?? meta.description);
    setJsonLd(meta.jsonLd);

    return () => {
      document.title = defaults.title;
      setMeta('description', defaults.description);
      setCanonical(defaults.canonical);
      setMeta('og:title', defaults.ogTitle, 'property');
      setMeta('og:description', defaults.ogDescription, 'property');
      setMeta('og:url', defaults.ogUrl, 'property');
      setMeta('twitter:title', defaults.twitterTitle);
      setMeta('twitter:description', defaults.twitterDescription);
      setJsonLd(undefined);
    };
  }, [meta.title, meta.description, meta.canonical, meta.ogTitle, meta.ogDescription, meta.ogUrl, meta.jsonLd]);
}
