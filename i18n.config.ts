import type { I18nConfig } from "next-i18next/proxy";

const i18nConfig: I18nConfig = {
  supportedLngs: ["uz", "ru", "en"],
  fallbackLng: "en",
  defaultNS: "common",
  ns: ["common", "home", "tours", "about", "contact", "auth", "services", "admin", "profile"],
  hideDefaultLocale: true,
  ...(process.env.NODE_ENV === "production"
    ? {
      resourceLoader: (language: string, namespace: string) =>
        import(`./public/locales/${language}/${namespace}.json`),
    }
    : {}),
};

export function withLocale(path: string, lng: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  if (lng === i18nConfig.fallbackLng) {
    return normalizedPath;
  }
  return normalizedPath === "/" ? `/${lng}` : `/${lng}${normalizedPath}`;
}

export function parseLocaleFromPath(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  const hasLocale = i18nConfig.supportedLngs.includes(segments[0]);
  return {
    locale: hasLocale ? segments[0] : i18nConfig.fallbackLng,
    segments: hasLocale ? segments.slice(1) : segments,
  };
}

export default i18nConfig;
export { i18nConfig };