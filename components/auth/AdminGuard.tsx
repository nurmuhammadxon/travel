"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useLocalizedHref } from "@/hooks/use-localized-href";

const ADMIN_ROLES = ["admin", "agent"];

export function AdminGuard({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const withLocale = useLocalizedHref();

    useEffect(() => {
        if (!isLoading && (!user || !ADMIN_ROLES.includes(user.role))) {
            router.push(withLocale("/login"));
        }
    }, [user, isLoading, router, withLocale]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-muted-foreground">
                Loading...
            </div>
        );
    }

    if (!user || !ADMIN_ROLES.includes(user.role)) {
        return null;
    }

    return <>{children}</>;
}