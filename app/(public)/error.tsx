"use client";

import Link from "next/link";

export default function PublicError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-20 text-center">
      <p className="text-5xl mb-6" aria-hidden="true">✂️</p>
      <h1 className="font-serif text-2xl md:text-3xl text-text-main font-semibold mb-3">
        Oups, quelque chose s&apos;est mal passé.
      </h1>
      <p className="text-sm text-text-main/55 mb-8 max-w-sm leading-relaxed">
        Une erreur inattendue est survenue. Veuillez réessayer ou revenir à l&apos;accueil.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
        <button
          onClick={reset}
          className="w-full bg-primary hover:bg-primary-light text-white font-semibold text-sm py-3.5 rounded-2xl transition-colors duration-200"
        >
          Réessayer
        </button>
        <Link
          href="/"
          className="w-full border border-primary/25 text-primary hover:bg-primary/5 font-semibold text-sm py-3.5 rounded-2xl transition-colors duration-200 flex items-center justify-center"
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
