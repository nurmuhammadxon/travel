"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { MapPin, ArrowUpRight } from "lucide-react";
import { getMediaUrl } from "@/lib/media";
import { localizedText } from "@/lib/utils";
import type { Tour } from "@/types";

export function TourCard({ tour, viewLabel }: { tour: Tour; viewLabel: string }) {
    const params = useParams<{ lng: string }>();
    const lng = params.lng ?? "uz";

    const title = localizedText(tour.title, lng);
    const shortDescription = localizedText(tour.short_description, lng);
    const countryName = tour.countries?.[0] ? localizedText(tour.countries[0].name, lng) : "";

    return (
        <Link
            href={`/tours/${tour.slug}`}
            className="group rounded-2xl overflow-hidden bg-card ring-1 ring-border hover:ring-primary/30 transition-all duration-300"
        >
            <div className="relative h-52 bg-muted overflow-hidden">
                <img
                    src={getMediaUrl(tour.cover_image ?? tour.images?.[0])}
                    alt={title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 text-sm font-bold text-primary">
                    ${tour.price}
                </div>
            </div>

            <div className="p-5">
                {countryName && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
                        <MapPin className="h-3.5 w-3.5" />
                        {countryName}
                    </div>
                )}
                <h3 className="text-base font-bold text-foreground leading-snug mb-2 group-hover:text-primary transition-colors">
                    {title}
                </h3>
                {shortDescription && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {shortDescription}
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