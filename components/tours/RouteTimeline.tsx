"use client";

import { RotateCcw, MapPin, Clock, Camera, Users, ShoppingBag } from "lucide-react";
import { localizedText } from "@/lib/utils";
import type { RoutePoint } from "@/types";

interface RouteTimelineProps {
    points: RoutePoint[];
    lng?: string;
    title?: string;
    startingLocationLabel?: string;
    dropoffLocationLabel?: string;
    extraFeeLabel?: string;
    activityLabels?: Partial<Record<"photo_stop" | "guided_tour" | "shopping", string>>;
    minutesLabel?: string;
}

const ACTIVITY_ICON: Record<string, typeof Camera> = {
    photo_stop: Camera,
    guided_tour: Users,
    shopping: ShoppingBag,
};

const DEFAULT_ACTIVITY_LABEL: Record<string, string> = {
    photo_stop: "Photo stop",
    guided_tour: "Guided tour",
    shopping: "Shopping",
};

export function RouteTimeline({
    points,
    lng = "uz",
    title = "Itinerary",
    startingLocationLabel = "Starting location:",
    dropoffLocationLabel = "Drop-off location:",
    extraFeeLabel = "Qo'shimcha to'lov",
    activityLabels = {},
    minutesLabel = "min",
}: RouteTimelineProps) {

    if (!points || points.length === 0) return null;

    const sorted = [...points].sort((a, b) => a.order - b.order);

    return (
        <div>
            <h3 className="text-lg font-bold text-primary mb-6">{title}</h3>
            <div className="relative pl-1">
                {sorted.map((point, i) => {
                    const isFirst = i === 0;
                    const isLast = i === sorted.length - 1;
                    const name = localizedText(point.name, lng);
                    const address = localizedText(point.address, lng);
                    const ActivityIcon = point.activity_type ? ACTIVITY_ICON[point.activity_type] : null;
                    const activityLabel = point.activity_type
                        ? activityLabels[point.activity_type] ?? DEFAULT_ACTIVITY_LABEL[point.activity_type]
                        : null;

                    return (
                        <div key={`${point.order}-${i}`} className="relative flex gap-4 pb-8 last:pb-0">
                            {!isLast && (
                                <span className="absolute left-3.75 top-8 bottom-0 w-0.5 bg-accent" />
                            )}
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
                            <div className="pt-1">
                                {isFirst && (
                                    <p className="text-xs font-semibold text-muted-foreground mb-1">
                                        {startingLocationLabel}
                                    </p>
                                )}
                                {isLast && sorted.length > 1 && (
                                    <p className="text-xs font-semibold text-muted-foreground mb-1">
                                        {dropoffLocationLabel}
                                    </p>
                                )}
                                <p className="font-bold text-foreground text-sm leading-snug">{name}</p>
                                {address && (
                                    <p className="text-sm text-muted-foreground mt-0.5">{address}</p>
                                )}

                                {(activityLabel || point.duration_minutes || point.has_extra_fee) && (
                                    <div className="flex flex-wrap items-center gap-3 mt-1.5">
                                        {activityLabel && (
                                            <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
                                                {ActivityIcon && <ActivityIcon className="h-3.5 w-3.5" />}
                                                {activityLabel}
                                            </span>
                                        )}
                                        {typeof point.duration_minutes === "number" && point.duration_minutes > 0 && (
                                            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                                                <Clock className="h-3.5 w-3.5" />
                                                {point.duration_minutes} {minutesLabel}
                                            </span>
                                        )}
                                        {point.has_extra_fee && (
                                            <span className="text-xs text-muted-foreground/60">{extraFeeLabel}</span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}