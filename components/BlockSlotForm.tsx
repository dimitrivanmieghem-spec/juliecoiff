"use client";

import { useState, useTransition, useRef } from "react";
import { blockTimeSlot } from "@/app/actions/admin";

const inputClass =
  "w-full bg-white/80 border border-primary/20 rounded-xl px-4 py-3 text-sm text-text-main placeholder:text-text-main/40 focus:outline-none focus:ring-2 focus:ring-primary/40 transition";

export default function BlockSlotForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError]     = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await blockTimeSlot(fd);
      if (result?.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        formRef.current?.reset();
      }
    });
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="bg-white/80 border border-primary/15 rounded-2xl p-6 shadow-sm space-y-4"
    >
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="block_date" className="block text-xs font-medium text-text-main/60 mb-1.5">
            Date <span aria-hidden="true">*</span>
          </label>
          <input
            id="block_date" name="block_date" type="date" required
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="block_time" className="block text-xs font-medium text-text-main/60 mb-1.5">
            Heure de début <span aria-hidden="true">*</span>
          </label>
          <input
            id="block_time" name="block_time" type="time" required
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="duration" className="block text-xs font-medium text-text-main/60 mb-1.5">
          Durée (minutes) <span aria-hidden="true">*</span>
        </label>
        <input
          id="duration" name="duration" type="number"
          min={15} step={15} placeholder="60" required
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="reason" className="block text-xs font-medium text-text-main/60 mb-1.5">
          Motif (optionnel)
        </label>
        <input
          id="reason" name="reason" type="text"
          placeholder="Pause midi, Formation, Rendez-vous personnel…"
          className={inputClass}
        />
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          {error}
        </p>
      )}
      {success && (
        <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
          Créneau bloqué avec succès.
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-primary hover:bg-primary-light disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium text-sm px-6 py-3 rounded-full transition-colors duration-200"
      >
        {isPending ? "Enregistrement…" : "Bloquer ce créneau"}
      </button>
    </form>
  );
}
