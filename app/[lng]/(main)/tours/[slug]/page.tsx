import { notFound } from "next/navigation";
import { getT } from "next-i18next/server";
import { MapPin, Clock, ShieldCheck, UserRound, Activity, Check, X } from "lucide-react";
import { getTourBySlug, getTours } from "@/lib/api";
import { localizedText, localizedList } from "@/lib/utils";
import type { Tour } from "@/types";
import { TourGallery } from "@/components/tours/TourGallery";
import { ReviewsSection } from "@/components/tours/ReviewsSection";
import { BookingCard } from "@/components/tours/BookingCard";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/components/ui/accordion";
import { TourCard } from "@/components/tours/TourCard";

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

    let relatedTours: Tour[] = [];
    try {
        const relatedRes = await getTours({
            lang: lng,
            category: tour.category,
            page_size: 4,
        });
        relatedTours = relatedRes.items.filter((t) => t.slug !== tour.slug).slice(0, 3);
    } catch {
        relatedTours = [];
    }

    const reviews = tour.reviews ?? [];
    const title = localizedText(tour.title, lng);
    const description = localizedText(tour.description, lng);
    const countryName = tour.countries?.[0] ? localizedText(tour.countries[0].name, lng) : "";

    const highlights = localizedList(tour.highlights, lng);
    const included = localizedList(tour.included, lng);
    const excluded = localizedList(tour.excluded, lng);
    const destinationChips = tour.destinations ?? [];

    // Tezkor ma'lumot bloki - faqat backend'dan kelgan maydonlar ko'rsatiladi
    const quickInfo = [
        tour.duration_days
            ? {
                icon: Clock,
                label: t("days_short"),
                value: `${tour.duration_days} ${tour.duration_nights ? `/ ${tour.duration_nights}` : ""}`,
            }
            : null,
        typeof tour.technical_level === "number"
            ? { icon: ShieldCheck, label: t("technical_level"), value: `${tour.technical_level}/5` }
            : null,
        typeof tour.min_age === "number"
            ? { icon: UserRound, label: t("min_age"), value: `${tour.min_age}+` }
            : null,
        typeof tour.fitness_level === "number"
            ? { icon: Activity, label: t("fitness_level"), value: `${tour.fitness_level}/5` }
            : null,
    ].filter((x): x is NonNullable<typeof x> => x !== null);

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
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-primary mb-6">{title}</h1>

                <TourGallery images={tour.images ?? (tour.cover_image ? [tour.cover_image] : [])} title={title} />

                {/* Tezkor ma'lumot qatori */}
                {quickInfo.length > 0 && (
                    <div className="flex flex-wrap gap-6 md:gap-10 mt-8 pb-8 border-b border-border">
                        {quickInfo.map((info) => (
                            <div key={info.label} className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-full bg-accent/15 text-accent flex items-center justify-center shrink-0">
                                    <info.icon className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">{info.label}</p>
                                    <p className="text-sm font-semibold text-foreground">{info.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-8">
                    <div className="lg:col-span-2">
                        {/* Yo'nalish chip'lari */}
                        {destinationChips.length > 0 && (
                            <div className="mb-8">
                                <h2 className="text-lg font-bold text-primary mb-3">
                                    {t("destinations_title")}
                                </h2>
                                <div className="flex flex-wrap gap-2">
                                    {destinationChips.map((d) => (
                                        <Badge
                                            key={d.id}
                                            variant="outline"
                                            className="gap-1.5 rounded-full px-3 py-1.5 text-sm"
                                        >
                                            <MapPin className="h-3.5 w-3.5" />
                                            {localizedText(d.name, lng)}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        <Tabs defaultValue="overview">
                            <TabsList variant="line" className="mb-6 flex-wrap h-auto">
                                <TabsTrigger value="overview">{t("tab_overview")}</TabsTrigger>
                                {tour.itinerary && tour.itinerary.length > 0 && (
                                    <TabsTrigger value="itinerary">{t("tab_itinerary")}</TabsTrigger>
                                )}
                                {(included.length > 0 || excluded.length > 0) && (
                                    <TabsTrigger value="included">{t("tab_included")}</TabsTrigger>
                                )}
                                {tour.faqs && tour.faqs.length > 0 && (
                                    <TabsTrigger value="faqs">{t("tab_faqs")}</TabsTrigger>
                                )}
                            </TabsList>

                            {/* --- OVERVIEW --- */}
                            <TabsContent value="overview" className="space-y-8">
                                <div>
                                    <h2 className="text-xl font-bold text-primary mb-3">{t("about_tour")}</h2>
                                    <p className="text-foreground/80 leading-relaxed whitespace-pre-line">
                                        {description}
                                    </p>
                                </div>

                                {highlights.length > 0 && (
                                    <div>
                                        <h2 className="text-xl font-bold text-primary mb-3">
                                            {t("highlights_title")}
                                        </h2>
                                        <ul className="space-y-2">
                                            {highlights.map((h, i) => (
                                                <li key={i} className="flex items-start gap-2 text-sm">
                                                    <Check className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                                                    <span className="text-foreground/80">{h}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </TabsContent>

                            {/* --- ITINERARY (accordion) --- */}
                            {tour.itinerary && tour.itinerary.length > 0 && (
                                <TabsContent value="itinerary">
                                    <Accordion defaultValue={["day-0"]}>
                                        {tour.itinerary.map((day, i) => (
                                            <AccordionItem key={i} value={`day-${i}`}>
                                                <AccordionTrigger className="text-left">
                                                    <span className="flex items-center gap-3">
                                                        <span className="shrink-0 h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                                                            {day.day}
                                                        </span>
                                                        <span className="font-semibold text-foreground">
                                                            {localizedText(day.title, lng)}
                                                        </span>
                                                    </span>
                                                </AccordionTrigger>
                                                <AccordionContent className="pl-11 text-sm text-muted-foreground">
                                                    {localizedText(day.description, lng)}
                                                </AccordionContent>
                                            </AccordionItem>
                                        ))}
                                    </Accordion>
                                </TabsContent>
                            )}

                            {/* --- INCLUDED / EXCLUDED --- */}
                            {(included.length > 0 || excluded.length > 0) && (
                                <TabsContent value="included">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {included.length > 0 && (
                                            <div>
                                                <h3 className="font-semibold text-foreground mb-3">
                                                    {t("whats_included")}
                                                </h3>
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
                                                <h3 className="font-semibold text-foreground mb-3">
                                                    {t("whats_excluded")}
                                                </h3>
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
                                </TabsContent>
                            )}

                            {/* --- FAQ (accordion) --- */}
                            {tour.faqs && tour.faqs.length > 0 && (
                                <TabsContent value="faqs">
                                    <Accordion defaultValue={[]}>
                                        {tour.faqs.map((faq, i) => (
                                            <AccordionItem key={i} value={`faq-${i}`}>
                                                <AccordionTrigger className="text-left font-medium">
                                                    {localizedText(faq.question, lng)}
                                                </AccordionTrigger>
                                                <AccordionContent className="text-sm text-muted-foreground">
                                                    {localizedText(faq.answer, lng)}
                                                </AccordionContent>
                                            </AccordionItem>
                                        ))}
                                    </Accordion>
                                </TabsContent>
                            )}
                        </Tabs>

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
                        <div className="sticky top-28">
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
                {relatedTours.length > 0 && (
                    <div className="mt-20 pt-12 border-t border-border">
                        <div className="text-center mb-10">
                            <h2 className="text-2xl md:text-3xl font-bold text-primary">
                                {t("related_title")}
                            </h2>
                            <p className="text-muted-foreground mt-1">{t("related_subtitle")}</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {relatedTours.map((relatedTour) => (
                                <TourCard
                                    key={relatedTour.id}
                                    tour={relatedTour}
                                    viewLabel={t("view_tour")}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}