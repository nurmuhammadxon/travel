import { Bus, FileCheck2, Compass, Route, ShieldCheck, Building2, type LucideIcon } from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
    transportation: Bus,
    visa_support: FileCheck2,
    tours: Compass,
    itineraries: Route,
    insurance: ShieldCheck,
    corporate: Building2,
};

export function ServiceCard({
    serviceKey,
    title,
    text,
}: {
    serviceKey: string;
    title: string;
    text: string;
}) {
    const Icon = ICONS[serviceKey] ?? Compass;

    return (
        <div className="rounded-2xl border border-border p-6 hover:border-primary/30 hover:shadow-sm transition-all">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Icon className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-bold text-primary mb-2">{title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
        </div>
    );
}