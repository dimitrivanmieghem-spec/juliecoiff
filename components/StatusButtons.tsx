"use client";
// components/StatusButtons.tsx

import { useTransition } from "react";
import { updateReservationStatus } from "@/app/actions/booking";

interface StatusButtonsProps {
  id: string;
  currentStatus: string;
}

export default function StatusButtons({ id, currentStatus }: StatusButtonsProps) {
  const [isPending, startTransition] = useTransition();

  function handle(status: string) {
    startTransition(() => updateReservationStatus(id, status));
  }

  return (
    <div className="flex items-center gap-2" aria-label="Modifier le statut">
      <button
        onClick={() => handle("confirmed")}
        disabled={isPending || currentStatus === "confirmed"}
        aria-label="Confirmer la réservation"
        className="px-3 py-1.5 text-xs font-medium rounded-full border border-green-300 text-green-700 hover:bg-green-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150"
      >
        Valider
      </button>
      <button
        onClick={() => handle("cancelled")}
        disabled={isPending || currentStatus === "cancelled"}
        aria-label="Annuler la réservation"
        className="px-3 py-1.5 text-xs font-medium rounded-full border border-red-300 text-red-700 hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150"
      >
        Annuler
      </button>
    </div>
  );
}
