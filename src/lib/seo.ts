import { useEffect } from "react";

/**
 * useSEO — client-side per-page SEO manager.
 * Updates <title>, meta description/keywords, canonical, robots,
 * Open Graph and Twitter Card tags, and injects JSON-LD structured data.
 * Reverted automatically on unmount so stale tags never leak across pages.
 */

export interface SEOData {
  title: string;
  description: string;
  keywords?: string;
  path?: string;                 // canonical path, defaults to current location
  type?: "website" | "article";
  image?: string;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  noindex?: boolean;
}

const SITE = "https://yasirzayed.com";
const SITE_NAME = "Yasir Zayed";

function setMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

/** Keep one alternate-language link per hreflang value. */
function setAlternate(hreflang: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(
    `link[rel="alternate"][hreflang="${hreflang}"]`,
  );
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "alternate");
    el.setAttribute("hreflang", hreflang);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export function useSEO(seo: SEOData) {
  useEffect(() => {
    const fullTitle = seo.title.includes(SITE_NAME) ? seo.title : `${seo.title} | ${SITE_NAME}`;
    const url = `${SITE}${seo.path ?? window.location.pathname}`;
    const image = seo.image ?? `${SITE}/og-image.png`;

    const prevTitle = document.title;
    document.title = fullTitle;

    const robots = seo.noindex
      ? "noindex, nofollow"
      : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";

    setMeta("name", "description", seo.description);
    if (seo.keywords) setMeta("name", "keywords", seo.keywords);
    setMeta("name", "robots", robots);
    setMeta("name", "googlebot", robots);

    // Canonical + language alternates
    setLink("canonical", url);
    setAlternate("en", url);
    setAlternate("x-default", url);

    // Open Graph
    setMeta("property", "og:title", fullTitle);
    setMeta("property", "og:description", seo.description);
    setMeta("property", "og:url", url);
    setMeta("property", "og:type", seo.type ?? "website");
    setMeta("property", "og:image", image);
    setMeta("property", "og:image:alt", fullTitle);
    setMeta("property", "og:site_name", SITE_NAME);
    setMeta("property", "og:locale", "en_KE");

    // Twitter
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:site", "@yasirzayed");
    setMeta("name", "twitter:title", fullTitle);
    setMeta("name", "twitter:description", seo.description);
    setMeta("name", "twitter:image", image);
    setMeta("name", "twitter:image:alt", fullTitle);

    // Article extras
    if (seo.type === "article") {
      if (seo.publishedTime) setMeta("property", "article:published_time", seo.publishedTime);
      if (seo.modifiedTime) setMeta("property", "article:modified_time", seo.modifiedTime);
      if (seo.author) setMeta("property", "article:author", seo.author);
    }

    // JSON-LD (supports single object or @graph array)
    let script: HTMLScriptElement | null = null;
    if (seo.jsonLd) {
      script = document.createElement("script");
      script.type = "application/ld+json";
      script.dataset.seoDynamic = "true";
      const graph = Array.isArray(seo.jsonLd) ? { "@context": "https://schema.org", "@graph": seo.jsonLd } : seo.jsonLd;
      script.textContent = JSON.stringify(graph);
      document.head.appendChild(script);
    }

    return () => {
      document.title = prevTitle;
      if (script?.parentNode) script.parentNode.removeChild(script);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    seo.title, seo.description, seo.keywords, seo.path, seo.type,
    seo.image, seo.publishedTime, seo.modifiedTime, seo.author, seo.noindex,
    JSON.stringify(seo.jsonLd),
  ]);
}

export { SITE as SEO_SITE_URL, SITE_NAME as SEO_SITE_NAME };
