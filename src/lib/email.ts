import 'server-only'

// Resend transactional email for KV registrations.
// Domain weeks.cz is verified in Resend (eu-west-1). From defaults to a real
// inbox so replies reach the team.

const RESEND_URL = 'https://api.resend.com/emails'

interface EmailConfig {
  apiKey: string
  from: string
}

function getConfig(): EmailConfig | null {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return null
  return {
    apiKey,
    from: process.env.RESEND_FROM || 'Weeks <info@weeks.cz>',
  }
}

export function isEmailConfigured(): boolean {
  return getConfig() !== null
}

export async function sendEmail(params: {
  to: string
  subject: string
  html: string
  replyTo?: string
}): Promise<void> {
  const cfg = getConfig()
  if (!cfg) throw new Error('Resend not configured (RESEND_API_KEY missing)')
  const res = await fetch(RESEND_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${cfg.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: cfg.from,
      to: [params.to],
      subject: params.subject,
      html: params.html,
      reply_to: params.replyTo || 'info@weeks.cz',
    }),
  })
  if (!res.ok) {
    throw new Error(`Resend send failed: ${res.status} ${await res.text()}`)
  }
}

// ── Templates (pure, testable) ────────────────────────────────────────────────

function layout(title: string, bodyHtml: string): string {
  return `<!DOCTYPE html>
<html lang="cs"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;background:#f1f5f9;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#0f172a;">
  <div style="max-width:560px;margin:0 auto;padding:24px 16px;">
    <div style="background:#fff;border-radius:16px;border:1px solid #e2e8f0;padding:28px;">
      <h1 style="font-size:20px;margin:0 0 16px;color:#4f46e5;">${title}</h1>
      ${bodyHtml}
    </div>
    <p style="text-align:center;color:#94a3b8;font-size:12px;margin-top:16px;">
      Weeks · IT tábory pro děti · <a href="https://weeks.cz" style="color:#94a3b8;">weeks.cz</a> · info@weeks.cz · +420 703 046 440
    </p>
  </div>
</body></html>`
}

export interface ConfirmationParams {
  childName: string
  programName: string
  termLabel: string
  locationName: string
  priceKc: number
}

export function buildConfirmationEmail(p: ConfirmationParams): { subject: string; html: string } {
  const body = `
    <p>Dobrý den,</p>
    <p>děkujeme za registraci a potvrzujeme přijetí platby. Místo pro <strong>${p.childName}</strong> je závazně rezervované.</p>
    <table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:14px;">
      <tr><td style="padding:6px 0;color:#64748b;">Tábor</td><td style="padding:6px 0;text-align:right;font-weight:600;">${p.programName}</td></tr>
      <tr><td style="padding:6px 0;color:#64748b;">Místo</td><td style="padding:6px 0;text-align:right;font-weight:600;">${p.locationName}</td></tr>
      <tr><td style="padding:6px 0;color:#64748b;">Termín</td><td style="padding:6px 0;text-align:right;font-weight:600;">${p.termLabel}</td></tr>
      <tr><td style="padding:6px 0;color:#64748b;">Uhrazeno</td><td style="padding:6px 0;text-align:right;font-weight:600;">${p.priceKc.toLocaleString('cs-CZ')} Kč</td></tr>
    </table>
    <p><strong>Daňový doklad</strong> obdržíte v samostatném e-mailu.</p>
    <p>Přibližně <strong>týden před táborem</strong> vám pošleme <strong>nástupní list</strong> s podrobnostmi (čas a místo nástupu, co s sebou).</p>
    <p>S pozdravem,<br>tým Weeks</p>`
  return {
    subject: `Potvrzení registrace – ${p.programName}`,
    html: layout('Registrace potvrzena 🎉', body),
  }
}

export interface RegistrationReceivedParams {
  childName: string
  programName: string
  termLabel: string
  locationName: string
  priceKc: number
  paymentUrl: string
}

