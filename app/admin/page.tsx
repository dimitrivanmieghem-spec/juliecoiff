// app/admin/page.tsx
import { createClient } from "@/lib/supabase";
import { logout } from "@/app/actions/auth";
import { deleteBlock } from "@/app/actions/admin";
import StatusButtons from "@/components/StatusButtons";
import BlockSlotForm from "@/components/BlockSlotForm";
import AdminTabs from "@/components/AdminTabs";
import { ALL_SERVICES as SERVICES, formatDuration } from "@/lib/data";

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

export default async function AdminPage() {
  const supabase = await createClient();
  const today = new Date().toISOString().split("T")[0];

  const [{ data: reservations, error }, { data: blocks }] = await Promise.all([
    supabase.from("reservations").select("*").order("created_at", { ascending: false }),
    supabase
      .from("unavailabilities")
      .select("*")
      .gte("block_date", today)
      .order("block_date")
      .order("block_time"),
  ]);

  const reservationsTab = (
    <div>
      {error && (
        <p role="alert" className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-6">
          Erreur lors du chargement : {error.message}
        </p>
      )}
      {!reservations?.length ? (
        <div className="text-center py-20 text-text-main/50">
          <p className="text-lg">Aucune réservation pour le moment.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-primary/10 shadow-sm">
          <table className="w-full text-sm bg-white/80 backdrop-blur-sm">
            <thead>
              <tr className="border-b border-primary/10 bg-primary/5">
                {["RDV", "Cliente", "Adresse", "Prestations", "Montant / Durée", "Statut", "Actions"].map((h) => (
                  <th
                    key={h}
                    scope="col"
                    className="text-left text-xs font-semibold text-text-main/60 px-4 py-3 whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(reservations as Reservation[]).map((r, i) => (
                <tr
                  key={r.id}
                  className={`border-b border-primary/5 hover:bg-primary/3 transition-colors ${i % 2 === 0 ? "" : "bg-white/40"}`}
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="font-medium text-text-main">{fmtDate(r.appointment_date)}</div>
                    <div className="text-xs text-text-main/50">{r.appointment_time.slice(0, 5)}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-text-main">{r.client_name}</div>
                    <div className="text-xs text-text-main/50">{r.client_email}</div>
                    <div className="text-xs text-text-main/50">{r.client_phone}</div>
                  </td>
                  <td className="px-4 py-3 max-w-[180px]">
                    <span className="text-xs text-text-main/70">{r.client_address}</span>
                  </td>
                  <td className="px-4 py-3 max-w-[220px]">
                    <span
                      className="text-xs text-text-main/80 line-clamp-3"
                      title={serviceNames(r.service_ids)}
                    >
                      {serviceNames(r.service_ids)}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="font-semibold text-primary">{Number(r.total_price).toFixed(2)}€</div>
                    {r.duration != null && (
                      <div className="text-xs text-text-main/50">{formatDuration(r.duration)}</div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${statusBadge[r.status] ?? statusBadge.pending}`}
                    >
                      {statusLabel[r.status] ?? r.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusButtons id={r.id} currentStatus={r.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
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
          <div className="rounded-2xl border border-primary/10 overflow-hidden shadow-sm">
            <table className="w-full text-sm bg-white/80">
              <thead>
                <tr className="border-b border-primary/10 bg-primary/5">
                  {["Date / Heure", "Durée", "Motif", ""].map((h) => (
                    <th
                      key={h}
                      scope="col"
                      className="text-left text-xs font-semibold text-text-main/60 px-4 py-3"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(blocks as Block[]).map((b, i) => (
                  <tr
                    key={b.id}
                    className={`border-b border-primary/5 ${i % 2 === 0 ? "" : "bg-white/40"}`}
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="font-medium text-text-main">{fmtDate(b.block_date)}</div>
                      <div className="text-xs text-text-main/50">{b.block_time.slice(0, 5)}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-text-main/80 text-xs">
                      {formatDuration(b.duration)}
                    </td>
                    <td className="px-4 py-3 text-xs text-text-main/60">
                      {b.reason ?? <span className="italic text-text-main/30">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <form action={deleteBlock.bind(null, b.id)}>
                        <button
                          type="submit"
                          className="text-xs text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Supprimer
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background-cream">
      <header className="bg-white/80 backdrop-blur-sm border-b border-primary/10 px-4 py-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-serif text-xl text-primary font-semibold">Julie Coiff — Admin</h1>
            <p className="text-xs text-text-main/50 mt-0.5">
              {reservations?.length ?? 0} réservation
              {(reservations?.length ?? 0) !== 1 ? "s" : ""}
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
        />
      </main>
    </div>
  );
}
