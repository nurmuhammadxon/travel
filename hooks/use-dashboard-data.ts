"use client";

import { useEffect, useState } from "react";
import { useT } from "next-i18next/client";

import { getTours, getAllBookings, getUsers, getAllReviews } from "@/lib/api";
import type { Booking } from "@/types";

export interface DashboardStats {
    toursCount: number;
    bookingsCount: number;
    usersCount: number;
    reviewsCount: number;
    pendingBookingsCount: number;
}

export interface RevenueGroup {
    count: number;
    amount: number;
}

export interface RevenueStats {
    currency: string;
    total: RevenueGroup;
    paid: RevenueGroup; 
    pending: RevenueGroup;
    cancelled: RevenueGroup;
}

function computeRevenue(bookings: Booking[]): RevenueStats {
    const currency = bookings.find((b) => b.currency)?.currency ?? "USD";

    const acc: RevenueStats = {
        currency,
        total: { count: 0, amount: 0 },
        paid: { count: 0, amount: 0 },
        pending: { count: 0, amount: 0 },
        cancelled: { count: 0, amount: 0 },
    };

    for (const b of bookings) {
        const amount = Number(b.total_price) || 0;
        acc.total.count += 1;
        acc.total.amount += amount;

        if (b.status === "confirmed" || b.status === "completed") {
            acc.paid.count += 1;
            acc.paid.amount += amount;
        } else if (b.status === "pending") {
            acc.pending.count += 1;
            acc.pending.amount += amount;
        } else if (b.status === "cancelled") {
            acc.cancelled.count += 1;
            acc.cancelled.amount += amount;
        }
    }

    return acc;
}

export function useDashboardData() {
    const { t } = useT("admin");

    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [revenue, setRevenue] = useState<RevenueStats | null>(null);
    const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function loadDashboard() {
            setIsLoading(true);
            setError(null);
            try {
                const [toursRes, bookings, users, reviews] = await Promise.all([
                    getTours({ page: 1, page_size: 1 }),
                    getAllBookings(),
                    getUsers(),
                    getAllReviews(),
                ]);

                if (cancelled) return;

                const sortedBookings = [...bookings].sort(
                    (a, b) => new Date(b.tour_date).getTime() - new Date(a.tour_date).getTime()
                );

                setStats({
                    toursCount: toursRes.total,
                    bookingsCount: bookings.length,
                    usersCount: users.length,
                    reviewsCount: reviews.length,
                    pendingBookingsCount: bookings.filter((b) => b.status === "pending").length,
                });
                setRevenue(computeRevenue(bookings));
                setRecentBookings(sortedBookings.slice(0, 8));
            } catch (err) {
                if (!cancelled) {
                    setError(err instanceof Error ? err.message : t("dashboard.error_generic"));
                }
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        }

        loadDashboard();
        return () => {
            cancelled = true;
        };
    }, [t]);

    return { stats, revenue, recentBookings, isLoading, error };
}