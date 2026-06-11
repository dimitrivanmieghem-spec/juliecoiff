import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";

function WAIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className ?? "w-6 h-6"} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

const COMMUNES = [
  "Seneffe", "Manage", "Nivelles", "Feluy",
  "Familleureux", "Arquennes", "Pont-à-Celles", "Ecaussinnes",
];

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-14 md:py-20">

      <Link href="/" className="text-sm text-primary hover:underline mb-10 inline-block">
        ← Retour à l&apos;accueil
      </Link>

      <h1 className="font-serif text-3xl md:text-4xl text-text-main font-semibold mb-3">
        Contactez Julie
      </h1>
      <p className="text-base text-text-main/60 mb-10 leading-relaxed max-w-md">
        Une question sur une prestation&nbsp;? Besoin d&apos;un conseil avant de réserver&nbsp;? Je suis à votre écoute.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">

        {/* Appel direct */}
        <div className="bg-white/80 border border-primary/15 rounded-3xl p-6 flex flex-col gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
              <Phone size={20} className="text-primary" aria-hidden="true" />
            </div>
            <div>
              <p className="font-semibold text-text-main text-sm">Appel direct</p>
              <p className="text-text-main/50 text-xs">Réponse rapide</p>
            </div>
          </div>
          <p className="text-2xl font-bold text-text-main tracking-tight">0484/66.68.92</p>
          <a
            href="tel:+32484666892"
            className="mt-auto w-full bg-primary hover:bg-primary-light text-white font-semibold text-sm py-4 rounded-2xl text-center transition-colors duration-200"
          >
            Appeler maintenant
          </a>
        </div>

        {/* WhatsApp */}
        <div className="bg-white/80 border border-primary/15 rounded-3xl p-6 flex flex-col gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#25D366]/10 flex items-center justify-center shrink-0">
              <WAIcon className="w-5 h-5 text-[#25D366]" />
            </div>
            <div>
              <p className="font-semibold text-text-main text-sm">WhatsApp</p>
              <p className="text-text-main/50 text-xs">Envoyez une photo</p>
            </div>
          </div>
          <p className="text-sm text-text-main/70 leading-relaxed">
            Envoyez une photo de vos cheveux pour un diagnostic personnalisé avant votre rendez-vous.
          </p>
          <a
            href="https://wa.me/32484666892"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto w-full bg-primary hover:bg-primary-light text-white font-semibold text-sm py-4 rounded-2xl text-center transition-colors duration-200"
          >
            Écrire sur WhatsApp
          </a>
        </div>

        {/* Email */}
        <div className="bg-white/80 border border-primary/15 rounded-3xl p-6 flex flex-col gap-4 shadow-sm md:col-span-2">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
              <Mail size={20} className="text-primary" aria-hidden="true" />
            </div>
            <div>
              <p className="font-semibold text-text-main text-sm">E-mail</p>
              <p className="text-text-main/50 text-xs">Réponse sous 24h</p>
            </div>
          </div>
          <p className="text-sm text-text-main/50 break-all">julie.budie@icloud.com</p>
          <a
            href="mailto:julie.budie@icloud.com"
            className="mt-auto w-full bg-primary hover:bg-primary-light text-white font-semibold text-sm py-4 rounded-2xl text-center transition-colors duration-200"
          >
            Envoyer un e-mail
          </a>
        </div>
      </div>

      {/* Zone d'intervention */}
      <div className="bg-primary/5 border border-primary/15 rounded-3xl p-6">
        <div className="flex items-center gap-2.5 mb-4">
          <MapPin size={18} className="text-primary shrink-0" aria-hidden="true" />
          <h2 className="font-serif text-primary text-lg font-semibold">Zone d&apos;intervention</h2>
        </div>
        <p className="text-sm text-text-main/60 mb-4 leading-relaxed">
          Julie se déplace à domicile dans les communes suivantes et alentours&nbsp;:
        </p>
        <ul className="flex flex-wrap gap-2" aria-label="Communes couvertes">
          {COMMUNES.map((c) => (
            <li
              key={c}
              className="bg-white border border-primary/20 text-primary text-xs font-medium px-3.5 py-1.5 rounded-full"
            >
              {c}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-text-main/45 leading-relaxed">
          Déplacement offert jusqu&apos;à 8 km. Au-delà, un forfait de déplacement s&apos;applique. Contactez Julie pour toute demande hors zone.
        </p>
      </div>

    </div>
  );
}
