"use client";

import { useEffect, useRef, useState } from "react";
import { useT } from "next-i18next/client";
import { cn } from "@/lib/utils";

interface Review {
    rating: number;
}

interface StatsProps {
    totalTours: number;
    reviews?: Review[];
}

function useCountUp(target: number, start: boolean, duration = 1500) {
    const [value, setValue] = useState(0);

    useEffect(() => {
        if (!start) return;
        let raf: number;
        const startTime = performance.now();

        function tick(now: number) {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out
            setValue(Math.round(target * eased));
            if (progress < 1) raf = requestAnimationFrame(tick);
        }
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [start, target, duration]);

    return value;
}

function StatCircle({
    value,
    suffix,
    label,
    offset,
    start,
}: {
    value: number;
    suffix: string;
    label: string;
    offset: string;
    start: boolean;
}) {
    const count = useCountUp(value, start);

    return (
        <div className={cn("relative flex flex-col items-center", offset)}>
            <div className="relative h-40 w-40 md:h-44 md:w-44 rounded-full border border-accent/40 flex items-center justify-center">
                <div className="h-32 w-32 md:h-36 md:w-36 rounded-full bg-primary/5 flex flex-col items-center justify-center text-center px-3">
                    <span className="text-3xl md:text-4xl font-bold text-primary">
                        {count.toLocaleString()}
                        {suffix}
                    </span>
                    <span className="text-xs md:text-sm text-muted-foreground mt-1 leading-tight">
                        {label}
                    </span>
                </div>
                <span className="absolute top-3 right-3 h-2 w-2 rounded-full bg-accent" />
            </div>
        </div>
    );
}

export function Stats({ totalTours, reviews = [] }: StatsProps) {
    const { t } = useT("home");
    const ref = useRef<HTMLDivElement>(null);
    const [started, setStarted] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setStarted(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.4 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    // reviews[].rating backenddan 1-5 oralig'ida keladi, foizga o'giramiz
    const satisfactionPct =
        reviews.length > 0
            ? Math.round(
                (reviews.reduce((sum, r) => sum + r.rating, 0) /
                    reviews.length /
                    5) *
                100
            )
            : 95; // reviews hali bo'lmasa fallback

    const stats = [
        { key: "years", value: 12, suffix: "", offset: "md:mt-16" },
        { key: "satisfaction", value: satisfactionPct, suffix: "%", offset: "" },
        { key: "adventures", value: totalTours, suffix: "+", offset: "md:mt-16" },
        { key: "travelers", value: 9431, suffix: "+", offset: "" },
    ];

    return (
        <section ref={ref} className="py-10 md:py-8 bg-background">
            <div className="mx-auto max-w-6xl px-4 grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-14 justify-items-center">
                {stats.map((stat) => (
                    <StatCircle
                        key={stat.key}
                        value={stat.value}
                        suffix={stat.suffix}
                        label={t(`stats.${stat.key}`)}
                        offset={stat.offset}
                        start={started}
                    />
                ))}
            </div>
        </section>
    );
}