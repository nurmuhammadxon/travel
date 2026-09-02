"use client";

import { useState } from "react";
import { useT } from "next-i18next/client";
import { Globe, MapPinned, Landmark } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { useGeographyManager } from "@/hooks/use-geography-manager";
import { CountryForm } from "./country-form";
import { CountryList } from "./country-list";
import { DestinationForm } from "./destination-form";
import { DestinationList } from "./destination-list";

export function GeographyManagerDialog() {
    const { t } = useT("admin");
    const [open, setOpen] = useState(false);
    const f = useGeographyManager(open);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button variant="outline" className="gap-1.5" />}>
                <Globe className="h-3.5 w-3.5" />
                {t("settings.geography.manage_button")}
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{t("settings.geography.dialog_title")}</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Landmark className="h-4 w-4" />
                                {t("settings.geography.countries_title")}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <CountryForm {...f} />
                            <CountryList {...f} />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <MapPinned className="h-4 w-4" />
                                {t("settings.geography.destinations_title")}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <DestinationForm {...f} />
                            <DestinationList {...f} />
                        </CardContent>
                    </Card>
                </div>
            </DialogContent>
        </Dialog>
    );
}