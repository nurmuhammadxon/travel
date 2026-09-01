import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { UseTourFormReturn } from "@/hooks/use-tour-form";

export function HighlightsSection(f: UseTourFormReturn) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{f.t("form.highlights")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-xs text-muted-foreground">{f.t("form.list_hint")}</p>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                        <Label>UZ</Label>
                        <Textarea value={f.highlightsUz} onChange={(e) => f.setHighlightsUz(e.target.value)} rows={4} />
                    </div>
                    <div className="space-y-2">
                        <Label>RU</Label>
                        <Textarea value={f.highlightsRu} onChange={(e) => f.setHighlightsRu(e.target.value)} rows={4} />
                    </div>
                    <div className="space-y-2">
                        <Label>EN</Label>
                        <Textarea value={f.highlightsEn} onChange={(e) => f.setHighlightsEn(e.target.value)} rows={4} />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}