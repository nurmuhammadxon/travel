"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useT } from "next-i18next/client";
import { Globe, Plus, MapPinned, Landmark } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

import { getCountries, getDestinations, createCountry, createDestination } from "@/lib/api";
import { showSuccess, showError } from "@/lib/toast";
import { localizedText } from "@/lib/utils";
import type { Country, Destination } from "@/types";

function slugify(text: string) {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");
}

export function GeographyManagerDialog() {
    const { t } = useT("admin");
    const params = useParams<{ lng: string }>();
    const lng = params.lng ?? "uz";
    const [open, setOpen] = useState(false);

    // --- Countries ---
    const [countries, setCountries] = useState<Country[]>([]);
    const [isLoadingCountries, setIsLoadingCountries] = useState(true);
    const [countryName, setCountryName] = useState("");
    const [countrySlug, setCountrySlug] = useState("");
    const [countrySlugTouched, setCountrySlugTouched] = useState(false);
    const [isSavingCountry, setIsSavingCountry] = useState(false);

    // --- Destinations ---
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
                getCountries(),
                getDestinations(),
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
        if (open) loadGeography();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    function handleCountryNameChange(value: string) {
        setCountryName(value);
        if (!countrySlugTouched) setCountrySlug(slugify(value));
    }

    async function handleCreateCountry(e: React.FormEvent) {
        e.preventDefault();
        setIsSavingCountry(true);
        try {
            await createCountry({
                name: { uz: countryName, ru: countryName, en: countryName },
                slug: countrySlug,
            });
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
                name: { uz: destinationName, ru: destinationName, en: destinationName },
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
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button variant="outline" className="gap-1.5" />}>
                <Globe className="h-3.5 w-3.5" />
                {t("settings.geography.manage_button")}
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{t("settings.geography.dialog_title")}</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Countries */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Landmark className="h-4 w-4" />
                                {t("settings.geography.countries_title")}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <form
                                onSubmit={handleCreateCountry}
                                className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:items-end"
                            >
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
                                <Button type="submit" disabled={isSavingCountry} size="sm" className="gap-1.5">
                                    <Plus className="h-3.5 w-3.5" />
                                    {isSavingCountry
                                        ? t("settings.geography.saving")
                                        : t("settings.geography.add")}
                                </Button>
                            </form>

                            {isLoadingCountries ? (
                                <div className="space-y-2">
                                    {Array.from({ length: 3 }).map((_, i) => (
                                        <Skeleton key={i} className="h-9 w-full" />
                                    ))}
                                </div>
                            ) : countries.length === 0 ? (
                                <p className="text-sm text-muted-foreground py-2 text-center">
                                    {t("settings.geography.no_countries")}
                                </p>
                            ) : (
                                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                                    {countries.map((c) => (
                                        <div
                                            key={c.id}
                                            className="flex items-center justify-between rounded-lg border border-border px-3 py-2"
                                        >
                                            <div className="flex items-center gap-2 text-sm">
                                                <span className="font-medium">
                                                    {localizedText(c.name, lng)}
                                                </span>
                                                <span className="text-muted-foreground text-xs">/{c.slug}</span>
                                            </div>
                                            <Badge variant="secondary">
                                                {t("settings.geography.tour_count", {
                                                    count: c.tour_count ?? 0,
                                                })}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Destinations */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <MapPinned className="h-4 w-4" />
                                {t("settings.geography.destinations_title")}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <form
                                onSubmit={handleCreateDestination}
                                className="grid grid-cols-1 gap-3 sm:grid-cols-4 sm:items-end"
                            >
                                <div className="space-y-1.5">
                                    <Label htmlFor="destination_country">
                                        {t("settings.geography.country")}
                                    </Label>
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
                                                {localizedText(c.name, lng)}
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
                                <Button
                                    type="submit"
                                    disabled={isSavingDestination}
                                    size="sm"
                                    className="gap-1.5"
                                >
                                    <Plus className="h-3.5 w-3.5" />
                                    {isSavingDestination
                                        ? t("settings.geography.saving")
                                        : t("settings.geography.add")}
                                </Button>
                            </form>

                            {isLoadingDestinations ? (
                                <div className="space-y-2">
                                    {Array.from({ length: 3 }).map((_, i) => (
                                        <Skeleton key={i} className="h-9 w-full" />
                                    ))}
                                </div>
                            ) : destinations.length === 0 ? (
                                <p className="text-sm text-muted-foreground py-2 text-center">
                                    {t("settings.geography.no_destinations")}
                                </p>
                            ) : (
                                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                                    {destinations.map((d) => {
                                        const countryName = countries.find(
                                            (c) => c.id === d.country_id
                                        )?.name;
                                        return (
                                            <div
                                                key={d.id}
                                                className="flex items-center justify-between rounded-lg border border-border px-3 py-2"
                                            >
                                                <div className="flex items-center gap-2 text-sm">
                                                    <span className="font-medium">
                                                        {localizedText(d.name, lng)}
                                                    </span>
                                                    <span className="text-muted-foreground text-xs">
                                                        /{d.slug}
                                                    </span>
                                                </div>
                                                {countryName && (
                                                    <span className="text-xs text-muted-foreground">
                                                        {localizedText(countryName, lng)}
                                                    </span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </DialogContent>
        </Dialog>
    );
}