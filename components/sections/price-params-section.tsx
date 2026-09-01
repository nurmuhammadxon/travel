import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { UseTourFormReturn } from "@/hooks/use-tour-form";

export function PriceParamsSection(f: UseTourFormReturn) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{f.t("form.price_params")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                    <div className="space-y-2">
                        <Label>{f.t("form.category")}</Label>
                        <Input value={f.category} onChange={(e) => f.setCategory(e.target.value)} placeholder={f.t("form.category_placeholder")} required />
                    </div>
                    <div className="space-y-2">
                        <Label>{f.t("form.duration_days")}</Label>
                        <Input type="number" min={0} value={f.durationDays} onFocus={(e) => e.target.select()} onChange={(e) => f.setDurationDays(e.target.value === "" ? 0 : Number(e.target.value))} />
                    </div>
                    <div className="space-y-2">
                        <Label>{f.t("form.duration_nights")}</Label>
                        <Input type="number" min={0} value={f.durationNights} onFocus={(e) => e.target.select()} onChange={(e) => f.setDurationNights(e.target.value === "" ? 0 : Number(e.target.value))} />
                    </div>
                    <div className="space-y-2">
                        <Label>{f.t("form.max_group_size")}</Label>
                        <Input type="number" min={0} value={f.maxGroupSize} onFocus={(e) => e.target.select()} onChange={(e) => f.setMaxGroupSize(e.target.value === "" ? 0 : Number(e.target.value))} />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label>{f.t("form.price")}</Label>
                        <Input type="number" min={0} step="0.01" value={f.price} onFocus={(e) => e.target.select()} onChange={(e) => f.setPrice(e.target.value === "" ? 0 : Number(e.target.value))} required />
                    </div>
                    <div className="space-y-2">
                        <Label>{f.t("form.currency")}</Label>
                        <Select value={f.currency} onValueChange={(value) => f.setCurrency(value ?? "USD")}>
                            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="USD">USD</SelectItem>
                                <SelectItem value="UZS">UZS</SelectItem>
                                <SelectItem value="EUR">EUR</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3 pt-2">
                    <div className="space-y-2">
                        <Label>{f.t("form.technical_level")}</Label>
                        <Input type="number" min={1} max={5} value={f.technicalLevel} onFocus={(e) => e.target.select()} onChange={(e) => f.setTechnicalLevel(e.target.value === "" ? 1 : Number(e.target.value))} />
                    </div>
                    <div className="space-y-2">
                        <Label>{f.t("form.min_age")}</Label>
                        <Input type="number" min={0} value={f.minAge} onFocus={(e) => e.target.select()} onChange={(e) => f.setMinAge(e.target.value === "" ? 0 : Number(e.target.value))} />
                    </div>
                    <div className="space-y-2">
                        <Label>{f.t("form.fitness_level")}</Label>
                        <Input type="number" min={1} max={5} value={f.fitnessLevel} onFocus={(e) => e.target.select()} onChange={(e) => f.setFitnessLevel(e.target.value === "" ? 1 : Number(e.target.value))} />
                    </div>
                </div>
                
                <div className="flex items-center gap-6 pt-2">
                    <div className="flex items-center gap-2">
                        <Switch checked={f.isFeatured} onCheckedChange={f.setIsFeatured} id="is_featured" />
                        <Label htmlFor="is_featured">{f.t("form.is_featured")}</Label>
                    </div>
                    <div className="flex items-center gap-2">
                        <Switch checked={f.isActive} onCheckedChange={f.setIsActive} id="is_active" />
                        <Label htmlFor="is_active">{f.t("form.is_active")}</Label>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}