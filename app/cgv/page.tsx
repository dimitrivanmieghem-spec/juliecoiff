import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Conditions Générales de Vente | Julie Coiff",
};

export default function CgvPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 md:py-20">
      <Link href="/" className="text-sm text-primary hover:underline mb-8 inline-block">
        ← Retour à l&apos;accueil
      </Link>

      <h1 className="font-serif text-3xl md:text-4xl text-text-main font-semibold mb-10">
        Conditions Générales de Vente
      </h1>

      <div className="space-y-8 text-sm text-text-main/80 leading-relaxed">
        <section>
          <h2 className="font-serif text-lg font-semibold text-text-main mb-3">
            1. Prestations
          </h2>
          <p>
            Julie Coiff propose des services de coiffure à domicile (coupe, coloration,
            brushing, soins, etc.) dans le respect des règles sanitaires en vigueur.
            Les tarifs affichés sur le site sont indicatifs et peuvent être adaptés selon
            la longueur des cheveux et les spécificités de la prestation.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-lg font-semibold text-text-main mb-3">
            2. Réservation
          </h2>
          <p>
            Toute réservation effectuée via le site est soumise à confirmation par Julie
            Coiff par e-mail ou téléphone. La réservation ne devient définitive qu&apos;après
            cette confirmation explicite.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-lg font-semibold text-text-main mb-3">
            3. Annulation
          </h2>
          <p>
            Toute annulation doit être signalée au minimum <strong className="text-text-main">24 heures avant</strong> le
            rendez-vous. En cas d&apos;annulation tardive ou de non-présentation, une indemnité
            forfaitaire pourra être demandée.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-lg font-semibold text-text-main mb-3">
            4. Frais de déplacement
          </h2>
          <p>
            Les frais de déplacement sont calculés selon la zone géographique (voir
            calculateur de devis). Ils sont offerts dans un rayon de 8 km autour de Seneffe
            et à partir de 80€ de prestation dans la Zone 2 (8–15 km).
          </p>
        </section>

        <section>
          <h2 className="font-serif text-lg font-semibold text-text-main mb-3">
            5. Paiement
          </h2>
          <p>
            Le paiement s&apos;effectue le jour de la prestation, en espèces ou par virement
            bancaire. Aucun acompte n&apos;est requis à la réservation.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-lg font-semibold text-text-main mb-3">
            6. Responsabilité
          </h2>
          <p>
            Julie Coiff ne peut être tenu responsable des dommages résultant d&apos;informations
            erronées fournies par le client lors de la réservation (allergies non déclarées,
            traitements capillaires non mentionnés, etc.).
          </p>
        </section>

        <section>
          <h2 className="font-serif text-lg font-semibold text-text-main mb-3">
            7. Droit applicable
          </h2>
          <p>
            Les présentes CGV sont soumises au droit belge. Tout litige sera soumis aux
            tribunaux compétents de l&apos;arrondissement judiciaire de Charleroi.
          </p>
        </section>
      </div>
    </div>
  );
}
