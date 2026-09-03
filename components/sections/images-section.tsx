import { Loader2, Upload, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import type { UseTourFormReturn } from "@/hooks/use-tour-form";
import { Button } from "../ui/button";

export function ImagesSection(f: UseTourFormReturn) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{f.t("form.image_section")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label>{f.t("form.cover_image")}</Label>
                    <div className="flex items-center gap-4">
                        {f.coverImage && (
                            <img src={f.coverImage} alt="cover" className="h-20 w-32 rounded-md object-cover border" />
                        )}
                        <div className="flex flex-col gap-2">
                            <label className="inline-flex items-center gap-2 cursor-pointer rounded-md border px-3 py-2 text-sm hover:bg-muted">
                                {f.isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                                {f.t("form.select_image")}
                                <input type="file" accept="image/jpeg,image/png,image/webp,image/heic" className="hidden" onChange={f.handleCoverUpload} />
                            </label>
                            {f.coverImage && (
                                <Button type="button" onClick={() => f.setCoverImage("")} className="inline-flex items-center gap-1 text-xs text-destructive hover:underline">
                                    <X className="h-3 w-3" /> {f.t("form.remove_image")}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-2 pt-4 border-t">
                    <Label>{f.t("form.gallery")}</Label>
                    <div className="flex flex-wrap gap-3">
                        {f.images.map((img, i) => (
                            <div key={i} className="relative">
                                <img src={img} alt={`gallery-${i}`} className="h-20 w-28 rounded-md object-cover border" />
                                <Button type="button" onClick={() => f.removeGalleryImage(i)} className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1">
                                    <X className="h-3 w-3" />
                                </Button>
                            </div>
                        ))}
                    </div>
                    <label className="inline-flex items-center gap-2 cursor-pointer rounded-md border px-3 py-2 text-sm hover:bg-muted w-fit">
                        {f.isUploadingGallery ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                        {f.t("form.add_images")}
                        <input type="file" accept="image/jpeg,image/png,image/webp,image/heic" className="hidden" multiple onChange={f.handleGalleryUpload} />
                    </label>
                    <p className="text-xs text-muted-foreground">{f.t("form.gallery_hint")}</p>
                </div>
            </CardContent>
        </Card>
    );
}