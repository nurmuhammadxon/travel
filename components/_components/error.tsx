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
        <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 text-center">
            <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                <AlertTriangle className="h-7 w-7 text-destructive" />
            </div>
            <h1 className="text-2xl font-bold text-primary">Nimadir notogri ketdi</h1>
            <p className="text-muted-foreground mt-2 max-w-sm">
                Kechirasiz, kutilmagan xatolik yuz berdi. Qaytadan urinib koring.
            </p>
            <Button onClick={reset} className="mt-6 rounded-full bg-primary text-white hover:bg-primary/90">
                Qaytadan urinish
            </Button>
        </div>
    );
}