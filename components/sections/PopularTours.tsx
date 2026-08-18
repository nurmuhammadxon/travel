"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useT } from "next-i18next/client";
import { ChevronLeft, ChevronRight, MapPin, Clock, ArrowUpRight } from "lucide-react";

const MOCK_TOURS = [
    { id: "1", slug: "registon-samarqand", title: "Registon va Shohizinda", location: "Samarqand", days: 1, price: 45, image: "/images/tour-1.jpg" },
    { id: "2", slug: "buxoro-tarix", title: "Buxoroning tarixiy markazi", location: "Buxoro", days: 2, price: 90, image: "/images/tour-2.jpg" },
    { id: "3", slug: "xiva-ichon-qala", title: "Xiva — Ichon Qal'a sayohati", location: "Xiva", days: 2, price: 110, image: "/images/tour-3.jpg" },
    { id: "4", slug: "fargona-vodiysi", title: "Farg'ona vodiysi bo'ylab", location: "Farg'ona", days: 3, price: 150, image: "/images/tour-4.jpg" },
    { id: "5", slug: "nurota-cholsuv", title: "Nurota va Cho'lsuv ko'li", location: "Nurota", days: 1, price: 60, image: "/images/tour-5.jpg" },
    { id: "6", slug: "silk-road-classic", title: "Klassik Ipak yo'li turi", location: "Samarqand — Buxoro — Xiva", days: 7, price: 480, image: "/images/tour-6.jpg" },
];

export function PopularTours() {
    const { t } = useT("home");
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
                        <button
                            onClick={() => scroll("left")}
                            aria-label="Chapga"
                            className="h-10 w-10 rounded-full border border-accent flex items-center justify-center text-accent hover:bg-accent hover:text-white transition-colors cursor-pointer"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => scroll("right")}
                            aria-label="O'ngga"
                            className="h-10 w-10 rounded-full border border-accent flex items-center justify-center text-accent hover:bg-accent hover:text-white transition-colors cursor-pointer"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>

            <div
                ref={scrollerRef}
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={endDrag}
                onMouseLeave={endDrag}
                className={`flex gap-5 overflow-x-auto pb-4 px-4 md:px-[max(1rem,calc((100vw-80rem)/2+1rem))] snap-x snap-mandatory scroll-smooth select-none [-ms-overflow-style:none] [scrollbar-none] [&::-webkit-scrollbar]:hidden ${isMouseDown ? "cursor-grabbing scroll-auto" : "cursor-grab"
                    }`}
            >
                {MOCK_TOURS.map((tour) => (
                    <Link
                        key={tour.id}
                        href={`/tours/${tour.slug}`}
                        onClick={onCardClick}
                        draggable={false}
                        className="group snap-start shrink-0 w-70 md:w-[320px] rounded-2xl overflow-hidden bg-card ring-1 ring-border hover:ring-primary/30 transition-all duration-300"
                    >
                        <div className="relative h-52 bg-muted overflow-hidden">
                            <img
                                src={tour.image}
                                alt={tour.title}
                                draggable={false}
                                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 pointer-events-none"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = "none";
                                }}
                            />
                            <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 text-sm font-bold text-primary">
                                ${tour.price}
                            </div>
                        </div>

                        <div className="p-5">
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
                                <MapPin className="h-3.5 w-3.5" />
                                {tour.location}
                            </div>
                            <h3 className="text-base font-bold text-foreground leading-snug mb-3 group-hover:text-primary transition-colors">
                                {tour.title}
                            </h3>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                    <Clock className="h-3.5 w-3.5" />
                                    {tour.days} {t("popular.days_short")}
                                </div>
                                <span className="flex items-center gap-1 text-sm font-semibold text-accent">
                                    {t("popular.view")}
                                    <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}

                <Link
                    href="/tours"
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