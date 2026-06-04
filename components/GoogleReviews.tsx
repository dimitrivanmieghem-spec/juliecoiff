import { Star } from "lucide-react";

const REVIEWS = [
  {
    author: "Caroline Koeks",
    text: "Excellente coiffeuse je recommande vivement :-)",
  },
  {
    author: "Cathy Vanreckt",
    text: "Très contente de ma nouvelle coiffure.",
  },
  {
    author: "Sabah El Haman",
    text: "D'une gentillesse incroyable. Soucieuse du bonheur de ses clientes, de bons conseils, on est chouchoutée et très bon travail. Merci !",
  },
];

function StarRating() {
  return (
    <div className="flex gap-0.5 mb-4" aria-label="5 étoiles sur 5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={15} className="fill-amber-400 text-amber-400" />
      ))}
    </div>
  );
}

export default function GoogleReviews() {
  return (
    <section className="py-16 md:py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10 md:mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary/60 mb-3">
            Avis Google vérifiés
          </p>
          <h2 className="font-serif text-3xl md:text-4xl text-text-main font-semibold">
            Ce que disent mes clientes
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map(({ author, text }) => (
            <div
              key={author}
              className="bg-white/80 border border-primary/10 rounded-2xl p-6 shadow-md flex flex-col"
            >
              <StarRating />
              <p className="text-sm text-text-main/80 leading-relaxed flex-1 italic">
                &ldquo;{text}&rdquo;
              </p>
              <div className="flex items-center gap-3 mt-5 pt-4 border-t border-primary/8">
                <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                  <span className="text-sm font-semibold text-primary" aria-hidden="true">
                    {author[0]}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-main">{author}</p>
                  <p className="text-xs text-text-main/40">Avis Google</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-text-main/40 mt-8">
          Avis recueillis directement sur Google Business Profile.
        </p>
      </div>
    </section>
  );
}
