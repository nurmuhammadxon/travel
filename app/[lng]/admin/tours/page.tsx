"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Plus, Pencil, Trash2, Star, Loader2 } from "lucide-react";

import { getTours, deleteTour, updateTour } from "@/lib/api";
import { showSuccess, showError } from "@/lib/toast";
import type { Tour } from "@/types";
import { cn } from "@/lib/utils";

import { buttonVariants } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
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
            setError(err instanceof Error ? err.message : "Turlarni yuklab bo'lmadi");
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
            showError(err instanceof Error ? err.message : "Xatolik yuz berdi");
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
            showSuccess("Tur o'chirildi");
        } catch (err) {
            showError(err instanceof Error ? err.message : "Xatolik yuz berdi");
        } finally {
            setIsDeleting(false);
            setDeleteTarget(null);
        }
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">Turlar</h1>
                    <p className="text-sm text-muted-foreground">
                        Jami: {isLoading ? "..." : tours.length} ta tur
                    </p>
                </div>
                <Link
                    href={`${prefix}/admin/tours/new`}
                    className={cn(buttonVariants(), "gap-1.5")}
                >
                    <Plus className="h-4 w-4" />
                    Yangi tur
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
                    Hozircha turlar yo&apos;q
                </p>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nomi</TableHead>
                            <TableHead>Kategoriya</TableHead>
                            <TableHead>Narx</TableHead>
                            <TableHead className="text-center">
                                <Star className="h-4 w-4 inline" />
                            </TableHead>
                            <TableHead className="text-right">Amallar</TableHead>
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
                        <AlertDialogTitle>Turni o&apos;chirish</AlertDialogTitle>
                        <AlertDialogDescription>
                            {"Ushbu turni o'chirmoqchimisiz? Bu amalni ortga qaytarib bo'lmaydi."}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Bekor qilish</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteConfirm}
                            disabled={isDeleting}
                            className="bg-destructive text-white hover:bg-destructive/90"
                        >
                            {isDeleting ? "O'chirilmoqda..." : "O'chirish"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}