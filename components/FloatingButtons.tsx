"use client";

import { useState } from "react";
import { MessageCircle, X, ChevronRight, Mail } from "lucide-react";

const QUICK_REPLIES = [
  { id: "materiel", label: "Quel matériel apportez-vous ?" },
  { id: "zone",     label: "Quelle est la zone d'intervention ?" },
  { id: "contact",  label: "Comment contacter Julie ?" },
];

const RESPONSES: Record<string, string> = {
  materiel: "Julie apporte tout le matériel professionnel nécessaire : colorations, outils de coiffure, serviettes et produits de soin. Vous n'avez absolument rien à préparer !",
  zone:     "Julie intervient à Seneffe et dans un rayon de 25 km : Manage, Nivelles, Pont-à-Celles, Ecaussinnes, Charleroi, Soignies et bien d'autres communes. Le déplacement est offert jusqu'à 8 km.",
  contact:  "Voici comment joindre Julie directement :",
};

type Msg = { from: "bot" | "user"; text: string };

function WAIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className ?? "w-6 h-6"} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

// z-index stack (mobile):
// z-40 : BottomNav (h-14, bottom-0)
// z-30 : StickyPriceFooter (bottom-14, ~82px tall → top at ~138px)
// z-50 : FloatingButtons (bottom-40 = 160px → clear of StickyPriceFooter)
// z-50 : Chat panel (bottom-56 = 224px → above buttons at 160+56=216px)

export default function FloatingButtons() {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { from: "bot", text: "Bonjour ! Je suis l'assistante Julie Coiff. Comment puis-je vous aider ?" },
  ]);
  const [asked, setAsked] = useState<string[]>([]);

  function handleQuick(id: string, label: string) {
    if (asked.includes(id)) return;
    setAsked((prev) => [...prev, id]);
    setMessages((prev) => [
      ...prev,
      { from: "user", text: label },
      { from: "bot",  text: RESPONSES[id] },
    ]);
  }

  const remaining   = QUICK_REPLIES.filter((q) => !asked.includes(q.id));
  const showContact = asked.includes("contact");

  return (
    <>
      {/* ── Chat panel ───────────────────────────────────────────────────── */}
      {chatOpen && (
        <div
          className="fixed z-50 bottom-56 right-3 left-3 md:left-auto md:right-6 md:w-80 md:bottom-24 bg-white rounded-3xl shadow-2xl border border-primary/10 flex flex-col overflow-hidden"
          style={{ maxHeight: "min(480px, 60vh)" }}
        >
          <div className="bg-primary px-5 py-3.5 flex items-center justify-between shrink-0">
            <div>
              <p className="text-white font-semibold text-sm">Julie Coiff</p>
              <p className="text-white/65 text-[11px]">Assistante virtuelle</p>
            </div>
            <button
              onClick={() => setChatOpen(false)}
              className="text-white/70 hover:text-white p-1 transition-colors"
              aria-label="Fermer le chat"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#fdf6f2]">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`rounded-2xl px-3.5 py-2.5 text-sm max-w-[85%] leading-relaxed ${
                  msg.from === "user"
                    ? "bg-primary text-white"
                    : "bg-white border border-primary/10 text-text-main shadow-sm"
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}

            {showContact && (
              <div className="space-y-2 pt-1">
                <a
                  href="#booking"
                  onClick={() => setChatOpen(false)}
                  className="flex items-center gap-2.5 bg-primary hover:bg-primary-light text-white text-xs font-semibold px-4 py-3 rounded-2xl w-full transition-colors"
                >
                  <ChevronRight size={14} aria-hidden="true" />
                  Prendre rendez-vous
                </a>
                <a
                  href="https://wa.me/32484666892"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 bg-[#25D366] hover:opacity-90 text-white text-xs font-semibold px-4 py-3 rounded-2xl w-full transition-opacity"
                >
                  <WAIcon className="w-4 h-4 shrink-0" />
                  WhatsApp — 0484/66.68.92
                </a>
                <a
                  href="mailto:julie.budie@icloud.com"
                  className="flex items-center gap-2.5 bg-white border border-primary/20 hover:bg-primary/5 text-primary text-xs font-semibold px-4 py-3 rounded-2xl w-full transition-colors"
                >
                  <Mail size={14} aria-hidden="true" className="shrink-0" />
                  julie.budie@icloud.com
                </a>
              </div>
            )}
          </div>

          {remaining.length > 0 && (
            <div className="shrink-0 p-3 border-t border-primary/8 bg-white space-y-2">
              {remaining.map((q) => (
                <button
                  key={q.id}
                  onClick={() => handleQuick(q.id, q.label)}
                  className="w-full text-left text-xs font-medium text-primary border border-primary/20 hover:bg-primary/5 px-3.5 py-2.5 rounded-xl transition-colors"
                >
                  {q.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── WhatsApp (hidden when chat is open) ──────────────────────────── */}
      {!chatOpen && (
        <a
          href="https://wa.me/32484666892"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-40 md:bottom-6 right-20 md:right-24 z-50 w-14 h-14 bg-[#25D366] rounded-full shadow-xl flex items-center justify-center text-white hover:opacity-90 transition-opacity"
          aria-label="Contacter Julie sur WhatsApp"
        >
          <WAIcon />
        </a>
      )}

      {/* ── Chat toggle ───────────────────────────────────────────────────── */}
      <button
        onClick={() => setChatOpen((o) => !o)}
        className="fixed bottom-40 md:bottom-6 right-4 md:right-6 z-50 w-14 h-14 bg-primary hover:bg-primary-light rounded-full shadow-xl flex items-center justify-center text-white transition-colors"
        aria-label={chatOpen ? "Fermer le chat" : "Ouvrir l'assistant Julie Coiff"}
      >
        {chatOpen
          ? <X size={22} aria-hidden="true" />
          : <MessageCircle size={22} aria-hidden="true" />
        }
      </button>
    </>
  );
}
