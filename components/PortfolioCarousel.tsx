"use client";

import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";

export default function PortfolioCarousel({ images }: { images: string[] }) {
  const [emblaRef] = useEmblaCarousel({ loop: true, align: "start", dragFree: true });

  return (
    <div className="overflow-hidden" ref={emblaRef}>
      <div className="flex" style={{ marginLeft: "-1rem" }}>
        {images.map((url, i) => (
          <div
            key={i}
            className="flex-none pl-4 min-w-[80%] sm:min-w-[50%] lg:min-w-[33.333%]"
          >
            <div className="relative aspect-square overflow-hidden rounded-xl shadow-sm group">
              <Image
                src={url}
                alt="Réalisation"
                fill
                quality={75}
                sizes="(max-width: 640px) 80vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
