import type { Metadata } from "next";
import Calculator from "@/components/Calculator";
import Storytelling from "@/components/Storytelling";
import PortfolioGallery from "@/components/PortfolioGallery";
import GoogleReviews from "@/components/GoogleReviews";
import FAQ from "@/components/FAQ";

export const metadata: Metadata = {
  title: "Coiffeur Seneffe & environs | Julie Coiff - Coiffure Premium à Domicile",
  description:
    "Julie Coiff, coiffeuse expert à Seneffe. Balayages, colorations et coiffure mariage à domicile. Profitez de l'expertise d'un salon chez vous.",
  openGraph: {
    title: "Coiffeur Seneffe & environs | Julie Coiff - Coiffure Premium à Domicile",
    description:
      "Découvrez l'expertise coiffure de Julie Coiff, directement chez vous. Balayages, colorations et soins haut de gamme à Seneffe, Manage, Nivelles et environs.",
    url: "https://www.juliecoiff.be",
    siteName: "Julie Coiff",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Julie Coiff - Coiffure à domicile",
      },
    ],
  },
};

export default function HomePage() {
  return (
    <div className="flex flex-col">

      {/* Hero */}
      <section className="text-center py-16 md:py-20 px-4 border-b border-primary/8">
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-text-main leading-tight max-w-3xl mx-auto">
          Coiffeur à Seneffe &amp; environs&nbsp;:{" "}
          <span className="text-primary">Votre salon de coiffure premium à domicile.</span>
        </h1>
        <p className="mt-5 text-base md:text-lg text-text-main/70 max-w-xl mx-auto leading-relaxed">
          L&apos;expertise et le confort d&apos;un salon professionnel, directement dans votre salon.
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
              Réservez votre expérience coiffure à Seneffe, Manage &amp; Nivelles
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

      {/* FAQ */}
      <FAQ />

      {/* Final CTA */}
      <section className="py-20 md:py-28 px-4 bg-gradient-to-br from-primary/15 via-[#f5e0d5] to-primary/8 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary/60 mb-4">
          Disponible 6j/7 · Seneffe, Manage, Nivelles &amp; environs
        </p>
        <h2 className="font-serif text-3xl md:text-5xl text-text-main font-semibold leading-tight max-w-xl mx-auto mb-6">
          Balayages et colorations à Seneffe — L&apos;expertise salon chez vous
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

      {/* Bloc SEO local */}
      <section className="px-4 py-10 bg-white/30 border-t border-primary/8">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif text-xl text-text-main font-semibold mb-4">
            Un coiffeur expert à Manage, Nivelles, La Louvière et Seneffe
          </h2>
          <p className="text-sm text-text-main/60 leading-relaxed">
            Vous cherchez un coiffeur à Seneffe, Manage, Nivelles ou La Louvière&nbsp;?
            Julie Coiff vous propose une expérience de salon haut de gamme, directement chez vous.
            Profitez d&apos;un diagnostic personnalisé, de colorations professionnelles et de balayages
            tendance sans le stress et l&apos;attente d&apos;un salon traditionnel.
            Diplômée et passionnée, Julie intervient également à Feluy, Familleureux, Arquennes,
            Pont-à-Celles et Ecaussinnes avec tout le matériel professionnel nécessaire.
          </p>
        </div>
      </section>

    </div>
  );
}
