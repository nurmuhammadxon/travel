import type { I18nConfig } from "next-i18next/proxy";

const i18nConfig: I18nConfig = {
  supportedLngs: ["uz", "ru", "en"],
  fallbackLng: "uz",
  defaultNS: "common",
  ns: ["common", "home", "tours", "about", "contact", "auth", "services"],
  hideDefaultLocale: true,
  ...(process.env.NODE_ENV === "production"
    ? {
      resourceLoader: (language: string, namespace: string) =>
        import(`./public/locales/${language}/${namespace}.json`),
    }
    : {}),
};

export default i18nConfig;