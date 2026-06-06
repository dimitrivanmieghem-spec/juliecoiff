"use client";

import { useTransition, useState, useEffect } from "react";
import { updateReservationStatus } from "@/app/actions/booking";
import { Loader2 } from "lucide-react";

interface Props {
  id: string;
  currentStatus: string;
}

interface Toast {
  message: string;
  type: "success" | "error";
}

export default function StatusButtons({ id, currentStatus }: Props) {
  const [isPending, startTransition] = useTransition();
  const [toast, setToast]           = useState<Toast | null>(null);
  const [showModal, setShowModal]   = useState(false);
  const [reason, setReason]         = useState("");

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  function handleConfirm() {
    startTransition(async () => {
      try {
        await updateReservationStatus(id, "confirmed");
        setToast({ message: "Confirmé — e-mail envoyé", type: "success" });
      } catch {
        setToast({ message: "Erreur — veuillez réessayer", type: "error" });
      }
    });
  }

  function openCancelModal() {
    setReason("");
    setShowModal(true);
  }

  function confirmCancel() {
    if (!reason.trim()) return;
    setShowModal(false);
    startTransition(async () => {
      try {
        await updateReservationStatus(id, "cancelled", reason.trim());
        setToast({ message: "Réservation annulée", type: "error" });
      } catch {
        setToast({ message: "Erreur — veuillez réessayer", type: "error" });
      }
    });
  }

  return (
    <>
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl shadow-xl text-sm font-medium whitespace-nowrap ${
            toast.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"
          }`}
        >
          {toast.message}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4">
            <h3 className="font-serif text-lg font-semibold text-text-main">
              Annuler ce rendez-vous
            </h3>
            <div>
              <label
                htmlFor={`cancel-reason-${id}`}
                className="block text-xs font-medium text-text-main/60 mb-1.5"
              >
                Raison de l&apos;annulation <span className="text-red-500" aria-hidden="true">*</span>
              </label>
              <textarea
                id={`cancel-reason-${id}`}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                placeholder="Ex : Indisponibilité, maladie, demande cliente…"
                className="w-full bg-white/80 border border-primary/20 rounded-xl px-4 py-3 text-sm text-text-main placeholder:text-text-main/40 focus:outline-none focus:ring-2 focus:ring-primary/40 transition resize-none"
              />
            </div>
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex-1 py-3 text-sm font-medium rounded-xl border border-primary/20 text-text-main/60 hover:bg-primary/5 transition-colors"
              >
                Retour
              </button>
              <button
                type="button"
                onClick={confirmCancel}
                disabled={!reason.trim() || isPending}
                className="flex-1 py-3 text-sm font-medium rounded-xl bg-red-700 text-white hover:bg-red-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-1.5"
              >
                {isPending
                  ? <Loader2 className="w-4 h-4 animate-spin" />
                  : "Confirmer l'annulation"
                }
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-2 mt-3">
        <button
          onClick={handleConfirm}
          disabled={isPending || currentStatus === "confirmed"}
          aria-label="Confirmer la réservation"
          className="flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-medium rounded-xl bg-green-50 border border-green-300 text-green-700 hover:bg-green-100 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Valider"}
        </button>
        <button
          onClick={openCancelModal}
          disabled={isPending || currentStatus === "cancelled"}
          aria-label="Annuler la réservation"
          className="flex-1 py-3 text-sm font-medium rounded-xl bg-red-50 border border-red-300 text-red-700 hover:bg-red-100 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          Annuler
        </button>
      </div>
    </>
  );
}
