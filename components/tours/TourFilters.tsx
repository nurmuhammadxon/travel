"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const CATEGORIES = [
    { value: "day_trip", label: "Kunlik tur" },
    { value: "multi_day", label: "Ko'p kunlik tur" },
];

interface TourFiltersProps {
    labels: {
        search: string;
        all_categories: string;
        clear: string;
    };
}

export function TourFilters({ labels }: TourFiltersProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const currentCategory = searchParams.get("category") ?? "";
    const currentQuery = searchParams.get("search") ?? "";

    function updateParam(key: string, value: string) {
        const params = new URLSearchParams(searchParams.toString());
        if (value) params.set(key, value);
        else params.delete(key);
        const query = params.toString();
        router.push(query ? `${pathname}?${query}` : pathname);
    }

    const hasActiveFilters = currentCategory || currentQuery;

    return (
        <div className="flex flex-col md:flex-row gap-3 md:items-center">
            <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    defaultValue={currentQuery}
                    placeholder={labels.search}
                    className="pl-10 rounded-full"
                    onKeyDown={(e) => {
                        if (e.key === "Enter") updateParam("search", (e.target as HTMLInputElement).value);
                    }}
                />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
                <button
                    onClick={() => updateParam("category", "")}
                    className={cn(
                        "text-sm px-4 py-2 rounded-full border transition-colors",
                        !currentCategory
                            ? "bg-primary text-white border-primary"
                            : "border-border text-muted-foreground hover:border-primary/40"
                    )}
                >
                    {labels.all_categories}
                </button>
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat.value}
                        onClick={() => updateParam("category", cat.value)}
                        className={cn(
                            "text-sm px-4 py-2 rounded-full border transition-colors",
                            currentCategory === cat.value
                                ? "bg-primary text-white border-primary"
                                : "border-border text-muted-foreground hover:border-primary/40"
                        )}
                    >
                        {cat.label}
                    </button>
                ))}

                {hasActiveFilters && (
                    <button
                        onClick={() => router.push(pathname)}
                        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-destructive transition-colors"
                    >
                        <X className="h-3.5 w-3.5" />
                        {labels.clear}
                    </button>
                )}
            </div>
        </div>
    );
}