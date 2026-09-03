"use client";

import { useRef, useState } from "react";
import { Loader2, Upload, X } from "lucide-react";

import { Label } from "@/components/ui/label";
import { uploadReviewImage } from "@/lib/api";
import { showError } from "@/lib/toast";
import { Button } from "../ui/button";

interface ImageUploadFieldProps {
    label: string;
    value: string;
    onChange: (url: string) => void;
    uploadLabel?: string;
    removeLabel?: string;
    errorMessage?: string;
}

export function ImageUploadField({
    label,
    value,
    onChange,
    uploadLabel = "Rasm tanlash",
    removeLabel = "Rasmni o'chirish",
    errorMessage = "Rasm yuklashda xatolik",
}: ImageUploadFieldProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);

    async function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        setIsUploading(true);
        try {
            const { url } = await uploadReviewImage(file);
            onChange(url);
        } catch (err) {
            showError(err instanceof Error ? err.message : errorMessage);
        } finally {
            setIsUploading(false);
            if (inputRef.current) inputRef.current.value = "";
        }
    }

    return (
        <div className="space-y-2">
            <Label>{label}</Label>
            <div className="flex items-center gap-4">
                {value && (
                    <img src={value} alt="" className="h-20 w-32 rounded-md object-cover border" />
                )}
                <div className="flex flex-col gap-2">
                    <label className="inline-flex items-center gap-2 cursor-pointer rounded-md border px-3 py-2 text-sm hover:bg-muted">
                        {isUploading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Upload className="h-4 w-4" />
                        )}
                        {uploadLabel}
                        <input
                            ref={inputRef}
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/heic"
                            className="hidden"
                            onChange={handleFileSelected}
                        />
                    </label>
                    {value && (
                        <Button
                            type="button"
                            onClick={() => onChange("")}
                            className="inline-flex items-center gap-1 text-xs text-destructive hover:underline"
                        >
                            <X className="h-3 w-3" /> {removeLabel}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}