"use client";

import { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface LegalDocumentProps {
    title: string;
    content: string;
    ruFallbackNotice?: string;
}

interface Section {
    id: string;
    text: string;
}

function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/['"‘’“”()]/g, "")
        .replace(/[^\p{L}\p{N}]+/gu, "-")
        .replace(/^-+|-+$/g, "");
}

function extractSections(content: string): Section[] {
    const matches = Array.from(content.matchAll(/^###\s+(.+)$/gm));
    const seen = new Map<string, number>();

    return matches.map((match) => {
        const text = match[1].trim();
        const base = slugify(text);
        const count = seen.get(base) ?? 0;
        seen.set(base, count + 1);
        const id = count === 0 ? base : `${base}-${count}`;
        return { id, text };
    });
}

const SCROLL_OFFSET = 96;

export function LegalDocument({ title, content, ruFallbackNotice }: LegalDocumentProps) {
    const sections = useMemo(() => extractSections(content), [content]);
    const [activeId, setActiveId] = useState<string | null>(sections[0]?.id ?? null);

    useEffect(() => {
        if (sections.length === 0) return;

        const headingEls = sections
            .map((section) => document.getElementById(section.id))
            .filter((el): el is HTMLElement => Boolean(el));

        if (headingEls.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries.filter((entry) => entry.isIntersecting);
                if (visible.length === 0) return;

                const topMost = visible.reduce((closest, entry) =>
                    entry.boundingClientRect.top < closest.boundingClientRect.top ? entry : closest
                );
                setActiveId(topMost.target.id);
            },
            { rootMargin: `-${SCROLL_OFFSET}px 0px -65% 0px`, threshold: 0 }
        );

        headingEls.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, [sections]);

    function handleSectionClick(event: React.MouseEvent<HTMLAnchorElement>, id: string) {
        event.preventDefault();
        const el = document.getElementById(id);
        if (!el) return;

        const top = el.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET;
        window.scrollTo({ top, behavior: "smooth" });
        setActiveId(id);
        window.history.replaceState(null, "", `#${id}`);
    }

    return (
        <div className="min-h-screen bg-background pb-20">
            <div className="mx-auto max-w-6xl px-4 pt-10 md:pt-14">
                <h1 className="text-3xl md:text-4xl font-bold text-primary mb-8">{title}</h1>
                {ruFallbackNotice && (
                    <div className="mb-8 rounded-xl border border-accent/30 bg-accent/10 px-5 py-4 text-sm text-foreground/80">
                        {ruFallbackNotice}
                    </div>
                )}

                <div className="flex flex-col md:flex-row gap-10">
                    {sections.length > 0 && (
                        <nav className="order-2 md:order-1 md:w-64 shrink-0" aria-label="Bo'limlar">
                            <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-2">
                                <ul className="space-y-0.5 border-l border-border">
                                    {sections.map((section) => {
                                        const isActive = activeId === section.id;
                                        return (
                                            <li key={section.id}>
                                                <a
                                                    href={`#${section.id}`}
                                                    onClick={(event) => handleSectionClick(event, section.id)}
                                                    className={
                                                        "block -ml-px border-l-2 py-1.5 pl-4 text-sm leading-snug transition-colors " +
                                                        (isActive
                                                            ? "border-accent font-medium text-accent"
                                                            : "border-transparent text-foreground/60 hover:border-border hover:text-foreground")
                                                    }
                                                >
                                                    {section.text}
                                                </a>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </nav>
                    )}

                    <article
                        className="order-1 md:order-2 flex-1 prose prose-neutral max-w-none
                            prose-headings:text-primary prose-headings:font-bold
                            prose-h1:hidden
                            prose-a:text-accent prose-a:no-underline hover:prose-a:underline
                            prose-strong:text-foreground
                            prose-li:marker:text-primary/50"
                    >
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                                h3: ({ children, ...props }) => {
                                    const text = Array.isArray(children)
                                        ? children.join("")
                                        : String(children ?? "");
                                    const id = slugify(text);
                                    return (
                                        <h3 id={id} className="scroll-mt-24" {...props}>
                                            {children}
                                        </h3>
                                    );
                                },
                            }}
                        >
                            {content}
                        </ReactMarkdown>
                    </article>
                </div>
            </div>
        </div>
    );
}
