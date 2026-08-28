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

const STATUS_VARIANT: Record<Booking["status"], "default" | "secondary" | "destructive" | "outline"> = {
    pending: "outline",
    confirmed: "default",
    completed: "secondary",
    cancelled: "destructive",
};

export default function AdminDashboardPage() {
    const params = useParams<{ lng: string }>();
    const lng = params.lng ?? "uz";
    const prefix = lng === "uz" ? "" : `/${lng}`;
    const { t } = useT("admin");

    const [stats, setStats] = useState<DashboardStats | null>(null);
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
                setRecentBookings(sortedBookings.slice(0, 8));
            } catch (err) {
                if (!cancelled) {
                    setError(err instanceof Error ? err.message : "Xatolik yuz berdi");
                }
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        }

        loadDashboard();
        return () => {
            cancelled = true;
        };
    }, []);

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

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-semibold">{t("sidebar.dashboard")}</h1>
                <p className="text-sm text-muted-foreground">
                    DiscoverStans admin paneliga xush kelibsiz
                </p>
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

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>So'nggi buyurtmalar</CardTitle>
                    <Link
                        href={`${prefix}/admin/bookings`}
                        className="flex items-center gap-1 text-sm text-primary hover:underline"
                    >
                        Barchasi <ArrowUpRight className="h-3.5 w-3.5" />
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
                            Hozircha buyurtmalar yo'q
                        </p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Buyurtma №</TableHead>
                                    <TableHead>Sana</TableHead>
                                    <TableHead>Mehmonlar</TableHead>
                                    <TableHead>Narx</TableHead>
                                    <TableHead>Holat</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentBookings.map((booking) => (
                                    <TableRow key={booking.id}>
                                        <TableCell className="font-medium">
                                            {booking.booking_number}
                                        </TableCell>
                                        <TableCell>
                                            {new Date(booking.tour_date).toLocaleDateString("uz-UZ")}
                                        </TableCell>
                                        <TableCell>
                                            {booking.num_adults + booking.num_children}
                                        </TableCell>
                                        <TableCell>
                                            {Number(booking.total_price).toLocaleString("uz-UZ")}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={STATUS_VARIANT[booking.status]}>
                                                {booking.status}
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