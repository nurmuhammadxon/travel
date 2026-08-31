"use client";

import { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { sendContactMessage } from "@/lib/api";
import { showSuccess, showError } from "@/lib/toast";

interface ContactFormProps {
    source: "contact" | "service";
    labels: {
        name: string;
        email: string;
        message: string;
        submit: string;
        submitting?: string;
        success?: string;
    };
}

export function ContactForm({ source, labels }: ContactFormProps) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await sendContactMessage({ name, email, message, source });
            showSuccess(labels.success ?? "Xabar yuborildi");
            setName("");
            setEmail("");
            setMessage("");
        } catch (err) {
            showError(err instanceof Error ? err.message : "Xatolik yuz berdi");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
                <Label htmlFor="contact-name">{labels.name}</Label>
                <Input id="contact-name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-1.5">
                <Label htmlFor="contact-email">{labels.email}</Label>
                <Input
                    id="contact-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <div className="space-y-1.5">
                <Label htmlFor="contact-message">{labels.message}</Label>
                <Textarea
                    id="contact-message"
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                />
            </div>
            <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-full bg-primary text-white hover:bg-primary/90 gap-2"
            >
                {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <Send className="h-4 w-4" />
                )}
                {isSubmitting ? (labels.submitting ?? "...") : labels.submit}
            </Button>
        </form>
    );
}