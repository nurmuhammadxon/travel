"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter, usePathname, useSearchParams, useParams } from "next/navigation";
import { useT } from "next-i18next/client";
import { SlidersHorizontal, Search, } from "lucide-react";
import { localizedText } from "@/lib/utils";

import { getCountries, getDestinations } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import type { Country, Destination } from "@/types";

const CATEGORIES = [
    { value: "day_trip", label: "Day trip" },
    { value: "multi_day", label: "Multi-day" },
];

interface TourFiltersProps {
    resultCount: number;
}

export function TourFilters({ resultCount }: TourFiltersProps) {
    const { t } = useT("tours");
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const params = useParams<{ lng: string }>();
    const lng = params.lng ?? "uz";
    const [, startTransition] = useTransition();

    const currentSearch = searchParams.get("search") ?? "";
    const currentCategory = searchParams.get("category") ?? "";
    const currentCountries = (searchParams.get("country") ?? "").split(",").filter(Boolean);

    const [searchValue, setSearchValue] = useState(currentSearch);
    const [modalOpen, setModalOpen] = useState(false);
    const [draftCountries, setDraftCountries] = useState<string[]>(currentCountries);
    const [draftDestination, setDraftDestination] = useState<string | null>(null);

    const [countries, setCountries] = useState<Country[]>([]);
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [isLoadingLists, setIsLoadingLists] = useState(true);

    const currentDestination = searchParams.get("destination") ?? "";

    const activeFilterCount =
        (currentCountries.length > 0 ? 1 : 0) +
        (currentCategory ? 1 : 0) +
        (currentDestination ? 1 : 0);

    useEffect(() => {
        let cancelled = false;
        setIsLoadingLists(true);

        Promise.all([getCountries(), getDestinations()])
            .then(([countriesRes, destinationsRes]) => {
                if (cancelled) return;
                setCountries(countriesRes);
                setDestinations(destinationsRes);
            })
            .catch(() => {
                if (!cancelled) {
                    setCountries([]);
                    setDestinations([]);
                }
            })
            .finally(() => {
                if (!cancelled) setIsLoadingLists(false);
            });

        return () => {
            cancelled = true;
        };
    }, [lng]);

    useEffect(() => {
        if (!modalOpen) return;
        setDraftCountries(currentCountries);
        setDraftDestination(currentDestination || null);
    }, [modalOpen]);

    function updateParams(next: Record<string, string | null>) {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(next).forEach(([key, value]) => {
            if (value) {
                params.set(key, value);
            } else {
                params.delete(key);
            }
        });
        startTransition(() => {
            router.push(`${pathname}?${params.toString()}`);
        });
    }

    function handleSearchSubmit(e: React.FormEvent) {
        e.preventDefault();
        updateParams({ search: searchValue.trim() || null });
    }

    function toggleCategory(value: string) {
        updateParams({ category: currentCategory === value ? null : value });
    }

    function toggleDraftCountry(slug: string) {
        setDraftCountries((prev) =>
            prev.includes(slug) ? prev.filter((c) => c !== slug) : [...prev, slug]
        );
    }

    function toggleDraftDestination(slug: string) {
        setDraftDestination((prev) => (prev === slug ? null : slug));
    }

    function applyFilters() {
        updateParams({
            country: draftCountries.length > 0 ? draftCountries.join(",") : null,
            destination: draftDestination ?? null,
        });
        setModalOpen(false);
    }

    function handleClear() {
        setDraftCountries([]);
        setDraftDestination(null);
        updateParams({ country: null, destination: null });
        setModalOpen(false);
    }

    return (
        <div className="space-y-4">
            <form onSubmit={handleSearchSubmit} className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder={t("search_placeholder")}
                    className="pl-9"
                />
            </form>

            <div className="flex items-center gap-2 overflow-x-auto pb-1">
                <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 shrink-0 rounded-full"
                    onClick={() => setModalOpen(true)}
                >
                    <SlidersHorizontal className="h-3.5 w-3.5" />
                    {t("filter_button")}
                    {activeFilterCount > 0 && (
                        <span className="ml-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                            {activeFilterCount}
                        </span>
                    )}
                </Button>

                <button
                    type="button"
                    onClick={() => updateParams({ category: null })}
                    className={`shrink-0 rounded-full border px-3 py-1.5 text-xs whitespace-nowrap transition-colors ${!currentCategory
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border text-muted-foreground hover:bg-muted"
                        }`}
                >
                    {t("all_categories")}
                </button>

                {CATEGORIES.map((c) => (
                    <button
                        key={c.value}
                        type="button"
                        onClick={() => toggleCategory(c.value)}
                        className={`shrink-0 rounded-full border px-3 py-1.5 text-xs whitespace-nowrap transition-colors ${currentCategory === c.value
                            ? "bg-primary text-primary-foreground border-primary"
                            : "border-border text-muted-foreground hover:bg-muted"
                            }`}
                    >
                        {c.label}
                    </button>
                ))}

                <span className="ml-auto shrink-0 text-sm font-medium whitespace-nowrap pl-2">
                    {resultCount} {t("tours_word")}
                </span>
            </div>

            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{t("filter_button")}</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-5 max-h-96 overflow-y-auto pr-1">
                        <div className="space-y-2">
                            <p className="text-sm font-semibold">{t("country_label")}</p>
                            {isLoadingLists ? (
                                Array.from({ length: 4 }).map((_, i) => (
                                    <Skeleton key={i} className="h-7 w-full" />
                                ))
                            ) : (
                                countries.map((c) => (
                                    <label
                                        key={c.slug}
                                        className="flex items-center justify-between gap-2 cursor-pointer py-1"
                                    >
                                        <span className="flex items-center gap-2 text-sm">
                                            <Checkbox
                                                checked={draftCountries.includes(c.slug)}
                                                onCheckedChange={() => toggleDraftCountry(c.slug)}
                                            />
                                            {localizedText(c.name, lng)}
                                        </span>
                                        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-muted px-1 text-[11px] text-muted-foreground">
                                            {c.tour_count ?? "—"}
                                        </span>
                                    </label>
                                ))
                            )}
                        </div>

                        <div className="space-y-2 border-t pt-4">
                            <p className="text-sm font-semibold">{t("destination_label")}</p>
                            {isLoadingLists ? (
                                Array.from({ length: 6 }).map((_, i) => (
                                    <Skeleton key={i} className="h-7 w-full" />
                                ))
                            ) : (
                                destinations.map((d) => (
                                    <label
                                        key={d.id}
                                        className="flex items-center gap-2 cursor-pointer py-1"
                                    >
                                        <Checkbox
                                            checked={draftDestination === d.slug}
                                            onCheckedChange={() => toggleDraftDestination(d.slug)}
                                        />
                                        <span className="text-sm">{localizedText(d.name, lng)}</span>
                                    </label>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                        <Button variant="outline" className="flex-1" onClick={handleClear}>
                            {t("clear_filters")}
                        </Button>
                        <Button className="flex-1" onClick={applyFilters}>
                            {t("show")}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}