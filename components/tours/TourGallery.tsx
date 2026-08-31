"use client";

import { useState } from "react";
import { Expand } from "lucide-react";
import { getMediaUrl } from "@/lib/media";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { TourImagePlaceholder } from "./TourImagePlaceholder";

export function TourGallery({ images, title }: { images: string[]; title: string }) {
    const list = images && images.length > 0 ? images : [];
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    if (list.length === 0) {
        return <TourImagePlaceholder className="aspect-video rounded-2xl" />;
    }

    const visibleThumbs = list.slice(1, 5); 
    const remainingCount = list.length - 5; 

    function openLightbox(index: number) {
        setActiveIndex(index);
        setLightboxOpen(true);
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 rounded-2xl overflow-hidden">
                <button
                    onClick={() => openLightbox(0)}
                    className="md:col-span-2 md:row-span-2 relative aspect-video md:aspect-auto min-h-65 muted overflow-hidden group"
                >
                    {getMediaUrl(list[0]) ? (
                        <img
                            src={getMediaUrl(list[0])!}
                            alt={title}
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    ) : (
                        <TourImagePlaceholder className="h-full w-full" />
                    )}
                </button>

                {visibleThumbs.map((img, i) => {
                    const isLastVisible = i === visibleThumbs.length - 1;
                    const showOverlay = isLastVisible && remainingCount > 0;
                    const thumbUrl = getMediaUrl(img);

                    return (
                        <button
                            key={img + i}
                            onClick={() => openLightbox(i + 1)}
                            className="relative aspect-video md:aspect-square bg-muted overflow-hidden group"
                        >
                            {thumbUrl ? (
                                <img
                                    src={thumbUrl}
                                    alt=""
                                    className={cn(
                                        "h-full w-full object-cover group-hover:scale-105 transition-transform duration-500",
                                        showOverlay && "brightness-50"
                                    )}
                                />
                            ) : (
                                <TourImagePlaceholder className="h-full w-full" />
                            )}
                            {showOverlay && (
                                <span className="absolute inset-0 flex items-center gap-1.5 justify-center text-white font-semibold text-sm">
                                    <Expand className="h-4 w-4" />+{remainingCount} Photos
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
                <DialogContent className="max-w-4xl p-2">
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
                        {getMediaUrl(list[activeIndex]) ? (
                            <img
                                src={getMediaUrl(list[activeIndex])!}
                                alt=""
                                className="h-full w-full object-contain"
                            />
                        ) : (
                            <TourImagePlaceholder className="h-full w-full" />
                        )}
                    </div>
                    <div className="flex gap-2 overflow-x-auto pt-2 pb-1 px-1">
                        {list.map((img, i) => {
                            const thumbUrl = getMediaUrl(img);
                            return (
                                <button
                                    key={img + i}
                                    onClick={() => setActiveIndex(i)}
                                    className={cn(
                                        "relative shrink-0 h-14 w-20 rounded-md overflow-hidden ring-2 transition-all",
                                        i === activeIndex ? "ring-primary" : "ring-transparent opacity-60 hover:opacity-100"
                                    )}
                                >
                                    {thumbUrl ? (
                                        <img src={thumbUrl} alt="" className="h-full w-full object-cover" />
                                    ) : (
                                        <TourImagePlaceholder className="h-full w-full" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}