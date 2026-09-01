import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { UseTourFormReturn } from "@/hooks/use-tour-form";

export function BasicInfoSection(f: UseTourFormReturn) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{f.t("form.main_info")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                        <Label>{f.t("form.name_uz")}</Label>
                        <Input value={f.titleUz} onChange={(e) => f.setTitleUz(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                        <Label>{f.t("form.name_ru")}</Label>
                        <Input value={f.titleRu} onChange={(e) => f.setTitleRu(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label>{f.t("form.name_en")}</Label>
                        <Input value={f.titleEn} onChange={(e) => f.setTitleEn(e.target.value)} />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>{f.t("form.slug")}</Label>
                    <Input value={f.slug} onChange={(e) => f.setSlug(e.target.value)} disabled={f.isEdit} required />
                    {f.isEdit && <p className="text-xs text-muted-foreground">{f.t("form.slug_hint")}</p>}
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                        <Label>{f.t("form.short_desc_uz")}</Label>
                        <Textarea value={f.shortDescUz} onChange={(e) => f.setShortDescUz(e.target.value)} rows={2} />
                    </div>
                    <div className="space-y-2">
                        <Label>{f.t("form.short_desc_ru")}</Label>
                        <Textarea value={f.shortDescRu} onChange={(e) => f.setShortDescRu(e.target.value)} rows={2} />
                    </div>
                    <div className="space-y-2">
                        <Label>{f.t("form.short_desc_en")}</Label>
                        <Textarea value={f.shortDescEn} onChange={(e) => f.setShortDescEn(e.target.value)} rows={2} />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                        <Label>{f.t("form.full_desc_uz")}</Label>
                        <Textarea value={f.descUz} onChange={(e) => f.setDescUz(e.target.value)} rows={5} required />
                    </div>
                    <div className="space-y-2">
                        <Label>{f.t("form.full_desc_ru")}</Label>
                        <Textarea value={f.descRu} onChange={(e) => f.setDescRu(e.target.value)} rows={5} />
                    </div>
                    <div className="space-y-2">
                        <Label>{f.t("form.full_desc_en")}</Label>
                        <Textarea value={f.descEn} onChange={(e) => f.setDescEn(e.target.value)} rows={5} />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}