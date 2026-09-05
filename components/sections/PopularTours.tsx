"use client";

import { useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useT } from "next-i18next/client";
import { ChevronLeft, ChevronRight, MapPin, ArrowUpRight } from "lucide-react";
import { getMediaUrl } from "@/lib/media";
import { localizedText, localizedHref } from "@/lib/utils";
import { TourImagePlaceholder } from "@/components/tours/TourImagePlaceholder";
import type { Tour } from "@/types";
import { Button } from "../ui/button";

export function PopularTours({ tours }: { tours: Tour[] }) {
    const { t } = useT("home");
    const params = useParams<{ lng: string }>();
    const lng = params.lng ?? "uz";
    const scrollerRef = useRef<HTMLDivElement>(null);

    const isDragging = useRef(false);
    const wasDragged = useRef(false);
    const startX = useRef(0);
    const startScrollLeft = useRef(0);
    const [isMouseDown, setIsMouseDown] = useState(false);

    function scroll(direction: "left" | "right") {
        const el = scrollerRef.current;
        if (!el) return;
        const amount = el.clientWidth * 0.8;
        el.scrollBy({ left: direction === "left" ? -amount : amount, behavior: "smooth" });
    }

    function onMouseDown(e: React.MouseEvent) {
        const el = scrollerRef.current;
        if (!el) return;
        isDragging.current = true;
        wasDragged.current = false;
        setIsMouseDown(true);
        startX.current = e.pageX - el.offsetLeft;
        startScrollLeft.current = el.scrollLeft;
    }

    function endDrag() {
        isDragging.current = false;
        setIsMouseDown(false);
    }

    function onMouseMove(e: React.MouseEvent) {
        const el = scrollerRef.current;
        if (!el || !isDragging.current) return;
        e.preventDefault();
        const x = e.pageX - el.offsetLeft;
        const walk = x - startX.current;
        if (Math.abs(walk) > 5) wasDragged.current = true;
        el.scrollLeft = startScrollLeft.current - walk;
    }

    function onCardClick(e: React.MouseEvent) {
        if (wasDragged.current) {
            e.preventDefault();
        }
    }

    return (
        <section className="py-15 md:py-10 bg-background">
            <div className="mx-auto max-w-7xl px-4">
                <div className="flex items-end justify-between mb-10">
                    <div>
                        <div className="text-accent text-sm font-semibold uppercase tracking-wide mb-2">
                            {t("popular.eyebrow")}
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-primary">
                            {t("popular.title")}
                        </h2>
                    </div>

                    <div className="hidden sm:flex items-center gap-2">
                        <Button
                            onClick={() => scroll("left")}
                            aria-label="Chapga"
                            className="h-10 w-10 rounded-full border border-accent bg-white flex items-center justify-center text-accent hover:bg-accent hover:text-white transition-colors cursor-pointer"                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            onClick={() => scroll("right")}
                            aria-label="O'ngga"
                            className="h-10 w-10 rounded-full border border-accent bg-white flex items-center justify-center text-accent hover:bg-accent hover:text-white transition-colors cursor-pointer"                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            <div
                ref={scrollerRef}
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={endDrag}
                onMouseLeave={endDrag}
                className={`flex gap-5 overflow-x-auto pb-4 px-4 md:px-[max(1rem,calc((100vw-80rem)/2+1rem))] snap-x snap-mandatory scroll-smooth select-none [-ms-overflow-style:none] scrollbar-none [&::-webkit-scrollbar]:hidden ${isMouseDown ? "cursor-grabbing scroll-auto" : "cursor-grab"
                    }`}
            >
                {tours.map((tour) => {
                    const title = localizedText(tour.title, lng);
                    const shortDescription = localizedText(tour.short_description, lng);
                    const countryName = tour.countries?.[0]
                        ? localizedText(tour.countries[0].name, lng)
                        : "";
                    const imageUrl = getMediaUrl(tour.cover_image ?? tour.images?.[0]);

                    return (
                        <Link
                            key={tour.id}
                            href={localizedHref(lng, `/tours/${tour.slug}`)}
                            onClick={onCardClick}
                            draggable={false}
                            className="group snap-start shrink-0 w-70 md:w-[320px] rounded-2xl overflow-hidden bg-card ring-1 ring-border hover:ring-primary/30 transition-all duration-300"
                        >
                            <div className="relative h-52 bg-muted overflow-hidden">
                                {imageUrl ? (
                                    <img
                                        src={imageUrl}
                                        alt={title}
                                        draggable={false}
                                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 pointer-events-none"
                                    />
                                ) : (
                                    <TourImagePlaceholder className="h-full w-full" />
                                )}
                                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 text-sm font-bold text-primary">
                                    ${tour.price}
                                </div>
                            </div>

                            <div className="p-5">
                                {countryName && (
                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
                                        <MapPin className="h-3.5 w-3.5" />
                                        {countryName}
                                    </div>
                                )}
                                <h3 className="text-base font-bold text-foreground leading-snug mb-3 group-hover:text-primary transition-colors">
                                    {title}
                                </h3>
                                <div className="flex items-center justify-between">
                                    {shortDescription ? (
                                        <p className="text-xs text-muted-foreground line-clamp-1 flex-1 mr-2">
                                            {shortDescription}
                                        </p>
                                    ) : (
                                        <span />
                                    )}
                                    <span className="flex items-center gap-1 text-sm font-semibold text-accent shrink-0">
                                        {t("popular.view")}
                                        <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                    </span>
                                </div>
                            </div>
                        </Link>
                    );
                })}

                <Link
                    href={localizedHref(lng, "/tours")}
                    onClick={onCardClick}
                    draggable={false}
                    className="group snap-start shrink-0 w-70 md:w-[320px] rounded-2xl bg-primary text-white flex flex-col items-center justify-center gap-3 p-8 text-center hover:bg-primary/90 transition-colors"
                >
                    <span className="text-lg font-bold">{t("popular.view_all")}</span>
                    <span className="h-10 w-10 rounded-full bg-white/15 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                        <ArrowUpRight className="h-4 w-4" />
                    </span>
                </Link>
            </div>
        </section>
    );
}