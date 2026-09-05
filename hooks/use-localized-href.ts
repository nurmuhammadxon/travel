"use client";

import { usePathname } from "next/navigation";
import i18nConfig from "@/i18n.config";
import { localizedHref } from "@/lib/utils";

export function useLocalizedHref() {
    const pathname = usePathname();
    const segments = pathname.split("/").filter(Boolean);
    const currentLocale = i18nConfig.supportedLngs.includes(segments[0])
        ? segments[0]
        : i18nConfig.fallbackLng;

    return (href: string) => localizedHref(currentLocale, href, i18nConfig.fallbackLng);
}