import { notFound } from "next/navigation";
import { getT } from "next-i18next/server";
import { MapPin, Clock } from "lucide-react";
import { getTourBySlug } from "@/lib/api";
import { localizedText } from "@/lib/utils";
import { TourGallery } from "@/components/tours/TourGallery";
import { ReviewsSection } from "@/components/tours/ReviewsSection";
import { BookingCard } from "@/components/tours/BookingCard";

interface Props {
    params: Promise<{ lng: string; slug: string }>;
}

export default async function TourDetailPage({ params }: Props) {
    const { lng, slug } = await params;
    const { t } = await getT("tours", { lng });

    let tour;
    try {
        tour = await getTourBySlug(slug, lng);
    } catch {
        notFound();
    }
    if (!tour) notFound();

    const reviews = tour.reviews ?? [];
    const title = localizedText(tour.title, lng);
    const description = localizedText(tour.description, lng);
    const countryName = tour.countries?.[0] ? localizedText(tour.countries[0].name, lng) : "";

    return (
        <div className="min-h-screen bg-background pt-28 md:pt-32 pb-20">
            <div className="mx-auto max-w-7xl px-4">
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    {countryName && (
                        <span className="flex items-center gap-1.5">
                            <MapPin className="h-4 w-4" />
                            {countryName}
                        </span>
                    )}
                    {tour.itinerary && tour.itinerary.length > 0 && (
                        <span className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4" />
                            {tour.itinerary.length} {t("days_short")}
                        </span>
                    )}
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-primary mb-8">{title}</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2">
                        <TourGallery images={tour.images ?? (tour.cover_image ? [tour.cover_image] : [])} title={title} />
                        <div className="mt-10">
                            <h2 className="text-2xl font-bold text-primary mb-3">{t("about_tour")}</h2>
                            <p className="text-foreground/80 leading-relaxed">{description}</p>
                        </div>

                        {tour.itinerary && tour.itinerary.length > 0 && (
                            <div className="mt-10">
                                <h2 className="text-2xl font-bold text-primary mb-5">{t("itinerary_title")}</h2>
                                <div className="space-y-4">
                                    {tour.itinerary.map((day, i) => (
                                        <div key={i} className="flex gap-4">
                                            <div className="shrink-0 h-9 w-9 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                                                {day.day}
                                            </div>
                                            <div className="pb-4 border-b border-border flex-1">
                                                <h3 className="font-semibold text-foreground">{localizedText(day.title, lng)}</h3>
                                                <p className="text-sm text-muted-foreground mt-1">{localizedText(day.description, lng)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="mt-10">
                            <ReviewsSection
                                tourId={tour.id}
                                initialReviews={reviews}
                                labels={{
                                    title: t("reviews_title"),
                                    no_reviews: t("no_reviews"),
                                    write_review: t("write_review"),
                                    login_prompt: t("login_prompt"),
                                    login_link: t("login_link"),
                                    rating_label: t("rating_label"),
                                    placeholder: t("review_placeholder"),
                                    submit: t("submit_review"),
                                    submitting: t("submitting"),
                                    success: t("review_success"),
                                }}
                            />
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <BookingCard
                            tourId={tour.id}
                            price={Number(tour.price)}
                            currency={tour.currency}
                            labels={{
                                from: t("from"),
                                per_person: t("per_person"),
                                date: t("select_date"),
                                adults: t("adults"),
                                children: t("children"),
                                book_now: t("book_now"),
                                booking: t("booking_in_progress"),
                                total: t("total"),
                                full_name: t("full_name"),
                                email: t("email"),
                                phone: t("phone"),
                                success: t("booking_success"),
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}