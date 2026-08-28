"use client";

import { useT } from "next-i18next/client";
import { TourForm } from "@/components/admin/tours/tour-form";

export default function NewTourPage() {
    const { t } = useT("admin");

    return (
        <div className="flex flex-col gap-6 max-w-4xl">
            <div>
                <h1 className="text-2xl font-semibold">{t("tours.new_page_title")}</h1>
            </div>
            <TourForm />
        </div>
    );
}