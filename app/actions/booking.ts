"use server";

import { revalidatePath } from "next/cache";
import { supabase, createActionClient } from "@/lib/supabase";

interface CartData {
  serviceIds: string[];
  totalPrice: number;
  totalDuration: number;
  cityName: string;
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

export async function updateReservationStatus(id: string, status: string): Promise<void> {
  const client = await createActionClient();
  const { error } = await client.from("reservations").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}
