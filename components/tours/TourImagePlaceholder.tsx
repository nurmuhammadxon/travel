import { Compass } from "lucide-react";
import { cn } from "@/lib/utils";

export function TourImagePlaceholder({ className }: { className?: string }) {
    return (
        <div
            className={cn(
                "relative flex items-center justify-center overflow-hidden bg-linear-to-br from-primary via-primary/90 to-primary/70",
                className
            )}
        >
            <svg
                className="absolute inset-0 h-full w-full opacity-[0.08]"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
            >
                <defs>
                    <pattern id="tour-pattern" width="14" height="14" patternUnits="userSpaceOnUse">
                        <circle cx="7" cy="7" r="1.2" fill="white" />
                        <path
                            d="M0 7 L7 0 L14 7 L7 14 Z"
                            fill="none"
                            stroke="white"
                            strokeWidth="0.4"
                        />
                    </pattern>
                </defs>
                <rect width="100" height="100" fill="url(#tour-pattern)" />
            </svg>

            <div className="relative flex flex-col items-center gap-3 px-6 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm ring-1 ring-white/20">
                    <Compass className="h-6 w-6 text-white/90" strokeWidth={1.5} />
                </div>
                <span className="text-xs font-medium tracking-wide text-white/70 uppercase">
                    Centralia Tours
                </span>
            </div>
        </div>
    );
}