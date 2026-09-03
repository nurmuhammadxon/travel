"use client";

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
import type { Booking } from "@/types";

const STATUS_VARIANT: Record<Booking["status"], "default" | "secondary" | "destructive" | "outline"> = {
    pending: "outline",
    confirmed: "default",
    completed: "secondary",
    cancelled: "destructive",
};

interface RecentBookingsTableProps {
    bookings: Booking[];
    isLoading: boolean;
    lng: string;
    labels: {
        number: string;
        date: string;
        guests: string;
        price: string;
        status: string;
        empty: string;
    };
    statusLabel: (status: Booking["status"]) => string;
}

export function RecentBookingsTable({
    bookings,
    isLoading,
    lng,
    labels,
    statusLabel,
}: RecentBookingsTableProps) {
    const locale = lng === "uz" ? "uz-UZ" : lng === "ru" ? "ru-RU" : "en-US";

    if (isLoading) {
        return (
            <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                ))}
            </div>
        );
    }

    if (bookings.length === 0) {
        return (
            <p className="text-sm text-muted-foreground py-6 text-center">{labels.empty}</p>
        );
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>{labels.number}</TableHead>
                    <TableHead>{labels.date}</TableHead>
                    <TableHead>{labels.guests}</TableHead>
                    <TableHead>{labels.price}</TableHead>
                    <TableHead>{labels.status}</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {bookings.map((booking) => (
                    <TableRow key={booking.id}>
                        <TableCell className="font-medium">{booking.booking_number}</TableCell>
                        <TableCell>
                            {new Date(booking.tour_date).toLocaleDateString(locale)}
                        </TableCell>
                        <TableCell>{booking.num_adults + booking.num_children}</TableCell>
                        <TableCell>{Number(booking.total_price).toLocaleString(locale)}</TableCell>
                        <TableCell>
                            <Badge variant={STATUS_VARIANT[booking.status]}>
                                {statusLabel(booking.status)}
                            </Badge>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}