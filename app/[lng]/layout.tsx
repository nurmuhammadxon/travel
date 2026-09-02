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

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

initServerI18next(i18nConfig);

export async function generateMetadata(): Promise<Metadata> {
  return {
    metadataBase: new URL("https://discover-stans.uz"),

    title: {
      default: "DiscoverStans — O'zbekiston va Markaziy Osiyoga sayohat",
      template: "%s | DiscoverStans",
    },

    description:
      "DiscoverStans orqali O'zbekiston va Markaziy Osiyoning eng qiziqarli joylari, sayohat yo'nalishlari va turistik imkoniyatlarini kashf eting.",

    keywords: [
      "DiscoverStans",
      "O'zbekiston sayohat",
      "O'zbekiston turizm",
      "Markaziy Osiyo sayohat",
      "Central Asia travel",
      "Uzbekistan travel",
      "Uzbekistan tourism",
      "Samarqand",
      "Buxoro",
      "Xiva",
      "Toshkent",
      "sayohat turlari",
      "turistik joylar",
      "O'zbekiston turistik joylari",
    ],

    authors: [
      {
        name: "DiscoverStans",
        url: "https://discover-stans.uz",
      },
    ],

    creator: "DiscoverStans",
    publisher: "DiscoverStans",

    category: "travel",

    alternates: {
      canonical: "https://discover-stans.uz/",
    },

    robots: {
      index: true,
      follow: true,
      nocache: false,

      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },

    openGraph: {
      title: "DiscoverStans — O'zbekiston va Markaziy Osiyoga sayohat",
      description:
        "O'zbekiston va Markaziy Osiyoning eng qiziqarli joylari, sayohat yo'nalishlari va turistik imkoniyatlarini DiscoverStans bilan kashf eting.",
      url: "https://discover-stans.uz/",
      siteName: "DiscoverStans",
      locale: "uz_UZ",
      type: "website",

      images: [
        {
          url: "/images/hero_image.png",
          width: 1200,
          height: 630,
          alt: "DiscoverStans — O'zbekiston va Markaziy Osiyo sayohatlari",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: "DiscoverStans — O'zbekiston va Markaziy Osiyoga sayohat",
      description:
        "O'zbekiston va Markaziy Osiyoning eng qiziqarli joylari va sayohat yo'nalishlarini DiscoverStans bilan kashf eting.",
      images: ["/images/hero_image.png"],
    },

    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon.ico",
      apple: "/apple-touch-icon.png",
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
    await i18n.reloadResources(
      i18nConfig.supportedLngs,
      i18nConfig.ns
    );
  }

  const resources = getResources(i18n);

  return (
    <html lang={lng}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <I18nProvider
          fallbackLng={i18nConfig.fallbackLng}
          language={lng}
          resources={resources}
        >
          <AuthProvider>{children}</AuthProvider>

          <Toaster
            richColors
            position="top-center"
          />
        </I18nProvider>
      </body>
    </html>
  );
} 