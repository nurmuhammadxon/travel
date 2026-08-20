import Link from "next/link";
import { Compass } from "lucide-react";
import { cn } from "@/lib/utils";

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 text-center">
            <span className="text-7xl md:text-8xl font-bold text-primary/10">404</span>
            <h1 className="text-2xl md:text-3xl font-bold text-primary -mt-6">
                Sahifa topilmadi
            </h1>
            <p className="text-muted-foreground mt-3 max-w-sm">
                Siz qidirayotgan sahifa mavjud emas yoki ko&apos;chirilgan bo&apos;lishi mumkin.
            </p>
            <Link
                href="/"
                className={cn(
                    "mt-8 inline-flex items-center gap-2 rounded-full bg-primary text-white px-6 py-3 text-sm font-semibold hover:bg-primary/90 transition-colors"
                )}
            >
                <Compass className="h-4 w-4" />
                Bosh sahifaga qaytish
            </Link>
        </div>
    );
}