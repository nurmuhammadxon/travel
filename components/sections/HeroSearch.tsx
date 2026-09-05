"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useT } from "next-i18next/client";
import { Search, MapPin, Loader2 } from "lucide-react";

import { getDestinations, getTours } from "@/lib/api";
import { getMediaUrl } from "@/lib/media";
import { localizedText, cn } from "@/lib/utils";
import { TourImagePlaceholder } from "@/components/tours/TourImagePlaceholder";
import type { Destination, Tour } from "@/types";
import { Button } from "../ui/button";

export function HeroSearch() {
    const { t } = useT("home");
    const router = useRouter();
    const params = useParams<{ lng: string }>();
    const lng = params.lng ?? "en";
    const prefix = lng === "en" ? "" : `/${lng}`;

    const [query, setQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [allDestinations, setAllDestinations] = useState<Destination[]>([]);
    const [matchedDestinations, setMatchedDestinations] = useState<Destination[]>([]);
    const [matchedTours, setMatchedTours] = useState<Tour[]>([]);

    const containerRef = useRef<HTMLDivElement>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        getDestinations()
            .then(setAllDestinations)
            .catch(() => setAllDestinations([]));
    }, []);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    function handleQueryChange(value: string) {
        setQuery(value);

        if (debounceRef.current) clearTimeout(debounceRef.current);

        const trimmed = value.trim();
        if (trimmed.length < 2) {
            setMatchedDestinations([]);
            setMatchedTours([]);
            setIsOpen(false);
            return;
        }

        setIsOpen(true);
        debounceRef.current = setTimeout(async () => {
            setIsSearching(true);
            const destMatches = allDestinations
                .filter((d) => localizedText(d.name, lng).toLowerCase().includes(trimmed.toLowerCase()))
                .slice(0, 3);
            setMatchedDestinations(destMatches);

            try {
                const res = await getTours({ search: trimmed, lang: lng, page_size: 4 });
                setMatchedTours(res.items);
            } catch {
                setMatchedTours([]);
            } finally {
                setIsSearching(false);
            }
        }, 350);
    }

    function goToTours(searchValue: string) {
        setIsOpen(false);
        router.push(`${prefix}/tours?search=${encodeURIComponent(searchValue)}`);
    }

    function goToDestination(slug: string) {
        setIsOpen(false);
        router.push(`${prefix}/tours?destination=${encodeURIComponent(slug)}`);
    }

    function goToTour(slug: string) {
        setIsOpen(false);
        router.push(`${prefix}/tours/${slug}`);
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (query.trim()) goToTours(query.trim());
    }

    const hasResults = matchedDestinations.length > 0 || matchedTours.length > 0;

    return (
        <div ref={containerRef} className="relative z-10 mx-auto max-w-2xl w-full px-4 pb-14 md:pb-20">
            <form
                onSubmit={handleSubmit}
                className="flex items-center gap-2 bg-white rounded-full p-2 pl-5 shadow-xl"
            >
                <Search className="h-5 w-5 text-muted-foreground shrink-0" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => handleQueryChange(e.target.value)}
                    onFocus={() => query.trim().length >= 2 && setIsOpen(true)}
                    placeholder={t("hero.search_placeholder")}
                    className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground py-2 min-w-0"
                />
                <Button
                    type="submit"
                    aria-label={t("hero.search_button")}
                    className="h-10 w-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center hover:bg-accent/90 transition-colors shrink-0"
                >
                    <Search className="h-4 w-4" />
                </Button>
            </form>

            {isOpen && (
                <div className="absolute z-30 left-4 right-4 mt-2 bg-white border border-border rounded-2xl shadow-2xl overflow-hidden text-left max-h-[70vh] overflow-y-auto">
                    {isSearching && !hasResults ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                        </div>
                    ) : !hasResults ? (
                        <p className="text-sm text-muted-foreground text-center py-8">
                            {t("hero.search_no_results")}
                        </p>
                    ) : (
                        <>
                            {matchedDestinations.length > 0 && (
                                <div className="p-3">
                                    <p className="px-2 pb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                        {t("hero.search_destinations_label")}
                                    </p>
                                    {matchedDestinations.map((d) => {
                                        const img = getMediaUrl(d.cover_image);
                                        return (
                                            <Button
                                                key={d.id}
                                                type="button"
                                                onClick={() => goToDestination(d.slug)}
                                                variant="ghost"
                                                className="flex items-center gap-3 w-full h-auto px-2 py-2 rounded-lg bg-transparent hover:bg-muted text-left text-foreground transition-colors whitespace-normal justify-start"                                            >
                                                <div className="h-12 w-12 rounded-lg overflow-hidden shrink-0 bg-muted">
                                                    {img ? (
                                                        <img
                                                            src={img}
                                                            alt=""
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <TourImagePlaceholder className="h-full w-full" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-foreground">
                                                        {localizedText(d.name, lng)}
                                                    </p>
                                                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                                                        <MapPin className="h-3 w-3" />
                                                        {localizedText(d.description, lng)}
                                                    </p>
                                                </div>
                                            </Button>
                                        );
                                    })}
                                </div>
                            )}

                            {matchedTours.length > 0 && (
                                <div className={cn("p-3", matchedDestinations.length > 0 && "border-t border-border")}>
                                    <p className="px-2 pb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                        {t("hero.search_tours_label")}
                                    </p>
                                    {matchedTours.map((tour) => {
                                        const img = getMediaUrl(tour.cover_image);
                                        return (
                                            <Button
                                                key={tour.id}
                                                type="button"
                                                onClick={() => goToTour(tour.slug)}
                                                variant="ghost"
                                                className="flex items-center gap-3 w-full h-auto px-2 py-2 rounded-lg bg-transparent hover:bg-muted text-left text-foreground transition-colors whitespace-normal justify-start"                                            >
                                                <div className="h-12 w-12 rounded-lg overflow-hidden shrink-0 bg-muted">
                                                    {img ? (
                                                        <img
                                                            src={img}
                                                            alt=""
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <TourImagePlaceholder className="h-full w-full" />
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-semibold text-foreground truncate">
                                                        {localizedText(tour.title, lng)}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {tour.category}
                                                    </p>
                                                </div>
                                            </Button>
                                        );
                                    })}
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
}