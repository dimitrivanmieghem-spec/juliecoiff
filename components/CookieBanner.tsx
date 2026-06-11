"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = document.cookie.split("; ").some((c) => c.startsWith("cookie-consent=true"));
    if (!accepted) setVisible(true);
  }, []);

  function accept() {
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1);
    document.cookie = `cookie-consent=true; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Consentement aux cookies"
      className="fixed bottom-14 md:bottom-0 left-0 right-0 z-50 bg-[#3d2c1e] text-white px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
    >
      <p className="text-xs leading-relaxed text-white/85 max-w-xl">
        Ce site utilise des cookies essentiels pour la gestion de votre réservation et la connexion sécurisée.{" "}
        <Link href="/mentions-legales" className="underline underline-offset-2 hover:text-white transition-colors">
          En savoir plus
        </Link>
        .
      </p>
      <button
        onClick={accept}
        className="shrink-0 bg-primary hover:bg-primary-light text-white text-xs font-semibold px-5 py-2 rounded-xl transition-colors duration-200"
      >
        Accepter
      </button>
    </div>
  );
}
