import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") || "";
const FROM_EMAIL = Deno.env.get("FROM_EMAIL") || "Calisthenics Ranked <no-reply@example.com>";
const SITE_NAME = Deno.env.get("SITE_NAME") || "Calisthenics Ranked";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

function normalizeEmail(value: unknown) {
  const email = String(value || "").trim().toLowerCase();
  if (!email || !email.includes("@") || email.startsWith("@") || email.endsWith("@")) return "";
  return email;
}

function decodeJwtPayload(token: string) {
  const parts = token.split(".");
  if (parts.length < 2) return {};

  try {
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
    const json = atob(padded);
    return JSON.parse(json);
  } catch {
    return {};
  }
}

serve(async (request) => {
  if (request.method === "OPTIONS") {
    return jsonResponse({}, 200);
  }

  if (request.method !== "POST") {
    return jsonResponse({ error: "method_not_allowed" }, 405);
  }

  if (!RESEND_API_KEY) {
    return jsonResponse({ error: "missing_resend_api_key" }, 500);
  }

  const authHeader = request.headers.get("Authorization") || request.headers.get("authorization") || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";
  if (!token) {
    return jsonResponse({ error: "missing_authorization" }, 401);
  }

  const claims = decodeJwtPayload(token);
  const jwtEmail = normalizeEmail(claims?.email);
  if (!jwtEmail) {
    return jsonResponse({ error: "invalid_jwt_email" }, 401);
  }

  const payload = await request.json().catch(() => ({}));
  const name = String(payload?.name || "Athlete").trim() || "Athlete";
  const lang = String(payload?.lang || "en").toLowerCase().startsWith("es") ? "es" : "en";
  const submittedAtRaw = String(payload?.submittedAt || "");

  const submittedAt = new Date(submittedAtRaw || Date.now());
  const submittedAtText = Number.isNaN(submittedAt.getTime())
    ? "-"
    : submittedAt.toLocaleString(lang === "es" ? "es-ES" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const subject = lang === "es"
    ? "Confirmación: respuesta registrada"
    : "Confirmation: response registered";

  const text = lang === "es"
    ? `Hola ${name},\n\nTu respuesta se ha registrado correctamente en ${SITE_NAME}.\nFecha de registro: ${submittedAtText}\n\nGracias.`
    : `Hi ${name},\n\nYour response has been registered successfully in ${SITE_NAME}.\nRegistration date: ${submittedAtText}\n\nThank you.`;

  const resendResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: [jwtEmail],
      subject,
      text,
    }),
  });

  if (!resendResponse.ok) {
    const detail = await resendResponse.text().catch(() => "");
    return jsonResponse({ error: "resend_failed", detail }, 502);
  }

  return jsonResponse({ ok: true }, 200);
});
