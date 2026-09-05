import type { MetadataRoute } from "next";
import { getTours } from "@/lib/api";

const BASE_URL = "https://discover-stans.uz";
const STATIC_PATHS = ["", "/tours", "/about", "/services", "/contact"];
const LOCALES = ["uz", "ru", "en"];

function localizedUrl(path: string, lng: string) {
    const prefix = lng === "uz" ? "" : `/${lng}`;
    return `${BASE_URL}${prefix}${path}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const entries: MetadataRoute.Sitemap = [];

    for (const lng of LOCALES) {
        for (const path of STATIC_PATHS) {
            entries.push({
                url: localizedUrl(path, lng),
                lastModified: new Date(),
                changeFrequency: path === "" ? "weekly" : "monthly",
                priority: path === "" ? 1 : 0.7,
            });
        }
    }

    try {
        const { items } = await getTours({ page_size: 1000 });
        for (const lng of LOCALES) {
            for (const tour of items) {
                entries.push({
                    url: localizedUrl(`/tours/${tour.slug}`, lng),
                    lastModified: new Date(),
                    changeFrequency: "weekly",
                    priority: 0.8,
                });
            }
        }
    } catch {
    }

    return entries;
}