const PROD_API_FALLBACK = "https://wildwave-safaris-api.onrender.com/api";

function isLocalHost(hostname: string) {
  return hostname === "localhost" || hostname === "127.0.0.1";
}

function resolveApiBaseUrl() {
  const raw = import.meta.env.VITE_API_URL?.trim();

  if (!raw) return PROD_API_FALLBACK;

  const currentHost =
    typeof window !== "undefined" ? window.location.hostname : "";
  const onLocalFrontend = currentHost ? isLocalHost(currentHost) : false;

  // Prevent broken values like ":5000/api" from being used in production.
  if (raw.startsWith(":")) return PROD_API_FALLBACK;

  try {
    const parsed = new URL(raw);
    // If frontend is not local, never use localhost backend URL.
    if (!onLocalFrontend && isLocalHost(parsed.hostname)) {
      return PROD_API_FALLBACK;
    }
    return parsed.toString().replace(/\/$/, "");
  } catch {
    return PROD_API_FALLBACK;
  }
}

export const API_BASE_URL = resolveApiBaseUrl();
