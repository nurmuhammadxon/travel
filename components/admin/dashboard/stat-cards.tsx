"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export interface StatCardItem {
    title: string;
    value: number | undefined;
    icon: LucideIcon;
    href: string;
}

interface StatCardsProps {
    cards: StatCardItem[];
    isLoading: boolean;
}

export function StatCards({ cards, isLoading }: StatCardsProps) {
    return (
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
    );
}