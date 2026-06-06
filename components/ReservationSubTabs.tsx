"use client";

import { useState } from "react";

interface Props {
  upcomingCount: number;
  historyCount: number;
  upcomingContent: React.ReactNode;
  historyContent: React.ReactNode;
}

export default function ReservationSubTabs({
  upcomingCount,
  historyCount,
  upcomingContent,
  historyContent,
}: Props) {
  const [active, setActive] = useState<"upcoming" | "history">("upcoming");

  function tabClass(t: "upcoming" | "history") {
    return `relative pb-2.5 px-1 text-sm font-medium transition-colors ${
      active === t ? "text-primary" : "text-text-main/50 hover:text-text-main"
    }`;
  }

  function countBadge(count: number, t: "upcoming" | "history") {
    if (!count) return null;
    return (
      <span
        className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
          active === t ? "bg-primary/10 text-primary" : "bg-primary/5 text-text-main/40"
        }`}
      >
        {count}
      </span>
    );
  }

  return (
    <div>
      <div className="flex gap-6 border-b border-primary/15 mb-6">
        <button type="button" onClick={() => setActive("upcoming")} className={tabClass("upcoming")}>
          À venir
          {countBadge(upcomingCount, "upcoming")}
          {active === "upcoming" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
          )}
        </button>
        <button type="button" onClick={() => setActive("history")} className={tabClass("history")}>
          Historique
          {countBadge(historyCount, "history")}
          {active === "history" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
          )}
        </button>
      </div>

      {active === "upcoming" ? upcomingContent : historyContent}
    </div>
  );
}
