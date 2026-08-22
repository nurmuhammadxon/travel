import { Hero } from "@/components/sections/Hero";
import { PopularTours } from "@/components/sections/PopularTours";
import { Destinations } from "@/components/sections/Destinations";
import { Stats } from "@/components/sections/Stats";
import { Testimonials } from "@/components/sections/Testimonials";
import { getHomePageData } from "@/lib/home-data";

interface Props {
  params: Promise<{ lng: string }>;
}

export default async function Home({ params }: Props) {
  const { lng } = await params;
  const { featuredTours, totalTours, countries, reviews } = await getHomePageData(lng);

  return (
    <>
      <Hero />
      <div className="max-w-7xl mx-auto px-4 py-16">
        {featuredTours.length > 0 && <PopularTours tours={featuredTours} />}
        <Stats totalTours={totalTours} reviews={reviews} />
        {countries.length > 0 && <Destinations countries={countries} />}
        {reviews.length > 0 && <Testimonials reviews={reviews} />}      </div>
    </>
  );
}