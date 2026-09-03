"use client";

import { useRef, useState } from "react";
import { useT } from "next-i18next/client";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Review } from "@/types";
import { Button } from "../ui/button";

const AVATAR_COLORS = ["bg-primary", "bg-accent", "bg-secondary"];

interface TestimonialsProps {
  reviews: Review[];
}

export function Testimonials({ reviews }: TestimonialsProps) {
  const { t } = useT("home");
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const isDragging = useRef(false);
  const wasDragged = useRef(false);
  const startX = useRef(0);
  const startScrollLeft = useRef(0);
  const [isMouseDown, setIsMouseDown] = useState(false);

  function scrollToIndex(i: number) {
    const el = scrollerRef.current;
    const card = el?.children[i] as HTMLElement | undefined;
    if (!el || !card) return;
    el.scrollTo({ left: card.offsetLeft - el.offsetLeft, behavior: "smooth" });
  }

  function onScroll() {
    const el = scrollerRef.current;
    if (!el) return;
    const center = el.scrollLeft + el.clientWidth / 2;
    let closest = 0;
    let minDist = Infinity;
    Array.from(el.children).forEach((child, i) => {
      const c = child as HTMLElement;
      const dist = Math.abs(c.offsetLeft + c.clientWidth / 2 - center);
      if (dist < minDist) {
        minDist = dist;
        closest = i;
      }
    });
    setActive(closest);
  }

  function onMouseDown(e: React.MouseEvent) {
    const el = scrollerRef.current;
    if (!el) return;
    isDragging.current = true;
    wasDragged.current = false;
    setIsMouseDown(true);
    startX.current = e.pageX - el.offsetLeft;
    startScrollLeft.current = el.scrollLeft;
  }

  function endDrag() {
    isDragging.current = false;
    setIsMouseDown(false);
    requestAnimationFrame(() => onScroll());
    setTimeout(() => scrollToIndex(active), 50);
  }

  function onMouseMove(e: React.MouseEvent) {
    const el = scrollerRef.current;
    if (!el || !isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = x - startX.current;
    if (Math.abs(walk) > 5) wasDragged.current = true;
    el.scrollLeft = startScrollLeft.current - walk;
  }

  if (reviews.length === 0) return null;

  return (
    <section className="py-10 md:py-8 bg-background">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center mb-12">
          <div className="text-accent text-sm font-semibold uppercase tracking-wide mb-2">
            {t("testimonials.eyebrow")}
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-primary">
            {t("testimonials.title")}
          </h2>
        </div>
      </div>

      <div
        ref={scrollerRef}
        onScroll={onScroll}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={endDrag}
        onMouseLeave={endDrag}
        className={cn(
          "flex gap-5 overflow-x-auto pb-2 px-4 md:px-[max(1rem,calc((100vw-72rem)/2+1rem))] snap-x snap-mandatory scroll-smooth select-none",
          "[-ms-overflow-style:none] scrollbar-width:none [&::-webkit-scrollbar]:hidden",
          isMouseDown ? "cursor-grabbing scroll-auto" : "cursor-grab"
        )}
      >
        {reviews.map((review, i) => (
          <div
            key={review.id}
            onClickCapture={(e) => {
              if (wasDragged.current) e.preventDefault();
            }}
            className="snap-start shrink-0 w-75 md:w-85 rounded-2xl bg-muted/60 p-6 flex flex-col"
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className={cn(
                  "h-11 w-11 rounded-full flex items-center justify-center text-white font-bold shrink-0 pointer-events-none",
                  AVATAR_COLORS[i % AVATAR_COLORS.length]
                )}
              >
                {review.reviewer_name?.charAt(0).toUpperCase() ?? "?"}
              </div>
              <div>
                <div className="font-bold text-primary text-sm leading-tight">
                  {review.reviewer_name}
                </div>
                {review.reviewer_country && (
                  <div className="text-xs text-muted-foreground">{review.reviewer_country}</div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-0.5 mb-3">
              {Array.from({ length: 5 }).map((_, starIndex) => (
                <Star
                  key={starIndex}
                  className={cn(
                    "h-3.5 w-3.5 pointer-events-none",
                    starIndex < review.rating ? "fill-accent text-accent" : "fill-muted text-muted-foreground/30"
                  )}
                />
              ))}
            </div>

            <p className="text-sm text-foreground/80 leading-relaxed line-clamp-4 pointer-events-none">
              {review.text}
            </p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-2 mt-8">
        {reviews.map((_, i) => (
          <Button
            key={i}
            type="button"
            aria-label={`${i + 1}-sharh`}
            onClick={() => scrollToIndex(i)}
            className={cn(
              "rounded-full transition-all duration-300",
              i === active ? "w-6 h-2 bg-accent" : "w-2 h-2 bg-primary/25 hover:bg-primary/40"
            )}
          />
        ))}
      </div>
    </section>
  );
}