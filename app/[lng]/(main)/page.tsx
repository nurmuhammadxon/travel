import { Destinations } from "@/components/sections/Destinations";
import { Hero } from "@/components/sections/Hero";
import { PopularTours } from "@/components/sections/PopularTours";
import { Stats } from "@/components/sections/Stats";
import { Testimonials } from "@/components/sections/Testimonials";

export default function Home() {
  return (
    <>
      <Hero />
      <div className="max-w-7xl mx-auto px-4 py-16">
        <PopularTours />
        <Destinations />
        <Stats />
        <Testimonials />
      </div>
    </>
  );
}