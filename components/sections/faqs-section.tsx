import { Trash2, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { UseTourFormReturn } from "@/hooks/use-tour-form";

export function FaqsSection(f: UseTourFormReturn) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{f.t("form.faqs")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {f.faqs.map((faq, i) => (
                    <div key={i} className="border rounded-md p-4 space-y-3 relative">
                        <Button type="button" onClick={() => f.removeFaq(i)} className="absolute top-3 right-3 text-destructive">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                        <Label className="text-xs">{f.t("form.question")}</Label>
                        <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                            <Input placeholder="UZ" value={faq.question.uz} onChange={(e) => f.updateFaq(i, "question", "uz", e.target.value)} />
                            <Input placeholder="RU" value={faq.question.ru} onChange={(e) => f.updateFaq(i, "question", "ru", e.target.value)} />
                            <Input placeholder="EN" value={faq.question.en} onChange={(e) => f.updateFaq(i, "question", "en", e.target.value)} />
                        </div>
                        <Label className="text-xs">{f.t("form.answer")}</Label>
                        <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                            <Textarea placeholder="UZ" rows={2} value={faq.answer.uz} onChange={(e) => f.updateFaq(i, "answer", "uz", e.target.value)} />
                            <Textarea placeholder="RU" rows={2} value={faq.answer.ru} onChange={(e) => f.updateFaq(i, "answer", "ru", e.target.value)} />
                            <Textarea placeholder="EN" rows={2} value={faq.answer.en} onChange={(e) => f.updateFaq(i, "answer", "en", e.target.value)} />
                        </div>
                    </div>
                ))}
                <Button type="button" variant="outline" onClick={f.addFaq} className="w-full">
                    <Plus className="h-4 w-4 mr-2" /> {f.t("form.add_faq")}
                </Button>
            </CardContent>
        </Card>
    );
}