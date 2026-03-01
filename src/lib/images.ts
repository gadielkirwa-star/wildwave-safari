import type { SyntheticEvent } from "react";
import { API_BASE_URL } from "./api";

export const FALLBACK_IMAGE_SRC = "/placeholder.svg";
const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, "");

const normalizeExternalImageUrl = (rawUrl: string) => {
  try {
    const parsed = new URL(rawUrl);

    // Convert Dropbox share links into direct image links.
    if (parsed.hostname.includes("dropbox.com")) {
      parsed.searchParams.set("raw", "1");
      parsed.searchParams.delete("dl");
      return parsed.toString();
    }

    // If older data stored local dev upload URLs, remap to active API origin.
    if (parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1") {
      const apiBase = new URL(API_ORIGIN);
      parsed.protocol = apiBase.protocol;
      parsed.host = apiBase.host;
      return parsed.toString();
    }

    return rawUrl;
  } catch {
    return rawUrl;
  }
};

export const toImageSrc = (rawUrl?: string | null) => {
  const value = (rawUrl || "").trim();
  if (!value) {
    return FALLBACK_IMAGE_SRC;
  }
  if (value.startsWith("http://") || value.startsWith("https://") || value.startsWith("data:") || value.startsWith("blob:")) {
    return normalizeExternalImageUrl(value);
  }
  if (value.startsWith("//")) {
    return normalizeExternalImageUrl(`https:${value}`);
  }
  if (value.startsWith("/")) {
    return `${API_ORIGIN}${value}`;
  }
  return `${API_ORIGIN}/${value}`;
};

export const withImageFallback = (
  event: SyntheticEvent<HTMLImageElement, Event>,
) => {
  const img = event.currentTarget;
  if (img.dataset.fallbackApplied === "true") {
    return;
  }
  img.dataset.fallbackApplied = "true";
  img.src = FALLBACK_IMAGE_SRC;
};
