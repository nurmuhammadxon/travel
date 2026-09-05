import { getT } from "next-i18next/server";
import { MapPin } from "lucide-react";
import { ServiceCard } from "@/components/services/ServiceCard";
import { GetInTouchSection } from "@/components/sections/GetInTouchSection";
import { SERVICE_KEYS } from "@/lib/data/services";
import type { Metadata } from "next";

interface Props {
    params: Promise<{ lng: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { lng } = await params;
    const { t } = await getT("services", { lng });

    const title = t("meta_title") ?? t("title");
    const description = t("meta_description") ?? t("subtitle");

    return {
        title,
        description,
        alternates: { canonical: "/services" },
        openGraph: {
            title,
            description,
            url: "/services",
            images: [{ url: "/images/service_image.png", width: 1200, height: 630, alt: title }],
        },
    };
}

export default async function ServicesPage({ params }: Props) {
    const { lng } = await params;
    const { t } = await getT("services", { lng });

    return (
        <div className="min-h-screen bg-background">
            <div className="relative min-h-screen flex items-center justify-center overflow-hidden mb-16">
                <img
                    src="/images/service_image.png"
                    alt={t("title")}
                    className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/35 to-black/10" />

                <div className="relative z-10 w-full mx-auto max-w-3xl px-4 text-center">
                    <div className="flex items-center justify-center gap-2 text-white text-sm font-medium tracking-wide uppercase mb-4">
                        <MapPin className="h-4 w-4" />
                        {t("eyebrow")}
                    </div>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.05]">
                        {t("title")}
                    </h1>
                    <p className="mt-6 text-base md:text-lg text-white/80 max-w-xl mx-auto leading-relaxed">
                        {t("subtitle")}
                    </p>
                </div>
            </div>

            <div className="mx-auto max-w-6xl px-4 pb-20">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {SERVICE_KEYS.map((key) => (
                        <ServiceCard
                            key={key}
                            serviceKey={key}
                            title={t(`items.${key}.title`)}
                            text={t(`items.${key}.text`)}
                        />
                    ))}
                </div>
            </div>

            <GetInTouchSection lng={lng} source="service" />
        </div>
    );
}