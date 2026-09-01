import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { UseTourFormReturn } from "@/hooks/use-tour-form";

export function IncludedExcludedSection(f: UseTourFormReturn) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{f.t("form.included")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <Label className="mb-2 block">{f.t("form.included_label")}</Label>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <Textarea value={f.includedUz} onChange={(e) => f.setIncludedUz(e.target.value)} rows={4} placeholder="UZ" />
                        <Textarea value={f.includedRu} onChange={(e) => f.setIncludedRu(e.target.value)} rows={4} placeholder="RU" />
                        <Textarea value={f.includedEn} onChange={(e) => f.setIncludedEn(e.target.value)} rows={4} placeholder="EN" />
                    </div>
                </div>
                <div>
                    <Label className="mb-2 block">{f.t("form.excluded_label")}</Label>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <Textarea value={f.excludedUz} onChange={(e) => f.setExcludedUz(e.target.value)} rows={4} placeholder="UZ" />
                        <Textarea value={f.excludedRu} onChange={(e) => f.setExcludedRu(e.target.value)} rows={4} placeholder="RU" />
                        <Textarea value={f.excludedEn} onChange={(e) => f.setExcludedEn(e.target.value)} rows={4} placeholder="EN" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}