"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useT } from "next-i18next/client";
import { Loader2, LogOut } from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { getProfile, updateProfile, getMyBookings } from "@/lib/api";
import { showSuccess, showError } from "@/lib/toast";
import type { User, Booking } from "@/types";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const STATUS_VARIANT: Record<Booking["status"], "default" | "secondary" | "destructive" | "outline"> = {
    pending: "outline",
    confirmed: "default",
    completed: "secondary",
    cancelled: "destructive",
};

export default function ProfilePage() {
    const { user: authUser, isLoading: authLoading, logout } = useAuth();
    const router = useRouter();
    const params = useParams<{ lng: string }>();
    const lng = params.lng ?? "uz";
    const prefix = lng === "uz" ? "" : `/${lng}`;
    const { t } = useT("profile");

    const [profile, setProfile] = useState<User | null>(null);
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [preferredLanguage, setPreferredLanguage] = useState<"uz" | "ru" | "en">("uz");
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoadingBookings, setIsLoadingBookings] = useState(true);
    const [bookingsError, setBookingsError] = useState<string | null>(null);

    const ROLE_LABEL: Record<string, string> = {
        admin: t("role_admin"),
        agent: t("role_agent"),
        customer: t("role_customer"),
    };

    const STATUS_LABEL: Record<Booking["status"], string> = {
        pending: t("bookings.status_pending"),
        confirmed: t("bookings.status_confirmed"),
        completed: t("bookings.status_completed"),
        cancelled: t("bookings.status_cancelled"),
    };

    useEffect(() => {
        if (authLoading) return;
        if (!authUser) {
            router.replace(`${prefix}/login`);
            return;
        }

        getProfile()
            .then((data) => {
                setProfile(data);
                setFullName(data.full_name);
                setPhone(data.phone ?? "");
                setPreferredLanguage((data.preferred_language as "uz" | "ru" | "en") ?? "uz");
            })
            .catch((err) => {
                showError(err instanceof Error ? err.message : t("error_load"));
            })
            .finally(() => setIsLoading(false));

        getMyBookings()
            .then(setBookings)
            .catch((err) => {
                setBookingsError(err instanceof Error ? err.message : t("bookings.error_load"));
            })
            .finally(() => setIsLoadingBookings(false));
    }, [authUser, authLoading, router, prefix, t]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!profile) return;

        setIsSaving(true);
        try {
            const updated = await updateProfile({
                full_name: fullName,
                phone: phone || undefined,
                preferred_language: preferredLanguage,
            });
            setProfile(updated);
            showSuccess(t("success"));
        } catch (err) {
            showError(err instanceof Error ? err.message : t("error_generic"));
        } finally {
            setIsSaving(false);
        }
    }

    async function handleLogout() {
        await logout();
        router.push(`${prefix}/login`);
    }

    if (authLoading || isLoading) {
        return (
            <div className="flex h-[60vh] w-full items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!profile) return null;

    return (
        <div className="mx-auto max-w-xl px-4 py-24 space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>{t("title")}</CardTitle>
                        <Badge variant="secondary">
                            {ROLE_LABEL[profile.role] ?? profile.role}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="full_name">{t("full_name")}</Label>
                            <Input
                                id="full_name"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">{t("email")}</Label>
                            <Input id="email" type="email" value={profile.email} disabled />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">{t("phone")}</Label>
                            <Input
                                id="phone"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="+998 90 123 45 67"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="preferred_language">{t("language")}</Label>
                            <Select
                                value={preferredLanguage}
                                onValueChange={(v) => setPreferredLanguage((v ?? "uz") as "uz" | "ru" | "en")}
                            >
                                <SelectTrigger id="preferred_language" className="w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="uz">{t("language_uz")}</SelectItem>
                                    <SelectItem value="ru">{t("language_ru")}</SelectItem>
                                    <SelectItem value="en">{t("language_en")}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>{t("role")}</Label>
                            <Input value={ROLE_LABEL[profile.role] ?? profile.role} disabled />
                        </div>

                        <Button type="submit" disabled={isSaving} className="w-full">
                            {isSaving ? t("saving") : t("save")}
                        </Button>
                    </form>

                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleLogout}
                        className="w-full mt-3 gap-2 text-destructive hover:text-destructive"
                    >
                        <LogOut className="h-4 w-4" />
                        {t("logout")}
                    </Button>
                </CardContent>
            </Card>

            {/* Mening buyurtmalarim */}
            <Card>
                <CardHeader>
                    <CardTitle>{t("bookings.title")}</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoadingBookings ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                        </div>
                    ) : bookingsError ? (
                        <p className="text-sm text-destructive">{bookingsError}</p>
                    ) : bookings.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-6">
                            {t("bookings.empty")}
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {bookings.map((booking) => (
                                <div
                                    key={booking.id}
                                    className="rounded-lg border border-border p-4 flex items-center justify-between gap-3"
                                >
                                    <div>
                                        <p className="font-medium text-sm">{booking.booking_number}</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            {booking.tour_date} · {booking.num_adults} {t("bookings.adults_short")}
                                            {booking.num_children
                                                ? `, ${booking.num_children} ${t("bookings.children_short")}`
                                                : ""}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            {booking.total_price} {booking.currency ?? ""}
                                        </p>
                                    </div>
                                    <Badge variant={STATUS_VARIANT[booking.status]}>
                                        {STATUS_LABEL[booking.status]}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}