"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { localizedText } from "@/lib/utils";
import type { UseGeographyManagerReturn } from "@/hooks/use-geography-manager";

export function DestinationList(f: UseGeographyManagerReturn) {
    if (f.isLoadingDestinations) {
        return (
            <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-9 w-full" />
                ))}
            </div>
        );
    }

    if (f.destinations.length === 0) {
        return (
            <p className="text-sm text-muted-foreground py-2 text-center">
                {f.t("settings.geography.no_destinations")}
            </p>
        );
    }

    return (
        <div className="space-y-1.5 max-h-48 overflow-y-auto">
            {f.destinations.map((d) => {
                const country = f.countries.find((c) => c.id === d.country_id);
                return (
                    <div
                        key={d.id}
                        className="flex items-center justify-between rounded-lg border border-border px-3 py-2"
                    >
                        <div className="flex items-center gap-2 text-sm">
                            <span className="font-medium">{localizedText(d.name, f.lng)}</span>
                            <span className="text-muted-foreground text-xs">/{d.slug}</span>
                        </div>
                        {country && (
                            <span className="text-xs text-muted-foreground">
                                {localizedText(country.name, f.lng)}
                            </span>
                        )}
                    </div>
                );
            })}
        </div>
    );
}