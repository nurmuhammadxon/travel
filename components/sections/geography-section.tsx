"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { getCountries, getDestinations } from "@/lib/api";
import { localizedText } from "@/lib/utils";
import type { Country, Destination } from "@/types";
import type { UseTourFormReturn } from "@/hooks/use-tour-form";

export function GeographySection(f: UseTourFormReturn) {
    const [countries, setCountries] = useState<Country[]>([]);
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getCountries()
            .then(setCountries)
            .catch(() => setCountries([]))
            .finally(() => setIsLoading(false));
    }, []);

    useEffect(() => {
        if (f.countryIds.length === 0) {
            setDestinations([]);
            return;
        }
        Promise.all(f.countryIds.map((id) => getDestinations(id)))
            .then((results) => setDestinations(results.flat()))
            .catch(() => setDestinations([]));
    }, [f.countryIds]);

    if (isLoading) {
        return (
            <Card>
                <CardContent className="py-8 flex justify-center">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>{f.t("form.geography")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label>{f.t("form.country_ids")}</Label>
                    {countries.length === 0 ? (
                        <p className="text-xs text-muted-foreground">
                            {f.t("form.no_countries")}
                        </p>
                    ) : (
                        <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                            {countries.map((c) => (
                                <label key={c.id} className="flex items-center gap-2 text-sm cursor-pointer">
                                    <Checkbox
                                        checked={f.countryIds.includes(c.id)}
                                        onCheckedChange={() => f.toggleCountry(c.id)}
                                    />
                                    {localizedText(c.name)}
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                {f.countryIds.length > 0 && (
                    <div className="space-y-2">
                        <Label>{f.t("form.destination_ids")}</Label>
                        {destinations.length === 0 ? (
                            <p className="text-xs text-muted-foreground">
                                {f.t("form.no_destinations")}
                            </p>
                        ) : (
                            <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                                {destinations.map((d) => (
                                    <label key={d.id} className="flex items-center gap-2 text-sm cursor-pointer">
                                        <Checkbox
                                            checked={f.destinationIds.includes(d.id)}
                                            onCheckedChange={() => f.toggleDestination(d.id)}
                                        />
                                        {localizedText(d.name)}
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}