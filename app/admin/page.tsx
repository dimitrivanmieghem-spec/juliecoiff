// app/admin/page.tsx
import { createClient } from "@/lib/supabase";
import { logout } from "@/app/actions/auth";
import { deleteBlock } from "@/app/actions/admin";
import { getPortfolioImages } from "@/app/actions/portfolio";
import StatusButtons from "@/components/StatusButtons";
import BlockSlotForm from "@/components/BlockSlotForm";
import AdminTabs from "@/components/AdminTabs";
import ReservationSubTabs from "@/components/ReservationSubTabs";
import PortfolioAdmin from "@/components/PortfolioAdmin";
import { ALL_SERVICES as SERVICES, formatDuration } from "@/lib/data";
import { MapPin, Clock, Mail, Phone, Scissors } from "lucide-react";

interface Reservation {
  id: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  client_address: string;
  service_ids: string[];
  total_price: number;
  duration: number | null;
  appointment_date: string;
  appointment_time: string;
  status: string;
  created_at: string;
  cancellation_reason?: string | null;
}

interface Block {
  id: string;
  block_date: string;
  block_time: string;
  duration: number;
  reason: string | null;
}

const statusBadge: Record<string, string> = {
  pending:   "bg-yellow-100 text-yellow-800 border border-yellow-200",
  confirmed: "bg-green-100 text-green-800 border border-green-200",
  cancelled: "bg-red-100 text-red-800 border border-red-200",
};

const statusLabel: Record<string, string> = {
  pending:   "En attente",
  confirmed: "Confirmé",
  cancelled: "Annulé",
};

function serviceNames(ids: string[]): string {
  return ids.map((id) => SERVICES.find((s) => s.id === id)?.name ?? id).join(", ");
}

function fmtDate(d: string) {
  const [y, m, day] = d.split("-").map(Number);
  return new Date(y, m - 1, day).toLocaleDateString("fr-BE", {
    day: "2-digit", month: "2-digit", year: "numeric",
  });
}

