"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "Faut-il prévoir du matériel ou se laver les cheveux avant ?",
    a: "Absolument pas ! J'arrive chez vous avec tout mon matériel professionnel, y compris mon propre bac à shampoing. Vous n'avez qu'à prévoir une chaise près d'une prise électrique, je m'occupe du reste.",
  },
  {
    q: "Que se passe-t-il pour le nettoyage après la coupe ?",
    a: "Mon objectif est de vous offrir un moment de détente. Une fois la prestation terminée, je nettoie et balaye méticuleusement l'espace utilisé. Votre intérieur restera aussi impeccable qu'à mon arrivée.",
  },
  {
    q: "Dois-je prévoir beaucoup d'espace chez moi ?",
    a: "Non, un espace d'environ 2m² suffit amplement. Un coin de votre salon ou de votre cuisine fait parfaitement l'affaire du moment qu'il y a une prise à proximité.",
  },
  {
    q: "Quelles sont vos zones de déplacement exactes ?",
    a: "Je me déplace dans un rayon autour de Seneffe, incluant Manage, Nivelles, Feluy, et les communes limitrophes. N'hésitez pas à vérifier votre code postal lors de la réservation.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-16 md:py-24 px-4 bg-white/40 border-t border-primary/8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10 md:mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary/60 mb-3">
            F.A.Q
          </p>
          <h2 className="font-serif text-3xl md:text-4xl text-text-main font-semibold leading-tight">
            Vous avez des questions ?<br className="hidden sm:block" /> Je vous réponds.
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="border border-primary/12 rounded-2xl overflow-hidden bg-white/70"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
              >
                <span className="text-sm font-medium text-text-main leading-snug">
                  {faq.q}
                </span>
                <ChevronDown
                  className={`shrink-0 w-4 h-4 text-primary transition-transform duration-300 ${
                    open === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  open === i ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="px-6 pb-5 text-sm text-text-main/65 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
