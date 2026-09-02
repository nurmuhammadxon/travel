"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useT } from "next-i18next/client";
import { createTour, updateTour, uploadReviewImage } from "@/lib/api";
import { showSuccess, showError } from "@/lib/toast";
import type { AdminTourDetail, TourPayload, RoutePoint, RoutePointType, RouteActivityType } from "@/types";

export type MultiLangText = { uz: string; ru: string; en: string };

export interface FaqItem {
    question: MultiLangText;
    answer: MultiLangText;
}

export interface RoutePointForm {
    order: number;
    type: RoutePointType;
    name: MultiLangText;
    address: MultiLangText;
    activity_type: RouteActivityType | "";
    duration_minutes: number | null;
    has_extra_fee: boolean;
    latitude: number | null;
    longitude: number | null;
}

export interface PricingOption {
    id?: string;
    type: string;
    label: MultiLangText;
    price: number;
    currency: string;
    min_people: number;
    max_people: number | null;
}

function slugify(text: string) {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");
}

function toMultiLang(value?: string | { uz?: string; ru?: string; en?: string } | null): MultiLangText {
    if (!value) return { uz: "", ru: "", en: "" };
    if (typeof value === "string") return { uz: value, ru: value, en: value };
    return { uz: value.uz ?? "", ru: value.ru ?? "", en: value.en ?? "" };
}

function listToText(list?: string[]) {
    return (list ?? []).join("\n");
}
function textToList(text: string) {
    return text
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);
}

