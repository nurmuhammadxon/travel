"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useT } from "next-i18next/client";

import {
    getCountries, getDestinations,
    createCountry, updateCountry, deleteCountry,
    createDestination, updateDestination, deleteDestination,
} from "@/lib/api";
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

    const [countries, setCountries] = useState<Country[]>([]);
    const [isLoadingCountries, setIsLoadingCountries] = useState(true);
    const [countryName, setCountryName] = useState<LocalizedText>(EMPTY_LOCALIZED);
    const [countrySlug, setCountrySlug] = useState("");
    const [countrySlugTouched, setCountrySlugTouched] = useState(false);
    const [countryCoverImage, setCountryCoverImage] = useState("");
    const [editingCountryId, setEditingCountryId] = useState<string | null>(null);
    const [deletingCountryId, setDeletingCountryId] = useState<string | null>(null);
    const [countrySaveTick, setCountrySaveTick] = useState(0);
    const [isSavingCountry, setIsSavingCountry] = useState(false);

    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [isLoadingDestinations, setIsLoadingDestinations] = useState(true);
    const [destinationName, setDestinationName] = useState<LocalizedText>(EMPTY_LOCALIZED);
    const [destinationSlug, setDestinationSlug] = useState("");
    const [destinationSlugTouched, setDestinationSlugTouched] = useState(false);
    const [destinationCountryId, setDestinationCountryId] = useState("");
    const [destinationDescription, setDestinationDescription] = useState("");
    const [destinationCoverImage, setDestinationCoverImage] = useState("");
    const [editingDestinationId, setEditingDestinationId] = useState<string | null>(null);
    const [deletingDestinationId, setDeletingDestinationId] = useState<string | null>(null);
    const [destinationSaveTick, setDestinationSaveTick] = useState(0);
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
    }, [open]);

    function handleCountryNameChange(next: LocalizedText) {
        setCountryName(next);
        if (!countrySlugTouched) setCountrySlug(slugify(next.uz || next.ru || next.en || ""));
    }

    function resetCountryForm() {
        setCountryName(EMPTY_LOCALIZED);
        setCountrySlug("");
        setCountrySlugTouched(false);
        setCountryCoverImage("");
        setEditingCountryId(null);
    }

    function startEditCountry(country: Country) {
        setEditingCountryId(country.id);
        setCountryName(
            typeof country.name === "string"
                ? { uz: country.name, ru: country.name, en: country.name }
                : { uz: country.name?.uz ?? "", ru: country.name?.ru ?? "", en: country.name?.en ?? "" }
        );
        setCountrySlug(country.slug);
        setCountrySlugTouched(true);
        setCountryCoverImage(country.cover_image ?? "");
    }

    function cancelEditCountry() {
        resetCountryForm();
    }

    async function handleCreateCountry(e: React.FormEvent) {
        e.preventDefault();
        setIsSavingCountry(true);
        try {
            const payload = {
                name: countryName,
                slug: countrySlug,
                cover_image: countryCoverImage || undefined,
            };
            if (editingCountryId) {
                await updateCountry(editingCountryId, payload);
                showSuccess(t("settings.geography.country_updated"));
            } else {
                await createCountry(payload);
                showSuccess(t("settings.geography.country_created"));
            }
            resetCountryForm();
            setCountrySaveTick((n) => n + 1);
            await loadGeography();
        } catch (err) {
            showError(err instanceof Error ? err.message : t("settings.error_generic"));
        } finally {
            setIsSavingCountry(false);
        }
    }

    async function handleDeleteCountry(country: Country) {
        if (typeof window !== "undefined") {
            const ok = window.confirm(t("settings.geography.confirm_delete_country"));
            if (!ok) return;
        }
        setDeletingCountryId(country.id);
        try {
            await deleteCountry(country.id);
            showSuccess(t("settings.geography.delete_success"));
            if (editingCountryId === country.id) resetCountryForm();
            await loadGeography();
        } catch (err) {
            showError(err instanceof Error ? err.message : t("settings.geography.delete_error"));
        } finally {
            setDeletingCountryId(null);
        }
    }

    function handleDestinationNameChange(next: LocalizedText) {
        setDestinationName(next);
        if (!destinationSlugTouched) setDestinationSlug(slugify(next.uz || next.ru || next.en || ""));
    }

    function resetDestinationForm() {
        setDestinationName(EMPTY_LOCALIZED);
        setDestinationSlug("");
        setDestinationSlugTouched(false);
        setDestinationDescription("");
        setDestinationCoverImage("");
        setEditingDestinationId(null);
    }

    function startEditDestination(destination: Destination) {
        setEditingDestinationId(destination.id);
        setDestinationName(
            typeof destination.name === "string"
                ? { uz: destination.name, ru: destination.name, en: destination.name }
                : { uz: destination.name?.uz ?? "", ru: destination.name?.ru ?? "", en: destination.name?.en ?? "" }
        );
        setDestinationSlug(destination.slug);
        setDestinationSlugTouched(true);
        setDestinationCountryId(destination.country_id);
        setDestinationDescription(destination.description ?? "");
        setDestinationCoverImage(destination.cover_image ?? "");
    }

    function cancelEditDestination() {
        resetDestinationForm();
    }

    async function handleCreateDestination(e: React.FormEvent) {
        e.preventDefault();
        if (!destinationCountryId) {
            showError(t("settings.geography.select_country_first"));
            return;
        }
        setIsSavingDestination(true);
        try {
            const payload = {
                name: destinationName,
                slug: destinationSlug,
                country_id: destinationCountryId,
                description: destinationDescription || undefined,
                cover_image: destinationCoverImage || undefined,
            };
            if (editingDestinationId) {
                await updateDestination(editingDestinationId, payload);
                showSuccess(t("settings.geography.destination_updated"));
            } else {
                await createDestination(payload);
                showSuccess(t("settings.geography.destination_created"));
            }
            resetDestinationForm();
            setDestinationSaveTick((n) => n + 1);
            await loadGeography();
        } catch (err) {
            showError(err instanceof Error ? err.message : t("settings.error_generic"));
        } finally {
            setIsSavingDestination(false);
        }
    }

    async function handleDeleteDestination(destination: Destination) {
        if (typeof window !== "undefined") {
            const ok = window.confirm(t("settings.geography.confirm_delete_destination"));
            if (!ok) return;
        }
        setDeletingDestinationId(destination.id);
        try {
            await deleteDestination(destination.id);
            showSuccess(t("settings.geography.delete_success"));
            if (editingDestinationId === destination.id) resetDestinationForm();
            await loadGeography();
        } catch (err) {
            showError(err instanceof Error ? err.message : t("settings.geography.delete_error"));
        } finally {
            setDeletingDestinationId(null);
        }
    }

    return {
        t, lng,
        countries, isLoadingCountries,
        countryName, setCountryName: handleCountryNameChange,
        countrySlug, setCountrySlug: (v: string) => { setCountrySlug(v); setCountrySlugTouched(true); },
        countryCoverImage, setCountryCoverImage,
        isSavingCountry, handleCreateCountry,
        editingCountryId, startEditCountry, cancelEditCountry,
        deletingCountryId, handleDeleteCountry, countrySaveTick,

        destinations, isLoadingDestinations,
        destinationName, setDestinationName: handleDestinationNameChange,
        destinationSlug, setDestinationSlug: (v: string) => { setDestinationSlug(v); setDestinationSlugTouched(true); },
        destinationCountryId, setDestinationCountryId,
        destinationDescription, setDestinationDescription,
        destinationCoverImage, setDestinationCoverImage,
        isSavingDestination, handleCreateDestination,
        editingDestinationId, startEditDestination, cancelEditDestination,
        deletingDestinationId, handleDeleteDestination, destinationSaveTick,
    };
}

export type UseGeographyManagerReturn = ReturnType<typeof useGeographyManager>;