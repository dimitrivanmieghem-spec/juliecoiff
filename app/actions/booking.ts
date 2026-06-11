"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { supabase, createActionClient } from "@/lib/supabase";
import { checkRateLimit } from "@/lib/ratelimit";
import { ALL_SERVICES as SERVICES, formatDuration } from "@/lib/data";
import { sendPendingEmails, sendConfirmationEmail, sendRejectionEmail, type BookingEmailData } from "@/app/actions/emails";

interface CartData {
  serviceIds: string[];
  totalPrice: number;
  totalDuration: number;
  cityName: string;
}

interface ReservationRow {
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
  cancellation_reason?: string | null;
}

function toEmailData(r: ReservationRow): BookingEmailData {
  const [y, m, d] = r.appointment_date.split("-").map(Number);
  return {
    clientName:    r.client_name,
    clientEmail:   r.client_email,
    clientPhone:   r.client_phone,
    clientAddress: r.client_address,
    serviceNames:  r.service_ids.map((id) => SERVICES.find((s) => s.id === id)?.name ?? id).join(", "),
    date:          new Date(y, m - 1, d).toLocaleDateString("fr-BE", { weekday: "long", day: "numeric", month: "long", year: "numeric" }),
    time:          r.appointment_time.slice(0, 5),
    totalPrice:    r.total_price,
    duration:      r.duration ? formatDuration(r.duration) : undefined,
  };
}

export async function createReservation(
  formData: FormData,
  cartData: CartData
): Promise<{ success: true } | { error: string }> {
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for")?.split(",")[0].trim() ?? "anonymous";
  const { limited } = await checkRateLimit(`booking:${ip}`);
  if (limited) return { error: "Trop de tentatives. Veuillez patienter une minute avant de réessayer." };

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

  const [y, m, d] = appointmentDate.split("-").map(Number);
  try {
    await sendPendingEmails({
      clientName,
      clientEmail,
      clientPhone,
      clientAddress,
      serviceNames: cartData.serviceIds.map((id) => SERVICES.find((s) => s.id === id)?.name ?? id).join(", "),
      date:         new Date(y, m - 1, d).toLocaleDateString("fr-BE", { weekday: "long", day: "numeric", month: "long", year: "numeric" }),
      time:         appointmentTime.slice(0, 5),
      totalPrice:   cartData.totalPrice,
      duration:     cartData.totalDuration ? formatDuration(cartData.totalDuration) : undefined,
    });
  } catch (emailError) {
    console.error("Erreur lors de l'envoi de l'e-mail, mais réservation sauvegardée :", emailError);
  }

  return { success: true };
}

export async function approveBooking(id: string): Promise<void> {
  const client = await createActionClient();

  const { data: reservation, error: fetchError } = await client
    .from("reservations").select("*").eq("id", id).single();
  if (fetchError) throw new Error(fetchError.message);

  const { error } = await client.from("reservations").update({ status: "confirmed" }).eq("id", id);
  if (error) throw new Error(error.message);

  try {
    await sendConfirmationEmail(toEmailData(reservation as ReservationRow));
  } catch (emailError) {
    console.error("Erreur envoi confirmation :", emailError);
  }

  revalidatePath("/admin");
}

export async function rejectBooking(id: string): Promise<void> {
  const client = await createActionClient();

  const { data: reservation, error: fetchError } = await client
    .from("reservations").select("*").eq("id", id).single();
  if (fetchError) throw new Error(fetchError.message);

  const { error } = await client.from("reservations").update({ status: "rejected" }).eq("id", id);
  if (error) throw new Error(error.message);

  try {
    await sendRejectionEmail(toEmailData(reservation as ReservationRow));
  } catch (emailError) {
    console.error("Erreur envoi refus :", emailError);
  }

  revalidatePath("/admin");
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
    .from("reservations").select("*").eq("id", id).single();
  if (fetchError) throw new Error(fetchError.message);

  const updatePayload: Record<string, unknown> = { status };
  if (status === "cancelled" && cancellationReason) {
    updatePayload.cancellation_reason = cancellationReason;
  }

  const { error } = await client.from("reservations").update(updatePayload).eq("id", id);
  if (error) throw new Error(error.message);

  if (status === "confirmed" && reservation) {
    try {
      await sendConfirmationEmail(toEmailData(reservation as ReservationRow));
    } catch (emailError) {
      console.error("Erreur envoi confirmation :", emailError);
    }
  }

  revalidatePath("/admin");
}
