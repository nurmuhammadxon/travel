import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { localizedText } from "@/lib/utils";
import type { Tour } from "@/types";
import { TourAccommodation } from "./TourAccommodation";

type ItineraryDay = NonNullable<Tour["itinerary"]>[number];

interface TourItineraryDayProps {
    day: ItineraryDay;
    index: number;
    lng: string;
    labels: {
        what_to_expect: string;
        meals_included: string;
        transportation: string;
        accommodation: string;
        view_on_map: string;
        check_in: string;
    };
}

export function TourItineraryDay({ day, index, lng, labels }: TourItineraryDayProps) {
    return (
        <AccordionItem value={`day-${index}`}>
            <AccordionTrigger className="text-left">
                <span className="flex items-center gap-3">
                    <span className="shrink-0 h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                        {day.day_number}
                    </span>
                    <span className="font-semibold text-foreground">
                        {localizedText(day.title, lng)}
                    </span>
                </span>
            </AccordionTrigger>

            <AccordionContent className="pl-11 space-y-4">
                {day.description && (
                    <p className="text-sm text-muted-foreground">
                        {localizedText(day.description, lng)}
                    </p>
                )}

                {day.what_to_expect && (
                    <div className="rounded-lg bg-muted/50 p-3">
                        <p className="text-xs font-semibold text-foreground mb-1">
                            {labels.what_to_expect}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            {localizedText(day.what_to_expect, lng)}
                        </p>
                    </div>
                )}

                {day.meals_included && day.meals_included.length > 0 && (
                    <p className="text-xs text-muted-foreground">
                        <span className="font-semibold text-foreground">
                            {labels.meals_included}:
                        </span>{" "}
                        {day.meals_included.join(", ")}
                    </p>
                )}

                {day.transportation && (day.transportation.type || day.transportation.duration) && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="font-semibold text-foreground">
                            {labels.transportation}:
                        </span>
                        {day.transportation.type}
                        {day.transportation.duration && ` · ${day.transportation.duration}`}
                        {day.transportation.distance && ` · ${day.transportation.distance}`}
                    </div>
                )}

                {day.gallery && day.gallery.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto pb-1">
                        {day.gallery.map((img, gi) => (
                            <img
                                key={gi}
                                src={img}
                                alt=""
                                className="h-20 w-28 rounded-lg object-cover shrink-0"
                            />
                        ))}
                    </div>
                )}

                {day.accommodation?.name && (
                    <TourAccommodation
                        accommodation={day.accommodation}
                        labels={{
                            accommodation: labels.accommodation,
                            view_on_map: labels.view_on_map,
                            check_in: labels.check_in,
                        }}
                    />
                )}
            </AccordionContent>
        </AccordionItem>
    );
}
