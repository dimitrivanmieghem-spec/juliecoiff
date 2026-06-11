"use server";
// app/actions/auth.ts

import { redirect } from "next/navigation";
import { createActionClient } from "@/lib/supabase";

export async function login(
  _prevState: { error: string | null },
  formData: FormData
): Promise<{ error: string | null }> {
  const email = formData.get("email")?.toString().trim();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    return { error: "Identifiants invalides." };
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail || email !== adminEmail) {
    return { error: "Identifiants invalides." };
  }

  const supabase = await createActionClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "Identifiants incorrects." };
  }

  redirect("/admin");
}

export async function logout() {
  const supabase = await createActionClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
