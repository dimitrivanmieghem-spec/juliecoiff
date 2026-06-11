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

export type PortfolioImage = {
  id: string;
  fileName: string;
  url: string;
  position: number;
};

export async function uploadPortfolioImage(
  formData: FormData
): Promise<{ url?: string; fileName?: string; id?: string; error?: string }> {
  const supabase = await createActionClient();
  const file = formData.get("file") as File | null;
  if (!file) return { error: "Aucun fichier sélectionné" };

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const fileName = `${Date.now()}.${ext}`;

  const { error: storageError } = await supabase.storage
    .from(BUCKET)
    .upload(fileName, file, { contentType: file.type, upsert: false });

  if (storageError) return { error: storageError.message };

  const { data: maxPos } = await supabase
    .from("portfolio_images")
    .select("position")
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextPosition = (maxPos?.position ?? -1) + 1;

  const { data: row } = await supabase
    .from("portfolio_images")
    .insert({ file_name: fileName, position: nextPosition })
    .select("id")
    .single();

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(fileName);
  revalidatePath("/");
  return { url: data.publicUrl, fileName, id: row?.id };
}

export async function deletePortfolioImage(
  fileName: string
): Promise<{ success?: boolean; error?: string }> {
  const supabase = await createActionClient();
  const { error } = await supabase.storage.from(BUCKET).remove([fileName]);
  if (error) return { error: error.message };
  await supabase.from("portfolio_images").delete().eq("file_name", fileName);
  revalidatePath("/");
  return { success: true };
}

export async function getPortfolioImages(): Promise<PortfolioImage[]> {
  const supabase = getReadClient();

  const { data: rows, error } = await supabase
    .from("portfolio_images")
    .select("id, file_name, position")
    .order("position", { ascending: true });

  if (!error && rows && rows.length > 0) {
    return rows.map((row: { id: string; file_name: string; position: number }) => ({
      id: row.id,
      fileName: row.file_name,
      url: supabase.storage.from(BUCKET).getPublicUrl(row.file_name).data.publicUrl,
      position: row.position,
    }));
  }

  const { data: files } = await supabase.storage.from(BUCKET).list("", {
    sortBy: { column: "created_at", order: "asc" },
  });
  if (!files) return [];
  return files
    .filter((f) => f.name !== ".emptyFolderPlaceholder")
    .map((f, i) => ({
      id: f.name,
      fileName: f.name,
      url: supabase.storage.from(BUCKET).getPublicUrl(f.name).data.publicUrl,
      position: i,
    }));
}

export async function getPublicPortfolioImages(): Promise<string[]> {
  const images = await getPortfolioImages();
  return images.map((img) => img.url);
}

export async function updateImagesOrder(
  updates: { id: string; position: number }[]
): Promise<{ error?: string }> {
  const supabase = await createActionClient();
  const results = await Promise.all(
    updates.map(({ id, position }) =>
      supabase.from("portfolio_images").update({ position }).eq("id", id)
    )
  );
  const failed = results.find((r) => r.error);
  if (failed?.error) return { error: failed.error.message };
  revalidatePath("/");
  return {};
}

export async function syncPortfolioImages(): Promise<void> {
  const supabase = await createActionClient();

  const { data: files } = await supabase.storage.from(BUCKET).list("", {
    sortBy: { column: "created_at", order: "asc" },
  });
  if (!files) return;

  const validFiles = files.filter((f) => f.name !== ".emptyFolderPlaceholder");
  const { data: existing } = await supabase
    .from("portfolio_images")
    .select("file_name");

  const existingNames = new Set(
    (existing ?? []).map((r: { file_name: string }) => r.file_name)
  );
  const missing = validFiles.filter((f) => !existingNames.has(f.name));
  if (missing.length === 0) return;

  const { data: maxPos } = await supabase
    .from("portfolio_images")
    .select("position")
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();

  let nextPos = (maxPos?.position ?? -1) + 1;
  for (const file of missing) {
    await supabase
      .from("portfolio_images")
      .insert({ file_name: file.name, position: nextPos++ });
  }
}
