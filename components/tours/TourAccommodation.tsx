import type { Tour } from "@/types";

type ItineraryDay = NonNullable<Tour["itinerary"]>[number];
type Accommodation = NonNullable<ItineraryDay["accommodation"]>;

interface TourAccommodationProps {
    accommodation: Accommodation;
    labels: {
        accommodation: string;
        view_on_map: string;
        check_in: string;
    };
}

export function TourAccommodation({ accommodation, labels }: TourAccommodationProps) {
    if (!accommodation?.name) return null;

    return (
        <div className="rounded-lg border border-border p-3 space-y-1">
            <p className="text-xs font-semibold text-muted-foreground">{labels.accommodation}</p>

            <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-foreground">{accommodation.name}</p>
                {accommodation.stars && (
                    <span className="text-xs text-accent">{"★".repeat(accommodation.stars)}</span>
                )}
            </div>

            {accommodation.address && (
                <p className="text-xs text-muted-foreground">
                    {accommodation.address}
                    {accommodation.map_url && (
                        <>
                            {" · "}
                            <a
                                href={accommodation.map_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-accent hover:underline"
                            >
                                {labels.view_on_map}
                            </a>
                        </>
                    )}
                </p>
            )}

            {(accommodation.check_in || accommodation.room_type) && (
                <p className="text-xs text-muted-foreground">
                    {accommodation.check_in && `${labels.check_in}: ${accommodation.check_in}`}
                    {accommodation.check_in && accommodation.room_type && " · "}
                    {accommodation.room_type}
                </p>
            )}

            {accommodation.photos && accommodation.photos.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pt-1">
                    {accommodation.photos.map((img, pi) => (
                        <img
                            key={pi}
                            src={img}
                            alt=""
                            className="h-14 w-20 rounded-md object-cover shrink-0"
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
