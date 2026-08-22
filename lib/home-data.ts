import { getTours, getCountries, getAllReviews } from "@/lib/api";
import type { Tour, Country, Review } from "@/types";

export interface HomePageData {
    featuredTours: Tour[];
    totalTours: number;
    countries: (Country & { tourCount: number })[];
    reviews: Review[];
}

export async function getHomePageData(lng: string): Promise<HomePageData> {
    let featuredTours: Tour[] = [];
    let totalTours = 0;
    let countries: (Country & { tourCount: number })[] = [];
    let reviews: Review[] = [];

    try {
        const toursRes = await getTours({ lang: lng, page_size: 6 });
        featuredTours = toursRes.items;
        totalTours = toursRes.total;
    } catch (err) {
        console.error("getTours xatosi:", err);
    }

    try {
        const countryList = await getCountries(lng);
        countries = await Promise.all(
            countryList.map(async (c) => {
                try {
                    const res = await getTours({ lang: lng, country: c.slug, page_size: 1 });
                    return { ...c, tourCount: res.total };
                } catch {
                    return { ...c, tourCount: 0 };
                }
            })
        );
    } catch (err) {
        console.error("getCountries xatosi:", err);
    }

    try {
        reviews = (await getAllReviews()).slice(0, 8);
    } catch (err) {
        console.error("getAllReviews xatosi:", err);
    }

    return { featuredTours, totalTours, countries, reviews };
}