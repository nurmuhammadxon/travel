"use client";

import { useEffect, useState } from "react";
import { useT } from "next-i18next/client";
import { Save } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import {
    getSiteStats,
    updateSiteStats,
} from "@/lib/api";
import { showSuccess, showError } from "@/lib/toast";
import type { SiteStats } from "@/types";

const EMPTY_STATS: SiteStats = {
    years_experience: 0,
    satisfaction_percent: 0,
    completed_trips: 0,
    happy_travelers: 0,
};

export default function AdminSettingsPage() {
    const { t } = useT("admin");

    // --- Site stats ---
    const [statsForm, setStatsForm] = useState<SiteStats>(EMPTY_STATS);
    const [isLoadingStats, setIsLoadingStats] = useState(true);
    const [statsLoadError, setStatsLoadError] = useState<string | null>(null);
    const [isSavingStats, setIsSavingStats] = useState(false);

    useEffect(() => {
        let cancelled = false;
        getSiteStats()
            .then((data) => {
                if (!cancelled) setStatsForm(data);
            })
            .catch((err) => {
                if (!cancelled) {
                    setStatsLoadError(err instanceof Error ? err.message : t("settings.error_generic"));
                }
            })
            .finally(() => {
                if (!cancelled) setIsLoadingStats(false);
            });
        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function handleSaveStats(e: React.FormEvent) {
        e.preventDefault();
        setIsSavingStats(true);
        try {
            const updated = await updateSiteStats({ years_experience: statsForm.years_experience });
            setStatsForm(updated);
            showSuccess(t("settings.site_stats.save_success"));
        } catch (err) {
            showError(err instanceof Error ? err.message : t("settings.error_generic"));
        } finally {
            setIsSavingStats(false);
        }
    }

    function updateStatsField(key: keyof SiteStats, value: string) {
        setStatsForm((f) => ({ ...f, [key]: value === "" ? 0 : Number(value) }));
    }

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-semibold">{t("settings.title")}</h1>
                <p className="text-sm text-muted-foreground">{t("settings.subtitle")}</p>
            </div>

            {/* Site stats */}
            <Card>
                <CardHeader>
                    <CardTitle>{t("settings.site_stats.title")}</CardTitle>
                    <p className="text-sm text-muted-foreground">{t("settings.site_stats.subtitle")}</p>
                </CardHeader>
                <CardContent>
                    {isLoadingStats ? (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <Skeleton key={i} className="h-16 w-full" />
                            ))}
                        </div>
                    ) : statsLoadError ? (
                        <p className="text-sm text-destructive">{statsLoadError}</p>
                    ) : (
                        <div className="space-y-6">
                            {/* Tahrirlanadigan maydon */}
                            <form onSubmit={handleSaveStats} className="flex flex-wrap items-end gap-3">
                                <div className="max-w-xs space-y-1.5">
                                    <Label htmlFor="years_experience">
                                        {t("settings.site_stats.years_experience")}
                                    </Label>
                                    <Input
                                        id="years_experience"
                                        type="number"
                                        min={0}
                                        value={statsForm.years_experience}
                                        onFocus={(e) => e.target.select()}
                                        onChange={(e) => updateStatsField("years_experience", e.target.value)}
                                    />
                                </div>
                                <Button type="submit" disabled={isSavingStats} className="gap-1.5">
                                    <Save className="h-3.5 w-3.5" />
                                    {isSavingStats ? t("settings.site_stats.saving") : t("settings.site_stats.save")}
                                </Button>
                            </form>

                            {/* Avtomatik hisoblanadigan (faqat ko'rsatish) */}
                            <div>
                                <p className="text-xs text-muted-foreground mb-2">
                                    {t("settings.site_stats.auto_calculated_note")}
                                </p>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                    <div className="rounded-lg border border-border p-3">
                                        <p className="text-xs text-muted-foreground">
                                            {t("settings.site_stats.satisfaction_percent")}
                                        </p>
                                        <p className="text-xl font-bold">{statsForm.satisfaction_percent}%</p>
                                    </div>
                                    <div className="rounded-lg border border-border p-3">
                                        <p className="text-xs text-muted-foreground">
                                            {t("settings.site_stats.completed_trips")}
                                        </p>
                                        <p className="text-xl font-bold">{statsForm.completed_trips}</p>
                                    </div>
                                    <div className="rounded-lg border border-border p-3">
                                        <p className="text-xs text-muted-foreground">
                                            {t("settings.site_stats.happy_travelers")}
                                        </p>
                                        <p className="text-xl font-bold">{statsForm.happy_travelers}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

        </div>
    );
}