"use client";

import { useState } from "react";
import { getMediaUrl } from "@/lib/media";
import { cn } from "@/lib/utils";

export function TourGallery({ images, title }: { images: string[]; title: string }) {
    const [active, setActive] = useState(0);
    const list = images && images.length > 0 ? images : [undefined];

    return (
        <div>
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={getMediaUrl(list[active])}
                    alt={title}
                    className="h-full w-full object-cover"
                />
            </div>

            {list.length > 1 && (
                <div className="flex gap-3 mt-3 overflow-x-auto pb-1">
                    {list.map((img, i) => (
                        <button
                            key={(img ?? "placeholder") + i}
                            onClick={() => setActive(i)}
                            className={cn(
                                "relative shrink-0 h-16 w-24 rounded-lg overflow-hidden ring-2 transition-all",
                                i === active ? "ring-primary" : "ring-transparent opacity-70 hover:opacity-100"
                            )}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={getMediaUrl(img)} alt="" className="h-full w-full object-cover" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}