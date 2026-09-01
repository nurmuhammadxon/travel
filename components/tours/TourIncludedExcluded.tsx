import { Check, X } from "lucide-react";

interface TourIncludedExcludedProps {
    included: string[];
    excluded: string[];
    labels: {
        whats_included: string;
        whats_excluded: string;
    };
}

export function TourIncludedExcluded({ included, excluded, labels }: TourIncludedExcludedProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {included.length > 0 && (
                <div>
                    <h3 className="font-semibold text-foreground mb-3">{labels.whats_included}</h3>
                    <ul className="space-y-2">
                        {included.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                                <Check className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                                <span className="text-foreground/80">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {excluded.length > 0 && (
                <div>
                    <h3 className="font-semibold text-foreground mb-3">{labels.whats_excluded}</h3>
                    <ul className="space-y-2">
                        {excluded.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                                <X className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                                <span className="text-foreground/80">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
