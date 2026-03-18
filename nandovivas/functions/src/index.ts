import { setGlobalOptions } from "firebase-functions";
import { onRequest } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import * as nodemailer from "nodemailer";

setGlobalOptions({ maxInstances: 10 });

const gmailUser = defineSecret("GMAIL_USER");
const gmailPass = defineSecret("GMAIL_APP_PASSWORD");

export const sendContactEmail = onRequest(
  { secrets: [gmailUser, gmailPass], invoker: "public" },
  async (req, res) => {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
      res.status(204).send("");
      return;
    }

    if (req.method !== "POST") {
      res.status(405).send("Method Not Allowed");
      return;
    }

    let body = req.body;
    if (typeof body === "string") {
      try { body = JSON.parse(body); } catch { body = {}; }
    } else if (Buffer.isBuffer(body)) {
      try { body = JSON.parse(body.toString()); } catch { body = {}; }
    }
    const { fromEmail, subject, message } = body || {};

    if (!fromEmail || !subject || !message) {
      res.status(400).json({ error: "Faltan campos obligatorios" });
      return;
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: gmailUser.value(),
        pass: gmailPass.value(),
      },
    });

    try {
      await transporter.sendMail({
        from: `"Portfolio Nando Vivas" <${gmailUser.value()}>`,
        to: gmailUser.value(),
        replyTo: fromEmail,
        subject: `[Web] ${subject}`,
        text: `De: ${fromEmail}\n\n${message}\n\n---\nMensaje enviado desde nandovivas.com`,
        html: `<p><strong>De:</strong> ${fromEmail}</p><p>${message.replace(/\n/g, "<br>")}</p><hr><p style="color:#999;font-size:12px;">Mensaje enviado desde <a href="https://nandovivas.com">nandovivas.com</a></p>`,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      res.status(500).json({ error: "Error al enviar el email", detail: message });
      return;
    }

    res.json({ success: true });
  }
);
