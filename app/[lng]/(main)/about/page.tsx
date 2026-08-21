import { getT } from "next-i18next/server";
import { Compass, ShieldCheck, Heart, Users } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Props {
    params: Promise<{ lng: string }>;
}

const VALUE_ICONS = [Compass, ShieldCheck, Heart, Users];

export default async function AboutPage({ params }: Props) {
    const { lng } = await params;
    const { t } = await getT("about", { lng });

    const values = [1, 2, 3, 4].map((i) => ({
        title: t(`values.item_${i}_title`),
        text: t(`values.item_${i}_text`),
    }));

    return (
        <section className="min-h-screen bg-background pb-10">
            {/* Hero */}
            <div className="relative min-h-screen flex items-end overflow-hidden mb-16">
                <img
                    src="/images/about_image.png"
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/35 to-black/10" />

                <div className="relative z-10 w-full mx-auto max-w-7xl px-4 pb-20 md:pb-28">
                    <div className="flex items-center gap-2 text-white/80 text-sm font-bold tracking-wide uppercase mb-4">
                        <Compass className="h-4 w-4" />
                        {t("eyebrow")}
                    </div>

                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.05] max-w-3xl">
                        {t("title")}
                    </h1>

                    <p className="mt-6 text-base md:text-lg text-white/80 max-w-xl leading-relaxed">
                        {t("story")}
                    </p>
                </div>
            </div>

            <div className="mx-auto max-w-4xl px-4">
                {/* Hikoya */}
                <div className="text-center mb-16">
                    <p className="text-lg text-foreground/80 leading-relaxed">{t("story")}</p>
                </div>

                {/* Qadriyatlar */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
                    {values.map((value, i) => {
                        const Icon = VALUE_ICONS[i];
                        return (
                            <div key={i} className="rounded-2xl bg-muted/50 p-6">
                                <div className="h-11 w-11 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                    <Icon className="h-5 w-5 text-primary" />
                                </div>
                                <h3 className="font-bold text-primary mb-1.5">{value.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">{value.text}</p>
                            </div>
                        );
                    })}
                </div>

                {/* CTA */}
                <div className="rounded-2xl bg-primary text-white p-8 md:p-10 text-center">
                    <h2 className="text-2xl font-bold mb-2">{t("cta_title")}</h2>
                    <p className="text-white/80 mb-6 max-w-md mx-auto">{t("cta_subtitle")}</p>
                    <Link
                        href="/tours"
                        className={cn(
                            "inline-flex items-center gap-2 rounded-full bg-accent text-accent-foreground px-6 py-3 text-sm font-semibold hover:bg-accent/90 transition-colors"
                        )}
                    >
                        <Compass className="h-4 w-4" />
                        {t("cta_button")}
                    </Link>
                </div>
            </div>
        </section>
    );
}