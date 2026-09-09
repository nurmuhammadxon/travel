import Link from "next/link";
import { X } from "lucide-react";
import { localizedHref } from "@/lib/utils";
import i18nConfig from "@/i18n.config";

export default async function LegalLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ lng: string }>;
}) {
    const { lng } = await params;

    return (
        <div className="min-h-screen bg-background">
            <div className="sticky top-0 z-50 bg-background border-b border-border">
                <div className="mx-auto max-w-3xl px-4 h-16 flex items-center justify-end">
                    <Link
                        href={localizedHref(lng, "/", i18nConfig.fallbackLng)}
                        aria-label="Yopish"
                        className="h-9 w-9 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </Link>
                </div>
            </div>
            {children}
        </div>
    );
}