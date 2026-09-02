"use client";

import { useEffect, useRef, useState } from "react";
import { useT } from "next-i18next/client";
import { Landmark, MapPinned, Plus } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { useGeographyManager } from "@/hooks/use-geography-manager";
import { CountryForm } from "@/components/admin/geography/country-form";
import { CountryList } from "@/components/admin/geography/country-list";
import { DestinationForm } from "@/components/admin/geography/destination-form";
import { DestinationList } from "@/components/admin/geography/destination-list";

export default function AdminGeographyPage() {
    const { t } = useT("admin");
    const f = useGeographyManager(true);

    const [countryDialogOpen, setCountryDialogOpen] = useState(false);
    const [destinationDialogOpen, setDestinationDialogOpen] = useState(false);

    useEffect(() => {
        if (f.editingCountryId) setCountryDialogOpen(true);
    }, [f.editingCountryId]);

    useEffect(() => {
        if (f.editingDestinationId) setDestinationDialogOpen(true);
    }, [f.editingDestinationId]);

    const countryTickRef = useRef(f.countrySaveTick);
    useEffect(() => {
        if (f.countrySaveTick !== countryTickRef.current) {
            countryTickRef.current = f.countrySaveTick;
            setCountryDialogOpen(false);
        }
    }, [f.countrySaveTick]);

    const destinationTickRef = useRef(f.destinationSaveTick);
    useEffect(() => {
        if (f.destinationSaveTick !== destinationTickRef.current) {
            destinationTickRef.current = f.destinationSaveTick;
            setDestinationDialogOpen(false);
        }
    }, [f.destinationSaveTick]);

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-semibold">{t("settings.geography.page_title")}</h1>
                <p className="text-sm text-muted-foreground">
                    {t("settings.geography.page_subtitle")}
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="flex items-center gap-2 text-base">
                            <Landmark className="h-4 w-4" />
                            {t("settings.geography.countries_title")}
                        </CardTitle>
                        <Button
                            type="button"
                            size="sm"
                            className="gap-1.5"
                            onClick={() => {
                                f.cancelEditCountry();
                                setCountryDialogOpen(true);
                            }}
                        >
                            <Plus className="h-3.5 w-3.5" />
                            {t("settings.geography.add")}
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <CountryList {...f} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="flex items-center gap-2 text-base">
                            <MapPinned className="h-4 w-4" />
                            {t("settings.geography.destinations_title")}
                        </CardTitle>
                        <Button
                            type="button"
                            size="sm"
                            className="gap-1.5"
                            onClick={() => {
                                f.cancelEditDestination();
                                setDestinationDialogOpen(true);
                            }}
                        >
                            <Plus className="h-3.5 w-3.5" />
                            {t("settings.geography.add")}
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <DestinationList {...f} />
                    </CardContent>
                </Card>
            </div>

            <Dialog
                open={countryDialogOpen}
                onOpenChange={(open) => {
                    setCountryDialogOpen(open);
                    if (!open) f.cancelEditCountry();
                }}
            >
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>
                            {f.editingCountryId
                                ? t("settings.geography.update")
                                : t("settings.geography.add")}
                        </DialogTitle>
                    </DialogHeader>
                    <CountryForm {...f} />
                </DialogContent>
            </Dialog>

            <Dialog
                open={destinationDialogOpen}
                onOpenChange={(open) => {
                    setDestinationDialogOpen(open);
                    if (!open) f.cancelEditDestination();
                }}
            >
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>
                            {f.editingDestinationId
                                ? t("settings.geography.update")
                                : t("settings.geography.add")}
                        </DialogTitle>
                    </DialogHeader>
                    <DestinationForm {...f} />
                </DialogContent>
            </Dialog>
        </div>
    );
}