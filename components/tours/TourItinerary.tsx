import { Accordion } from "@/components/ui/accordion";
import type { Tour } from "@/types";
import { TourItineraryDay } from "./TourItineraryDay";

interface TourItineraryProps {
    itinerary: NonNullable<Tour["itinerary"]>;
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

export function TourItinerary({ itinerary, lng, labels }: TourItineraryProps) {
    return (
        <Accordion defaultValue={["day-0"]}>
            {itinerary.map((day, i) => (
                <TourItineraryDay key={i} day={day} index={i} lng={lng} labels={labels} />
            ))}
        </Accordion>
    );
}
