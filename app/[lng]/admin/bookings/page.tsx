"use client";

import { useEffect, useMemo, useState } from "react";
import { RefreshCw } from "lucide-react";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/_components/loading";
import { getAllBookings, updateBookingStatus, autoCompleteBookings } from "@/lib/api";
import { showError, showSuccess } from "@/lib/toast";
import type { Booking } from "@/types";

const STATUS_OPTIONS: Booking["status"][] = ["pending", "confirmed", "completed", "cancelled"];

const STATUS_LABEL: Record<Booking["status"], string> = {
    pending: "Kutilmoqda",
    confirmed: "Tasdiqlangan",
    completed: "Yakunlangan",
    cancelled: "Bekor qilingan",
};

const STATUS_VARIANT: Record<Booking["status"], "default" | "secondary" | "destructive" | "outline"> = {
    pending: "outline",
    confirmed: "secondary",
    completed: "default",
    cancelled: "destructive",
};

export default function AdminBookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [isAutoCompleting, setIsAutoCompleting] = useState(false);

    async function load() {
        setIsLoading(true);
        setLoadError(null);
        try {
            const data = await getAllBookings();
            setBookings(data);
        } catch (err) {
            setLoadError(err instanceof Error ? err.message : "Buyurtmalarni yuklab bo'lmadi");
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, []);

    const filtered = useMemo(
        () => (statusFilter === "all" ? bookings : bookings.filter((b) => b.status === statusFilter)),
        [bookings, statusFilter]
    );

    async function handleStatusChange(booking: Booking, status: Booking["status"]) {
        setUpdatingId(booking.id);
        try {
            await updateBookingStatus(booking.id, status);
            setBookings((prev) => prev.map((b) => (b.id === booking.id ? { ...b, status } : b)));
            showSuccess("Holat yangilandi");
        } catch (err) {
            showError(err instanceof Error ? err.message : "Holatni yangilab bo'lmadi");
        } finally {
            setUpdatingId(null);
        }
    }

    async function handleAutoComplete() {
        setIsAutoCompleting(true);
        try {
            await autoCompleteBookings();
            showSuccess("Muddati o'tgan buyurtmalar yakunlandi");
            await load();
        } catch (err) {
            showError(err instanceof Error ? err.message : "Amalni bajarib bo'lmadi");
        } finally {
            setIsAutoCompleting(false);
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold">Buyurtmalar</h1>
                    <p className="text-sm text-muted-foreground mt-1">Jami {bookings.length} ta buyurtma</p>
                </div>
                <Button
                    variant="outline"
                    onClick={handleAutoComplete}
                    disabled={isAutoCompleting}
                    className="gap-1.5"
                >
                    <RefreshCw className={`h-3.5 w-3.5 ${isAutoCompleting ? "animate-spin" : ""}`} />
                    Muddati o&apos;tganlarni yakunlash
                </Button>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
                <button
                    onClick={() => setStatusFilter("all")}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${statusFilter === "all"
                            ? "bg-primary text-white border-primary"
                            : "border-border text-muted-foreground"
                        }`}
                >
                    Barchasi
                </button>
                {STATUS_OPTIONS.map((s) => (
                    <button
                        key={s}
                        onClick={() => setStatusFilter(s)}
                        className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${statusFilter === s
                                ? "bg-primary text-white border-primary"
                                : "border-border text-muted-foreground"
                            }`}
                    >
                        {STATUS_LABEL[s]}
                    </button>
                ))}
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
                                <TableHead>Buyurtma №</TableHead>
                                <TableHead>Mijoz</TableHead>
                                <TableHead>Sana</TableHead>
                                <TableHead>Odam soni</TableHead>
                                <TableHead>Narx</TableHead>
                                <TableHead>Holat</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.map((booking) => (
                                <TableRow key={booking.id}>
                                    <TableCell className="font-medium">{booking.booking_number}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span>{booking.full_name ?? "—"}</span>
                                            {booking.email && (
                                                <span className="text-[0.7rem] text-muted-foreground">
                                                    {booking.email}
                                                </span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>{booking.tour_date}</TableCell>
                                    <TableCell>
                                        {booking.num_adults} kattalar
                                        {booking.num_children ? `, ${booking.num_children} bola` : ""}
                                    </TableCell>
                                    <TableCell>
                                        {booking.total_price} {booking.currency ?? ""}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Badge variant={STATUS_VARIANT[booking.status]}>
                                                {STATUS_LABEL[booking.status]}
                                            </Badge>
                                            <select
                                                disabled={updatingId === booking.id}
                                                className="h-6 text-[0.7rem] rounded-md border border-input bg-input/20 px-1.5 outline-none"
                                                value={booking.status}
                                                onChange={(e) =>
                                                    handleStatusChange(booking, e.target.value as Booking["status"])
                                                }
                                            >
                                                {STATUS_OPTIONS.map((s) => (
                                                    <option key={s} value={s}>
                                                        {STATUS_LABEL[s]}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {filtered.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                                        Buyurtmalar topilmadi
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