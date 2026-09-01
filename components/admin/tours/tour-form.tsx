"use client";

import { Button } from "@/components/ui/button";
import type { AdminTourDetail } from "@/types";
import { useTourForm } from "@/hooks/use-tour-form";
import { BasicInfoSection } from "@/components/sections/basic-info-section";
import { PriceParamsSection } from "@/components/sections/price-params-section";
import { ImagesSection } from "@/components/sections/images-section";
import { HighlightsSection } from "@/components/sections/highlights-section";
import { IncludedExcludedSection } from "@/components/sections/included-excluded-section";
import { FaqsSection } from "@/components/sections/faqs-section";
import { PricingOptionsSection } from "@/components/sections/pricing-options-section";
import { GeographySection } from "@/components/sections/geography-section";

interface TourFormProps {
    initialData?: AdminTourDetail;
}

export function TourForm({ initialData }: TourFormProps) {
    const f = useTourForm(initialData);

    return (
        <form onSubmit={f.handleSubmit} className="space-y-6">
            <BasicInfoSection {...f} />
            <PriceParamsSection {...f} />
            <ImagesSection {...f} />
            <HighlightsSection {...f} />
            <IncludedExcludedSection {...f} />
            <FaqsSection {...f} />
            <PricingOptionsSection {...f} />
            <GeographySection {...f} />

            <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => f.router.push(`${f.prefix}/admin/tours`)}>
                    {f.t("form.cancel")}
                </Button>
                <Button type="submit" disabled={f.isSaving || f.isUploading || f.isUploadingGallery}>
                    {f.isSaving ? f.t("form.saving") : f.isEdit ? f.t("form.save") : f.t("form.create")}
                </Button>
            </div>
        </form>
    );
}