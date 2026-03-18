import { setGlobalOptions } from "firebase-functions";
import { onCall, HttpsError } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import * as nodemailer from "nodemailer";

setGlobalOptions({ maxInstances: 10 });

const gmailUser = defineSecret("GMAIL_USER");
const gmailPass = defineSecret("GMAIL_APP_PASSWORD");

export const sendContactEmail = onCall(
  { secrets: [gmailUser, gmailPass] },
  async (request) => {
    const { fromEmail, subject, message } = request.data;

    if (!fromEmail || !subject || !message) {
      throw new HttpsError("invalid-argument", "Faltan campos obligatorios");
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: gmailUser.value(),
        pass: gmailPass.value(),
      },
    });

    await transporter.sendMail({
      from: `"Portfolio Nando Vivas" <${gmailUser.value()}>`,
      to: gmailUser.value(),
      replyTo: fromEmail,
      subject: `[Web] ${subject}`,
      text: `De: ${fromEmail}\n\n${message}`,
      html: `<p><strong>De:</strong> ${fromEmail}</p><p>${message.replace(/\n/g, "<br>")}</p>`,
    });

    return { success: true };
  }
);
