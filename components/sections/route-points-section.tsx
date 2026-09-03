import { Trash2, Plus, ArrowUp, ArrowDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { UseTourFormReturn } from "@/hooks/use-tour-form";

export function RoutePointsSection(f: UseTourFormReturn) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{f.t("form.route_points")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {f.routePoints.map((point, i) => (
                    <div key={i} className="border rounded-md p-4 space-y-3 relative">
                        <div className="absolute top-3 right-3 flex items-center gap-1">
                            <Button
                                type="button"
                                disabled={i === 0}
                                onClick={() => f.moveRoutePoint(i, -1)}
                                className="text-muted-foreground disabled:opacity-30"
                            >
                                <ArrowUp className="h-4 w-4" />
                            </Button>
                            <Button
                                type="button"
                                disabled={i === f.routePoints.length - 1}
                                onClick={() => f.moveRoutePoint(i, 1)}
                                className="text-muted-foreground disabled:opacity-30"
                            >
                                <ArrowDown className="h-4 w-4" />
                            </Button>
                            <Button type="button" onClick={() => f.removeRoutePoint(i)} className="text-destructive ml-1">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 gap-3 md:grid-cols-4 pr-20">
                            <div className="space-y-1">
                                <Label className="text-xs">#{point.order}</Label>
                                <Select
                                    value={point.type}
                                    onValueChange={(v) => f.updateRoutePoint(i, "type", v)}
                                >
                                    <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="start">Start</SelectItem>
                                        <SelectItem value="stop">Stop</SelectItem>
                                        <SelectItem value="end">End</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {point.type === "stop" && (
                                <>
                                    <div className="space-y-1">
                                        <Label className="text-xs">{f.t("form.activity_type")}</Label>
                                        <Select
                                            value={point.activity_type || undefined}
                                            onValueChange={(v) => f.updateRoutePoint(i, "activity_type", v)}
                                        >
                                            <SelectTrigger className="w-full"><SelectValue placeholder="-" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="photo_stop">Photo stop</SelectItem>
                                                <SelectItem value="guided_tour">Guided tour</SelectItem>
                                                <SelectItem value="shopping">Shopping</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs">{f.t("form.duration_minutes")}</Label>
                                        <Input
                                            type="number"
                                            value={point.duration_minutes ?? ""}
                                            onFocus={(e) => e.target.select()}
                                            onChange={(e) =>
                                                f.updateRoutePoint(i, "duration_minutes", e.target.value === "" ? null : Number(e.target.value))
                                            }
                                        />
                                    </div>
                                    <div className="flex items-end gap-2 pb-1">
                                        <Switch
                                            checked={point.has_extra_fee}
                                            onCheckedChange={(v) => f.updateRoutePoint(i, "has_extra_fee", v)}
                                            id={`extra-fee-${i}`}
                                        />
                                        <Label htmlFor={`extra-fee-${i}`} className="text-xs">{f.t("form.has_extra_fee")}</Label>
                                    </div>
                                </>
                            )}
                        </div>

                        <Label className="text-xs">{f.t("form.name")}</Label>
                        <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                            <Input placeholder="UZ" value={point.name.uz} onChange={(e) => f.updateRoutePointText(i, "name", "uz", e.target.value)} />
                            <Input placeholder="RU" value={point.name.ru} onChange={(e) => f.updateRoutePointText(i, "name", "ru", e.target.value)} />
                            <Input placeholder="EN" value={point.name.en} onChange={(e) => f.updateRoutePointText(i, "name", "en", e.target.value)} />
                        </div>

                        {point.type !== "stop" && (
                            <>
                                <Label className="text-xs">{f.t("form.address")}</Label>
                                <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                                    <Input placeholder="UZ" value={point.address.uz} onChange={(e) => f.updateRoutePointText(i, "address", "uz", e.target.value)} />
                                    <Input placeholder="RU" value={point.address.ru} onChange={(e) => f.updateRoutePointText(i, "address", "ru", e.target.value)} />
                                    <Input placeholder="EN" value={point.address.en} onChange={(e) => f.updateRoutePointText(i, "address", "en", e.target.value)} />
                                </div>
                            </>
                        )}

                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                            <div className="space-y-1">
                                <Label className="text-xs">{f.t("form.latitude")}</Label>
                                <Input
                                    type="number"
                                    step="any"
                                    value={point.latitude ?? ""}
                                    onFocus={(e) => e.target.select()}
                                    onChange={(e) => f.updateRoutePoint(i, "latitude", e.target.value === "" ? null : Number(e.target.value))}
                                />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs">{f.t("form.longitude")}</Label>
                                <Input
                                    type="number"
                                    step="any"
                                    value={point.longitude ?? ""}
                                    onFocus={(e) => e.target.select()}
                                    onChange={(e) => f.updateRoutePoint(i, "longitude", e.target.value === "" ? null : Number(e.target.value))}
                                />
                            </div>
                        </div>
                    </div>
                ))}

                <div className="flex gap-2">
                    <Button type="button" variant="outline" onClick={() => f.addRoutePoint("stop")} className="w-full">
                        <Plus className="h-4 w-4 mr-2" /> {f.t("form.add_route_point")}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}