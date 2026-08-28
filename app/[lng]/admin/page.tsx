"use client";

import { useEffect, useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { getTours, getAllBookings, getUsers, getAllReviews } from "@/lib/api";
import type { Booking } from "@/types";

interface DashboardStats {
    toursCount: number;
    bookingsCount: number;
    usersCount: number;
    reviewsCount: number;
    pendingBookingsCount: number;
}

interface RevenueGroup {
    count: number;
    amount: number;
}

interface RevenueStats {
    currency: string;
    total: RevenueGroup;
    paid: RevenueGroup; // confirmed + completed
    pending: RevenueGroup;
    cancelled: RevenueGroup;
}

const STATUS_VARIANT: Record<Booking["status"], "default" | "secondary" | "destructive" | "outline"> = {
    pending: "outline",
    confirmed: "default",
    completed: "secondary",
    cancelled: "destructive",
};

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

export default function AdminDashboardPage() {
    const params = useParams<{ lng: string }>();
    const lng = params.lng ?? "uz";
    const prefix = lng === "uz" ? "" : `/${lng}`;
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
                    getTours({ page: 1, page_size: 1 }), // faqat "total" kerak
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
            },
            {
                key: "paid",
                title: t("dashboard.revenue.paid"),
                icon: CheckCircle2,
                data: revenue.paid,
                className: "text-emerald-600",
            },
            {
                key: "pending",
                title: t("dashboard.revenue.pending"),
                icon: Clock,
                data: revenue.pending,
                className: "text-amber-600",
            },
            {
                key: "cancelled",
                title: t("dashboard.revenue.cancelled"),
                icon: XCircle,
                data: revenue.cancelled,
                className: "text-destructive",
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

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {cards.map((card) => (
                    <Link key={card.title} href={card.href}>
                        <Card className="transition-colors hover:border-primary/50">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    {card.title}
                                </CardTitle>
                                <card.icon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                {isLoading ? (
                                    <Skeleton className="h-8 w-16" />
                                ) : (
                                    <div className="text-2xl font-bold">{card.value ?? 0}</div>
                                )}
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>

            {/* Daromad / statistika bo'limi */}
            <Card>
                <CardHeader>
                    <CardTitle>{t("dashboard.revenue.title")}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {isLoading || !revenue
                            ? Array.from({ length: 4 }).map((_, i) => (
                                <Skeleton key={i} className="h-20 w-full" />
                            ))
                            : revenueCards.map((card) => (
                                <div
                                    key={card.key}
                                    className="rounded-lg border border-border p-4 flex items-start gap-3"
                                >
                                    <card.icon className={`h-5 w-5 mt-0.5 shrink-0 ${card.className}`} />
                                    <div>
                                        <p className="text-xs text-muted-foreground">{card.title}</p>
                                        <p className="text-lg font-bold">
                                            {card.data.amount.toLocaleString(
                                                lng === "uz" ? "uz-UZ" : lng === "ru" ? "ru-RU" : "en-US"
                                            )}{" "}
                                            {revenue.currency}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {t("dashboard.revenue.count_label", { count: card.data.count })}
                                        </p>
                                    </div>
                                </div>
                            ))}
                    </div>
                </CardContent>
            </Card>

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
                    {isLoading ? (
                        <div className="space-y-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Skeleton key={i} className="h-10 w-full" />
                            ))}
                        </div>
                    ) : recentBookings.length === 0 ? (
                        <p className="text-sm text-muted-foreground py-6 text-center">
                            {t("dashboard.no_bookings")}
                        </p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>{t("dashboard.col_number")}</TableHead>
                                    <TableHead>{t("dashboard.col_date")}</TableHead>
                                    <TableHead>{t("dashboard.col_guests")}</TableHead>
                                    <TableHead>{t("dashboard.col_price")}</TableHead>
                                    <TableHead>{t("dashboard.col_status")}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentBookings.map((booking) => (
                                    <TableRow key={booking.id}>
                                        <TableCell className="font-medium">
                                            {booking.booking_number}
                                        </TableCell>
                                        <TableCell>
                                            {new Date(booking.tour_date).toLocaleDateString(
                                                lng === "uz" ? "uz-UZ" : lng === "ru" ? "ru-RU" : "en-US"
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {booking.num_adults + booking.num_children}
                                        </TableCell>
                                        <TableCell>
                                            {Number(booking.total_price).toLocaleString(
                                                lng === "uz" ? "uz-UZ" : lng === "ru" ? "ru-RU" : "en-US"
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={STATUS_VARIANT[booking.status]}>
                                                {statusLabel(booking.status)}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}