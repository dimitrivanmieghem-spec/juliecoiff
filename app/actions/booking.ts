"use server";

import { revalidatePath } from "next/cache";
import { supabase, createActionClient } from "@/lib/supabase";
import { ALL_SERVICES as SERVICES, formatDuration } from "@/lib/data";

interface CartData {
  serviceIds: string[];
  totalPrice: number;
  totalDuration: number;
  cityName: string;
}

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
}

export async function createReservation(
  formData: FormData,
  cartData: CartData
): Promise<{ success: true } | { error: string }> {
  const clientName      = formData.get("client_name")?.toString().trim();
  const clientEmail     = formData.get("client_email")?.toString().trim();
  const clientPhone     = formData.get("client_phone")?.toString().trim();
  const clientStreet    = formData.get("client_street")?.toString().trim();
  const appointmentDate = formData.get("appointment_date")?.toString();
  const appointmentTime = formData.get("appointment_time")?.toString();

  if (!clientName || !clientEmail || !clientPhone || !clientStreet || !appointmentDate || !appointmentTime) {
    return { error: "Tous les champs sont obligatoires." };
  }

  if (cartData.serviceIds.length === 0) {
    return { error: "Aucune prestation sélectionnée." };
  }

  const clientAddress = `${clientStreet}, ${cartData.cityName}`;

  const { error } = await supabase.from("reservations").insert({
    client_name:      clientName,
    client_email:     clientEmail,
    client_phone:     clientPhone,
    client_address:   clientAddress,
    service_ids:      cartData.serviceIds,
    total_price:      cartData.totalPrice,
    duration:         cartData.totalDuration,
    appointment_date: appointmentDate,
    appointment_time: appointmentTime,
    status:           "pending",
  });

  if (error) return { error: error.message };
  return { success: true };
}

export async function getBookedSlots(
  date: string
): Promise<{ appointment_time: string; totalDuration: number }[]> {
  const { data, error } = await supabase
    .from("booked_slots")
    .select("appointment_time, duration")
    .eq("appointment_date", date);

  if (error || !data) return [];
  return (data as { appointment_time: string; duration: number | null }[]).map((r) => ({
    appointment_time: r.appointment_time,
    totalDuration:    r.duration ?? 0,
  }));
}

export async function updateReservationStatus(
  id: string,
  status: string,
  cancellationReason?: string
): Promise<void> {
  const client = await createActionClient();

  const { data: reservation, error: fetchError } = await client
    .from("reservations")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchError) throw new Error(fetchError.message);

  const updatePayload: Record<string, unknown> = { status };
  if (status === "cancelled" && cancellationReason) {
    updatePayload.cancellation_reason = cancellationReason;
  }

  const { error } = await client.from("reservations").update(updatePayload).eq("id", id);
  if (error) throw new Error(error.message);

  if (status === "confirmed" && reservation) {
    await sendConfirmationEmail(reservation as Reservation).catch(() => {});
  }

  revalidatePath("/admin");
}

async function sendConfirmationEmail(r: Reservation) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const { Resend } = await import("resend");
  const resend = new Resend(apiKey);

  const from = process.env.RESEND_FROM_EMAIL ?? "Julie Coiff <onboarding@resend.dev>";
  const [y, m, d] = r.appointment_date.split("-").map(Number);
  const dateStr = new Date(y, m - 1, d).toLocaleDateString("fr-BE", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
  const timeStr = r.appointment_time.slice(0, 5);
  const serviceNames = r.service_ids
    .map((id) => SERVICES.find((s) => s.id === id)?.name ?? id)
    .join(", ");
  const durationStr = r.duration ? formatDuration(r.duration) : "";

  await resend.emails.send({
    from,
    to: r.client_email,
    subject: "Votre rendez-vous est confirmé !",
    html: `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#faf8f5;font-family:'Georgia',serif;">
  <div style="max-width:520px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.07);">
    <div style="background:#c9a96e;padding:32px 40px;text-align:center;">
      <h1 style="margin:0;color:#fff;font-size:24px;font-weight:400;letter-spacing:.5px;">Julie Coiff</h1>
      <p style="margin:8px 0 0;color:rgba(255,255,255,.85);font-size:13px;font-family:sans-serif;">Coiffeuse à domicile</p>
    </div>
    <div style="padding:36px 40px;">
      <p style="font-size:15px;color:#3d2c1e;margin:0 0 24px;">Bonjour <strong>${r.client_name}</strong>,</p>
      <p style="font-size:15px;color:#3d2c1e;margin:0 0 28px;line-height:1.6;">
        Votre rendez-vous est <strong style="color:#c9a96e;">confirmé</strong>. Julie sera ravie de vous accueillir !
      </p>
      <div style="background:#faf8f5;border-radius:12px;padding:20px 24px;margin-bottom:28px;">
        <table style="width:100%;border-collapse:collapse;font-family:sans-serif;font-size:13px;color:#3d2c1e;">
          <tr style="border-bottom:1px solid #e8e0d5;">
            <td style="padding:10px 0;color:#8a7565;font-weight:500;">Date</td>
            <td style="padding:10px 0;text-align:right;font-weight:600;text-transform:capitalize;">${dateStr}</td>
          </tr>
          <tr style="border-bottom:1px solid #e8e0d5;">
            <td style="padding:10px 0;color:#8a7565;font-weight:500;">Heure</td>
            <td style="padding:10px 0;text-align:right;font-weight:600;">${timeStr}</td>
          </tr>
          <tr style="border-bottom:1px solid #e8e0d5;">
            <td style="padding:10px 0;color:#8a7565;font-weight:500;">Prestations</td>
            <td style="padding:10px 0;text-align:right;">${serviceNames}</td>
          </tr>
          ${durationStr ? `
          <tr style="border-bottom:1px solid #e8e0d5;">
            <td style="padding:10px 0;color:#8a7565;font-weight:500;">Durée estimée</td>
            <td style="padding:10px 0;text-align:right;">${durationStr}</td>
          </tr>` : ""}
          <tr style="border-bottom:1px solid #e8e0d5;">
            <td style="padding:10px 0;color:#8a7565;font-weight:500;">Adresse</td>
            <td style="padding:10px 0;text-align:right;">${r.client_address}</td>
          </tr>
          <tr>
            <td style="padding:10px 0;color:#8a7565;font-weight:500;">Montant</td>
            <td style="padding:10px 0;text-align:right;font-size:16px;font-weight:700;color:#c9a96e;">${Number(r.total_price).toFixed(2)} €</td>
          </tr>
        </table>
      </div>
      <p style="font-size:13px;color:#8a7565;font-family:sans-serif;line-height:1.6;margin:0 0 8px;">
        En cas d'empêchement, merci de prévenir au moins 24h à l'avance.
      </p>
      <p style="font-size:13px;color:#8a7565;font-family:sans-serif;margin:0;">
        À très bientôt,<br><strong style="color:#3d2c1e;">Julie</strong>
      </p>
    </div>
    <div style="background:#faf8f5;padding:16px 40px;text-align:center;">
      <p style="margin:0;font-size:11px;color:#b0a090;font-family:sans-serif;">Julie Coiff · Coiffeuse à domicile en Belgique</p>
    </div>
  </div>
</body>
</html>`,
  });
}