function ReservationCard({ r }: { r: Reservation }) {
  return (
    <div className="bg-white/90 border border-primary/10 rounded-2xl shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-primary/3 border-b border-primary/8">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary/60 shrink-0" />
          <span className="font-semibold text-text-main text-sm">{fmtDate(r.appointment_date)}</span>
          <span className="text-text-main/50 text-sm">·</span>
          <span className="text-primary font-medium text-sm">{r.appointment_time.slice(0, 5)}</span>
        </div>
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusBadge[r.status] ?? statusBadge.pending}`}>
          {statusLabel[r.status] ?? r.status}
        </span>
      </div>

      <div className="p-4 space-y-3">
        <div>
          <p className="font-semibold text-text-main text-base leading-tight">{r.client_name}</p>
          <div className="mt-1.5 space-y-0.5">
            <a href={`mailto:${r.client_email}`} className="flex items-center gap-1.5 text-xs text-text-main/60 hover:text-primary transition-colors">
              <Mail className="w-3.5 h-3.5 shrink-0" />
              {r.client_email}
            </a>
            <a href={`tel:${r.client_phone}`} className="flex items-center gap-1.5 text-xs text-text-main/60 hover:text-primary transition-colors">
              <Phone className="w-3.5 h-3.5 shrink-0" />
              {r.client_phone}
            </a>
          </div>
        </div>

        <div className="flex items-start gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-text-main/40 mt-0.5 shrink-0" />
          <span className="text-xs text-text-main/60">{r.client_address}</span>
        </div>

        <div className="flex items-start gap-1.5">
          <Scissors className="w-3.5 h-3.5 text-text-main/40 mt-0.5 shrink-0" />
          <span className="text-xs text-text-main/70">{serviceNames(r.service_ids)}</span>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-primary/8">
          <span className="text-lg font-bold text-primary">{Number(r.total_price).toFixed(2)} €</span>
          {r.duration != null && (
            <span className="text-xs text-text-main/50 bg-primary/5 px-2.5 py-1 rounded-full">
              {formatDuration(r.duration)}
            </span>
          )}
        </div>

        {r.cancellation_reason && (
          <p className="text-xs text-text-main/50 italic border-t border-primary/8 pt-2">
            Motif : {r.cancellation_reason}
          </p>
        )}

        <StatusButtons id={r.id} currentStatus={r.status} />
      </div>
    </div>
  );
}

export default async function AdminPage() {
  const supabase = await createClient();
  const today = new Date().toISOString().split("T")[0];

  const [{ data: reservations, error }, { data: blocks }, portfolioImages] = await Promise.all([
    supabase.from("reservations").select("*").order("created_at", { ascending: false }),
    supabase
      .from("unavailabilities")
      .select("*")
      .gte("block_date", today)
      .order("block_date")
      .order("block_time"),
    getPortfolioImages(),
  ]);

  const allReservations = (reservations ?? []) as Reservation[];
  const upcoming = allReservations.filter(
    (r) => (r.status === "pending" || r.status === "confirmed") && r.appointment_date >= today
  );
  const history = allReservations.filter(
    (r) => r.status === "cancelled" || r.appointment_date < today
  );

  const reservationsTab = (
    <div>
      {error && (
        <p role="alert" className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-6">
          Erreur lors du chargement : {error.message}
        </p>
      )}
      <ReservationSubTabs
        upcomingCount={upcoming.length}
        historyCount={history.length}
        upcomingContent={
          upcoming.length === 0 ? (
            <div className="text-center py-20 text-text-main/50">
              <p className="text-lg">Aucun rendez-vous à venir.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {upcoming.map((r) => <ReservationCard key={r.id} r={r} />)}
            </div>
          )
        }
        historyContent={
          history.length === 0 ? (
            <div className="text-center py-20 text-text-main/50">
              <p className="text-lg">Aucun historique pour le moment.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {history.map((r) => <ReservationCard key={r.id} r={r} />)}
            </div>
          )
        }
      />
    </div>
  );

  const agendaTab = (
    <div className="grid lg:grid-cols-2 gap-10 items-start">
      <div>
        <h2 className="font-serif text-lg font-semibold text-primary mb-4">Bloquer un créneau</h2>
        <BlockSlotForm />
      </div>

      <div>
        <h2 className="font-serif text-lg font-semibold text-primary mb-4">
          Indisponibilités à venir
          {!!blocks?.length && (
            <span className="ml-2 text-sm font-sans font-normal text-text-main/40">
              ({blocks.length})
            </span>
          )}
        </h2>
        {!blocks?.length ? (
          <p className="text-sm text-text-main/50 italic">Aucune indisponibilité planifiée.</p>
        ) : (
          <div className="space-y-3">
            {(blocks as Block[]).map((b) => (
              <div key={b.id} className="bg-white/80 border border-primary/10 rounded-xl p-4 flex items-center justify-between gap-4 shadow-sm">
                <div>
                  <p className="font-medium text-text-main text-sm">{fmtDate(b.block_date)} · {b.block_time.slice(0, 5)}</p>
                  <p className="text-xs text-text-main/50 mt-0.5">{formatDuration(b.duration)}{b.reason ? ` — ${b.reason}` : ""}</p>
                </div>
                <form action={deleteBlock.bind(null, b.id)}>
                  <button
                    type="submit"
                    className="text-xs text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 px-3 py-2 rounded-lg transition-colors whitespace-nowrap"
                  >
                    Supprimer
                  </button>
                </form>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const portfolioTab = <PortfolioAdmin images={portfolioImages} />;

  return (
    <div className="min-h-screen bg-background-cream pb-24">
      <header className="bg-white/80 backdrop-blur-sm border-b border-primary/10 px-4 py-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-serif text-xl text-primary font-semibold">Julie Coiff — Admin</h1>
            <p className="text-xs text-text-main/50 mt-0.5">
              {reservations?.length ?? 0} réservation{(reservations?.length ?? 0) !== 1 ? "s" : ""}
            </p>
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="text-sm text-text-main/60 hover:text-primary border border-primary/20 hover:border-primary/40 px-4 py-2 rounded-full transition-colors duration-200"
            >
              Déconnexion
            </button>
          </form>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <AdminTabs
          counts={{ reservations: reservations?.length ?? 0, blocks: blocks?.length ?? 0 }}
          reservationsTab={reservationsTab}
          agendaTab={agendaTab}
          portfolioTab={portfolioTab}
        />
      </main>
    </div>
  );
}
