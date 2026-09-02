"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { LocalizedText } from "@/types";

const LANGS: { code: keyof LocalizedText; label: string }[] = [
    { code: "uz", label: "UZ" },
    { code: "ru", label: "RU" },
    { code: "en", label: "EN" },
];

interface LocalizedNameInputProps {
    idPrefix: string;
    label: string;
    value: LocalizedText;
    onChange: (next: LocalizedText) => void;
}

export function LocalizedNameInput({ idPrefix, label, value, onChange }: LocalizedNameInputProps) {
    return (
        <div className="space-y-1.5">
            <Label>{label}</Label>
            <div className="grid grid-cols-3 gap-1.5">
                {LANGS.map(({ code, label: langLabel }) => (
                    <div key={code} className="relative">
                        <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-muted-foreground">
                            {langLabel}
                        </span>
                        <Input
                            id={`${idPrefix}_${code}`}
                            value={value[code] ?? ""}
                            onChange={(e) => onChange({ ...value, [code]: e.target.value })}
                            className="pl-8"
                            required={code === "uz"}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}