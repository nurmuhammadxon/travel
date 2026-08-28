"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useT } from "next-i18next/client";
import { Loader2 } from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { getProfile, updateProfile } from "@/lib/api";
import { showSuccess, showError } from "@/lib/toast";
import type { User } from "@/types";

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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";

export default function ProfilePage() {
    const { user: authUser, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const params = useParams<{ lng: string }>();
    const lng = params.lng ?? "uz";
    const prefix = lng === "uz" ? "" : `/${lng}`;
    const { t } = useT("profile");

    const [profile, setProfile] = useState<User | null>(null);
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [preferredLanguage, setPreferredLanguage] = useState<"uz" | "ru" | "en">("uz");
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [emailConfirmOpen, setEmailConfirmOpen] = useState(false);

    const ROLE_LABEL: Record<string, string> = {
        admin: t("role_admin"),
        agent: t("role_agent"),
        customer: t("role_customer"),
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
                setEmail(data.email);
                setPhone(data.phone ?? "");
                setPreferredLanguage((data.preferred_language as "uz" | "ru" | "en") ?? "uz");
            })
            .catch((err) => {
                showError(err instanceof Error ? err.message : t("error_load"));
            })
            .finally(() => setIsLoading(false));
    }, [authUser, authLoading, router, prefix, t]);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!profile) return;

        if (email !== profile.email) {
            setEmailConfirmOpen(true);
            return;
        }

        void saveProfile();
    }

    async function saveProfile() {
        if (!profile) return;

        setIsSaving(true);
        try {
            const updated = await updateProfile({
                full_name: fullName,
                email,
                phone: phone || undefined,
                preferred_language: preferredLanguage,
            });
            setProfile(updated);
            setEmail(updated.email);
            showSuccess(t("success"));
        } catch (err) {
            showError(err instanceof Error ? err.message : t("error_generic"));
        } finally {
            setIsSaving(false);
            setEmailConfirmOpen(false);
        }
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
        <div className="mx-auto max-w-xl px-4 py-24">
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
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <p className="text-xs text-muted-foreground">{t("email_hint")}</p>
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
                                onValueChange={(v) => setPreferredLanguage(v as "uz" | "ru" | "en")}
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
                            <p className="text-xs text-muted-foreground">{t("role_hint")}</p>
                        </div>

                        <Button type="submit" disabled={isSaving} className="w-full">
                            {isSaving ? t("saving") : t("save")}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Dialog open={emailConfirmOpen} onOpenChange={setEmailConfirmOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t("email_dialog.title")}</DialogTitle>
                        <DialogDescription>
                            {t("email_dialog.current")}:{" "}
                            <span className="font-medium">{profile.email}</span>
                            <br />
                            {t("email_dialog.next")}:{" "}
                            <span className="font-medium">{email}</span>
                            <br />
                            {t("email_dialog.description")}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setEmailConfirmOpen(false)}
                            disabled={isSaving}
                        >
                            {t("email_dialog.cancel")}
                        </Button>
                        <Button onClick={() => void saveProfile()} disabled={isSaving}>
                            {isSaving ? t("saving") : t("email_dialog.confirm")}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}