"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useT } from "next-i18next/client";
import {
    Compass,
    ClipboardList,
    Star,
    Users,
    ArrowUpRight,
    Wallet,
    CheckCircle2,
    Clock,
    XCircle,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useDashboardData } from "@/hooks/use-dashboard-data";
import { StatCards } from "@/components/admin/dashboard/stat-cards";
import { RevenueSummary } from "@/components/admin/dashboard/revenue-summary";
import { RecentBookingsTable } from "@/components/admin/dashboard/recent-bookings-table";
import type { Booking } from "@/types";

export default function AdminDashboardPage() {
    const params = useParams<{ lng: string }>();
    const lng = params.lng ?? "uz";
    const prefix = lng === "uz" ? "" : `/${lng}`;
    const { t } = useT("admin");

    const { stats, revenue, recentBookings, isLoading, error } = useDashboardData();

    const cards = [
        {
            title: t("sidebar.tours"),
            value: stats?.toursCount,
            icon: Compass,
            href: `${prefix}/admin/tours`,
        },
        {
            title: t("sidebar.bookings"),
            value: stats?.bookingsCount,
            icon: ClipboardList,
            href: `${prefix}/admin/bookings`,
        },
        {
            title: t("sidebar.reviews"),
            value: stats?.reviewsCount,
            icon: Star,
            href: `${prefix}/admin/reviews`,
        },
        {
            title: t("sidebar.users"),
            value: stats?.usersCount,
            icon: Users,
            href: `${prefix}/admin/users`,
        },
    ];

    const revenueCards = revenue
        ? [
            {
                key: "total",
                title: t("dashboard.revenue.total"),
                icon: Wallet,
                data: revenue.total,
                className: "text-primary",
                countLabel: t("dashboard.revenue.count_label", { count: revenue.total.count }),
            },
            {
                key: "paid",
                title: t("dashboard.revenue.paid"),
                icon: CheckCircle2,
                data: revenue.paid,
                className: "text-emerald-600",
                countLabel: t("dashboard.revenue.count_label", { count: revenue.paid.count }),
            },
            {
                key: "pending",
                title: t("dashboard.revenue.pending"),
                icon: Clock,
                data: revenue.pending,
                className: "text-amber-600",
                countLabel: t("dashboard.revenue.count_label", { count: revenue.pending.count }),
            },
            {
                key: "cancelled",
                title: t("dashboard.revenue.cancelled"),
                icon: XCircle,
                data: revenue.cancelled,
                className: "text-destructive",
                countLabel: t("dashboard.revenue.count_label", { count: revenue.cancelled.count }),
            },
        ]
        : [];

    const statusLabel = (status: Booking["status"]) => t(`dashboard.status.${status}`);

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-semibold">{t("sidebar.dashboard")}</h1>
                <p className="text-sm text-muted-foreground">{t("dashboard.welcome")}</p>
            </div>

            {error && (
                <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {error}
                </div>
            )}

            <StatCards cards={cards} isLoading={isLoading} />

            <RevenueSummary
                title={t("dashboard.revenue.title")}
                isLoading={isLoading}
                revenue={revenue}
                cards={revenueCards}
                lng={lng}
            />

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>{t("dashboard.recent_bookings")}</CardTitle>
                    <Link
                        href={`${prefix}/admin/bookings`}
                        className="flex items-center gap-1 text-sm text-primary hover:underline"
                    >
                        {t("dashboard.view_all")} <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                </CardHeader>
                <CardContent>
                    <RecentBookingsTable
                        bookings={recentBookings}
                        isLoading={isLoading}
                        lng={lng}
                        labels={{
                            number: t("dashboard.col_number"),
                            date: t("dashboard.col_date"),
                            guests: t("dashboard.col_guests"),
                            price: t("dashboard.col_price"),
                            status: t("dashboard.col_status"),
                            empty: t("dashboard.no_bookings"),
                        }}
                        statusLabel={statusLabel}
                    />
                </CardContent>
            </Card>
        </div>
    );
}