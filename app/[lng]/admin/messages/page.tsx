"use client";

import { useEffect, useState } from "react";
import { Mail, MailOpen } from "lucide-react";
import { useT } from "next-i18next/client";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/_components/loading";
import { getContactMessages, markMessageRead } from "@/lib/api";
import { showError, showSuccess } from "@/lib/toast";
import type { ContactMessage } from "@/lib/api";

export default function AdminMessagesPage() {
    const { t } = useT("admin");

    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [markingId, setMarkingId] = useState<string | null>(null);
    const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

    async function load() {
        setIsLoading(true);
        setLoadError(null);
        try {
            const data = await getContactMessages();
            const sorted = [...data].sort(
                (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            );
            setMessages(sorted);
        } catch (err) {
            setLoadError(err instanceof Error ? err.message : t("messages.load_error"));
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, []);

    async function handleMarkRead(id: string) {
        setMarkingId(id);
        try {
            await markMessageRead(id);
            setMessages((prev) =>
                prev.map((m) => (m.id === id ? { ...m, is_read: true } : m))
            );
        } catch (err) {
            showError(err instanceof Error ? err.message : t("messages.mark_read_error"));
        } finally {
            setMarkingId(null);
        }
    }

    function handleRowClick(msg: ContactMessage) {
        setSelectedMessage(msg);
        if (!msg.is_read) {
            handleMarkRead(msg.id);
        }
    }

    const unreadCount = messages.filter((m) => !m.is_read).length;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">{t("messages.title")}</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    {t("messages.total", { count: messages.length })}
                    {unreadCount > 0 && (
                        <span className="ml-2 text-primary font-medium">
                            · {t("messages.unread_count", { count: unreadCount })}
                        </span>
                    )}
                </p>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-16">
                    <Loading className="h-8 w-8 text-muted-foreground" />
                </div>
            ) : loadError ? (
                <p className="text-destructive text-sm">{loadError}</p>
            ) : (
                <div className="rounded-xl border border-border overflow-x-auto bg-card">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-8"></TableHead>
                                <TableHead>{t("messages.col_name")}</TableHead>
                                <TableHead>{t("messages.col_email")}</TableHead>
                                <TableHead>{t("messages.col_source")}</TableHead>
                                <TableHead>{t("messages.col_message")}</TableHead>
                                <TableHead>{t("messages.col_date")}</TableHead>
                                <TableHead className="text-right">{t("messages.col_status")}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {messages.map((msg) => (
                                <TableRow
                                    key={msg.id}
                                    onClick={() => handleRowClick(msg)}
                                    className={`cursor-pointer hover:bg-muted/50 ${!msg.is_read ? "bg-primary/5 font-medium" : ""}`}
                                >
                                    <TableCell>
                                        {msg.is_read ? (
                                            <MailOpen className="h-4 w-4 text-muted-foreground" />
                                        ) : (
                                            <Mail className="h-4 w-4 text-primary" />
                                        )}
                                    </TableCell>
                                    <TableCell>{msg.name}</TableCell>
                                    <TableCell className="text-muted-foreground">{msg.email}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">
                                            {msg.source === "contact"
                                                ? t("messages.source_contact")
                                                : msg.source === "service"
                                                    ? t("messages.source_service")
                                                    : msg.source}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="max-w-80 truncate text-muted-foreground font-normal">
                                        {msg.message}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground font-normal whitespace-nowrap">
                                        {new Date(msg.created_at).toLocaleDateString("uz-UZ", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {msg.is_read ? (
                                                <Badge variant="secondary">{t("messages.status_read")}</Badge>
                                            ) : (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    disabled={markingId === msg.id}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleMarkRead(msg.id);
                                                    }}
                                                >
                                                    {markingId === msg.id ? "..." : t("messages.mark_read")}
                                                </Button>
                                            )}
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRowClick(msg);
                                                }}
                                            >
                                                {t("messages.view")}
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {messages.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                                        {t("messages.not_found")}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            )}

            <Dialog open={!!selectedMessage} onOpenChange={(open) => !open && setSelectedMessage(null)}>
                <DialogContent className="sm:max-w-lg max-h-[85vh] flex flex-col">
                    {selectedMessage && (
                        <>
                            <DialogHeader>
                                <DialogTitle>{t("messages.title")}</DialogTitle>
                            </DialogHeader>

                            <div className="space-y-4 overflow-y-auto pr-1">
                                <div className="flex items-center justify-between">
                                    <Badge variant="outline">
                                        {selectedMessage.source === "contact"
                                            ? t("messages.source_contact")
                                            : selectedMessage.source === "service"
                                                ? t("messages.source_service")
                                                : selectedMessage.source}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">
                                        {new Date(selectedMessage.created_at).toLocaleDateString("uz-UZ", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 gap-3 rounded-lg border border-border p-4">
                                    <div>
                                        <p className="text-xs font-medium text-muted-foreground">
                                            {t("messages.col_name")}
                                        </p>
                                        <p className="text-sm font-semibold text-foreground">
                                            {selectedMessage.name}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-muted-foreground">
                                            {t("messages.col_email")}
                                        </p>
                                        <p className="text-sm text-foreground">{selectedMessage.email}</p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs font-medium text-muted-foreground mb-1.5">
                                        {t("messages.col_message")}
                                    </p>
                                    <div className="rounded-lg bg-muted p-4 text-sm text-foreground whitespace-pre-line leading-relaxed">
                                        {selectedMessage.message}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}