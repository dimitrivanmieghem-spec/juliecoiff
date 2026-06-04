// app/admin/login/page.tsx
"use client";

import { useActionState } from "react";
import { login } from "@/app/actions/auth";

const initialState = { error: null };

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, initialState);

  return (
    <div className="min-h-screen bg-background-cream flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl text-primary font-semibold">
            Julie Coiff
          </h1>
          <p className="mt-1 text-sm text-text-main/60">Espace administrateur</p>
        </div>

        <form
          action={formAction}
          className="bg-white/80 backdrop-blur-sm border border-primary/15 rounded-2xl p-8 shadow-sm space-y-5"
          aria-label="Formulaire de connexion"
          noValidate
        >
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-medium text-text-main/60 mb-1.5"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              autoFocus
              className="w-full bg-white border border-primary/20 rounded-xl px-4 py-3 text-sm text-text-main placeholder:text-text-main/30 focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
              placeholder="admin@juliecoiff.be"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs font-medium text-text-main/60 mb-1.5"
            >
              Mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full bg-white border border-primary/20 rounded-xl px-4 py-3 text-sm text-text-main placeholder:text-text-main/30 focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
              placeholder="••••••••"
            />
          </div>

          {state.error && (
            <p
              role="alert"
              className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3"
            >
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            aria-busy={isPending}
            className="w-full bg-primary hover:bg-primary-light disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium text-sm px-6 py-3 rounded-full transition-colors duration-200"
          >
            {isPending ? "Connexion…" : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}
