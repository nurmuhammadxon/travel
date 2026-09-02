"use client";

import { Plus } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ImageUploadField } from "@/components/sections/image-upload-field";
import { localizedText } from "@/lib/utils";
import { LocalizedNameInput } from "./localized-name-input";
import type { UseGeographyManagerReturn } from "@/hooks/use-geography-manager";

export function DestinationForm(f: UseGeographyManagerReturn) {
    return (
        <form onSubmit={f.handleCreateDestination} className="space-y-3">
            <div className="space-y-1.5">
                <Label htmlFor="destination_country">{f.t("settings.geography.country")}</Label>
                <select
                    id="destination_country"
                    required
                    value={f.destinationCountryId}
                    onChange={(e) => f.setDestinationCountryId(e.target.value)}
                    className="h-9 w-full rounded-md border border-input bg-input/20 px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
                >
                    <option value="" disabled>
                        {f.t("settings.geography.select_country")}
                    </option>
                    {f.countries.map((c) => (
                        <option key={c.id} value={c.id}>
                            {localizedText(c.name, f.lng)}
                        </option>
                    ))}
                </select>
            </div>

            <LocalizedNameInput
                idPrefix="destination_name"
                label={f.t("settings.geography.name")}
                value={f.destinationName}
                onChange={f.setDestinationName}
            />

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                    <Label htmlFor="destination_slug">{f.t("settings.geography.slug")}</Label>
                    <Input
                        id="destination_slug"
                        value={f.destinationSlug}
                        onChange={(e) => f.setDestinationSlug(e.target.value)}
                        required
                    />
                </div>
                <ImageUploadField
                    label={f.t("settings.geography.cover_image")}
                    value={f.destinationCoverImage}
                    onChange={f.setDestinationCoverImage}
                    uploadLabel={f.t("form.select_image")}
                    removeLabel={f.t("form.remove_image")}
                    errorMessage={f.t("form.upload_error")}
                />
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="destination_description">{f.t("settings.geography.description")}</Label>
                <Input
                    id="destination_description"
                    value={f.destinationDescription}
                    onChange={(e) => f.setDestinationDescription(e.target.value)}
                />
            </div>

            <div className="flex items-center gap-2">
                <Button type="submit" disabled={f.isSavingDestination} size="sm" className="gap-1.5">
                    <Plus className="h-3.5 w-3.5" />
                    {f.isSavingDestination
                        ? f.t("settings.geography.saving")
                        : f.editingDestinationId
                            ? f.t("settings.geography.update")
                            : f.t("settings.geography.add")}
                </Button>
                {f.editingDestinationId && (
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={f.cancelEditDestination}
                        disabled={f.isSavingDestination}
                    >
                        {f.t("settings.geography.cancel")}
                    </Button>
                )}
            </div>
        </form>
    );
}