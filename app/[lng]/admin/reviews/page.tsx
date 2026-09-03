"use client";

import { useEffect, useState } from "react";
import { Star, Trash2 } from "lucide-react";
import { useT } from "next-i18next/client";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Loading } from "@/components/_components/loading";
import { getAllReviews, deleteReview } from "@/lib/api";
import { showError, showSuccess } from "@/lib/toast";
import type { Review } from "@/types";

export default function AdminReviewsPage() {
    const { t } = useT("admin");

    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Review | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    async function load() {
        setIsLoading(true);
        setLoadError(null);
        try {
            const data = await getAllReviews();
            setReviews(data);
        } catch (err) {
            setLoadError(err instanceof Error ? err.message : t("reviews.load_error"));
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, []);

    async function handleDelete() {
        if (!deleteTarget) return;
        setIsDeleting(true);
        try {
            await deleteReview(deleteTarget.id);
            showSuccess(t("reviews.delete_success"));
            setDeleteTarget(null);
            setReviews((prev) => prev.filter((r) => r.id !== deleteTarget.id));
        } catch (err) {
            showError(err instanceof Error ? err.message : t("reviews.delete_error"));
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">{t("reviews.title")}</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    {t("reviews.total", { count: reviews.length })}
                </p>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-16">
                    <Loading className="h-8 w-8 text-muted-foreground" />
                </div>
            ) : loadError ? (
                <p className="text-destructive text-sm">{loadError}</p>
            ) : (
                <div className="rounded-xl border border-border overflow-x-auto bg-card">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{t("reviews.col_author")}</TableHead>
                                <TableHead>{t("reviews.col_rating")}</TableHead>
                                <TableHead>{t("reviews.col_text")}</TableHead>
                                <TableHead>{t("reviews.col_source")}</TableHead>
                                <TableHead>{t("reviews.col_verified")}</TableHead>
                                <TableHead className="text-right">{t("reviews.col_actions")}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {reviews.map((review) => (
                                <TableRow key={review.id}>
                                    <TableCell className="font-medium">
                                        {review.reviewer_name}
                                        {review.reviewer_country && (
                                            <span className="block text-[0.7rem] text-muted-foreground">
                                                {review.reviewer_country}
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1">
                                            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                                            {review.rating}
                                        </div>
                                    </TableCell>
                                    <TableCell className="max-w-80 truncate">{review.text}</TableCell>
                                    <TableCell>{review.source ?? "—"}</TableCell>
                                    <TableCell>
                                        {review.is_verified ? (
                                            <Badge>{t("reviews.verified_yes")}</Badge>
                                        ) : (
                                            <span className="text-muted-foreground">—</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            size="icon-sm"
                                            variant="ghost"
                                            className="text-destructive hover:bg-destructive/10"
                                            onClick={() => setDeleteTarget(review)}
                                            aria-label={t("reviews.delete_label")}
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {reviews.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                                        {t("reviews.not_found")}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            )}

            <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>{t("reviews.delete_title")}</DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-muted-foreground">
                        {t("reviews.delete_confirm", { name: deleteTarget?.reviewer_name ?? "" })}
                    </p>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteTarget(null)}>
                            {t("reviews.cancel")}
                        </Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                            {isDeleting ? t("reviews.deleting") : t("reviews.delete_label")}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}