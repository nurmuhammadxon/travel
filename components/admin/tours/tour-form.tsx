"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
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
    initialData?: AdminTourDetail; // bo'lsa - edit rejimi, bo'lmasa - create
}

function slugify(text: string) {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");
}

export function TourForm({ initialData }: TourFormProps) {
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
            showError(err instanceof Error ? err.message : "Rasm yuklab bo'lmadi");
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
                showSuccess("Tur yangilandi");
            } else {
                await createTour(payload);
                showSuccess("Tur yaratildi");
            }
            router.push(`${prefix}/admin/tours`);
        } catch (err) {
            showError(err instanceof Error ? err.message : "Xatolik yuz berdi");
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Asosiy ma&apos;lumot</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                            <Label>Nomi (UZ)</Label>
                            <Input
                                value={titleUz}
                                onChange={(e) => handleTitleUzChange(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Nomi (RU)</Label>
                            <Input value={titleRu} onChange={(e) => setTitleRu(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Nomi (EN)</Label>
                            <Input value={titleEn} onChange={(e) => setTitleEn(e.target.value)} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Slug</Label>
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
                                Slug yaratilgandan keyin o&apos;zgartirilmaydi.
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                            <Label>Qisqa tavsif (UZ)</Label>
                            <Textarea value={shortDescUz} onChange={(e) => setShortDescUz(e.target.value)} rows={2} />
                        </div>
                        <div className="space-y-2">
                            <Label>Qisqa tavsif (RU)</Label>
                            <Textarea value={shortDescRu} onChange={(e) => setShortDescRu(e.target.value)} rows={2} />
                        </div>
                        <div className="space-y-2">
                            <Label>Qisqa tavsif (EN)</Label>
                            <Textarea value={shortDescEn} onChange={(e) => setShortDescEn(e.target.value)} rows={2} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                            <Label>To&apos;liq tavsif (UZ)</Label>
                            <Textarea value={descUz} onChange={(e) => setDescUz(e.target.value)} rows={5} required />
                        </div>
                        <div className="space-y-2">
                            <Label>To&apos;liq tavsif (RU)</Label>
                            <Textarea value={descRu} onChange={(e) => setDescRu(e.target.value)} rows={5} />
                        </div>
                        <div className="space-y-2">
                            <Label>To&apos;liq tavsif (EN)</Label>
                            <Textarea value={descEn} onChange={(e) => setDescEn(e.target.value)} rows={5} />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Narx va parametrlar</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                        <div className="space-y-2">
                            <Label>Kategoriya</Label>
                            <Input
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                placeholder="masalan: multi_day"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Kunlar soni</Label>
                            <Input
                                type="number"
                                min={0}
                                value={durationDays}
                                onChange={(e) => setDurationDays(Number(e.target.value))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Tunlar soni</Label>
                            <Input
                                type="number"
                                min={0}
                                value={durationNights}
                                onChange={(e) => setDurationNights(Number(e.target.value))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Guruh maksimal hajmi</Label>
                            <Input
                                type="number"
                                min={0}
                                value={maxGroupSize}
                                onChange={(e) => setMaxGroupSize(Number(e.target.value))}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label>Narx</Label>
                            <Input
                                type="number"
                                min={0}
                                step="0.01"
                                value={price}
                                onChange={(e) => setPrice(Number(e.target.value))}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Valyuta</Label>
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
                            <Label htmlFor="is_featured">Mashhur turlarda ko&apos;rsatilsin</Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <Switch checked={isActive} onCheckedChange={setIsActive} id="is_active" />
                            <Label htmlFor="is_active">Faol (saytda ko&apos;rinadi)</Label>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Rasm</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Muqova rasmi</Label>
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
                                    Rasm tanlash
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
                                        <X className="h-3 w-3" /> O&apos;chirish
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Geografiya</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-xs text-muted-foreground">
                        Hozircha backendda davlat/yo&apos;nalish ro&apos;yxati endpointi yo&apos;q -
                        shuning uchun ID&apos;larni qo&apos;lda kiriting (vergul bilan ajratib). Endpoint
                        qo&apos;shilgach, bu yer dropdown&apos;ga almashtiriladi.
                    </p>
                    <div className="space-y-2">
                        <Label>Davlat ID&apos;lari</Label>
                        <Input
                            value={countryIdsRaw}
                            onChange={(e) => setCountryIdsRaw(e.target.value)}
                            placeholder="uuid1, uuid2"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Yo&apos;nalish ID&apos;lari</Label>
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
                    Bekor qilish
                </Button>
                <Button type="submit" disabled={isSaving || isUploading}>
                    {isSaving ? "Saqlanmoqda..." : isEdit ? "Saqlash" : "Yaratish"}
                </Button>
            </div>
        </form>
    );
}