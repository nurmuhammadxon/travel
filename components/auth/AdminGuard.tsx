"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

const ADMIN_ROLES = ["admin", "agent"];

export function AdminGuard({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && (!user || !ADMIN_ROLES.includes(user.role))) {
            router.push("/login");
        }
    }, [user, isLoading, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-muted-foreground">
                Yuklanmoqda...
            </div>
        );
    }

    if (!user || !ADMIN_ROLES.includes(user.role)) {
        return null;
    }

    return <>{children}</>;
}