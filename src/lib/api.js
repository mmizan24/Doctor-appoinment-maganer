const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
const isLocalhostApi =
  configuredApiUrl && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(configuredApiUrl);
const isRelativeApi = configuredApiUrl?.startsWith("/");
const isVercelSiteUrl =
  configuredApiUrl &&
  /^https:\/\/doctor-appointment-manager-sable\.vercel\.app$/i.test(configuredApiUrl);

const sameOriginApiBaseUrl = () => {
  if (typeof window !== "undefined") {
    return "/api";
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}/api`;
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.BETTER_AUTH_URL;
  return `${(appUrl || "http://localhost:3000").replace(/\/$/, "")}/api`;
};

export const API_BASE_URL =
  configuredApiUrl && (isRelativeApi || (!isLocalhostApi && !isVercelSiteUrl))
    ? configuredApiUrl
    : sameOriginApiBaseUrl();

export const apiUrl = (path) =>
  `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
