"use client";

import { useEffect, useState } from "react";
import { useT } from "next-i18next/client";
import { Save, Plus, MapPinned, Landmark } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

import {
    getSiteStats,
    updateSiteStats,
    getCountries,
    getDestinations,
    createCountry,
    createDestination,
} from "@/lib/api";
import { showSuccess, showError } from "@/lib/toast";
import type { SiteStats, Country, Destination } from "@/types";

const EMPTY_STATS: SiteStats = {
    years_experience: 0,
    satisfaction_percent: 0,
    completed_trips: 0,
    happy_travelers: 0,
};

function slugify(text: string) {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");
}

export default function AdminSettingsPage() {
    const { t } = useT("admin");

    // --- Site stats ---
    const [statsForm, setStatsForm] = useState<SiteStats>(EMPTY_STATS);
    const [isLoadingStats, setIsLoadingStats] = useState(true);
    const [statsLoadError, setStatsLoadError] = useState<string | null>(null);
    const [isSavingStats, setIsSavingStats] = useState(false);

    useEffect(() => {
        let cancelled = false;
        getSiteStats()
            .then((data) => {
                if (!cancelled) setStatsForm(data);
            })
            .catch((err) => {
                if (!cancelled) {
                    setStatsLoadError(err instanceof Error ? err.message : t("settings.error_generic"));
                }
            })
            .finally(() => {
                if (!cancelled) setIsLoadingStats(false);
            });
        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function handleSaveStats(e: React.FormEvent) {
        e.preventDefault();
        setIsSavingStats(true);
        try {
            const updated = await updateSiteStats(statsForm);
            setStatsForm(updated);
            showSuccess(t("settings.site_stats.save_success"));
        } catch (err) {
            showError(err instanceof Error ? err.message : t("settings.error_generic"));
        } finally {
            setIsSavingStats(false);
        }
    }

    function updateStatsField(key: keyof SiteStats, value: string) {
        setStatsForm((f) => ({ ...f, [key]: value === "" ? 0 : Number(value) }));
    }

    // --- Geography: Countries ---
    const [countries, setCountries] = useState<Country[]>([]);
    const [isLoadingCountries, setIsLoadingCountries] = useState(true);
    const [countryName, setCountryName] = useState("");
    const [countrySlug, setCountrySlug] = useState("");
    const [countrySlugTouched, setCountrySlugTouched] = useState(false);
    const [isSavingCountry, setIsSavingCountry] = useState(false);

    // --- Geography: Destinations ---
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [isLoadingDestinations, setIsLoadingDestinations] = useState(true);
    const [destinationName, setDestinationName] = useState("");
    const [destinationSlug, setDestinationSlug] = useState("");
    const [destinationSlugTouched, setDestinationSlugTouched] = useState(false);
    const [destinationCountryId, setDestinationCountryId] = useState("");
    const [isSavingDestination, setIsSavingDestination] = useState(false);

    async function loadGeography() {
        setIsLoadingCountries(true);
        setIsLoadingDestinations(true);
        try {
            const [countriesRes, destinationsRes] = await Promise.all([
                getCountries("uz"),
                getDestinations("uz"),
            ]);
            setCountries(countriesRes);
            setDestinations(destinationsRes);
        } catch (err) {
            showError(err instanceof Error ? err.message : t("settings.error_generic"));
        } finally {
            setIsLoadingCountries(false);
            setIsLoadingDestinations(false);
        }
    }

    useEffect(() => {
        loadGeography();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function handleCountryNameChange(value: string) {
        setCountryName(value);
        if (!countrySlugTouched) setCountrySlug(slugify(value));
    }

    async function handleCreateCountry(e: React.FormEvent) {
        e.preventDefault();
        setIsSavingCountry(true);
        try {
            await createCountry({ name: countryName, slug: countrySlug });
            showSuccess(t("settings.geography.country_created"));
            setCountryName("");
            setCountrySlug("");
            setCountrySlugTouched(false);
            await loadGeography();
        } catch (err) {
            showError(err instanceof Error ? err.message : t("settings.error_generic"));
        } finally {
            setIsSavingCountry(false);
        }
    }

    function handleDestinationNameChange(value: string) {
        setDestinationName(value);
        if (!destinationSlugTouched) setDestinationSlug(slugify(value));
    }

    async function handleCreateDestination(e: React.FormEvent) {
        e.preventDefault();
        if (!destinationCountryId) {
            showError(t("settings.geography.select_country_first"));
            return;
        }
        setIsSavingDestination(true);
        try {
            await createDestination({
                name: destinationName,
                slug: destinationSlug,
                country_id: destinationCountryId,
            });
            showSuccess(t("settings.geography.destination_created"));
            setDestinationName("");
            setDestinationSlug("");
            setDestinationSlugTouched(false);
            await loadGeography();
        } catch (err) {
            showError(err instanceof Error ? err.message : t("settings.error_generic"));
        } finally {
            setIsSavingDestination(false);
        }
    }

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-semibold">{t("settings.title")}</h1>
                <p className="text-sm text-muted-foreground">{t("settings.subtitle")}</p>
            </div>

            {/* Site stats */}
            <Card>
                <CardHeader>
                    <CardTitle>{t("settings.site_stats.title")}</CardTitle>
                    <p className="text-sm text-muted-foreground">{t("settings.site_stats.subtitle")}</p>
                </CardHeader>
                <CardContent>
                    {isLoadingStats ? (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <Skeleton key={i} className="h-16 w-full" />
                            ))}
                        </div>
                    ) : statsLoadError ? (
                        <p className="text-sm text-destructive">{statsLoadError}</p>
                    ) : (
                        <form onSubmit={handleSaveStats} className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="years_experience">
                                        {t("settings.site_stats.years_experience")}
                                    </Label>
                                    <Input
                                        id="years_experience"
                                        type="number"
                                        min={0}
                                        value={statsForm.years_experience}
                                        onFocus={(e) => e.target.select()}
                                        onChange={(e) => updateStatsField("years_experience", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="satisfaction_percent">
                                        {t("settings.site_stats.satisfaction_percent")}
                                    </Label>
                                    <Input
                                        id="satisfaction_percent"
                                        type="number"
                                        min={0}
                                        max={100}
                                        value={statsForm.satisfaction_percent}
                                        onFocus={(e) => e.target.select()}
                                        onChange={(e) => updateStatsField("satisfaction_percent", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="completed_trips">
                                        {t("settings.site_stats.completed_trips")}
                                    </Label>
                                    <Input
                                        id="completed_trips"
                                        type="number"
                                        min={0}
                                        value={statsForm.completed_trips}
                                        onFocus={(e) => e.target.select()}
                                        onChange={(e) => updateStatsField("completed_trips", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="happy_travelers">
                                        {t("settings.site_stats.happy_travelers")}
                                    </Label>
                                    <Input
                                        id="happy_travelers"
                                        type="number"
                                        min={0}
                                        value={statsForm.happy_travelers}
                                        onFocus={(e) => e.target.select()}
                                        onChange={(e) => updateStatsField("happy_travelers", e.target.value)}
                                    />
                                </div>
                            </div>
                            <Button type="submit" disabled={isSavingStats} className="gap-1.5">
                                <Save className="h-3.5 w-3.5" />
                                {isSavingStats ? t("settings.site_stats.saving") : t("settings.site_stats.save")}
                            </Button>
                        </form>
                    )}
                </CardContent>
            </Card>

            {/* Geography: Countries */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Landmark className="h-4 w-4" />
                        {t("settings.geography.countries_title")}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">{t("settings.geography.countries_subtitle")}</p>
                </CardHeader>
                <CardContent className="space-y-5">
                    <form onSubmit={handleCreateCountry} className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:items-end">
                        <div className="space-y-1.5">
                            <Label htmlFor="country_name">{t("settings.geography.name")}</Label>
                            <Input
                                id="country_name"
                                value={countryName}
                                onChange={(e) => handleCountryNameChange(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="country_slug">{t("settings.geography.slug")}</Label>
                            <Input
                                id="country_slug"
                                value={countrySlug}
                                onChange={(e) => {
                                    setCountrySlug(e.target.value);
                                    setCountrySlugTouched(true);
                                }}
                                required
                            />
                        </div>
                        <Button type="submit" disabled={isSavingCountry} className="gap-1.5">
                            <Plus className="h-3.5 w-3.5" />
                            {isSavingCountry ? t("settings.geography.saving") : t("settings.geography.add")}
                        </Button>
                    </form>

                    {isLoadingCountries ? (
                        <div className="space-y-2">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <Skeleton key={i} className="h-9 w-full" />
                            ))}
                        </div>
                    ) : countries.length === 0 ? (
                        <p className="text-sm text-muted-foreground py-4 text-center">
                            {t("settings.geography.no_countries")}
                        </p>
                    ) : (
                        <div className="space-y-1.5">
                            {countries.map((c) => (
                                <div
                                    key={c.id}
                                    className="flex items-center justify-between rounded-lg border border-border px-3 py-2"
                                >
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="font-medium">{c.name}</span>
                                        <span className="text-muted-foreground text-xs">/{c.slug}</span>
                                    </div>
                                    <Badge variant="secondary">
                                        {t("settings.geography.tour_count", { count: c.tour_count ?? 0 })}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Geography: Destinations */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MapPinned className="h-4 w-4" />
                        {t("settings.geography.destinations_title")}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">{t("settings.geography.destinations_subtitle")}</p>
                </CardHeader>
                <CardContent className="space-y-5">
                    <form
                        onSubmit={handleCreateDestination}
                        className="grid grid-cols-1 gap-3 sm:grid-cols-4 sm:items-end"
                    >
                        <div className="space-y-1.5">
                            <Label htmlFor="destination_country">{t("settings.geography.country")}</Label>
                            <select
                                id="destination_country"
                                required
                                value={destinationCountryId}
                                onChange={(e) => setDestinationCountryId(e.target.value)}
                                className="h-9 w-full rounded-md border border-input bg-input/20 px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
                            >
                                <option value="" disabled>
                                    {t("settings.geography.select_country")}
                                </option>
                                {countries.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="destination_name">{t("settings.geography.name")}</Label>
                            <Input
                                id="destination_name"
                                value={destinationName}
                                onChange={(e) => handleDestinationNameChange(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="destination_slug">{t("settings.geography.slug")}</Label>
                            <Input
                                id="destination_slug"
                                value={destinationSlug}
                                onChange={(e) => {
                                    setDestinationSlug(e.target.value);
                                    setDestinationSlugTouched(true);
                                }}
                                required
                            />
                        </div>
                        <Button type="submit" disabled={isSavingDestination} className="gap-1.5">
                            <Plus className="h-3.5 w-3.5" />
                            {isSavingDestination ? t("settings.geography.saving") : t("settings.geography.add")}
                        </Button>
                    </form>

                    {isLoadingDestinations ? (
                        <div className="space-y-2">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <Skeleton key={i} className="h-9 w-full" />
                            ))}
                        </div>
                    ) : destinations.length === 0 ? (
                        <p className="text-sm text-muted-foreground py-4 text-center">
                            {t("settings.geography.no_destinations")}
                        </p>
                    ) : (
                        <div className="space-y-1.5">
                            {destinations.map((d) => {
                                const countryName = countries.find((c) => c.id === d.country_id)?.name;
                                return (
                                    <div
                                        key={d.id}
                                        className="flex items-center justify-between rounded-lg border border-border px-3 py-2"
                                    >
                                        <div className="flex items-center gap-2 text-sm">
                                            <span className="font-medium">{d.name}</span>
                                            <span className="text-muted-foreground text-xs">/{d.slug}</span>
                                        </div>
                                        {countryName && (
                                            <span className="text-xs text-muted-foreground">{countryName}</span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}