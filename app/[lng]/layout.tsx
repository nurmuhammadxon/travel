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
import { Toaster } from "@/components/ui/sonner";
import i18nConfig from "../../i18n.config";
import "../globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

initServerI18next(i18nConfig);

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: {
      default: "DiscoverStans — Markaziy Osiyo bo'ylab sayohat",
      template: `%s | DiscoverStans`,
    },
    description: "O'zbekiston va Markaziy Osiyo bo'ylab tanlangan sayohat turlari.",
    metadataBase: new URL("https://travel-lake-rho-83.vercel.app"),
    openGraph: {
      title: "DiscoverStans",
      description: "O'zbekiston va Markaziy Osiyo bo'ylab tanlangan sayohat turlari.",
      siteName: "DiscoverStans",
      type: "website",
      images: ["/images/hero_image.png"],
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
          <Toaster richColors position="top-center" />
        </I18nProvider>
      </body>
    </html>
  );
}