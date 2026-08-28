"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useT } from "next-i18next/client";
import { SlidersHorizontal, Search, X } from "lucide-react";

import { getTours } from "@/lib/api";
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

// TODO: backend /countries endpointi tayyor bo'lgach, dinamik ro'yxatga almashtiring
const COUNTRIES = [
    { slug: "uzbekistan", label: "Uzbekistan" },
    { slug: "tajikistan", label: "Tajikistan" },
    { slug: "kazakhstan", label: "Kazakhstan" },
    { slug: "kyrgyzstan", label: "Kyrgyzstan" },
];

// TODO: backend /destinations endpointi tayyor bo'lgach, dinamik ro'yxatga almashtiring
// Hozircha "search" orqali ishlaydi (tur nomi/tavsifida shahar nomi uchrasa mos keladi)
const DESTINATIONS = [
    { key: "Samarkand", label: "Samarkand" },
    { key: "Tashkent", label: "Tashkent" },
    { key: "Bukhara", label: "Bukhara" },
    { key: "Khiva", label: "Khiva" },
    { key: "Almaty", label: "Almaty" },
    { key: "Issyk-Kul", label: "Issyk-Kul" },
];

// TODO: backend'dagi haqiqiy category enum qiymatlari bilan almashtiring
const CATEGORIES = [
    { value: "multi_day", label: "Multi-day" },
    { value: "day_trip", label: "Day trip" },
    { value: "adventure", label: "Adventure" },
    { value: "cultural", label: "Cultural" },
    { value: "expedition", label: "Expedition" },
    { value: "hiking", label: "Hiking" },
];

interface TourFiltersProps {
    resultCount: number;
}

export function TourFilters({ resultCount }: TourFiltersProps) {
    const { t } = useT("tours");
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [, startTransition] = useTransition();

    const currentSearch = searchParams.get("search") ?? "";
    const currentCategory = searchParams.get("category") ?? "";
    const currentCountries = (searchParams.get("country") ?? "").split(",").filter(Boolean);

    const [searchValue, setSearchValue] = useState(currentSearch);
    const [modalOpen, setModalOpen] = useState(false);
    const [draftCountries, setDraftCountries] = useState<string[]>(currentCountries);
    const [draftDestination, setDraftDestination] = useState<string | null>(
        DESTINATIONS.some((d) => d.key === currentSearch) ? currentSearch : null
    );

    const [countryCounts, setCountryCounts] = useState<Record<string, number | null>>({});
    const [destinationCounts, setDestinationCounts] = useState<Record<string, number | null>>({});
    const [countsLoading, setCountsLoading] = useState(false);

    const activeFilterCount =
        (currentCountries.length > 0 ? 1 : 0) +
        (currentCategory ? 1 : 0) +
        (DESTINATIONS.some((d) => d.key === currentSearch) ? 1 : 0);

    // Modal ochilganda har bir davlat/yo'nalish uchun tur sonini yuklaymiz
    useEffect(() => {
        if (!modalOpen) return;
        let cancelled = false;
        setCountsLoading(true);

        async function loadCounts() {
            const countryEntries = await Promise.all(
                COUNTRIES.map(async (c) => {
                    try {
                        const res = await getTours({ country: c.slug, page_size: 1 });
                        return [c.slug, res.total] as const;
                    } catch {
                        return [c.slug, null] as const;
                    }
                })
            );
            const destinationEntries = await Promise.all(
                DESTINATIONS.map(async (d) => {
                    try {
                        const res = await getTours({ search: d.key, page_size: 1 });
                        return [d.key, res.total] as const;
                    } catch {
                        return [d.key, null] as const;
                    }
                })
            );

            if (cancelled) return;
            setCountryCounts(Object.fromEntries(countryEntries));
            setDestinationCounts(Object.fromEntries(destinationEntries));
            setCountsLoading(false);
        }

        loadCounts();
        return () => {
            cancelled = true;
        };
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

    function toggleDraftDestination(key: string) {
        setDraftDestination((prev) => (prev === key ? null : key));
    }

    function applyFilters() {
        updateParams({
            country: draftCountries.length > 0 ? draftCountries.join(",") : null,
            search: draftDestination ?? null,
        });
        setModalOpen(false);
    }

    // Filtr(lar)ni darhol tozalab, modalni yopadi
    function handleClear() {
        setDraftCountries([]);
        setDraftDestination(null);
        updateParams({ country: null, search: null });
        setSearchValue("");
        setModalOpen(false);
    }

    function clearAllFilters() {
        setSearchValue("");
        setDraftCountries([]);
        setDraftDestination(null);
        router.push(pathname);
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
                    onClick={() => {
                        setDraftCountries(currentCountries);
                        setDraftDestination(
                            DESTINATIONS.some((d) => d.key === currentSearch) ? currentSearch : null
                        );
                        setModalOpen(true);
                    }}
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
                            {COUNTRIES.map((c) => (
                                <label
                                    key={c.slug}
                                    className="flex items-center justify-between gap-2 cursor-pointer py-1"
                                >
                                    <span className="flex items-center gap-2 text-sm">
                                        <Checkbox
                                            checked={draftCountries.includes(c.slug)}
                                            onCheckedChange={() => toggleDraftCountry(c.slug)}
                                        />
                                        {c.label}
                                    </span>
                                    {countsLoading ? (
                                        <Skeleton className="h-5 w-6 rounded-full" />
                                    ) : (
                                        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-muted px-1 text-[11px] text-muted-foreground">
                                            {countryCounts[c.slug] ?? "—"}
                                        </span>
                                    )}
                                </label>
                            ))}
                        </div>

                        <div className="space-y-2 border-t pt-4">
                            <p className="text-sm font-semibold">{t("destination_label")}</p>
                            {DESTINATIONS.map((d) => (
                                <label
                                    key={d.key}
                                    className="flex items-center justify-between gap-2 cursor-pointer py-1"
                                >
                                    <span className="flex items-center gap-2 text-sm">
                                        <Checkbox
                                            checked={draftDestination === d.key}
                                            onCheckedChange={() => toggleDraftDestination(d.key)}
                                        />
                                        {d.label}
                                    </span>
                                    {countsLoading ? (
                                        <Skeleton className="h-5 w-6 rounded-full" />
                                    ) : (
                                        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-muted px-1 text-[11px] text-muted-foreground">
                                            {destinationCounts[d.key] ?? "—"}
                                        </span>
                                    )}
                                </label>
                            ))}
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