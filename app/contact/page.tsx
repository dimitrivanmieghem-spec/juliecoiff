"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

const inputClass =
  "w-full bg-white/80 border border-primary/20 rounded-xl px-4 py-3 text-sm text-text-main placeholder:text-text-main/40 focus:outline-none focus:ring-2 focus:ring-primary/40 transition";

export default function ContactPage() {
  const [sent, setSent]   = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const name    = fd.get("name")?.toString().trim();
    const email   = fd.get("email")?.toString().trim();
    const message = fd.get("message")?.toString().trim();
    if (!name || !email || !message) {
      setError("Tous les champs sont obligatoires.");
      return;
    }
    startTransition(async () => {
      await new Promise((r) => setTimeout(r, 600));
      setSent(true);
    });
  }

  if (sent) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center flex flex-col items-center gap-5">
        <CheckCircle size={52} className="text-primary" />
        <h1 className="font-serif text-2xl text-text-main font-semibold">Message envoyé !</h1>
        <p className="text-base text-text-main/70">
          Merci pour votre message. Julie vous répondra dans les plus brefs délais.
        </p>
        <Link href="/" className="mt-2 text-sm text-primary underline underline-offset-4 hover:text-primary-light transition-colors">
          Retour à l&apos;accueil
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-16 md:py-20">
      <Link href="/" className="text-sm text-primary hover:underline mb-8 inline-block">
        ← Retour à l&apos;accueil
      </Link>

      <h1 className="font-serif text-3xl md:text-4xl text-text-main font-semibold mb-2">
        Contactez Julie
      </h1>
      <p className="text-base text-text-main/60 mb-10 leading-relaxed">
        Une question, une demande particulière ? Envoyez un message — Julie vous répondra rapidement.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div>
          <label htmlFor="name" className="block text-xs font-medium text-text-main/60 mb-1.5">
            Nom complet <span aria-hidden="true">*</span>
          </label>
          <input
            id="name" name="name" type="text" required
            autoComplete="name" placeholder="Marie Dupont"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-xs font-medium text-text-main/60 mb-1.5">
            E-mail <span aria-hidden="true">*</span>
          </label>
          <input
            id="email" name="email" type="email" required
            autoComplete="email" placeholder="marie@example.com"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-xs font-medium text-text-main/60 mb-1.5">
            Message <span aria-hidden="true">*</span>
          </label>
          <textarea
            id="message" name="message" rows={5} required
            placeholder="Votre message…"
            className={`${inputClass} resize-none`}
          />
        </div>

        {error && (
          <p role="alert" className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-primary hover:bg-primary-light disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium text-sm px-6 py-3.5 rounded-full transition-colors duration-200"
        >
          {isPending ? "Envoi en cours…" : "Envoyer le message"}
        </button>
      </form>
    </div>
  );
}
