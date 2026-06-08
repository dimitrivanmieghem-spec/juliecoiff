"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM    = "onboarding@resend.dev";
const REPLY_TO = "julie.budie@icloud.com";
const ACCENT  = "#b85d38";

export interface BookingEmailData {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: string;
  serviceNames: string;
  date: string;
  time: string;
  totalPrice: number;
  duration?: string;
}

export async function sendBookingEmails(data: BookingEmailData): Promise<void> {
  const priceStr = Number(data.totalPrice).toFixed(2);

  const tableRows = `
    <tr style="border-bottom:1px solid #ede6df;">
      <td style="padding:11px 0;color:#8a7565;font-size:13px;font-weight:500;">Prestation</td>
      <td style="padding:11px 0;text-align:right;font-size:13px;color:#3d2c1e;">${data.serviceNames}</td>
    </tr>
    <tr style="border-bottom:1px solid #ede6df;">
      <td style="padding:11px 0;color:#8a7565;font-size:13px;font-weight:500;">Date</td>
      <td style="padding:11px 0;text-align:right;font-size:13px;font-weight:600;color:#3d2c1e;text-transform:capitalize;">${data.date}</td>
    </tr>
    <tr style="border-bottom:1px solid #ede6df;">
      <td style="padding:11px 0;color:#8a7565;font-size:13px;font-weight:500;">Heure</td>
      <td style="padding:11px 0;text-align:right;font-size:13px;font-weight:600;color:#3d2c1e;">${data.time}</td>
    </tr>
    ${data.duration ? `
    <tr style="border-bottom:1px solid #ede6df;">
      <td style="padding:11px 0;color:#8a7565;font-size:13px;font-weight:500;">Durée estimée</td>
      <td style="padding:11px 0;text-align:right;font-size:13px;color:#3d2c1e;">${data.duration}</td>
    </tr>` : ""}
    <tr style="border-bottom:1px solid #ede6df;">
      <td style="padding:11px 0;color:#8a7565;font-size:13px;font-weight:500;">Adresse</td>
      <td style="padding:11px 0;text-align:right;font-size:13px;color:#3d2c1e;">${data.clientAddress}</td>
    </tr>
    <tr>
      <td style="padding:11px 0;color:#8a7565;font-size:13px;font-weight:500;">Prix total</td>
      <td style="padding:11px 0;text-align:right;font-size:17px;font-weight:700;color:${ACCENT};">${priceStr} €</td>
    </tr>
  `;

  const clientHtml = `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#faf8f5;font-family:'Georgia',serif;">
  <div style="max-width:520px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08);">
    <div style="background:${ACCENT};padding:32px 40px;text-align:center;">
      <h1 style="margin:0;color:#fff;font-size:24px;font-weight:400;letter-spacing:.5px;">Julie Coiff</h1>
      <p style="margin:8px 0 0;color:rgba(255,255,255,.85);font-size:13px;font-family:sans-serif;">Coiffeuse à domicile</p>
    </div>
    <div style="padding:36px 40px;">
      <p style="font-size:15px;color:#3d2c1e;margin:0 0 8px;">Bonjour <strong>${data.clientName}</strong>,</p>
      <p style="font-size:15px;color:#3d2c1e;margin:0 0 28px;line-height:1.6;">
        Votre demande de rendez-vous a bien été reçue. Julie vous contactera pour confirmer le créneau.
      </p>

      <div style="background:#faf8f5;border-radius:12px;padding:20px 24px;margin-bottom:28px;">
        <table style="width:100%;border-collapse:collapse;">
          ${tableRows}
        </table>
      </div>

      <div style="background:#fff4f0;border-left:3px solid ${ACCENT};border-radius:0 8px 8px 0;padding:16px 20px;margin-bottom:28px;">
        <p style="margin:0;font-size:13px;color:#3d2c1e;font-family:sans-serif;line-height:1.7;">
          <strong>Ne vous souciez de rien : Julie arrivera avec son matériel professionnel et son bac à shampoing. Détendez-vous, elle s'occupe de tout !</strong>
        </p>
      </div>

      <p style="font-size:13px;color:#8a7565;font-family:sans-serif;line-height:1.6;margin:0 0 6px;">
        En cas d'empêchement, merci de prévenir au moins 24h à l'avance.
      </p>
      <p style="font-size:13px;color:#8a7565;font-family:sans-serif;margin:0;">
        À très bientôt,<br><strong style="color:#3d2c1e;">Julie</strong>
      </p>
    </div>
    <div style="background:#faf8f5;padding:16px 40px;text-align:center;">
      <p style="margin:0;font-size:11px;color:#b0a090;font-family:sans-serif;">Julie Coiff · Coiffeuse à domicile · Seneffe, Belgique</p>
    </div>
  </div>
</body>
</html>`;

  const adminHtml = `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:sans-serif;">
  <div style="max-width:520px;margin:32px auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.08);">
    <div style="background:#3d2c1e;padding:20px 32px;">
      <h1 style="margin:0;color:#fff;font-size:18px;font-weight:600;">📅 Nouveau rendez-vous</h1>
    </div>
    <div style="padding:28px 32px;">
      <table style="width:100%;border-collapse:collapse;font-size:14px;color:#3d2c1e;">
        <tr style="border-bottom:1px solid #eee;">
          <td style="padding:10px 0;color:#888;font-weight:500;width:40%;">Nom</td>
          <td style="padding:10px 0;font-weight:600;">${data.clientName}</td>
        </tr>
        <tr style="border-bottom:1px solid #eee;">
          <td style="padding:10px 0;color:#888;font-weight:500;">Email</td>
          <td style="padding:10px 0;"><a href="mailto:${data.clientEmail}" style="color:${ACCENT};">${data.clientEmail}</a></td>
        </tr>
        <tr style="border-bottom:1px solid #eee;">
          <td style="padding:10px 0;color:#888;font-weight:500;">Téléphone</td>
          <td style="padding:10px 0;"><a href="tel:${data.clientPhone}" style="color:${ACCENT};">${data.clientPhone}</a></td>
        </tr>
        <tr style="border-bottom:1px solid #eee;">
          <td style="padding:10px 0;color:#888;font-weight:500;">Prestation</td>
          <td style="padding:10px 0;">${data.serviceNames}</td>
        </tr>
        <tr style="border-bottom:1px solid #eee;">
          <td style="padding:10px 0;color:#888;font-weight:500;">Date</td>
          <td style="padding:10px 0;font-weight:600;text-transform:capitalize;">${data.date} à ${data.time}</td>
        </tr>
        <tr style="border-bottom:1px solid #eee;">
          <td style="padding:10px 0;color:#888;font-weight:500;">Adresse</td>
          <td style="padding:10px 0;">${data.clientAddress}</td>
        </tr>
        <tr>
          <td style="padding:10px 0;color:#888;font-weight:500;">Prix total</td>
          <td style="padding:10px 0;font-size:16px;font-weight:700;color:${ACCENT};">${priceStr} €</td>
        </tr>
      </table>
    </div>
  </div>
</body>
</html>`;

  await Promise.all([
    resend.emails.send({
      from: FROM,
      replyTo: REPLY_TO,
      to: data.clientEmail,
      subject: "Confirmation de votre rendez-vous — Julie Coiff",
      html: clientHtml,
    }),
    resend.emails.send({
      from: FROM,
      replyTo: REPLY_TO,
      to: process.env.ADMIN_EMAIL ?? REPLY_TO,
      subject: `📅 NOUVEAU RENDEZ-VOUS : ${data.clientName}`,
      html: adminHtml,
    }),
  ]);
}
