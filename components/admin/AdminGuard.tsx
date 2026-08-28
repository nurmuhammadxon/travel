"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

const ADMIN_ROLES = ["admin", "agent"];

export function AdminGuard({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const params = useParams<{ lng: string }>();
    const lng = params.lng ?? "uz";
    const prefix = lng === "uz" ? "" : `/${lng}`;

    useEffect(() => {
        if (isLoading) return;

        if (!user) {
            router.replace(`${prefix}/login`);
            return;
        }

        if (!ADMIN_ROLES.includes(user.role)) {
            router.replace(prefix || "/");
        }
    }, [user, isLoading, router, prefix]);

    if (isLoading || !user || !ADMIN_ROLES.includes(user.role)) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return <>{children}</>;
}