export function useTourForm(initialData?: AdminTourDetail) {
    const { t } = useT("admin");
    const router = useRouter();
    const params = useParams<{ lng: string }>();
    const lng = params.lng ?? "uz";
    const prefix = lng === "uz" ? "" : `/${lng}`;
    const isEdit = !!initialData;

    // Asosiy ma'lumot
    const [titleUz, setTitleUz] = useState(initialData?.title?.uz ?? "");
    const [titleRu, setTitleRu] = useState(initialData?.title?.ru ?? "");
    const [titleEn, setTitleEn] = useState(initialData?.title?.en ?? "");
    const [slug, setSlug] = useState(initialData?.slug ?? "");
    const [slugTouched, setSlugTouched] = useState(isEdit);

    const [shortDescUz, setShortDescUz] = useState(initialData?.short_description?.uz ?? "");
    const [shortDescRu, setShortDescRu] = useState(initialData?.short_description?.ru ?? "");
    const [shortDescEn, setShortDescEn] = useState(initialData?.short_description?.en ?? "");

    const [descUz, setDescUz] = useState(initialData?.description?.uz ?? "");
    const [descRu, setDescRu] = useState(initialData?.description?.ru ?? "");
    const [descEn, setDescEn] = useState(initialData?.description?.en ?? "");

    // Narx / parametrlar
    const [category, setCategory] = useState(initialData?.category ?? "");
    const [durationDays, setDurationDays] = useState(initialData?.duration_days ?? 1);
    const [durationNights, setDurationNights] = useState(initialData?.duration_nights ?? 0);
    const [price, setPrice] = useState(initialData?.price ?? 0);
    const [currency, setCurrency] = useState(initialData?.currency ?? "USD");
    const [maxGroupSize, setMaxGroupSize] = useState(initialData?.max_group_size ?? 10);
    const [coverImage, setCoverImage] = useState(initialData?.cover_image ?? "");
    const [isFeatured, setIsFeatured] = useState(initialData?.is_featured ?? false);
    const [isActive, setIsActive] = useState(initialData?.is_active ?? true);
    const [technicalLevel, setTechnicalLevel] = useState<number>(initialData?.technical_level ?? 1);
    const [minAge, setMinAge] = useState<number>(initialData?.min_age ?? 0);
    const [fitnessLevel, setFitnessLevel] = useState<number>(initialData?.fitness_level ?? 1);

    // Geografiya (checkbox orqali)
    const [countryIds, setCountryIds] = useState<string[]>(initialData?.country_ids ?? []);
    const [destinationIds, setDestinationIds] = useState<string[]>(initialData?.destination_ids ?? []);

    function toggleCountry(id: string) {
        setCountryIds((prev) =>
            prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
        );
    }

    function toggleDestination(id: string) {
        setDestinationIds((prev) =>
            prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
        );
    }

    // Galereya
    const [images, setImages] = useState<string[]>(initialData?.images ?? []);
    const [isUploadingGallery, setIsUploadingGallery] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    // Highlights / Included / Excluded
    const [highlightsUz, setHighlightsUz] = useState(listToText(initialData?.highlights?.uz));
    const [highlightsRu, setHighlightsRu] = useState(listToText(initialData?.highlights?.ru));
    const [highlightsEn, setHighlightsEn] = useState(listToText(initialData?.highlights?.en));
    const [includedUz, setIncludedUz] = useState(listToText(initialData?.included?.uz));
    const [includedRu, setIncludedRu] = useState(listToText(initialData?.included?.ru));
    const [includedEn, setIncludedEn] = useState(listToText(initialData?.included?.en));
    const [excludedUz, setExcludedUz] = useState(listToText(initialData?.excluded?.uz));
    const [excludedRu, setExcludedRu] = useState(listToText(initialData?.excluded?.ru));
    const [excludedEn, setExcludedEn] = useState(listToText(initialData?.excluded?.en));

    // FAQ
    const [faqs, setFaqs] = useState<FaqItem[]>(initialData?.faqs ?? []);
    function addFaq() {
        setFaqs([...faqs, { question: { uz: "", ru: "", en: "" }, answer: { uz: "", ru: "", en: "" } }]);
    }
    function removeFaq(index: number) {
        setFaqs(faqs.filter((_, i) => i !== index));
    }
    function updateFaq(index: number, field: "question" | "answer", lang: "uz" | "ru" | "en", value: string) {
        const updated = [...faqs];
        updated[index] = { ...updated[index], [field]: { ...updated[index][field], [lang]: value } };
        setFaqs(updated);
    }

    // Pricing options
    const [pricingOptions, setPricingOptions] = useState<PricingOption[]>(initialData?.pricing_options ?? []);
    function addPricingOption() {
        setPricingOptions([
            ...pricingOptions,
            { type: "group", label: { uz: "", ru: "", en: "" }, price: 0, currency: "USD", min_people: 1, max_people: null },
        ]);
    }
    function removePricingOption(index: number) {
        setPricingOptions(pricingOptions.filter((_, i) => i !== index));
    }
    function updatePricingOption(index: number, field: string, value: any) {
        const updated = [...pricingOptions];
        updated[index] = { ...updated[index], [field]: value };
        setPricingOptions(updated);
    }
    function updatePricingLabel(index: number, lang: "uz" | "ru" | "en", value: string) {
        const updated = [...pricingOptions];
        updated[index] = { ...updated[index], label: { ...updated[index].label, [lang]: value } };
        setPricingOptions(updated);
    }

    // Route points (marshrut nuqtalari)
    const [routePoints, setRoutePoints] = useState<RoutePointForm[]>(
        (initialData?.route_points ?? []).map((p) => ({
            order: p.order,
            type: p.type,
            name: toMultiLang(p.name),
            address: toMultiLang(p.address),
            activity_type: (p.activity_type as RouteActivityType) ?? "",
            duration_minutes: p.duration_minutes ?? null,
            has_extra_fee: p.has_extra_fee ?? false,
            latitude: p.latitude ?? null,
            longitude: p.longitude ?? null,
        }))
    );

    function addRoutePoint(type: RoutePointType = "stop") {
        setRoutePoints((prev) => [
            ...prev,
            {
                order: prev.length + 1,
                type,
                name: { uz: "", ru: "", en: "" },
                address: { uz: "", ru: "", en: "" },
                activity_type: "",
                duration_minutes: null,
                has_extra_fee: false,
                latitude: null,
                longitude: null,
            },
        ]);
    }

    function removeRoutePoint(index: number) {
        setRoutePoints((prev) =>
            prev.filter((_, i) => i !== index).map((p, i) => ({ ...p, order: i + 1 }))
        );
    }

    function updateRoutePoint(index: number, field: keyof RoutePointForm, value: any) {
        setRoutePoints((prev) => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    }

    function updateRoutePointText(index: number, field: "name" | "address", lang: "uz" | "ru" | "en", value: string) {
        setRoutePoints((prev) => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: { ...updated[index][field], [lang]: value } };
            return updated;
        });
    }

    function moveRoutePoint(index: number, direction: -1 | 1) {
        setRoutePoints((prev) => {
            const target = index + direction;
            if (target < 0 || target >= prev.length) return prev;
            const updated = [...prev];
            [updated[index], updated[target]] = [updated[target], updated[index]];
            return updated.map((p, i) => ({ ...p, order: i + 1 }));
        });
    }

    const [isSaving, setIsSaving] = useState(false);

    function handleTitleUzChange(value: string) {
        setTitleUz(value);
        if (!slugTouched) setSlug(slugify(value));
    }

    async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        setIsUploading(true);
        try {
            const { url } = await uploadReviewImage(file);
            setCoverImage(url);
        } catch (err) {
            showError(err instanceof Error ? err.message : t("form.upload_error"));
        } finally {
            setIsUploading(false);
        }
    }

    async function handleGalleryUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        setIsUploadingGallery(true);
        try {
            const uploaded: string[] = [];
            for (const file of Array.from(files)) {
                const { url } = await uploadReviewImage(file);
                uploaded.push(url);
            }
            setImages((prev) => [...prev, ...uploaded]);
        } catch (err) {
            showError(err instanceof Error ? err.message : t("form.upload_error"));
        } finally {
            setIsUploadingGallery(false);
            e.target.value = "";
        }
    }

    function removeGalleryImage(index: number) {
        setImages(images.filter((_, i) => i !== index));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const payload: TourPayload = {
            title: { uz: titleUz, ru: titleRu, en: titleEn },
            short_description: { uz: shortDescUz, ru: shortDescRu, en: shortDescEn },
            description: { uz: descUz, ru: descRu, en: descEn },
            category,
            duration_days: Number(durationDays),
            duration_nights: Number(durationNights),
            price: Number(price),
            currency,
            cover_image: coverImage,
            max_group_size: Number(maxGroupSize),
            is_featured: isFeatured,
            is_active: isActive,
            country_ids: countryIds,
            destination_ids: destinationIds,
            itinerary: initialData?.itinerary ?? [],
            images,
            technical_level: technicalLevel,
            min_age: minAge,
            fitness_level: fitnessLevel,
            highlights: { uz: textToList(highlightsUz), ru: textToList(highlightsRu), en: textToList(highlightsEn) },
            included: { uz: textToList(includedUz), ru: textToList(includedRu), en: textToList(includedEn) },
            excluded: { uz: textToList(excludedUz), ru: textToList(excludedRu), en: textToList(excludedEn) },
            faqs,
            pricing_options: pricingOptions,
            route_points: routePoints.map((p) => ({
                order: p.order,
                type: p.type,
                name: p.name,
                ...(p.type !== "stop" ? { address: p.address } : {}),
                ...(p.type === "stop" && p.activity_type ? { activity_type: p.activity_type } : {}),
                ...(p.type === "stop" && p.duration_minutes ? { duration_minutes: Number(p.duration_minutes) } : {}),
                has_extra_fee: p.has_extra_fee,
                ...(p.latitude !== null ? { latitude: Number(p.latitude) } : {}),
                ...(p.longitude !== null ? { longitude: Number(p.longitude) } : {}),
            })),
        };

        if (!isEdit) payload.slug = slug;

        setIsSaving(true);
        try {
            if (isEdit && initialData) {
                await updateTour(initialData.id, payload);
                showSuccess(t("form.update_success"));
            } else {
                await createTour(payload);
                showSuccess(t("form.create_success"));
            }
            router.push(`${prefix}/admin/tours`);
        } catch (err) {
            showError(err instanceof Error ? err.message : t("form.save_error"));
        } finally {
            setIsSaving(false);
        }
    }

    return {
        t, isEdit, router, prefix,
        titleUz, setTitleUz: handleTitleUzChange, titleRu, setTitleRu, titleEn, setTitleEn,
        slug, setSlug: (v: string) => { setSlug(v); setSlugTouched(true); },
        shortDescUz, setShortDescUz, shortDescRu, setShortDescRu, shortDescEn, setShortDescEn,
        descUz, setDescUz, descRu, setDescRu, descEn, setDescEn,
        category, setCategory, durationDays, setDurationDays, durationNights, setDurationNights,
        price, setPrice, currency, setCurrency, maxGroupSize, setMaxGroupSize,
        isFeatured, setIsFeatured, isActive, setIsActive,
        technicalLevel, setTechnicalLevel, minAge, setMinAge, fitnessLevel, setFitnessLevel,
        countryIds, toggleCountry, destinationIds, toggleDestination,
        coverImage, setCoverImage, isUploading, handleCoverUpload,
        images, isUploadingGallery, handleGalleryUpload, removeGalleryImage,
        highlightsUz, setHighlightsUz, highlightsRu, setHighlightsRu, highlightsEn, setHighlightsEn,
        includedUz, setIncludedUz, includedRu, setIncludedRu, includedEn, setIncludedEn,
        excludedUz, setExcludedUz, excludedRu, setExcludedRu, excludedEn, setExcludedEn,
        faqs, addFaq, removeFaq, updateFaq,
        pricingOptions, addPricingOption, removePricingOption, updatePricingOption, updatePricingLabel,
        routePoints, addRoutePoint, removeRoutePoint, updateRoutePoint, updateRoutePointText, moveRoutePoint,
        isSaving, handleSubmit,
    };
}

export type UseTourFormReturn = ReturnType<typeof useTourForm>;