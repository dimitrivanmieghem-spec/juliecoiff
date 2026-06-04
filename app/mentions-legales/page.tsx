import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Mentions légales | Julie Coiff",
};

export default function MentionsLegalesPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 md:py-20">
      <Link href="/" className="text-sm text-primary hover:underline mb-8 inline-block">
        ← Retour à l&apos;accueil
      </Link>

      <h1 className="font-serif text-3xl md:text-4xl text-text-main font-semibold mb-10">
        Mentions légales
      </h1>

      <div className="space-y-8 text-sm text-text-main/80 leading-relaxed">
        <section>
          <h2 className="font-serif text-lg font-semibold text-text-main mb-3">
            1. Éditeur du site
          </h2>
          <p>
            <strong className="text-text-main">Julie Coiff</strong><br />
            Activité indépendante — Coiffeuse à domicile<br />
            Adresse : [Votre adresse complète], Seneffe, Belgique<br />
            Numéro d&apos;entreprise (TVA) : BE0000.000.000<br />
            E-mail : info@juliecoiff.be<br />
            Téléphone : +32 000 00 00 00
          </p>
        </section>

        <section>
          <h2 className="font-serif text-lg font-semibold text-text-main mb-3">
            2. Hébergement
          </h2>
          <p>
            Ce site est hébergé par :<br />
            <strong className="text-text-main">Vercel Inc.</strong><br />
            440 N Barranca Ave #4133, Covina, CA 91723, États-Unis<br />
            <a href="https://vercel.com" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
              vercel.com
            </a>
          </p>
        </section>

        <section>
          <h2 className="font-serif text-lg font-semibold text-text-main mb-3">
            3. Propriété intellectuelle
          </h2>
          <p>
            L&apos;ensemble des contenus présents sur ce site (textes, images, logo) sont la
            propriété exclusive de Julie Coiff. Toute reproduction, même partielle, est
            interdite sans autorisation écrite préalable.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-lg font-semibold text-text-main mb-3">
            4. Protection des données (RGPD)
          </h2>
          <p>
            Les données personnelles collectées via le formulaire de réservation (nom,
            e-mail, téléphone, adresse) sont utilisées uniquement dans le cadre de la prise
            de rendez-vous. Elles ne sont pas transmises à des tiers. Conformément au RGPD,
            vous disposez d&apos;un droit d&apos;accès, de rectification et de suppression de vos
            données en contactant : info@juliecoiff.be.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-lg font-semibold text-text-main mb-3">
            5. Cookies
          </h2>
          <p>
            Ce site n&apos;utilise pas de cookies publicitaires ou de traçage tiers. Des cookies
            techniques strictement nécessaires au fonctionnement du site peuvent être déposés.
          </p>
        </section>
      </div>
    </div>
  );
}
