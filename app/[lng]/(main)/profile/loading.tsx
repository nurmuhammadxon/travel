import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileLoading() {
    return (
        <div className="min-h-screen bg-background pt-28 md:pt-32 pb-20">
            <div className="mx-auto max-w-4xl px-4 space-y-6">
                <Skeleton className="h-8 w-48" />
                <div className="rounded-2xl border border-border p-6 space-y-4">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
            </div>
        </div>
    );
}