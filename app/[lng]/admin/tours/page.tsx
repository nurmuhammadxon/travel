"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Plus, Pencil, Trash2, Star, Loader2, Globe } from "lucide-react";
import { useT } from "next-i18next/client";

import { getTours, deleteTour, updateTour } from "@/lib/api";
import { showSuccess, showError } from "@/lib/toast";
import type { Tour } from "@/types";
import { cn } from "@/lib/utils";
import { buttonVariants, Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function AdminToursPage() {
    const { t } = useT("admin");
    const params = useParams<{ lng: string }>();
    const lng = params.lng ?? "uz";
    const prefix = lng === "uz" ? "" : `/${lng}`;

    const [tours, setTours] = useState<Tour[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Tour | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [togglingId, setTogglingId] = useState<string | null>(null);

    async function loadTours() {
        setIsLoading(true);
        setError(null);
        try {
            const res = await getTours({ page_size: 50 });
            setTours(res.items);
        } catch (err) {
            setError(err instanceof Error ? err.message : t("tours.load_error"));
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        loadTours();
    }, []);

    async function handleToggleFeatured(tour: Tour, value: boolean) {
        setTogglingId(tour.id);
        try {
            await updateTour(tour.id, { is_featured: value });
            setTours((prev) =>
                prev.map((t) => (t.id === tour.id ? { ...t, is_featured: value } : t))
            );
        } catch (err) {
            showError(err instanceof Error ? err.message : t("tours.toggle_error"));
        } finally {
            setTogglingId(null);
        }
    }

    async function handleDeleteConfirm() {
        if (!deleteTarget) return;
        setIsDeleting(true);
        try {
            await deleteTour(deleteTarget.id);
            setTours((prev) => prev.filter((t) => t.id !== deleteTarget.id));
            showSuccess(t("tours.delete_success"));
        } catch (err) {
            showError(err instanceof Error ? err.message : t("tours.toggle_error"));
        } finally {
            setIsDeleting(false);
            setDeleteTarget(null);
        }
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">{t("tours.title")}</h1>
                    <p className="text-sm text-muted-foreground">
                        {t("tours.total", { count: isLoading ? t("tours.loading_count") : tours.length })}
                    </p>
                </div>
                <Link
                    href={`${prefix}/admin/geography`}
                    className={cn(buttonVariants({ variant: "outline" }), "gap-1.5")}
                >
                    <Globe className="h-4 w-4" />
                    {t("settings.geography.manage_button")}
                </Link>
                <Link
                    href={`${prefix}/admin/tours/new`}
                    className={cn(buttonVariants(), "gap-1.5")}
                >
                    <Plus className="h-4 w-4" />
                    {t("tours.new_tour")}
                </Link>
            </div>

            {error && (
                <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {error}
                </div>
            )}

            {isLoading ? (
                <div className="space-y-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full" />
                    ))}
                </div>
            ) : tours.length === 0 ? (
                <p className="text-sm text-muted-foreground py-10 text-center">
                    {t("tours.empty")}
                </p>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>{t("tours.col_name")}</TableHead>
                            <TableHead>{t("tours.col_category")}</TableHead>
                            <TableHead>{t("tours.col_price")}</TableHead>
                            <TableHead className="text-center">
                                <Star className="h-4 w-4 inline" />
                            </TableHead>
                            <TableHead className="text-right">{t("tours.col_actions")}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tours.map((tour) => (
                            <TableRow key={tour.id}>
                                <TableCell className="font-medium">
                                    {typeof tour.title === "string" ? tour.title : tour.slug}
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline">{tour.category}</Badge>
                                </TableCell>
                                <TableCell>
                                    {tour.price} {tour.currency}
                                </TableCell>
                                <TableCell className="text-center">
                                    {togglingId === tour.id ? (
                                        <Loader2 className="h-4 w-4 animate-spin inline" />
                                    ) : (
                                        <Switch
                                            checked={Boolean((tour as unknown as { is_featured?: boolean }).is_featured)}
                                            onCheckedChange={(v) => handleToggleFeatured(tour, v)}
                                        />
                                    )}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button variant="ghost" size="icon">
                                            <Link href={`${prefix}/admin/tours/${tour.slug}/edit`}>
                                                <Pencil className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setDeleteTarget(tour)}
                                        >
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}

            <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t("tours.delete_title")}</AlertDialogTitle>
                        <AlertDialogDescription>{t("tours.delete_confirm")}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>{t("tours.cancel")}</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteConfirm}
                            disabled={isDeleting}
                            className="bg-destructive text-white hover:bg-destructive/90"
                        >
                            {isDeleting ? t("tours.deleting") : t("tours.delete")}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}