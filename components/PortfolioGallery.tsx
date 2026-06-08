import { getPublicPortfolioImages } from "@/app/actions/portfolio";
import PortfolioCarousel from "./PortfolioCarousel";

export default async function PortfolioGallery() {
  let images: string[] = [];
  try {
    images = await getPublicPortfolioImages();
  } catch (err) {
    console.error("PortfolioGallery: erreur chargement images", err);
  }

  if (images.length === 0) return null;

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
        <PortfolioCarousel images={images} />
      </div>
    </section>
  );
}
