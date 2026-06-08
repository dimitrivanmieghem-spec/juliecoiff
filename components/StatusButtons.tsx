"use client";

import { useTransition, useState, useEffect } from "react";
import { approveBooking, rejectBooking } from "@/app/actions/booking";
import { Loader2, CheckCircle } from "lucide-react";

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
  const [toast, setToast]            = useState<Toast | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  function handleApprove() {
    startTransition(async () => {
      try {
        await approveBooking(id);
        setToast({ message: "Rendez-vous accepté — e-mail envoyé", type: "success" });
      } catch {
        setToast({ message: "Erreur — veuillez réessayer", type: "error" });
      }
    });
  }

  function handleReject() {
    if (!confirm("Refuser ce rendez-vous et en informer la cliente ?")) return;
    startTransition(async () => {
      try {
        await rejectBooking(id);
        setToast({ message: "Rendez-vous refusé — cliente notifiée", type: "error" });
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

      <div className="flex gap-2 mt-3">
        {currentStatus === "confirmed" ? (
          <div className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-medium rounded-xl bg-green-50 border border-green-200 text-green-700">
            <CheckCircle className="w-4 h-4" />
            Confirmé
          </div>
        ) : currentStatus === "rejected" || currentStatus === "cancelled" ? (
          <div className="flex-1 flex items-center justify-center py-2.5 text-sm font-medium rounded-xl bg-red-50 border border-red-200 text-red-500">
            Refusé
          </div>
        ) : (
          <>
            <button
              onClick={handleApprove}
              disabled={isPending}
              aria-label="Accepter le rendez-vous"
              className="flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-medium rounded-xl bg-green-600 text-white hover:bg-green-700 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "✓ Accepter"}
            </button>
            <button
              onClick={handleReject}
              disabled={isPending}
              aria-label="Refuser le rendez-vous"
              className="flex-1 py-3 text-sm font-medium rounded-xl bg-red-50 border border-red-300 text-red-700 hover:bg-red-100 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              ✕ Refuser
            </button>
          </>
        )}
      </div>
    </>
  );
}
