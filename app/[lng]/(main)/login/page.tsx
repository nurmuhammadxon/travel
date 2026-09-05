"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useT } from "next-i18next/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { loginSchema, registerSchema, type LoginValues, type RegisterValues } from "@/lib/validations/auth";
import { siteConfig } from "@/lib/site-config";
import { showSuccess, showError } from "@/lib/toast";
import { Loading } from "@/components/_components/loading";
import { isAdminUser } from "@/lib/auth";
import { useParams } from "next/navigation";
import type { User } from "@/types";

export default function LoginPage() {
    const { t } = useT("auth");
    const router = useRouter();
    const params = useParams<{ lng: string }>();
    const lng = params.lng ?? "en";
    const prefix = lng === "en" ? "" : `/${lng}`;

    const { login, register: registerUser, user, isLoading: authLoading } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [showLoginPassword, setShowLoginPassword] = useState(false);
    const [showRegPassword, setShowRegPassword] = useState(false);
    const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);

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

    function redirectAfterLogin(u: User) {
        router.push(isAdminUser(u) ? `${prefix}/admin` : prefix || "/");
    }

    function redirectIfAlreadyAuthenticated(u: User) {
        router.push(isAdminUser(u) ? `${prefix}/admin` : `${prefix}/profile`);
    }

    async function onLogin(values: LoginValues) {
        setIsSubmitting(true);
        try {
            const loggedInUser = await login(values);
            showSuccess(t("login_success"));
            redirectAfterLogin(loggedInUser);
        } catch (err) {
            showError(err instanceof Error ? err.message : t("error_generic"));
        } finally {
            setIsSubmitting(false);
        }
    }

    async function onRegister(values: RegisterValues) {
        setIsSubmitting(true);
        try {
            const registeredUser = await registerUser(values);
            showSuccess(t("register_success"));
            redirectAfterLogin(registeredUser);
        } catch (err) {
            showError(err instanceof Error ? err.message : t("error_generic"));
        } finally {
            setIsSubmitting(false);
        }
    }

    useEffect(() => {
        if (!authLoading && user) {
            redirectIfAlreadyAuthenticated(user);
        }
    }, [user, authLoading]);

    if (authLoading || user) {
        return (
            <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
                <img
                    src="/images/login_image.png"
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/50 to-black/60" />
                <Loading className="relative z-10 h-10 w-10 text-white" />
            </div>
        );
    }

    return (
        <div className="relative min-h-screen flex items-center justify-center px-4 py-28 overflow-hidden">
            <img
                src="/images/login_image.png"
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/50 to-black/60" />

            <div className="relative z-10 w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 text-white font-bold text-2xl mb-2">
                        <MapPin className="h-6 w-6 text-accent" />
                        {siteConfig.logo.name}<span className="text-accent">{siteConfig.logo.nameHighlight}</span>
                    </div>
                    <p className="text-white/70 text-sm">{t("subtitle")}</p>
                </div>

                <div className="bg-card rounded-2xl ring-1 ring-border p-6 md:p-8 shadow-xl">
                    <Tabs defaultValue="login" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-6">
                            <TabsTrigger value="login">{t("tab_login")}</TabsTrigger>
                            <TabsTrigger value="register">{t("tab_register")}</TabsTrigger>
                        </TabsList>

                        <TabsContent value="login">
                            <form onSubmit={handleLoginSubmit(onLogin)} className="space-y-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="login-email">{t("email")}</Label>
                                    <Input id="login-email" type="email" placeholder="email@example.com" {...registerLoginField("email")} />
                                    {loginErrors.email && <p className="text-xs text-destructive">{loginErrors.email.message}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="login-password">{t("password")}</Label>
                                    <div className="relative">
                                        <Input
                                            id="login-password"
                                            type={showLoginPassword ? "text" : "password"}
                                            placeholder="********"
                                            className="pr-8"
                                            {...registerLoginField("password")}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowLoginPassword((v) => !v)}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                                            tabIndex={-1}
                                        >
                                            {showLoginPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
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
                                    <div className="relative">
                                        <Input
                                            id="reg-password"
                                            type={showRegPassword ? "text" : "password"}
                                            placeholder="********"
                                            className="pr-8"
                                            {...registerRegField("password")}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowRegPassword((v) => !v)}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                                            tabIndex={-1}
                                        >
                                            {showRegPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                    {registerErrors.password && <p className="text-xs text-destructive">{registerErrors.password.message}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="reg-confirm-password">{t("confirm_password")}</Label>
                                    <div className="relative">
                                        <Input
                                            id="reg-confirm-password"
                                            type={showRegConfirmPassword ? "text" : "password"}
                                            placeholder="********"
                                            className="pr-8"
                                            {...registerRegField("confirm_password")}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowRegConfirmPassword((v) => !v)}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                                            tabIndex={-1}
                                        >
                                            {showRegConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                    {registerErrors.confirm_password && <p className="text-xs text-destructive">{registerErrors.confirm_password.message}</p>}
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