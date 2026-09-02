"use client";

import { Plus } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ImageUploadField } from "@/components/sections/image-upload-field";
import { LocalizedNameInput } from "./localized-name-input";
import type { UseGeographyManagerReturn } from "@/hooks/use-geography-manager";

export function CountryForm(f: UseGeographyManagerReturn) {
    return (
        <form onSubmit={f.handleCreateCountry} className="space-y-3">
            <LocalizedNameInput
                idPrefix="country_name"
                label={f.t("settings.geography.name")}
                value={f.countryName}
                onChange={f.setCountryName}
            />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                    <Label htmlFor="country_slug">{f.t("settings.geography.slug")}</Label>
                    <Input
                        id="country_slug"
                        value={f.countrySlug}
                        onChange={(e) => f.setCountrySlug(e.target.value)}
                        required
                    />
                </div>
                <ImageUploadField
                    label={f.t("settings.geography.cover_image")}
                    value={f.countryCoverImage}
                    onChange={f.setCountryCoverImage}
                    uploadLabel={f.t("form.select_image")}
                    removeLabel={f.t("form.remove_image")}
                    errorMessage={f.t("form.upload_error")}
                />
            </div>
            <Button type="submit" disabled={f.isSavingCountry} size="sm" className="gap-1.5">
                <Plus className="h-3.5 w-3.5" />
                {f.isSavingCountry ? f.t("settings.geography.saving") : f.t("settings.geography.add")}
            </Button>
        </form>
    );
}