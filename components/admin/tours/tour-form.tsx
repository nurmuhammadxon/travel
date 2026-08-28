"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useT } from "next-i18next/client";
import { Loader2, Upload, X } from "lucide-react";

import { createTour, updateTour, uploadReviewImage, TourPayload } from "@/lib/api";
import { showSuccess, showError } from "@/lib/toast";
import type { AdminTourDetail } from "@/types";

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

interface TourFormProps {
    initialData?: AdminTourDetail;
}

function slugify(text: string) {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");
}

export function TourForm({ initialData }: TourFormProps) {
    const { t } = useT("admin");
    const router = useRouter();
    const params = useParams<{ lng: string }>();
    const lng = params.lng ?? "uz";
    const prefix = lng === "uz" ? "" : `/${lng}`;
    const isEdit = !!initialData;

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

    const [category, setCategory] = useState(initialData?.category ?? "");
    const [durationDays, setDurationDays] = useState(initialData?.duration_days ?? 1);
    const [durationNights, setDurationNights] = useState(initialData?.duration_nights ?? 0);
    const [price, setPrice] = useState(initialData?.price ?? 0);
    const [currency, setCurrency] = useState(initialData?.currency ?? "USD");
    const [maxGroupSize, setMaxGroupSize] = useState(initialData?.max_group_size ?? 10);
    const [coverImage, setCoverImage] = useState(initialData?.cover_image ?? "");
    const [isFeatured, setIsFeatured] = useState(initialData?.is_featured ?? false);
    const [isActive, setIsActive] = useState(initialData?.is_active ?? true);

    const [countryIdsRaw, setCountryIdsRaw] = useState(
        (initialData?.country_ids ?? []).join(", ")
    );
    const [destinationIdsRaw, setDestinationIdsRaw] = useState(
        (initialData?.destination_ids ?? []).join(", ")
    );

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

                    <div className="flex items-center gap-6 pt-2">
                        <div className="flex items-center gap-2">
                            <Switch checked={isFeatured} onCheckedChange={setIsFeatured} id="is_featured" />
                            <Label htmlFor="is_featured">{t("tours.form.is_featured")}</Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <Switch checked={isActive} onCheckedChange={setIsActive} id="is_active" />
                            <Label htmlFor="is_active">{t("tours.form.is_active")}</Label>
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
                <Button type="submit" disabled={isSaving || isUploading}>
                    {isSaving ? t("tours.form.saving") : isEdit ? t("tours.form.save") : t("tours.form.create")}
                </Button>
            </div>
        </form>
    );
}