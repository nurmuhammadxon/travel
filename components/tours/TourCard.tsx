"use client";

import Link from "next/link";
import { MapPin, ArrowUpRight } from "lucide-react";
import { getMediaUrl } from "@/lib/media";
import type { Tour } from "@/types";

export function TourCard({ tour, viewLabel }: { tour: Tour; viewLabel: string }) {
    return (
        <Link
            href={`/tours/${tour.slug}`}
            className="group rounded-2xl overflow-hidden bg-card ring-1 ring-border hover:ring-primary/30 transition-all duration-300"
        >
            <div className="relative h-52 bg-muted overflow-hidden">
                <img
                    src={getMediaUrl(tour.images?.[0])}
                    alt={tour.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 text-sm font-bold text-primary">
                    ${tour.price}
                </div>
            </div>

            <div className="p-5">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
                    <MapPin className="h-3.5 w-3.5" />
                    {tour.country}
                </div>
                <h3 className="text-base font-bold text-foreground leading-snug mb-2 group-hover:text-primary transition-colors">
                    {tour.title}
                </h3>
                {tour.short_description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {tour.short_description}
                    </p>
                )}
                <span className="flex items-center gap-1 text-sm font-semibold text-accent">
                    {viewLabel}
                    <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
            </div>
        </Link>
    );
}