"use server";

import { z } from "zod";

const contactSchema = z.object({
  name:    z.string().min(2, "Nom trop court"),
  email:   z.string().email("Format d'email invalide"),
  message: z.string().min(10, "Message trop court").max(1000, "Message trop long"),
});

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function sendContactEmail(
  formData: FormData
): Promise<{ success: true } | { error: string }> {
  const raw = {
    name:    formData.get("name")?.toString().trim() ?? "",
    email:   formData.get("email")?.toString().trim() ?? "",
    message: formData.get("message")?.toString().trim() ?? "",
  };

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    const first = Object.values(parsed.error.flatten().fieldErrors).flat()[0];
    return { error: first ?? "Données invalides." };
  }

  const { name, email, message } = parsed.data;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { error: "Service d'envoi non configuré." };

  const { Resend } = await import("resend");
  const resend = new Resend(apiKey);

  const from = process.env.RESEND_FROM_EMAIL ?? "Julie Coiff <onboarding@resend.dev>";

  const { error } = await resend.emails.send({
    from,
    to: "julie.budie@icloud.com",
    replyTo: email,
    subject: `Message de ${escapeHtml(name)} via juliecoiff.be`,
    html: `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#faf8f5;font-family:Arial,sans-serif;">
  <div style="max-width:520px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.07);">
    <div style="background:#b85d38;padding:24px 32px;">
      <h1 style="margin:0;color:#fff;font-size:18px;font-weight:600;">Nouveau message — Julie Coiff</h1>
    </div>
    <div style="padding:28px 32px;font-size:14px;color:#3d2c1e;line-height:1.7;">
      <p><strong>Nom :</strong> ${escapeHtml(name)}</p>
      <p><strong>E-mail :</strong> <a href="mailto:${escapeHtml(email)}" style="color:#b85d38;">${escapeHtml(email)}</a></p>
      <p style="margin-top:20px;"><strong>Message :</strong></p>
      <div style="background:#faf8f5;border-radius:10px;padding:16px;white-space:pre-wrap;">${escapeHtml(message)}</div>
    </div>
    <div style="background:#faf8f5;padding:14px 32px;text-align:center;">
      <p style="margin:0;font-size:11px;color:#b0a090;">Envoyé depuis le formulaire de contact juliecoiff.be</p>
    </div>
  </div>
</body>
</html>`,
  });

  if (error) return { error: error.message };
  return { success: true };
}
