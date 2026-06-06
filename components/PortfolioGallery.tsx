import Image from "next/image";

const PORTFOLIO_IMAGES = [
  "/IMG_5094.JPEG",
  "/IMG_5100.JPEG",
  "/IMG_5105.JPEG",
  "/IMG_5106.JPEG",
  "/IMG_5125.JPEG",
  "/IMG_5126.JPEG",
];

export default function PortfolioGallery() {
  return (
    <section className="py-16 md:py-24 px-4 bg-white/50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10 md:mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary/60 mb-3">
            Portfolio
          </p>
          <h2 className="font-serif text-3xl md:text-4xl text-text-main font-semibold">
            Quelques-unes de mes réalisations
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PORTFOLIO_IMAGES.map((src, i) => (
            <div
              key={i}
              className="relative aspect-square overflow-hidden rounded-xl shadow-sm group cursor-pointer"
            >
              <Image
                src={src}
                alt="Réalisation"
                fill
                quality={75}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300 rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
