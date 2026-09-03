"use client";

import type { LucideIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { RevenueStats } from "@/hooks/use-dashboard-data";

export interface RevenueCardItem {
    key: string;
    title: string;
    icon: LucideIcon;
    data: { count: number; amount: number };
    className: string;
    countLabel: string;
}

interface RevenueSummaryProps {
    title: string;
    isLoading: boolean;
    revenue: RevenueStats | null;
    cards: RevenueCardItem[];
    lng: string;
}

export function RevenueSummary({ title, isLoading, revenue, cards, lng }: RevenueSummaryProps) {
    const locale = lng === "uz" ? "uz-UZ" : lng === "ru" ? "ru-RU" : "en-US";

    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {isLoading || !revenue
                        ? Array.from({ length: 4 }).map((_, i) => (
                            <Skeleton key={i} className="h-20 w-full" />
                        ))
                        : cards.map((card) => (
                            <div
                                key={card.key}
                                className="rounded-lg border border-border p-4 flex items-start gap-3"
                            >
                                <card.icon className={`h-5 w-5 mt-0.5 shrink-0 ${card.className}`} />
                                <div>
                                    <p className="text-xs text-muted-foreground">{card.title}</p>
                                    <p className="text-lg font-bold">
                                        {card.data.amount.toLocaleString(locale)}{" "}
                                        {revenue.currency}
                                    </p>
                                    <p className="text-xs text-muted-foreground">{card.countLabel}</p>
                                </div>
                            </div>
                        ))}
                </div>
            </CardContent>
        </Card>
    );
}