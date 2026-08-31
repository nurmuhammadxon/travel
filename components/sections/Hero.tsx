"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useT } from "next-i18next/client";
import { MapPin, Compass, ChevronUp, ChevronDown } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { HeroSearch } from "./HeroSearch";

const SLIDE_COUNT = 6;
const ROTATE_INTERVAL = 4500;

export function Hero() {
    const { t } = useT("home");
    const [index, setIndex] = useState(0);

    const goTo = useCallback((next: number) => {
        setIndex(((next % SLIDE_COUNT) + SLIDE_COUNT) % SLIDE_COUNT);
    }, []);

    useEffect(() => {
        const id = setInterval(() => {
            setIndex((prev) => (prev + 1) % SLIDE_COUNT);
        }, ROTATE_INTERVAL);
        return () => clearInterval(id);
    }, [index]);

    return (
        <section className="relative min-h-screen flex flex-col overflow-hidden">
            <Image
                src="/images/hero_image.png"
                alt="Registon maydoni, Samarqand"
                fill
                priority
                className="object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/30 to-black/10" />

            {/* O'ng tomondagi slayd navigatsiyasi */}
            <div className="hidden md:flex flex-col items-center gap-3 absolute right-6 top-1/2 -translate-y-1/2 z-20">
                <button
                    type="button"
                    aria-label="Oldingi slayd"
                    onClick={() => goTo(index - 1)}
                    className="h-8 w-8 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/25 transition-colors"
                >
                    <ChevronUp className="h-4 w-4" />
                </button>

                <div className="flex flex-col items-center gap-1.5 py-2">
                    {Array.from({ length: SLIDE_COUNT }).map((_, i) => (
                        <button
                            key={i}
                            type="button"
                            aria-label={`${i + 1}-slayd`}
                            onClick={() => goTo(i)}
                            className="p-1"
                        >
                            <span
                                className={cn(
                                    "block w-1 rounded-full transition-all duration-300",
                                    i === index ? "h-4 bg-accent" : "h-1.5 bg-white/40"
                                )}
                            />
                        </button>
                    ))}
                </div>

                <button
                    type="button"
                    aria-label="Keyingi slayd"
                    onClick={() => goTo(index + 1)}
                    className="h-8 w-8 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/25 transition-colors"
                >
                    <ChevronDown className="h-4 w-4" />
                </button>
            </div>

            {/* Asosiy matn */}
            <div className="relative z-10 flex-1 flex items-center pt-28">
                <div className="mx-auto max-w-7xl px-4 w-full">
                    <div className="flex items-center gap-2 text-white text-base font-medium tracking-wide uppercase mb-4">
                        <MapPin className="h-4 w-4" />
                        {t("hero.eyebrow")}
                    </div>

                    <div key={index} className="animate-in fade-in slide-in-from-bottom-3 duration-700">
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.05] max-w-3xl min-h-20 md:min-h-32.5 lg:min-h-38.75 line-clamp-2">
                            {t(`hero.slide_${index + 1}_title`)}
                        </h1>
                        <p className="mt-6 text-base md:text-lg text-white/80 max-w-xl leading-relaxed min-h-13 md:min-h-15 line-clamp-2">
                            {t(`hero.slide_${index + 1}_subtitle`)}
                        </p>
                    </div>

                    <div className="mt-10 flex flex-wrap items-center gap-4">
                        <Link
                            href="/tours"
                            className={cn(
                                buttonVariants({ size: "lg" }),
                                "rounded-full font-bold bg-accent text-white text-base gap-2 px-8 hover:bg-transparent hover:text-white border border-accent hover:border-white/40 transition-colors duration-300"
                            )}
                        >
                            <Compass className="h-5 w-5" />
                            {t("hero.cta_primary")}
                        </Link>
                        <Link
                            href="/about"
                            className={cn(
                                buttonVariants({ variant: "outline", size: "lg" }),
                                "rounded-full font-bold border-white/40 text-white text-base px-8 hover:bg-accent hover:border-accent hover:text-white transition-colors duration-300"
                            )}
                        >
                            {t("hero.cta_secondary")}
                        </Link>
                    </div>
                </div>
            </div>

            {/* Qidiruv paneli */}
            <HeroSearch />
        </section>
    );
}