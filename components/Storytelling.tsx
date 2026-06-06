import Image from "next/image";
import Link from "next/link";

export default function Storytelling() {
  return (
    <section className="py-16 md:py-24 px-4">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 md:gap-16 items-center">
        <div className="order-2 md:order-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary/60 mb-2">
            Coiffeuse à domicile · Seneffe &amp; environs
          </p>
          <p className="text-xs text-text-main/45 italic mb-5">
            Diplômée par l&apos;école CEFA Manage
          </p>
          <h2 className="font-serif text-3xl md:text-4xl text-text-main font-semibold leading-tight mb-6">
            L&apos;expertise Julie Coiff<br className="hidden md:block" /> à votre domicile
          </h2>
          <p className="text-base text-text-main/70 leading-relaxed mb-4">
            Forte de mon expérience en salon, j&apos;ai décidé de mettre mon savoir-faire
            directement à votre service. Plus besoin de courir, de chercher une place de
            parking ou de patienter&nbsp;: le salon de coiffure vient à vous.
          </p>
          <p className="text-base text-text-main/70 leading-relaxed mb-8">
            Spécialisée dans les techniques de coloration, les balayages sur-mesure et les
            soins profonds, je me déplace avec du matériel professionnel pour vous offrir un
            véritable moment de détente et un résultat impeccable.
          </p>
          <Link
            href="#booking"
            className="inline-block border border-primary text-primary hover:bg-primary hover:text-white text-sm font-medium px-7 py-3.5 rounded-full transition-colors duration-200"
          >
            Voir les tarifs
          </Link>
        </div>

        <div className="order-1 md:order-2 relative h-72 md:h-[420px] rounded-3xl overflow-hidden shadow-lg">
          <Image
            src="/IMG_5863.JPEG"
            alt="Julie, coiffeuse à domicile"
            fill
            priority
            quality={75}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/15 via-transparent to-transparent" />
        </div>
      </div>
    </section>
  );
}
