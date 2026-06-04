import Calculator from "@/components/Calculator";
import Storytelling from "@/components/Storytelling";
import PortfolioGallery from "@/components/PortfolioGallery";
import GoogleReviews from "@/components/GoogleReviews";

export default function HomePage() {
  return (
    <div className="flex flex-col">

      {/* Hero */}
      <section className="text-center py-16 md:py-20 px-4 border-b border-primary/8">
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-text-main leading-tight max-w-3xl mx-auto">
          L&apos;expertise d&apos;un salon,{" "}
          <span className="text-primary">le confort de votre maison.</span>
        </h1>
        <p className="mt-5 text-base md:text-lg text-text-main/70 max-w-xl mx-auto leading-relaxed">
          Coiffeuse à domicile à Seneffe et ses environs. Colorations, coupes, balayages —
          le salon vient à vous.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#booking"
            className="w-full sm:w-auto bg-primary hover:bg-primary-light text-white font-medium text-sm px-7 py-3.5 rounded-full transition-colors duration-200"
          >
            Prendre rendez-vous
          </a>
          <a
            href="#portfolio"
            className="w-full sm:w-auto border border-primary/30 text-primary hover:bg-primary/5 font-medium text-sm px-7 py-3.5 rounded-full transition-colors duration-200"
          >
            Voir les réalisations
          </a>
        </div>
      </section>

      {/* Storytelling */}
      <Storytelling />

      {/* Booking / Calculator */}
      <section id="booking" className="py-16 md:py-20 px-4 bg-white/40 border-y border-primary/8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10 md:mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary/60 mb-3">
              Réservation en ligne
            </p>
            <h2 className="font-serif text-3xl md:text-4xl text-text-main font-semibold leading-tight">
              Estimez et réservez en quelques clics
            </h2>
            <p className="mt-3 text-base text-text-main/70 max-w-xl leading-relaxed">
              Sélectionnez vos prestations, entrez votre ville et choisissez un créneau
              disponible. Le déplacement est{" "}
              <strong className="text-primary font-medium">offert jusqu&apos;à 8 km</strong>.
            </p>
          </div>
          <Calculator />
        </div>
      </section>

      {/* Portfolio */}
      <div id="portfolio">
        <PortfolioGallery />
      </div>

      {/* Google Reviews */}
      <div id="avis">
        <GoogleReviews />
      </div>

      {/* Final CTA */}
      <section className="py-20 md:py-28 px-4 bg-gradient-to-br from-primary/15 via-[#f5e0d5] to-primary/8 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary/60 mb-4">
          Disponible 6j/7 · Seneffe &amp; environs
        </p>
        <h2 className="font-serif text-3xl md:text-5xl text-text-main font-semibold leading-tight max-w-xl mx-auto mb-6">
          Envie d&apos;un moment de détente ?
        </h2>
        <p className="text-base text-text-main/70 max-w-md mx-auto leading-relaxed mb-10">
          Réservez votre créneau en ligne en moins de 2 minutes. Sans déplacement,
          sans attente — juste vous et votre coiffeuse.
        </p>
        <a
          href="#booking"
          className="inline-block bg-primary hover:bg-primary-light text-white font-semibold text-base px-10 py-4 rounded-full shadow-md hover:shadow-lg transition-all duration-200"
        >
          Réserver mon rendez-vous
        </a>
      </section>

    </div>
  );
}
