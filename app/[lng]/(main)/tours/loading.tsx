import { Skeleton } from "@/components/ui/skeleton";

export default function ToursLoading() {
    return (
        <div className="min-h-screen bg-background pb-20">
            <div className="relative min-h-[60vh] md:min-h-screen flex items-center justify-center overflow-hidden -mx-4 mb-12 bg-primary" />
            <div className="mx-auto max-w-7xl px-4">
                <div className="mb-10">
                    <Skeleton className="h-12 w-full max-w-xl" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="rounded-2xl overflow-hidden border border-border">
                            <Skeleton className="h-56 w-full rounded-none" />
                            <div className="p-4 space-y-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-5 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}