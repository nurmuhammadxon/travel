import { Skeleton } from "@/components/ui/skeleton";

export default function TourDetailLoading() {
    return (
        <div className="min-h-screen bg-background pt-28 md:pt-32 pb-20">
            <div className="mx-auto max-w-7xl px-4">
                <Skeleton className="h-4 w-32 mb-4" />
                <Skeleton className="h-10 w-2/3 mb-6" />
                <Skeleton className="h-96 w-full rounded-2xl mb-8" />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2 space-y-4">
                        <Skeleton className="h-6 w-40" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                    </div>
                    <div className="lg:col-span-1">
                        <Skeleton className="h-80 w-full rounded-2xl" />
                    </div>
                </div>
            </div>
        </div>
    );
}