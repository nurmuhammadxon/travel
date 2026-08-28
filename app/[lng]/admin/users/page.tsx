"use client";

import { useEffect, useState } from "react";
import { useT } from "next-i18next/client";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loading } from "@/components/_components/loading";
import { getUsers } from "@/lib/api";
import type { User, UserRole } from "@/types";

const ROLE_VARIANT: Record<UserRole, "default" | "secondary" | "outline"> = {
    admin: "default",
    agent: "secondary",
    customer: "outline",
};

export default function AdminUsersPage() {
    const { t } = useT("admin");

    const ROLE_LABEL: Record<UserRole, string> = {
        admin: t("users.role_admin"),
        agent: t("users.role_agent"),
        customer: t("users.role_customer"),
    };

    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [search, setSearch] = useState("");

    useEffect(() => {
        getUsers()
            .then(setUsers)
            .catch((err) => setLoadError(err instanceof Error ? err.message : t("users.load_error")))
            .finally(() => setIsLoading(false));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const filtered = users.filter((u) =>
        `${u.full_name} ${u.email}`.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold">{t("users.title")}</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        {t("users.total", { count: users.length })}
                    </p>
                </div>
                <input
                    placeholder={t("users.search_placeholder")}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="h-8 w-64 max-w-full rounded-md border border-input bg-input/20 px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
                />
            </div>

            {isLoading ? (
                <div className="flex justify-center py-16">
                    <Loading className="h-8 w-8 text-muted-foreground" />
                </div>
            ) : loadError ? (
                <p className="text-destructive text-sm">{loadError}</p>
            ) : (
                <div className="rounded-xl border border-border overflow-x-auto bg-card">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{t("users.col_name")}</TableHead>
                                <TableHead>{t("users.col_email")}</TableHead>
                                <TableHead>{t("users.col_phone")}</TableHead>
                                <TableHead>{t("users.col_language")}</TableHead>
                                <TableHead>{t("users.col_created")}</TableHead>
                                <TableHead>{t("users.col_role")}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">{user.full_name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.phone ?? "—"}</TableCell>
                                    <TableCell className="uppercase">{user.preferred_language}</TableCell>
                                    <TableCell>
                                        {user.created_at ? new Date(user.created_at).toLocaleDateString("uz-UZ") : "—"}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={ROLE_VARIANT[user.role] ?? "outline"}>
                                            {ROLE_LABEL[user.role] ?? user.role}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {filtered.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                                        {t("users.not_found")}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
}