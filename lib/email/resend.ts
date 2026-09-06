import { Resend } from "resend";

let cachedClient: Resend | null | undefined;

export function getResendClient(): Resend | null {
  if (cachedClient !== undefined) return cachedClient;

  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.warn("[resend] RESEND_API_KEY missing — email client disabled.");
    cachedClient = null;
    return cachedClient;
  }

  cachedClient = new Resend(apiKey);
  return cachedClient;
}
