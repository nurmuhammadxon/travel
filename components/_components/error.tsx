"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen bg-background">
            <div className="min-h-[45vh] bg-primary flex flex-col items-center justify-center px-4 text-center pt-16">
                <div className="h-16 w-16 rounded-full bg-white/10 flex items-center justify-center mb-4">
                    <AlertTriangle className="h-7 w-7 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-white">Something went wrong</h1>
                <p className="text-white/80 mt-2 max-w-sm">
                    Sorry, an unexpected error occurred. Please try again.
                </p>
                <Button onClick={reset} className="mt-6 rounded-full bg-white text-primary hover:bg-white/90">
                    Try again
                </Button>
            </div>
        </div>
    );
}