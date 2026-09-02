import Link from "next/link";
import { getT } from "next-i18next/server";
import { GirihBorder } from "./GirihBorder";
import { SiteLogo } from "../shared/site-logo";
import { siteConfig } from "@/lib/site-config";

const QUICK_LINKS = [
    { href: "/", key: "nav.home" },
    { href: "/tours", key: "nav.tours" },
    { href: "/about", key: "nav.about" },
    { href: "/contact", key: "nav.contact" },
];

const SOCIAL_ITEMS = [
    { key: "instagram", label: "Instagram", url: siteConfig.social.instagram },
    { key: "facebook", label: "Facebook", url: siteConfig.social.facebook },
    { key: "telegram", label: "Telegram", url: siteConfig.social.telegram },
    { key: "youtube", label: "YouTube", url: siteConfig.social.youtube },
    { key: "tiktok", label: "TikTok", url: siteConfig.social.tiktok },
    { key: "whatsapp", label: "WhatsApp", url: siteConfig.social.whatsapp },
];

export async function Footer({ lng }: { lng: string }) {
    const { t } = await getT("common", { lng });
    const year = new Date().getFullYear();

    const phone = siteConfig.contact.phone;
    const phoneSecondary = siteConfig.contact.phoneSecondary;
    const email = siteConfig.contact.email;
    const address = siteConfig.contact.address;

    const phoneHref = "tel:" + phone.replace(/\s+/g, "");
    const phoneSecondaryHref = "tel:" + phoneSecondary.replace(/\s+/g, "");
    const emailHref = "mailto:" + email;

    const socialLinks = SOCIAL_ITEMS.filter(function (item) {
        return Boolean(item.url);
    });

    return (
        <footer className="bg-primary text-primary-foreground">
            <GirihBorder />

            <div className="mx-auto max-w-7xl px-4 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">

                <div>
                    <SiteLogo textClassName="text-xl font-bold tracking-tight" highlightClassName="text-accent" />
                    <p className="mt-3 text-sm text-primary-foreground/70 leading-relaxed">
                        {t("footer.about")}
                    </p>
                </div>

                <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-accent mb-4">
                        {t("footer.quick_links")}
                    </h3>
                    <ul className="space-y-2">
                        {QUICK_LINKS.map(function (link) {
                            return (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-primary-foreground/80 hover:text-accent transition-colors"
                                    >
                                        {t(link.key)}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-accent mb-4">
                        {t("footer.contact")}
                    </h3>
                    <ul className="space-y-2 text-sm text-primary-foreground/80">

                        {phone ? (
                            <li>
                                <a
                                    href={phoneHref}
                                    className="hover:text-accent transition-colors"
                                >
                                    {phone}
                                </a>
                            </li>
                        ) : null}

                        {phoneSecondary ? (
                            <li>
                                <a
                                    href={phoneSecondaryHref}
                                    className="hover:text-accent transition-colors"
                                >
                                    {phoneSecondary}
                                </a>
                            </li>
                        ) : null}

                        {email ? (
                            <li>
                                <a
                                    href={emailHref}
                                    className="hover:text-accent transition-colors"
                                >
                                    {email}
                                </a>
                            </li>
                        ) : null}

                        {address ? (
                            <li>{address}</li>
                        ) : null}

                    </ul>
                </div>

                <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-accent mb-4">
                        {t("footer.follow")}
                    </h3>
                    <ul className="space-y-2 text-sm text-primary-foreground/80">
                        {socialLinks.map(function (item) {
                            return (
                                <li key={item.key}>
                                    <a
                                        href={item.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:text-accent transition-colors"
                                    >
                                        {item.label}
                                    </a>
                                </li>
                            );
                        })}
                    </ul>
                </div>

            </div>

            <p className="text-sm">
                © {new Date().getFullYear()} {siteConfig.logo.name}
                {siteConfig.logo.nameHighlight}. {t("footer.rights")}
            </p>

        </footer>
    );
}
