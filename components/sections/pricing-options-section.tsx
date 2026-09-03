import { Trash2, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { UseTourFormReturn } from "@/hooks/use-tour-form";

export function PricingOptionsSection(f: UseTourFormReturn) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{f.t("form.pricing_options")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {f.pricingOptions.map((opt, i) => (
                    <div key={i} className="border rounded-md p-4 space-y-3 relative">
                        <Button type="button" onClick={() => f.removePricingOption(i)} className="absolute top-3 right-3 text-destructive">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                            <div className="space-y-1">
                                <Label className="text-xs">{f.t("form.type")}</Label>
                                <Select value={opt.type} onValueChange={(v) => f.updatePricingOption(i, "type", v)}>
                                    <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="group">Group</SelectItem>
                                        <SelectItem value="private">Private</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs">{f.t("form.price")}</Label>
                                <Input type="number" value={opt.price} onFocus={(e) => e.target.select()} onChange={(e) => f.updatePricingOption(i, "price", e.target.value === "" ? 0 : Number(e.target.value))} />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs">{f.t("form.min_people")}</Label>
                                <Input type="number" value={opt.min_people} onFocus={(e) => e.target.select()} onChange={(e) => f.updatePricingOption(i, "min_people", e.target.value === "" ? 1 : Number(e.target.value))} />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs">{f.t("form.max_people")}</Label>
                                <Input type="number" value={opt.max_people ?? ""} onFocus={(e) => e.target.select()} onChange={(e) => f.updatePricingOption(i, "max_people", e.target.value === "" ? null : Number(e.target.value))} />
                            </div>
                        </div>
                        <Label className="text-xs">{f.t("form.label")}</Label>
                        <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                            <Input placeholder="UZ" value={opt.label.uz} onChange={(e) => f.updatePricingLabel(i, "uz", e.target.value)} />
                            <Input placeholder="RU" value={opt.label.ru} onChange={(e) => f.updatePricingLabel(i, "ru", e.target.value)} />
                            <Input placeholder="EN" value={opt.label.en} onChange={(e) => f.updatePricingLabel(i, "en", e.target.value)} />
                        </div>
                    </div>
                ))}
                <Button type="button" variant="outline" onClick={f.addPricingOption} className="w-full">
                    <Plus className="h-4 w-4 mr-2" /> {f.t("form.add_pricing")}
                </Button>
            </CardContent>
        </Card>
    );
}