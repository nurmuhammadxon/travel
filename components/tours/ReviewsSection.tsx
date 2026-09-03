"use client";

import { useState } from "react";
import Link from "next/link";
import { Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { createReview } from "@/lib/api";
import { showSuccess, showError } from "@/lib/toast";
import { cn } from "@/lib/utils";
import type { Review } from "@/types";

interface ReviewsSectionProps {
    tourId: string;
    initialReviews: Review[];
    labels: {
        title: string;
        no_reviews: string;
        write_review: string;
        login_prompt: string;
        login_link: string;
        rating_label: string;
        placeholder: string;
        submit: string;
        submitting: string;
        success: string;
    };
}

export function ReviewsSection({ tourId, initialReviews, labels }: ReviewsSectionProps) {
    const { user } = useAuth();
    const [reviews, setReviews] = useState(initialReviews);
    const [rating, setRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0);
    const [text, setText] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const avgRating =
        reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : null;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!text.trim()) return;

        setIsSubmitting(true);
        try {
            const newReview = await createReview({
                tour_id: tourId,
                rating,
                text: text.trim(),
                images: [],
            });
            setReviews((prev) => [newReview, ...prev]);
            setText("");
            setRating(5);
            showSuccess(labels.success);
        } catch (err) {
            showError(err instanceof Error ? err.message : "Xatolik yuz berdi");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <section className="pt-10 border-t border-border">
            <div className="flex items-center gap-3 mb-6">
                <h2 className="text-2xl font-bold text-primary">{labels.title}</h2>
                {avgRating && (
                    <div className="flex items-center gap-1 text-sm font-semibold text-foreground">
                        <Star className="h-4 w-4 fill-accent text-accent" />
                        {avgRating}
                        <span className="text-muted-foreground font-normal">({reviews.length})</span>
                    </div>
                )}
            </div>

            {reviews.length === 0 ? (
                <p className="text-muted-foreground text-sm mb-8">{labels.no_reviews}</p>
            ) : (
                <div className="space-y-5 mb-10">
                    {reviews.map((review) => (
                        <div key={review.id} className="rounded-xl bg-muted/50 p-5">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-0.5">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star
                                            key={i}
                                            className={cn(
                                                "h-3.5 w-3.5",
                                                i < review.rating ? "fill-accent text-accent" : "fill-muted text-muted-foreground/30"
                                            )}
                                        />
                                    ))}
                                </div>
                                {review.reviewer_country && (
                                    <span className="text-xs text-muted-foreground">{review.reviewer_country}</span>
                                )}
                            </div>
                            <p className="text-sm text-foreground/80 leading-relaxed">{review.text}</p>
                        </div>
                    ))}
                </div>
            )}

            <div className="rounded-xl border border-border p-5 md:p-6">
                <h3 className="font-bold text-primary mb-4">{labels.write_review}</h3>

                {!user ? (
                    <p className="text-sm text-muted-foreground">
                        {labels.login_prompt}{" "}
                        <Link href="/login" className="text-accent font-semibold hover:underline">
                            {labels.login_link}
                        </Link>
                    </p>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <span className="text-sm text-muted-foreground block mb-2">{labels.rating_label}</span>
                            <div className="flex items-center gap-1">
                                {Array.from({ length: 5 }).map((_, i) => {
                                    const starValue = i + 1;
                                    return (
                                        <Button
                                            key={i}
                                            type="button"
                                            onClick={() => setRating(starValue)}
                                            onMouseEnter={() => setHoverRating(starValue)}
                                            onMouseLeave={() => setHoverRating(0)}
                                        >
                                            <Star
                                                className={cn(
                                                    "h-6 w-6 transition-colors",
                                                    starValue <= (hoverRating || rating)
                                                        ? "fill-accent text-accent"
                                                        : "fill-muted text-muted-foreground/30"
                                                )}
                                            />
                                        </Button>
                                    );
                                })}
                            </div>
                        </div>

                        <Textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder={labels.placeholder}
                            rows={4}
                            required
                        />

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="rounded-full bg-primary text-white hover:bg-primary/90 gap-2"
                        >
                            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                            {isSubmitting ? labels.submitting : labels.submit}
                        </Button>
                    </form>
                )}
            </div>
        </section>
    );
}