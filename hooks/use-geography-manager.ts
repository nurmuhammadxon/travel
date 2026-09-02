"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useT } from "next-i18next/client";

import { getCountries, getDestinations, createCountry, createDestination } from "@/lib/api";
import { showSuccess, showError } from "@/lib/toast";
import type { Country, Destination, LocalizedText } from "@/types";

const EMPTY_LOCALIZED: LocalizedText = { uz: "", ru: "", en: "" };

function slugify(text: string) {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");
}

export function useGeographyManager(open: boolean) {
    const { t } = useT("admin");
    const params = useParams<{ lng: string }>();
    const lng = params.lng ?? "uz";

    // --- Countries ---
    const [countries, setCountries] = useState<Country[]>([]);
    const [isLoadingCountries, setIsLoadingCountries] = useState(true);
    const [countryName, setCountryName] = useState<LocalizedText>(EMPTY_LOCALIZED);
    const [countrySlug, setCountrySlug] = useState("");
    const [countrySlugTouched, setCountrySlugTouched] = useState(false);
    const [countryCoverImage, setCountryCoverImage] = useState("");
    const [isSavingCountry, setIsSavingCountry] = useState(false);

    // --- Destinations ---
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [isLoadingDestinations, setIsLoadingDestinations] = useState(true);
    const [destinationName, setDestinationName] = useState<LocalizedText>(EMPTY_LOCALIZED);
    const [destinationSlug, setDestinationSlug] = useState("");
    const [destinationSlugTouched, setDestinationSlugTouched] = useState(false);
    const [destinationCountryId, setDestinationCountryId] = useState("");
    const [destinationDescription, setDestinationDescription] = useState("");
    const [destinationCoverImage, setDestinationCoverImage] = useState("");
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

    function handleCountryNameChange(next: LocalizedText) {
        setCountryName(next);
        if (!countrySlugTouched) setCountrySlug(slugify(next.uz || next.ru || next.en || ""));
    }

    async function handleCreateCountry(e: React.FormEvent) {
        e.preventDefault();
        setIsSavingCountry(true);
        try {
            await createCountry({
                name: countryName,
                slug: countrySlug,
                cover_image: countryCoverImage || undefined,
            });
            showSuccess(t("settings.geography.country_created"));
            setCountryName(EMPTY_LOCALIZED);
            setCountrySlug("");
            setCountrySlugTouched(false);
            setCountryCoverImage("");
            await loadGeography();
        } catch (err) {
            showError(err instanceof Error ? err.message : t("settings.error_generic"));
        } finally {
            setIsSavingCountry(false);
        }
    }

    function handleDestinationNameChange(next: LocalizedText) {
        setDestinationName(next);
        if (!destinationSlugTouched) setDestinationSlug(slugify(next.uz || next.ru || next.en || ""));
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
                description: destinationDescription || undefined,
                cover_image: destinationCoverImage || undefined,
            });
            showSuccess(t("settings.geography.destination_created"));
            setDestinationName(EMPTY_LOCALIZED);
            setDestinationSlug("");
            setDestinationSlugTouched(false);
            setDestinationDescription("");
            setDestinationCoverImage("");
            await loadGeography();
        } catch (err) {
            showError(err instanceof Error ? err.message : t("settings.error_generic"));
        } finally {
            setIsSavingDestination(false);
        }
    }

    return {
        t, lng,
        countries, isLoadingCountries,
        countryName, setCountryName: handleCountryNameChange,
        countrySlug, setCountrySlug: (v: string) => { setCountrySlug(v); setCountrySlugTouched(true); },
        countryCoverImage, setCountryCoverImage,
        isSavingCountry, handleCreateCountry,

        destinations, isLoadingDestinations,
        destinationName, setDestinationName: handleDestinationNameChange,
        destinationSlug, setDestinationSlug: (v: string) => { setDestinationSlug(v); setDestinationSlugTouched(true); },
        destinationCountryId, setDestinationCountryId,
        destinationDescription, setDestinationDescription,
        destinationCoverImage, setDestinationCoverImage,
        isSavingDestination, handleCreateDestination,
    };
}

export type UseGeographyManagerReturn = ReturnType<typeof useGeographyManager>;