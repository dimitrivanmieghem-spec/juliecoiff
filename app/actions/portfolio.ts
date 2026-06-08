"use server";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createActionClient } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

const BUCKET = "portfolio";

function getReadClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function uploadPortfolioImage(formData: FormData): Promise<{ url?: string; fileName?: string; error?: string }> {
  const supabase = await createActionClient();
  const file = formData.get("file") as File | null;
  if (!file) return { error: "Aucun fichier sélectionné" };

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const fileName = `${Date.now()}.${ext}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(fileName, file, { contentType: file.type, upsert: false });

  if (error) return { error: error.message };

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(fileName);
  revalidatePath("/");
  return { url: data.publicUrl, fileName };
}

export async function deletePortfolioImage(fileName: string): Promise<{ success?: boolean; error?: string }> {
  const supabase = await createActionClient();
  const { error } = await supabase.storage.from(BUCKET).remove([fileName]);
  if (error) return { error: error.message };
  revalidatePath("/");
  return { success: true };
}

export async function getPortfolioImages(): Promise<{ url: string; fileName: string }[]> {
  const supabase = getReadClient();
  const { data, error } = await supabase.storage.from(BUCKET).list("", {
    sortBy: { column: "created_at", order: "asc" },
  });

  if (error || !data) return [];

  return data
    .filter((f) => f.name !== ".emptyFolderPlaceholder")
    .map((f) => ({
      fileName: f.name,
      url: supabase.storage.from(BUCKET).getPublicUrl(f.name).data.publicUrl,
    }));
}

export async function getPublicPortfolioImages(): Promise<string[]> {
  const supabase = getReadClient();
  const { data, error } = await supabase.storage.from(BUCKET).list("", {
    sortBy: { column: "created_at", order: "asc" },
  });

  if (error || !data) return [];

  return data
    .filter((f) => f.name !== ".emptyFolderPlaceholder")
    .map((f) => supabase.storage.from(BUCKET).getPublicUrl(f.name).data.publicUrl);
}
