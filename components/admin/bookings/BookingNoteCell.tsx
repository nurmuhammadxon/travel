"use client";

import { MessageSquareText } from "lucide-react";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/ui/popover";

interface BookingNoteCellProps {
    notes?: string | null;
}

export function BookingNoteCell({ notes }: BookingNoteCellProps) {
    if (!notes) {
        return <span className="text-xs text-muted-foreground">—</span>;
    }

    return (
        <Popover>
            <PopoverTrigger>
                <div className="flex items-center gap-1.5 cursor-pointer group">
                    <span className="text-xs text-foreground/80 text-left group-hover:underline line-clamp-2 max-w-60">
                        {notes}
                    </span>
                    <button
                        type="button"
                        aria-label="Izohni ko'rish"
                        className="shrink-0 h-6 w-6 rounded-md border border-border flex items-center justify-center text-muted-foreground group-hover:text-foreground group-hover:border-accent transition-colors"
                    >
                        <MessageSquareText className="h-3.5 w-3.5" />
                    </button>
                </div>
            </PopoverTrigger>

            <PopoverContent className="w-72 text-sm leading-relaxed whitespace-pre-line">
                {notes}
            </PopoverContent>
        </Popover>
    );
}
