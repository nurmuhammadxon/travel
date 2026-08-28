"use client";

import { useEffect, useState } from "react";
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
import { isAdminUser } from "@/lib/auth";
import type { User, UserRole } from "@/types";

const ROLE_VARIANT: Record<UserRole, "default" | "secondary" | "outline"> = {
    admin: "default",
    agent: "secondary",
    customer: "outline",
};

const ROLE_LABEL: Record<UserRole, string> = {
    admin: "Admin",
    agent: "Agent",
    customer: "Mijoz",
};

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [search, setSearch] = useState("");

    useEffect(() => {
        getUsers()
            .then(setUsers)
            .catch((err) => setLoadError(err instanceof Error ? err.message : "Ro'yxatni yuklab bo'lmadi"))
            .finally(() => setIsLoading(false));
    }, []);

    const filtered = users.filter((u) =>
        `${u.full_name} ${u.email}`.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold">Foydalanuvchilar</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Jami {users.length} ta ro&apos;yxatdan o&apos;tgan foydalanuvchi
                    </p>
                </div>
                <input
                    placeholder="Ism yoki email bo'yicha qidirish..."
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
                                <TableHead>Ism</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Telefon</TableHead>
                                <TableHead>Til</TableHead>
                                <TableHead>Ro&apos;yxatdan o&apos;tgan</TableHead>
                                <TableHead>Rol</TableHead>
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
                                            {isAdminUser(user) ? (ROLE_LABEL[user.role] ?? "Admin") : (ROLE_LABEL[user.role] ?? "Mijoz")}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {filtered.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                                        Foydalanuvchi topilmadi
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