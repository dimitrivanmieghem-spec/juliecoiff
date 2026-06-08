"use client";

import useEmblaCarousel from "embla-carousel-react";
import { Star } from "lucide-react";
import { reviews } from "@/lib/data";

function Stars({ count = 5 }: { count?: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${count} étoiles sur 5`}>
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
      ))}
    </div>
  );
}

export default function GoogleReviews() {
  const [emblaRef] = useEmblaCarousel({ loop: true, align: "start", dragFree: true });

  return (
    <section className="py-16 md:py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10 md:mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary/60 mb-3">
            Avis Google vérifiés
          </p>
          <h2 className="font-serif text-3xl md:text-4xl text-text-main font-semibold mb-6">
            Ce que disent mes clientes
          </h2>

          <div className="inline-flex flex-col items-center gap-2">
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={22} className="fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-sm text-text-main/60 font-medium">
              <span className="text-text-main font-semibold">5,0</span> / 5 — Basé sur plus de 10 avis Google
            </p>
          </div>
        </div>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex" style={{ marginLeft: "-1rem" }}>
            {reviews.map((review) => (
              <div
                key={review.id}
                className="flex-none pl-4 min-w-full md:min-w-[50%] lg:min-w-[33.33%]"
              >
                <div className="bg-white/80 border border-primary/10 rounded-2xl p-6 shadow-sm flex flex-col h-full">
                  <Stars count={review.rating} />
                  <p className="text-sm text-text-main/80 leading-relaxed flex-1 italic mt-3">
                    &ldquo;{review.text}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 mt-5 pt-4 border-t border-primary/8">
                    <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                      <span className="text-sm font-semibold text-primary" aria-hidden="true">
                        {review.name[0].toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-text-main">{review.name}</p>
                      <p className="text-xs text-text-main/40">Avis Google</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-xs text-text-main/40 mt-8">
          Avis recueillis directement sur Google Business Profile.
        </p>
      </div>
    </section>
  );
}
