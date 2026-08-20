import type { I18nConfig } from "next-i18next/proxy";

const i18nConfig: I18nConfig = {
  supportedLngs: ["uz", "ru", "en"],
  fallbackLng: "uz",
  defaultNS: "common",
  ns: ["common", "home", "tours", "about", "contact", "auth"],
  hideDefaultLocale: true,
};

export default i18nConfig;