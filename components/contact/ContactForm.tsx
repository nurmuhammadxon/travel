"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ContactFormProps {
    labels: {
        name: string;
        email: string;
        message: string;
        submit: string;
    };
}

export function ContactForm({ labels }: ContactFormProps) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const subject = encodeURIComponent(`Sayt orqali xabar — ${name}`);
        const body = encodeURIComponent(`${message}\n\nEmail: ${email}`);
        window.location.href = `mailto:info@sayt.uz?subject=${subject}&body=${body}`;
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
            <Button type="submit" className="w-full rounded-full bg-primary text-white hover:bg-primary/90 gap-2">
                <Send className="h-4 w-4" />
                {labels.submit}
            </Button>
        </form>
    );
}