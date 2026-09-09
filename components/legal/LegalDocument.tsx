import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface LegalDocumentProps {
    title: string;
    content: string;
    ruFallbackNotice?: string;
}

export function LegalDocument({ title, content, ruFallbackNotice }: LegalDocumentProps) {
    return (
        <div className="min-h-screen bg-background pb-20">
            <div className="mx-auto max-w-3xl px-4 pt-32 md:pt-40">
                <h1 className="text-3xl md:text-4xl font-bold text-primary mb-8">{title}</h1>

                {ruFallbackNotice && (
                    <div className="mb-8 rounded-xl border border-accent/30 bg-accent/10 px-5 py-4 text-sm text-foreground/80">
                        {ruFallbackNotice}
                    </div>
                )}

                <article
                    className="prose prose-neutral max-w-none
                        prose-headings:text-primary prose-headings:font-bold
                        prose-h1:hidden
                        prose-a:text-accent prose-a:no-underline hover:prose-a:underline
                        prose-strong:text-foreground
                        prose-li:marker:text-primary/50"
                >
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
                </article>
            </div>
        </div>
    );
}