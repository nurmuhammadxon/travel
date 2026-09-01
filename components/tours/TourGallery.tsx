"use client";

import { useState, useCallback, useEffect } from "react";
import { Expand, ChevronLeft, ChevronRight, X } from "lucide-react";
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

    const goPrev = useCallback(() => {
        setActiveIndex((i) => (i === 0 ? list.length - 1 : i - 1));
    }, [list.length]);

    const goNext = useCallback(() => {
        setActiveIndex((i) => (i === list.length - 1 ? 0 : i + 1));
    }, [list.length]);

    useEffect(() => {
        if (!lightboxOpen) return;
        function handleKey(e: KeyboardEvent) {
            if (e.key === "ArrowLeft") {
                e.preventDefault();
                goPrev();
            }
            if (e.key === "ArrowRight") {
                e.preventDefault();
                goNext();
            }
            if (e.key === "Escape") {
                setLightboxOpen(false);
            }
        }
        document.addEventListener("keydown", handleKey, true);
        return () => document.removeEventListener("keydown", handleKey, true);
    }, [lightboxOpen, goPrev, goNext]);

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
                <DialogContent className="fixed! inset-0! left-0! top-0! translate-x-0! translate-y-0! w-screen! h-screen! max-w-none! max-h-none! rounded-none! border-0! p-0! m-0! gap-0! bg-black! [&>button]:hidden">
                    <div className="relative w-full h-full">
                        {getMediaUrl(list[activeIndex]) ? (
                            <img
                                src={getMediaUrl(list[activeIndex])!}
                                alt=""
                                className="absolute inset-0 h-full w-full object-cover!"
                            />
                        ) : (
                            <TourImagePlaceholder className="h-full w-full" />
                        )}

                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                setLightboxOpen(false);
                            }}
                            className="absolute z-50 top-4 right-4 h-10 w-10 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white transition-colors cursor-pointer"
                            aria-label="Yopish"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        <span className="absolute z-50 top-4 left-4 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white">
                            {activeIndex + 1} / {list.length}
                        </span>

                        {list.length > 1 && (
                            <>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        goPrev();
                                    }}
                                    className="absolute z-50 left-2 md:left-6 top-1/2 -translate-y-1/2 h-11 w-11 md:h-14 md:w-14 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white transition-colors cursor-pointer"
                                    aria-label="Oldingi rasm"
                                >
                                    <ChevronLeft className="h-6 w-6 md:h-7 md:w-7" />
                                </button>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        goNext();
                                    }}
                                    className="absolute z-50 right-2 md:right-6 top-1/2 -translate-y-1/2 h-11 w-11 md:h-14 md:w-14 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white transition-colors cursor-pointer"
                                    aria-label="Keyingi rasm"
                                >
                                    <ChevronRight className="h-6 w-6 md:h-7 md:w-7" />
                                </button>
                            </>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}