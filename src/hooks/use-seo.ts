import { useEffect } from "react";

type SEOConfig = {
  title: string;
  description: string;
  path?: string;
  image?: string;
  keywords?: string[];
  noindex?: boolean;
  structuredData?: Record<string, unknown> | Array<Record<string, unknown>>;
};

const SITE_NAME = "WildWave Safaris";

const ensureMetaTag = (attribute: "name" | "property", key: string) => {
  const selector = `meta[${attribute}="${key}"]`;
  let tag = document.head.querySelector<HTMLMetaElement>(selector);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attribute, key);
    document.head.appendChild(tag);
  }
  return tag;
};

const setMetaContent = (attribute: "name" | "property", key: string, value: string) => {
  const tag = ensureMetaTag(attribute, key);
  tag.setAttribute("content", value);
};

const setCanonical = (href: string) => {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", href);
};

const setStructuredData = (data: SEOConfig["structuredData"]) => {
  const scriptId = "seo-structured-data";
  const existing = document.getElementById(scriptId);
  if (!data) {
    if (existing) existing.remove();
    return;
  }

  const payload = Array.isArray(data) ? data : [data];
  const script = existing || document.createElement("script");
  script.setAttribute("id", scriptId);
  script.setAttribute("type", "application/ld+json");
  script.textContent = JSON.stringify(payload);
  if (!existing) {
    document.head.appendChild(script);
  }
};

export const useSEO = ({
  title,
  description,
  path = "/",
  image = "/placeholder.svg",
  keywords = [],
  noindex = false,
  structuredData,
}: SEOConfig) => {
  useEffect(() => {
    const origin = window.location.origin;
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    const canonicalUrl = `${origin}${normalizedPath === "/" ? "" : normalizedPath}`;
    const imageUrl = image.startsWith("http") ? image : `${origin}${image.startsWith("/") ? image : `/${image}`}`;
    const robots = noindex ? "noindex, nofollow" : "index, follow";

    document.title = title;
    document.documentElement.setAttribute("lang", "en");

    setCanonical(canonicalUrl);
    setMetaContent("name", "description", description);
    setMetaContent("name", "robots", robots);
    setMetaContent("name", "author", SITE_NAME);
    setMetaContent("name", "twitter:card", "summary_large_image");
    setMetaContent("name", "twitter:title", title);
    setMetaContent("name", "twitter:description", description);
    setMetaContent("name", "twitter:image", imageUrl);
    setMetaContent("property", "og:type", "website");
    setMetaContent("property", "og:site_name", SITE_NAME);
    setMetaContent("property", "og:title", title);
    setMetaContent("property", "og:description", description);
    setMetaContent("property", "og:url", canonicalUrl);
    setMetaContent("property", "og:image", imageUrl);

    if (keywords.length > 0) {
      setMetaContent("name", "keywords", keywords.join(", "));
    }

    setStructuredData(structuredData);
  }, [title, description, path, image, keywords, noindex, structuredData]);
};
