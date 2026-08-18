import Link from "next/link";
import { getT } from "next-i18next/server";
import { GirihBorder } from "./GirihBorder";

const QUICK_LINKS = [
    { href: "/", key: "nav.home" },
    { href: "/tours", key: "nav.tours" },
    { href: "/about", key: "nav.about" },
    { href: "/contact", key: "nav.contact" },
];

export async function Footer({ lng }: { lng: string }) {
    const { t } = await getT("common", { lng });

    return (
        <footer className="bg-primary text-primary-foreground">
            <GirihBorder />
            <div className="mx-auto max-w-7xl px-4 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
                <div>
                    <span className="text-xl font-bold tracking-tight">
                        Sayohat<span className="text-accent">Yoli</span>
                    </span>
                    <p className="mt-3 text-sm text-primary-foreground/70 leading-relaxed">
                        {t("footer.about")}
                    </p>
                </div>

                <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-accent mb-4">
                        {t("footer.quick_links")}
                    </h3>
                    <ul className="space-y-2">
                        {QUICK_LINKS.map((link) => (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    className="text-sm text-primary-foreground/80 hover:text-accent transition-colors"
                                >
                                    {t(link.key)}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-accent mb-4">
                        {t("footer.contact")}
                    </h3>
                    <ul className="space-y-2 text-sm text-primary-foreground/80">
                        <li>
                            <a href="tel:+998901234567" className="hover:text-accent transition-colors">
                                +998 90 123 45 67
                            </a>
                        </li>
                        <li>
                            <a href="mailto:info@sayt.uz" className="hover:text-accent transition-colors">
                                info@sayt.uz
                            </a>
                        </li>
                        <li>{t("footer.address")}</li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-accent mb-4">
                        {t("footer.follow")}
                    </h3>
                    <ul className="space-y-2 text-sm text-primary-foreground/80">
                        <li><a href="#" className="hover:text-accent transition-colors">Facebook</a></li>
                        <li><a href="#" className="hover:text-accent transition-colors">Instagram</a></li>
                        <li><a href="#" className="hover:text-accent transition-colors">Telegram</a></li>
                    </ul>
                </div>
            </div>

            <div className="border-t border-primary-foreground/10">
                <div className="mx-auto max-w-7xl px-4 py-4 text-xs text-primary-foreground/60 text-center">
                    © {new Date().getFullYear()} SayohatYoli. {t("footer.rights")}
                </div>
            </div>
        </footer>
    );
}