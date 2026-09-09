import { getT } from "next-i18next/server";
import { LegalDocument } from "@/components/legal/LegalDocument";
import { offerContent } from "@/lib/legal/offer";
import type { Metadata } from "next";

interface Props {
    params: Promise<{ lng: string }>;
}

function resolveOfferLocale(lng: string): "uz" | "en" {
    return lng === "uz" ? "uz" : "en";
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { lng } = await params;
    const { t } = await getT("legal", { lng });

    const title = t("offer_title");
    const description = t("offer_meta_description");

    return {
        title,
        description,
        alternates: { canonical: "/oferta" },
        openGraph: { title, description, url: "/oferta" },
    };
}

export default async function OfferPage({ params }: Props) {
    const { lng } = await params;
    const { t } = await getT("legal", { lng });

    const contentLocale = resolveOfferLocale(lng);
    const isRuFallback = lng === "ru";

    return (
        <LegalDocument
            title={t("offer_title")}
            content={offerContent[contentLocale]}
            ruFallbackNotice={isRuFallback ? t("ru_fallback_notice") : undefined}
        />
    );
}