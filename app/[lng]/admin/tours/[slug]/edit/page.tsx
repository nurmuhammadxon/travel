"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useT } from "next-i18next/client";

import { getTourRaw } from "@/lib/api";
import { showError } from "@/lib/toast";
import type { AdminTourDetail } from "@/types";
import { TourForm } from "@/components/admin/tours/tour-form";

export default function EditTourPage() {
    const { t } = useT("admin");
    const params = useParams<{ slug: string }>();
    const [tour, setTour] = useState<AdminTourDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getTourRaw(params.slug)
            .then(setTour)
            .catch((err) => {
                showError(err instanceof Error ? err.message : t("tours.load_tour_error"));
            })
            .finally(() => setIsLoading(false));
    }, [params.slug]);

    if (isLoading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!tour) {
        return <p className="text-sm text-muted-foreground">{t("tours.not_found")}</p>;
    }

    return (
        <div className="flex flex-col gap-6 max-w-4xl">
            <div>
                <h1 className="text-2xl font-semibold">{t("tours.edit_page_title")}</h1>
                <p className="text-sm text-muted-foreground">{tour.title.uz}</p>
            </div>
            <TourForm initialData={tour} />
        </div>
    );
}