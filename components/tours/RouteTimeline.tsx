"use client";

import { RotateCcw, MapPin } from "lucide-react";
import { localizedText } from "@/lib/utils";

interface RoutePoint {
    order: number;
    type: "start" | "stop" | "end";
    title: string | { uz?: string; ru?: string; en?: string };
    subtitle?: string | { uz?: string; ru?: string; en?: string };
    has_extra_fee?: boolean;
}

interface RouteTimelineProps {
    points: RoutePoint[];
    lng?: string;
    extraFeeLabel?: string;
}

export function RouteTimeline({ points, lng = "uz", extraFeeLabel = "Qo'shimcha to'lov" }: RouteTimelineProps) {
    if (!points || points.length === 0) return null;

    const sorted = [...points].sort((a, b) => a.order - b.order);

    return (
        <div>
            <h3 className="text-lg font-bold text-primary mb-6">Itinerary</h3>
            <div className="relative pl-1">
                {sorted.map((point, i) => {
                    const isFirst = i === 0;
                    const isLast = i === sorted.length - 1;
                    const title = localizedText(point.title, lng);
                    const subtitle = localizedText(point.subtitle, lng);

                    return (
                        <div key={point.order} className="relative flex gap-4 pb-8 last:pb-0">
                            {/* Vertikal chiziq */}
                            {!isLast && (
                                <span className="absolute left-3.75 top-8 bottom-0 w-0.5 bg-accent" />
                            )}

                            {/* Ikonka */}
                            <div className="relative z-10 shrink-0">
                                {isFirst ? (
                                    <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center">
                                        <RotateCcw className="h-4 w-4 text-white" />
                                    </div>
                                ) : isLast ? (
                                    <div className="h-8 w-8 rounded-full bg-accent" />
                                ) : (
                                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                                        <MapPin className="h-4 w-4 text-white" />
                                    </div>
                                )}
                            </div>

                            {/* Matn */}
                            <div className="pt-1">
                                {isFirst && (
                                    <p className="text-xs font-semibold text-muted-foreground mb-1">
                                        Starting location:
                                    </p>
                                )}
                                <p className="font-bold text-foreground text-sm leading-snug">{title}</p>
                                {subtitle && (
                                    <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
                                )}
                                {point.has_extra_fee && (
                                    <p className="text-xs text-muted-foreground/60 mt-0.5">{extraFeeLabel}</p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}