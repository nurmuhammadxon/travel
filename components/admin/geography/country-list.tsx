"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { localizedText } from "@/lib/utils";
import type { UseGeographyManagerReturn } from "@/hooks/use-geography-manager";

export function CountryList(f: UseGeographyManagerReturn) {
    if (f.isLoadingCountries) {
        return (
            <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-9 w-full" />
                ))}
            </div>
        );
    }

    if (f.countries.length === 0) {
        return (
            <p className="text-sm text-muted-foreground py-2 text-center">
                {f.t("settings.geography.no_countries")}
            </p>
        );
    }

    return (
        <div className="space-y-1.5 max-h-48 overflow-y-auto">
            {f.countries.map((c) => (
                <div
                    key={c.id}
                    className="flex items-center justify-between rounded-lg border border-border px-3 py-2"
                >
                    <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium">{localizedText(c.name, f.lng)}</span>
                        <span className="text-muted-foreground text-xs">/{c.slug}</span>
                    </div>
                    <Badge variant="secondary">
                        {f.t("settings.geography.tour_count", { count: c.tour_count ?? 0 })}
                    </Badge>
                </div>
            ))}
        </div>
    );
}