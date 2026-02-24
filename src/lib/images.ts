import type { SyntheticEvent } from "react";
import { API_BASE_URL } from "./api";

export const FALLBACK_IMAGE_SRC = "/placeholder.svg";
const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, "");

export const toImageSrc = (rawUrl?: string | null) => {
  const value = (rawUrl || "").trim();
  if (!value) {
    return FALLBACK_IMAGE_SRC;
  }
  if (value.startsWith("http://") || value.startsWith("https://") || value.startsWith("data:") || value.startsWith("blob:")) {
    return value;
  }
  if (value.startsWith("//")) {
    return `https:${value}`;
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
