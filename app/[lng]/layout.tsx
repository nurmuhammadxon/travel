import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";
import {
  initServerI18next,
  getT,
  getResources,
  generateI18nStaticParams,
} from "next-i18next/server";
import { I18nProvider } from "next-i18next/client";
import i18nConfig from "../../i18n.config";
import "../globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

initServerI18next(i18nConfig);
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lng: string }>;
}): Promise<Metadata> {
  const { lng } = await params;
  const { t } = await getT("common", { lng });

  return {
    title: {
      default: t("meta.default_title"),
      template: `%s | DiscoverStans`,
    },
    description: t("meta.default_description"),
    metadataBase: new URL("https://travel-lake-rho-83.vercel.app/"),
    alternates: {
      languages: {
        uz: "/",
        ru: "/ru",
        en: "/en",
      },
    },
    openGraph: {
      title: t("meta.default_title"),
      description: t("meta.default_description"),
      siteName: "DiscoverStans",
      locale: lng,
      type: "website",
      images: ["/images/hero_image.jpg"],
    },
    twitter: {
      card: "summary_large_image",
      title: t("meta.default_title"),
      description: t("meta.default_description"),
    },
  };
}

export async function generateStaticParams() {
  return generateI18nStaticParams();
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lng: string }>;
}) {
  const { lng } = await params;
  const { i18n } = await getT();

  if (process.env.NODE_ENV === "development") {
    await i18n.reloadResources(i18nConfig.supportedLngs, i18nConfig.ns);
  }

  const resources = getResources(i18n);

  return (
    <html lang={lng}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <I18nProvider fallbackLng={i18nConfig.fallbackLng} language={lng} resources={resources}>
          <AuthProvider>{children}</AuthProvider>
        </I18nProvider>
      </body>
    </html>
  );
}