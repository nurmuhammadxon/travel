"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useT } from "next-i18next/client";
import { Loader2, Upload, X, Plus, Trash2 } from "lucide-react";
import { createTour, updateTour, uploadReviewImage } from "@/lib/api";
import type { AdminTourDetail, TourPayload } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { showSuccess, showError } from "@/lib/toast";

interface TourFormProps {
    initialData?: AdminTourDetail;
}

type MultiLangText = { uz: string; ru: string; en: string };

interface FaqItem {
    question: MultiLangText;
    answer: MultiLangText;
}

interface PricingOption {
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

function listToText(list?: string[]) {
    return (list ?? []).join("\n");
}
function textToList(text: string) {
    return text
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);
}


export function TourForm({ initialData }: TourFormProps) {
    const { t } = useT("admin");
    const router = useRouter();
    const params = useParams<{ lng: string }>();
    const lng = params.lng ?? "uz";
    const prefix = lng === "uz" ? "" : `/${lng}`;
    const isEdit = !!initialData;

    // --- Asosiy ma'lumot ---
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

    // --- Narx / parametrlar ---
    const [category, setCategory] = useState(initialData?.category ?? "");
    const [durationDays, setDurationDays] = useState(initialData?.duration_days ?? 1);
    const [durationNights, setDurationNights] = useState(initialData?.duration_nights ?? 0);
    const [price, setPrice] = useState(initialData?.price ?? 0);
    const [currency, setCurrency] = useState(initialData?.currency ?? "USD");
    const [maxGroupSize, setMaxGroupSize] = useState(initialData?.max_group_size ?? 10);
    const [coverImage, setCoverImage] = useState(initialData?.cover_image ?? "");
    const [isFeatured, setIsFeatured] = useState(initialData?.is_featured ?? false);
    const [isActive, setIsActive] = useState(initialData?.is_active ?? true);

    // --- Qo'shimcha parametrlar (yangi) ---
    const [technicalLevel, setTechnicalLevel] = useState<number>(initialData?.technical_level ?? 1);
    const [minAge, setMinAge] = useState<number>(initialData?.min_age ?? 0);
    const [fitnessLevel, setFitnessLevel] = useState<number>(initialData?.fitness_level ?? 1);
    const [mapEmbedUrl, setMapEmbedUrl] = useState(initialData?.map_embed_url ?? "");

    // --- Geografiya ---
    const [countryIdsRaw, setCountryIdsRaw] = useState(
        (initialData?.country_ids ?? []).join(", ")
    );
    const [destinationIdsRaw, setDestinationIdsRaw] = useState(
        (initialData?.destination_ids ?? []).join(", ")
    );

    // --- Galereya rasmlari (yangi) ---
    const [images, setImages] = useState<string[]>(initialData?.images ?? []);
    const [isUploadingGallery, setIsUploadingGallery] = useState(false);

    // --- Highlights / Included / Excluded (yangi, har til uchun ro'yxat, qator-qator) ---
    const [highlightsUz, setHighlightsUz] = useState(listToText(initialData?.highlights?.uz));
    const [highlightsRu, setHighlightsRu] = useState(listToText(initialData?.highlights?.ru));
    const [highlightsEn, setHighlightsEn] = useState(listToText(initialData?.highlights?.en));

    const [includedUz, setIncludedUz] = useState(listToText(initialData?.included?.uz));
    const [includedRu, setIncludedRu] = useState(listToText(initialData?.included?.ru));
    const [includedEn, setIncludedEn] = useState(listToText(initialData?.included?.en));

    const [excludedUz, setExcludedUz] = useState(listToText(initialData?.excluded?.uz));
    const [excludedRu, setExcludedRu] = useState(listToText(initialData?.excluded?.ru));
    const [excludedEn, setExcludedEn] = useState(listToText(initialData?.excluded?.en));

    // --- FAQ (yangi) ---
    const [faqs, setFaqs] = useState<FaqItem[]>(
        initialData?.faqs ?? []
    );

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

    // --- Narx variantlari (yangi) ---
    const [pricingOptions, setPricingOptions] = useState<PricingOption[]>(
        initialData?.pricing_options ?? []
    );

    function addPricingOption() {
        setPricingOptions([
            ...pricingOptions,
            {
                type: "group",
                label: { uz: "", ru: "", en: "" },
                price: 0,
                currency: "USD",
                min_people: 1,
                max_people: null,
            },
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

    const [isUploading, setIsUploading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    function handleTitleUzChange(value: string) {
        setTitleUz(value);
        if (!slugTouched) {
            setSlug(slugify(value));
        }
    }

    async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const { url } = await uploadReviewImage(file);
            setCoverImage(url);
        } catch (err) {
            showError(err instanceof Error ? err.message : t("tours.form.upload_error"));
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
            showError(err instanceof Error ? err.message : t("tours.form.upload_error"));
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

        const country_ids = countryIdsRaw
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
        const destination_ids = destinationIdsRaw
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);

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
            country_ids,
            destination_ids,
            itinerary: initialData?.itinerary ?? [],
            images,
            technical_level: technicalLevel,
            min_age: minAge,
            fitness_level: fitnessLevel,
            highlights: {
                uz: textToList(highlightsUz),
                ru: textToList(highlightsRu),
                en: textToList(highlightsEn),
            },
            included: {
                uz: textToList(includedUz),
                ru: textToList(includedRu),
                en: textToList(includedEn),
            },
            excluded: {
                uz: textToList(excludedUz),
                ru: textToList(excludedRu),
                en: textToList(excludedEn),
            },
            faqs,
            map_embed_url: mapEmbedUrl || null,
            pricing_options: pricingOptions,
        };

        if (!isEdit) {
            payload.slug = slug;
        }

        setIsSaving(true);
        try {
            if (isEdit) {
                await updateTour(initialData.id, payload);
                showSuccess(t("tours.form.update_success"));
            } else {
                await createTour(payload);
                showSuccess(t("tours.form.create_success"));
            }
            router.push(`${prefix}/admin/tours`);
        } catch (err) {
            showError(err instanceof Error ? err.message : t("tours.form.save_error"));
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>{t("tours.form.main_info")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                            <Label>{t("tours.form.name_uz")}</Label>
                            <Input
                                value={titleUz}
                                onChange={(e) => handleTitleUzChange(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>{t("tours.form.name_ru")}</Label>
                            <Input value={titleRu} onChange={(e) => setTitleRu(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>{t("tours.form.name_en")}</Label>
                            <Input value={titleEn} onChange={(e) => setTitleEn(e.target.value)} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>{t("tours.form.slug")}</Label>
                        <Input
                            value={slug}
                            onChange={(e) => {
                                setSlug(e.target.value);
                                setSlugTouched(true);
                            }}
                            disabled={isEdit}
                            required
                        />
                        {isEdit && (
                            <p className="text-xs text-muted-foreground">
                                {t("tours.form.slug_hint")}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                            <Label>{t("tours.form.short_desc_uz")}</Label>
                            <Textarea value={shortDescUz} onChange={(e) => setShortDescUz(e.target.value)} rows={2} />
                        </div>
                        <div className="space-y-2">
                            <Label>{t("tours.form.short_desc_ru")}</Label>
                            <Textarea value={shortDescRu} onChange={(e) => setShortDescRu(e.target.value)} rows={2} />
                        </div>
                        <div className="space-y-2">
                            <Label>{t("tours.form.short_desc_en")}</Label>
                            <Textarea value={shortDescEn} onChange={(e) => setShortDescEn(e.target.value)} rows={2} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                            <Label>{t("tours.form.full_desc_uz")}</Label>
                            <Textarea value={descUz} onChange={(e) => setDescUz(e.target.value)} rows={5} required />
                        </div>
                        <div className="space-y-2">
                            <Label>{t("tours.form.full_desc_ru")}</Label>
                            <Textarea value={descRu} onChange={(e) => setDescRu(e.target.value)} rows={5} />
                        </div>
                        <div className="space-y-2">
                            <Label>{t("tours.form.full_desc_en")}</Label>
                            <Textarea value={descEn} onChange={(e) => setDescEn(e.target.value)} rows={5} />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>{t("tours.form.price_params")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                        <div className="space-y-2">
                            <Label>{t("tours.form.category")}</Label>
                            <Input
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                placeholder={t("tours.form.category_placeholder")}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>{t("tours.form.duration_days")}</Label>
                            <Input
                                type="number"
                                min={0}
                                value={durationDays}
                                onFocus={(e) => e.target.select()}
                                onChange={(e) => setDurationDays(e.target.value === "" ? 0 : Number(e.target.value))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>{t("tours.form.duration_nights")}</Label>
                            <Input
                                type="number"
                                min={0}
                                value={durationNights}
                                onFocus={(e) => e.target.select()}
                                onChange={(e) => setDurationNights(e.target.value === "" ? 0 : Number(e.target.value))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>{t("tours.form.max_group_size")}</Label>
                            <Input
                                type="number"
                                min={0}
                                value={maxGroupSize}
                                onFocus={(e) => e.target.select()}
                                onChange={(e) => setMaxGroupSize(e.target.value === "" ? 0 : Number(e.target.value))}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label>{t("tours.form.price")}</Label>
                            <Input
                                type="number"
                                min={0}
                                step="0.01"
                                value={price}
                                onFocus={(e) => e.target.select()}
                                onChange={(e) => setPrice(e.target.value === "" ? 0 : Number(e.target.value))}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>{t("tours.form.currency")}</Label>
                            <Select value={currency} onValueChange={(value) => setCurrency(value ?? "USD")}>
                                <SelectTrigger className="w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="USD">USD</SelectItem>
                                    <SelectItem value="UZS">UZS</SelectItem>
                                    <SelectItem value="EUR">EUR</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Qo'shimcha parametrlar */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 pt-2">
                        <div className="space-y-2">
                            <Label>{t("tours.form.technical_level") ?? "Texnik daraja (1-5)"}</Label>
                            <Input
                                type="number"
                                min={1}
                                max={5}
                                value={technicalLevel}
                                onFocus={(e) => e.target.select()}
                                onChange={(e) => setTechnicalLevel(e.target.value === "" ? 1 : Number(e.target.value))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>{t("tours.form.min_age") ?? "Minimal yosh"}</Label>
                            <Input
                                type="number"
                                min={0}
                                value={minAge}
                                onFocus={(e) => e.target.select()}
                                onChange={(e) => setMinAge(e.target.value === "" ? 0 : Number(e.target.value))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>{t("tours.form.fitness_level") ?? "Jismoniy tayyorgarlik (1-5)"}</Label>
                            <Input
                                type="number"
                                min={1}
                                max={5}
                                value={fitnessLevel}
                                onFocus={(e) => e.target.select()}
                                onChange={(e) => setFitnessLevel(e.target.value === "" ? 1 : Number(e.target.value))}
                            />
                        </div>
                    </div>

                    <div className="space-y-2 pt-2">
                        <Label>{t("tours.form.map_embed_url") ?? "Xarita (embed URL)"}</Label>
                        <Input
                            value={mapEmbedUrl}
                            onChange={(e) => setMapEmbedUrl(e.target.value)}
                            placeholder="https://www.google.com/maps/embed?..."
                        />
                    </div>

                    <div className="flex items-center gap-6 pt-2">
                        <div className="flex items-center gap-2">
                            <Switch checked={isFeatured} onCheckedChange={setIsFeatured} id="is_featured" />
                            <Label htmlFor="is_featured">{t("tours.form.is_featured")}</Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <Switch checked={isActive} onCheckedChange={setIsActive} id="is_active" />
                            <Label htmlFor="is_active">{t("tours.form.is_active") ?? "Faol (saytda ko'rinadi)"}</Label>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>{t("tours.form.image_section")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>{t("tours.form.cover_image")}</Label>
                        <div className="flex items-center gap-4">
                            {coverImage && (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={coverImage}
                                    alt="cover"
                                    className="h-20 w-32 rounded-md object-cover border"
                                />
                            )}
                            <div className="flex flex-col gap-2">
                                <label className="inline-flex items-center gap-2 cursor-pointer rounded-md border px-3 py-2 text-sm hover:bg-muted">
                                    {isUploading ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Upload className="h-4 w-4" />
                                    )}
                                    {t("tours.form.select_image")}
                                    <input
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp,image/heic"
                                        className="hidden"
                                        onChange={handleCoverUpload}
                                    />
                                </label>
                                {coverImage && (
                                    <button
                                        type="button"
                                        onClick={() => setCoverImage("")}
                                        className="inline-flex items-center gap-1 text-xs text-destructive hover:underline"
                                    >
                                        <X className="h-3 w-3" /> {t("tours.form.remove_image")}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Galereya (bir nechta rasm) */}
                    <div className="space-y-2 pt-4 border-t">
                        <Label>{t("tours.form.gallery") ?? "Galereya (bir nechta rasm)"}</Label>
                        <div className="flex flex-wrap gap-3">
                            {images.map((img, i) => (
                                <div key={i} className="relative">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={img} alt={`gallery-${i}`} className="h-20 w-28 rounded-md object-cover border" />
                                    <button
                                        type="button"
                                        onClick={() => removeGalleryImage(i)}
                                        className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <label className="inline-flex items-center gap-2 cursor-pointer rounded-md border px-3 py-2 text-sm hover:bg-muted w-fit">
                            {isUploadingGallery ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Upload className="h-4 w-4" />
                            )}
                            {t("tours.form.add_images") ?? "Rasm(lar) qo'shish"}
                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp,image/heic"
                                className="hidden"
                                multiple
                                onChange={handleGalleryUpload}
                            />
                        </label>
                        <p className="text-xs text-muted-foreground">
                            {t("tours.form.gallery_hint") ?? "Kamida 5, tavsiya etiladi 5-10 ta rasm."}
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Highlights */}
            <Card>
                <CardHeader>
                    <CardTitle>{t("tours.form.highlights") ?? "Asosiy jihatlar (highlights)"}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-xs text-muted-foreground">
                        {t("tours.form.list_hint") ?? "Har bir qatorga bitta band yozing."}
                    </p>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                            <Label>UZ</Label>
                            <Textarea value={highlightsUz} onChange={(e) => setHighlightsUz(e.target.value)} rows={4} />
                        </div>
                        <div className="space-y-2">
                            <Label>RU</Label>
                            <Textarea value={highlightsRu} onChange={(e) => setHighlightsRu(e.target.value)} rows={4} />
                        </div>
                        <div className="space-y-2">
                            <Label>EN</Label>
                            <Textarea value={highlightsEn} onChange={(e) => setHighlightsEn(e.target.value)} rows={4} />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Included / Excluded */}
            <Card>
                <CardHeader>
                    <CardTitle>{t("tours.form.included") ?? "Narxga kiradi / kirmaydi"}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <Label className="mb-2 block">{t("tours.form.included_label") ?? "Kiradi"}</Label>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <Textarea value={includedUz} onChange={(e) => setIncludedUz(e.target.value)} rows={4} placeholder="UZ" />
                            <Textarea value={includedRu} onChange={(e) => setIncludedRu(e.target.value)} rows={4} placeholder="RU" />
                            <Textarea value={includedEn} onChange={(e) => setIncludedEn(e.target.value)} rows={4} placeholder="EN" />
                        </div>
                    </div>
                    <div>
                        <Label className="mb-2 block">{t("tours.form.excluded_label") ?? "Kirmaydi"}</Label>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <Textarea value={excludedUz} onChange={(e) => setExcludedUz(e.target.value)} rows={4} placeholder="UZ" />
                            <Textarea value={excludedRu} onChange={(e) => setExcludedRu(e.target.value)} rows={4} placeholder="RU" />
                            <Textarea value={excludedEn} onChange={(e) => setExcludedEn(e.target.value)} rows={4} placeholder="EN" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* FAQ */}
            <Card>
                <CardHeader>
                    <CardTitle>{t("tours.form.faqs") ?? "Ko'p so'raladigan savollar (FAQ)"}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {faqs.map((faq, i) => (
                        <div key={i} className="border rounded-md p-4 space-y-3 relative">
                            <button
                                type="button"
                                onClick={() => removeFaq(i)}
                                className="absolute top-3 right-3 text-destructive"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                            <Label className="text-xs">{t("tours.form.question") ?? "Savol"}</Label>
                            <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                                <Input placeholder="UZ" value={faq.question.uz} onChange={(e) => updateFaq(i, "question", "uz", e.target.value)} />
                                <Input placeholder="RU" value={faq.question.ru} onChange={(e) => updateFaq(i, "question", "ru", e.target.value)} />
                                <Input placeholder="EN" value={faq.question.en} onChange={(e) => updateFaq(i, "question", "en", e.target.value)} />
                            </div>
                            <Label className="text-xs">{t("tours.form.answer") ?? "Javob"}</Label>
                            <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                                <Textarea placeholder="UZ" rows={2} value={faq.answer.uz} onChange={(e) => updateFaq(i, "answer", "uz", e.target.value)} />
                                <Textarea placeholder="RU" rows={2} value={faq.answer.ru} onChange={(e) => updateFaq(i, "answer", "ru", e.target.value)} />
                                <Textarea placeholder="EN" rows={2} value={faq.answer.en} onChange={(e) => updateFaq(i, "answer", "en", e.target.value)} />
                            </div>
                        </div>
                    ))}
                    <Button type="button" variant="outline" onClick={addFaq} className="w-full">
                        <Plus className="h-4 w-4 mr-2" /> {t("tours.form.add_faq") ?? "Savol qo'shish"}
                    </Button>
                </CardContent>
            </Card>

            {/* Pricing Options */}
            <Card>
                <CardHeader>
                    <CardTitle>{t("tours.form.pricing_options") ?? "Narx variantlari (Group/Private)"}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {pricingOptions.map((opt, i) => (
                        <div key={i} className="border rounded-md p-4 space-y-3 relative">
                            <button
                                type="button"
                                onClick={() => removePricingOption(i)}
                                className="absolute top-3 right-3 text-destructive"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                            <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                                <div className="space-y-1">
                                    <Label className="text-xs">{t("tours.form.type") ?? "Turi"}</Label>
                                    <Select value={opt.type} onValueChange={(v) => updatePricingOption(i, "type", v)}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="group">Group</SelectItem>
                                            <SelectItem value="private">Private</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs">{t("tours.form.price") ?? "Narx"}</Label>
                                    <Input
                                        type="number"
                                        value={opt.price}
                                        onFocus={(e) => e.target.select()}
                                        onChange={(e) => updatePricingOption(i, "price", e.target.value === "" ? 0 : Number(e.target.value))}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs">{t("tours.form.min_people") ?? "Min kishi"}</Label>
                                    <Input
                                        type="number"
                                        value={opt.min_people}
                                        onFocus={(e) => e.target.select()}
                                        onChange={(e) => updatePricingOption(i, "min_people", e.target.value === "" ? 1 : Number(e.target.value))}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs">{t("tours.form.max_people") ?? "Max kishi (bo'sh = cheksiz)"}</Label>
                                    <Input
                                        type="number"
                                        value={opt.max_people ?? ""}
                                        onFocus={(e) => e.target.select()}
                                        onChange={(e) => updatePricingOption(i, "max_people", e.target.value === "" ? null : Number(e.target.value))}
                                    />
                                </div>
                            </div>
                            <Label className="text-xs">{t("tours.form.label") ?? "Nomi"}</Label>
                            <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                                <Input placeholder="UZ" value={opt.label.uz} onChange={(e) => updatePricingLabel(i, "uz", e.target.value)} />
                                <Input placeholder="RU" value={opt.label.ru} onChange={(e) => updatePricingLabel(i, "ru", e.target.value)} />
                                <Input placeholder="EN" value={opt.label.en} onChange={(e) => updatePricingLabel(i, "en", e.target.value)} />
                            </div>
                        </div>
                    ))}
                    <Button type="button" variant="outline" onClick={addPricingOption} className="w-full">
                        <Plus className="h-4 w-4 mr-2" /> {t("tours.form.add_pricing") ?? "Narx varianti qo'shish"}
                    </Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>{t("tours.form.geography")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-xs text-muted-foreground">
                        {t("tours.form.geography_hint")}
                    </p>
                    <div className="space-y-2">
                        <Label>{t("tours.form.country_ids")}</Label>
                        <Input
                            value={countryIdsRaw}
                            onChange={(e) => setCountryIdsRaw(e.target.value)}
                            placeholder="uuid1, uuid2"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>{t("tours.form.destination_ids")}</Label>
                        <Input
                            value={destinationIdsRaw}
                            onChange={(e) => setDestinationIdsRaw(e.target.value)}
                            placeholder="uuid1, uuid2"
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push(`${prefix}/admin/tours`)}
                >
                    {t("tours.form.cancel")}
                </Button>
                <Button type="submit" disabled={isSaving || isUploading || isUploadingGallery}>
                    {isSaving ? t("tours.form.saving") : isEdit ? t("tours.form.save") : t("tours.form.create")}
                </Button>
            </div>
        </form>
    );
}