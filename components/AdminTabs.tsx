"use client";

import { useState } from "react";
import { CalendarOff } from "lucide-react";

interface Props {
  counts: { reservations: number; blocks: number };
  reservationsTab: React.ReactNode;
  agendaTab: React.ReactNode;
}

export default function AdminTabs({ counts, reservationsTab, agendaTab }: Props) {
  const [active, setActive] = useState<"reservations" | "agenda">("reservations");

  function cls(t: "reservations" | "agenda") {
    return `flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg transition-colors ${
      active === t
        ? "bg-primary text-white shadow-sm"
        : "text-text-main/60 hover:text-primary hover:bg-primary/5"
    }`;
  }

  function badge(count: number, isActive: boolean) {
    if (!count && !isActive) return null;
    return (
      <span className={`text-xs px-2 py-0.5 rounded-full ${isActive ? "bg-white/25" : "bg-primary/10 text-primary"}`}>
        {count}
      </span>
    );
  }

  return (
    <div>
      <div className="flex gap-1 mb-8 bg-white/60 border border-primary/10 rounded-xl p-1 w-fit shadow-sm">
        <button type="button" onClick={() => setActive("reservations")} className={cls("reservations")}>
          Réservations
          {badge(counts.reservations, active === "reservations")}
        </button>
        <button type="button" onClick={() => setActive("agenda")} className={cls("agenda")}>
          Gestion de l&apos;Agenda
          {badge(counts.blocks, active === "agenda")}
        </button>
      </div>

      <div>{active === "reservations" ? reservationsTab : agendaTab}</div>

      <button
        type="button"
        onClick={() => {
          setActive("agenda");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        aria-label="Bloquer un créneau"
        className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-50 flex items-center gap-2 bg-primary text-white pl-4 pr-5 py-3.5 rounded-full shadow-lg hover:bg-primary/90 active:scale-95 transition-all"
      >
        <CalendarOff className="w-5 h-5" />
        <span className="text-sm font-medium">Bloquer</span>
      </button>
    </div>
  );
}
