"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useT } from "next-i18next/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { loginSchema, registerSchema, type LoginValues, type RegisterValues } from "@/lib/validations/auth";

export default function LoginPage() {
    const { t } = useT("auth");
    const router = useRouter();
    const { login, register: registerUser } = useAuth();
    const [serverError, setServerError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register: registerLoginField,
        handleSubmit: handleLoginSubmit,
        formState: { errors: loginErrors },
    } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

    const {
        register: registerRegField,
        handleSubmit: handleRegisterSubmit,
        formState: { errors: registerErrors },
    } = useForm<RegisterValues>({ resolver: zodResolver(registerSchema) });

    async function onLogin(values: LoginValues) {
        setServerError(null);
        setIsSubmitting(true);
        try {
            await login(values);
            router.push("/");
        } catch (err) {
            setServerError(err instanceof Error ? err.message : t("error_generic"));
        } finally {
            setIsSubmitting(false);
        }
    }

    async function onRegister(values: RegisterValues) {
        setServerError(null);
        setIsSubmitting(true);
        try {
            await registerUser(values);
            router.push("/");
        } catch (err) {
            setServerError(err instanceof Error ? err.message : t("error_generic"));
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="min-h-screen bg-muted/40 flex items-center justify-center px-4 py-28">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 text-primary font-bold text-2xl mb-2">
                        <MapPin className="h-6 w-6 text-accent" />
                        Sayohat<span className="text-accent">Yoli</span>
                    </div>
                    <p className="text-muted-foreground text-sm">{t("subtitle")}</p>
                </div>

                <div className="bg-card rounded-2xl ring-1 ring-border p-6 md:p-8 shadow-sm">
                    <Tabs defaultValue="login" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-6">
                            <TabsTrigger value="login">{t("tab_login")}</TabsTrigger>
                            <TabsTrigger value="register">{t("tab_register")}</TabsTrigger>
                        </TabsList>

                        {serverError && (
                            <div className="mb-4 rounded-lg bg-destructive/10 text-destructive text-sm px-3 py-2">
                                {serverError}
                            </div>
                        )}

                        <TabsContent value="login">
                            <form onSubmit={handleLoginSubmit(onLogin)} className="space-y-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="login-email">{t("email")}</Label>
                                    <Input id="login-email" type="email" placeholder="email@example.com" {...registerLoginField("email")} />
                                    {loginErrors.email && <p className="text-xs text-destructive">{loginErrors.email.message}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="login-password">{t("password")}</Label>
                                    <Input id="login-password" type="password" placeholder="********" {...registerLoginField("password")} />
                                    {loginErrors.password && <p className="text-xs text-destructive">{loginErrors.password.message}</p>}
                                </div>

                                <Button type="submit" disabled={isSubmitting} className={cn("w-full rounded-full bg-primary text-white hover:bg-primary/90")}>
                                    {isSubmitting ? t("loading") : t("submit_login")}
                                </Button>
                            </form>
                        </TabsContent>

                        <TabsContent value="register">
                            <form onSubmit={handleRegisterSubmit(onRegister)} className="space-y-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="reg-name">{t("full_name")}</Label>
                                    <Input id="reg-name" placeholder="Ism Familiya" {...registerRegField("full_name")} />
                                    {registerErrors.full_name && <p className="text-xs text-destructive">{registerErrors.full_name.message}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="reg-email">{t("email")}</Label>
                                    <Input id="reg-email" type="email" placeholder="email@example.com" {...registerRegField("email")} />
                                    {registerErrors.email && <p className="text-xs text-destructive">{registerErrors.email.message}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="reg-phone">{t("phone")}</Label>
                                    <Input id="reg-phone" type="tel" placeholder="+998 90 123 45 67" {...registerRegField("phone")} />
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="reg-password">{t("password")}</Label>
                                    <Input id="reg-password" type="password" placeholder="********" {...registerRegField("password")} />
                                    {registerErrors.password && <p className="text-xs text-destructive">{registerErrors.password.message}</p>}
                                </div>

                                <Button type="submit" disabled={isSubmitting} className={cn("w-full rounded-full bg-primary text-white hover:bg-primary/90")}>
                                    {isSubmitting ? t("loading") : t("submit_register")}
                                </Button>
                            </form>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}