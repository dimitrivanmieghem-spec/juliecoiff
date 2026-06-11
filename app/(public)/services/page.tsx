import type { Metadata } from "next";
import Link from "next/link";
import { BASE_SERVICES, ADDONS } from "@/lib/data";

export const metadata: Metadata = {
  title: "Prestations coiffure à domicile à Seneffe & Manage | Julie Coiff",
  description:
    "Balayages, colorations, coupes et coiffures mariage à domicile à Seneffe, Manage, Nivelles et La Louvière. Tarifs transparents, matériel professionnel.",
  openGraph: {
    title: "Prestations coiffure à domicile à Seneffe & Manage | Julie Coiff",
    description:
      "Découvrez tous les services de Julie Coiff : balayages sur mesure, colorations, soins et coiffures événementielles à domicile dans la région de Seneffe.",
    url: "https://www.juliecoiff.be/services",
    siteName: "Julie Coiff",
    type: "website",
  },
};

const categories = [
  {
    id: "colorations",
    heading: "Balayage et colorations sur mesure à Seneffe",
    description:
      "Balayage californien, mèches, coloration permanente ou ton sur ton — Julie réalise vos techniques couleur avec des produits professionnels directement chez vous.",
    services: ADDONS.filter((s) =>
      ["Coloration", "Mèches", "Balayage", "Coulage"].includes(s.name)
    ),
  },
  {
    id: "coupes",
    heading: "Coupes & soins à domicile",
    description:
      "Shampoing, coupe, brushing et soins profonds réparateurs pour femme, homme et enfant — disponible à Manage, Nivelles, Ecaussinnes et environs.",
    services: BASE_SERVICES,
  },
  {
    id: "mariage",
    heading: "Coiffure mariage et soins à Manage",
    description:
      "Chignons, permanentes et coiffures événementielles réalisés chez vous ou sur votre lieu de réception. Julie se déplace avec tout son matériel pour votre grand jour.",
    services: ADDONS.filter((s) =>
      ["Permanente (Cheveux courts)", "Permanente (Cheveux longs)", "Soin profond réparateur", "Supplément Fixant"].includes(s.name)
    ),
  },
];

export default function ServicesPage() {
  return (
    <div className="flex flex-col">
      <section className="text-center py-16 md:py-20 px-4 border-b border-primary/8">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary/60 mb-3">
          Prestations
        </p>
        <h1 className="font-serif text-4xl md:text-5xl text-text-main font-semibold leading-tight max-w-3xl mx-auto">
          Coiffure à domicile à&nbsp;Seneffe, Manage&nbsp;&amp;&nbsp;Nivelles
        </h1>
        <p className="mt-5 text-base md:text-lg text-text-main/70 max-w-xl mx-auto leading-relaxed">
          Tous les services d&apos;un salon professionnel, directement chez vous. Tarifs fixes, matériel haut de gamme, résultats garantis.
        </p>
        <div className="mt-8">
          <Link
            href="/#booking"
            className="inline-block bg-primary hover:bg-primary-light text-white font-medium text-sm px-7 py-3.5 rounded-full transition-colors duration-200"
          >
            Réserver en ligne
          </Link>
        </div>
      </section>

      {categories.map((cat) => (
        <section key={cat.id} id={cat.id} className="py-14 md:py-18 px-4 border-b border-primary/8 even:bg-white/40">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-serif text-2xl md:text-3xl text-text-main font-semibold leading-tight mb-3">
              {cat.heading}
            </h2>
            <p className="text-sm text-text-main/60 leading-relaxed mb-8 max-w-2xl">
              {cat.description}
            </p>
            <div className="divide-y divide-primary/8 border border-primary/10 rounded-2xl overflow-hidden bg-white/60">
              {cat.services.map((s) => (
                <div key={s.id} className="flex items-center justify-between px-5 py-4">
                  <span className="text-sm text-text-main">{s.name}</span>
                  <span className="text-sm font-semibold text-primary whitespace-nowrap ml-4">
                    {s.price}&nbsp;€
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      <section className="py-16 md:py-20 px-4 text-center bg-gradient-to-br from-primary/10 via-[#f5e0d5] to-primary/8">
        <h2 className="font-serif text-3xl md:text-4xl text-text-main font-semibold leading-tight max-w-xl mx-auto mb-5">
          Réservez votre prestation à Seneffe, Manage ou Nivelles
        </h2>
        <p className="text-base text-text-main/70 max-w-md mx-auto leading-relaxed mb-8">
          Choisissez vos prestations en ligne, sélectionnez votre créneau et Julie se déplace chez vous avec tout son matériel.
        </p>
        <Link
          href="/#booking"
          className="inline-block bg-primary hover:bg-primary-light text-white font-semibold text-base px-10 py-4 rounded-full shadow-md hover:shadow-lg transition-all duration-200"
        >
          Réserver mon rendez-vous
        </Link>
      </section>

      <section className="px-4 py-10 bg-white/30 border-t border-primary/8">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif text-xl text-text-main font-semibold mb-4">
            Balayages et colorations à domicile — Seneffe, Manage, Nivelles, La Louvière
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
