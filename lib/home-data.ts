import { getTours, getCountries, getAllReviews, getSiteStats } from "@/lib/api";
import type { Tour, Country, Review, SiteStats } from "@/types";

export interface HomePageData {
    featuredTours: Tour[];
    totalTours: number;
    countries: (Country & { tourCount: number })[];
    reviews: Review[];
    siteStats: SiteStats | null;
}

export async function getHomePageData(lng: string): Promise<HomePageData> {
    let featuredTours: Tour[] = [];
    let totalTours = 0;
    let countries: (Country & { tourCount: number })[] = [];
    let reviews: Review[] = [];
    let siteStats: SiteStats | null = null;

    const [toursRes, countryList, allReviews, statsRes] = await Promise.allSettled([
        getTours({ lang: lng, page_size: 6 }),
        getCountries(),
        getAllReviews(),
        getSiteStats(),
    ]);

    if (toursRes.status === "fulfilled" && toursRes.value) {
        featuredTours = toursRes.value.items || [];
        totalTours = toursRes.value.total || 0;
    } else if (toursRes.status === "rejected") {
        console.error("getTours xatosi:", toursRes.reason);
    }

    if (countryList.status === "fulfilled" && Array.isArray(countryList.value)) {
        try {
            countries = await Promise.all(
                countryList.value.map(async (c) => {
                    try {
                        const res = await getTours({ lang: lng, country: c.slug, page_size: 1 });
                        return { ...c, tourCount: res?.total || 0 };
                    } catch {
                        return { ...c, tourCount: 0 };
                    }
                })
            );
        } catch (err) {
            console.error("Countries map xatosi:", err);
        }
    } else if (countryList.status === "rejected") {
        console.error("getCountries xatosi:", countryList.reason);
    }

    if (allReviews.status === "fulfilled" && Array.isArray(allReviews.value)) {
        reviews = allReviews.value.slice(0, 8);
    } else if (allReviews.status === "rejected") {
        console.error("getAllReviews xatosi:", allReviews.reason);
    }

    if (statsRes.status === "fulfilled" && statsRes.value) {
        siteStats = statsRes.value;
    } else if (statsRes.status === "rejected") {
        console.error("getSiteStats xatosi:", statsRes.reason);
    }

    return { featuredTours, totalTours, countries, reviews, siteStats };
}