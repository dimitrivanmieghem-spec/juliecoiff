"use server";

import { revalidatePath } from "next/cache";
import { createActionClient } from "@/lib/supabase";

export async function blockTimeSlot(
  formData: FormData
): Promise<{ error: string } | null> {
  const block_date = formData.get("block_date")?.toString();
  const block_time = formData.get("block_time")?.toString();
  const duration   = parseInt(formData.get("duration")?.toString() ?? "0", 10);
  const reason     = formData.get("reason")?.toString().trim() || null;

  if (!block_date || !block_time || !duration) {
    return { error: "Date, heure et durée sont obligatoires." };
  }

  const client = await createActionClient();
  const { error } = await client
    .from("unavailabilities")
    .insert({ block_date, block_time, duration, reason });

  if (error) return { error: error.message };
  revalidatePath("/admin");
  revalidatePath("/");
  return null;
}

export async function deleteBlock(id: string): Promise<void> {
  const client = await createActionClient();
  const { error } = await client.from("unavailabilities").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  revalidatePath("/");
}