// Sent immediately after a registration is created (before payment). Distinct from
// buildConfirmationEmail, which goes out only AFTER the payment settles. The point
// is to close the "am I even registered?" gap: the parent gets instant proof we
// have the registration, plus a clear path to pay. Spot is reserved only on payment.
export function buildRegistrationReceivedEmail(p: RegistrationReceivedParams): { subject: string; html: string } {
  const body = `
    <p>Dobrý den,</p>
    <p>děkujeme za registraci, máme ji u nás uloženou. Aby bylo místo pro <strong>${p.childName}</strong> závazně rezervované, zbývá poslední krok: <strong>dokončit platbu</strong>. Kapacita je omezená, místo proto rezervujeme až po přijetí platby.</p>
    <p style="text-align:center;margin:24px 0;">
      <a href="${p.paymentUrl}" style="display:inline-block;background:#4f46e5;color:#fff;text-decoration:none;font-weight:600;padding:12px 28px;border-radius:10px;">Zaplatit a rezervovat místo</a>
    </p>
    <table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:14px;">
      <tr><td style="padding:6px 0;color:#64748b;">Tábor</td><td style="padding:6px 0;text-align:right;font-weight:600;">${p.programName}</td></tr>
      <tr><td style="padding:6px 0;color:#64748b;">Místo</td><td style="padding:6px 0;text-align:right;font-weight:600;">${p.locationName}</td></tr>
      <tr><td style="padding:6px 0;color:#64748b;">Termín</td><td style="padding:6px 0;text-align:right;font-weight:600;">${p.termLabel}</td></tr>
      <tr><td style="padding:6px 0;color:#64748b;">Cena</td><td style="padding:6px 0;text-align:right;font-weight:600;">${p.priceKc.toLocaleString('cs-CZ')} Kč</td></tr>
    </table>
    <p style="font-size:14px;color:#475569;">Po zaplacení vám obratem přijde <strong>potvrzení a daňový doklad</strong>. Přibližně týden před táborem pošleme <strong>nástupní list</strong> s podrobnostmi.</p>
    <p style="font-size:13px;color:#94a3b8;">Pokud jste se neregistrovali vy nebo si to rozmyslíte, nemusíte nic řešit, bez platby registrace po čase propadne.</p>
    <p>S pozdravem,<br>tým Weeks</p>`
  return {
    subject: `Máme vaši registraci – zbývá dokončit platbu`,
    html: layout('Registrace přijata ✅', body),
  }
}

export interface NastupniListParams {
  childName: string
  programName: string
  termLabel: string
  venueName: string
  venueAddress: string
  contactPhone: string
  contactEmail: string
}

export function buildNastupniListEmail(p: NastupniListParams): { subject: string; html: string } {
  const body = `
    <p>Dobrý den,</p>
    <p>blíží se termín tábora, na který je <strong>${p.childName}</strong> přihlášen/a. Posíláme nástupní list s praktickými informacemi.</p>
    <table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:14px;">
      <tr><td style="padding:6px 0;color:#64748b;">Tábor</td><td style="padding:6px 0;text-align:right;font-weight:600;">${p.programName}</td></tr>
      <tr><td style="padding:6px 0;color:#64748b;">Termín</td><td style="padding:6px 0;text-align:right;font-weight:600;">${p.termLabel}</td></tr>
      <tr><td style="padding:6px 0;color:#64748b;">Čas</td><td style="padding:6px 0;text-align:right;font-weight:600;">8:00 – 16:00</td></tr>
      <tr><td style="padding:6px 0;color:#64748b;">Místo</td><td style="padding:6px 0;text-align:right;font-weight:600;">${p.venueName}<br>${p.venueAddress}</td></tr>
    </table>
    <p style="font-weight:600;margin-bottom:4px;">Co s sebou:</p>
    <ul style="margin:0 0 16px;padding-left:20px;font-size:14px;line-height:1.6;">
      <li>přezůvky</li>
      <li>svačinu a pití (oběd zajištěn)</li>
      <li>pohodlné oblečení</li>
    </ul>
    <p>V případě nemoci nebo dotazů nám dejte vědět na ${p.contactEmail} nebo ${p.contactPhone}.</p>
    <p>Těšíme se na vaše dítě!<br>tým Weeks</p>`
  return {
    subject: `Nástupní list – ${p.programName} (${p.termLabel})`,
    html: layout('Nástupní list 🎒', body),
  }
}

export interface PaymentReminderParams {
  childName: string
  programName: string
  locationName: string
  termLabel: string
  priceKc: number
  paymentUrl: string
}

export function buildPaymentReminderEmail(p: PaymentReminderParams): { subject: string; html: string } {
  const body = `
    <p>Dobrý den,</p>
    <p>děkujeme za zájem o náš <strong>${p.programName}</strong> v ${p.locationName}. Registraci pro <strong>${p.childName}</strong> máme rozepsanou, ale zatím u ní nevidíme dokončenou platbu. Místo se rezervuje až po zaplacení (volná místa se obsazují průběžně).</p>
    <p>Dokončit ji můžete jedním kliknutím:</p>
    <p style="text-align:center;margin:24px 0;">
      <a href="${p.paymentUrl}" style="display:inline-block;background:#4f46e5;color:#fff;text-decoration:none;font-weight:600;padding:12px 28px;border-radius:10px;">Dokončit platbu</a>
    </p>
    <table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:14px;">
      <tr><td style="padding:6px 0;color:#64748b;">Termín</td><td style="padding:6px 0;text-align:right;font-weight:600;">${p.termLabel}</td></tr>
      <tr><td style="padding:6px 0;color:#64748b;">Cena</td><td style="padding:6px 0;text-align:right;font-weight:600;">${p.priceKc.toLocaleString('cs-CZ')} Kč</td></tr>
    </table>
    <p>Pokud už o místo nemáte zájem, nic neřešte — stačí tento e-mail ignorovat.</p>
    <p>S pozdravem,<br>tým Weeks</p>`
  return {
    subject: `Dokončení registrace – ${p.programName}`,
    html: layout('Dokončení registrace', body),
  }
}
