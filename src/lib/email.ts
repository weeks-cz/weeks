import 'server-only'
import { PROVOZNI_DOBA } from './site'
import { formatDatumCs } from './dates'

/**
 * Escapuje text pro HTML, včetně uvozovek (hodnoty jdou i do atributu href).
 * Každý údaj od rodiče nebo z dat, který se dostane do šablony, musí projít tudy.
 */
export function esc(v: string): string {
  return v
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

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
    <p>děkujeme za registraci a potvrzujeme přijetí platby. Místo pro <strong>${esc(p.childName)}</strong> je závazně rezervované.</p>
    <table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:14px;">
      <tr><td style="padding:6px 0;color:#64748b;">Tábor</td><td style="padding:6px 0;text-align:right;font-weight:600;">${esc(p.programName)}</td></tr>
      <tr><td style="padding:6px 0;color:#64748b;">Místo</td><td style="padding:6px 0;text-align:right;font-weight:600;">${esc(p.locationName)}</td></tr>
      <tr><td style="padding:6px 0;color:#64748b;">Termín</td><td style="padding:6px 0;text-align:right;font-weight:600;">${esc(p.termLabel)}</td></tr>
      <tr><td style="padding:6px 0;color:#64748b;">Uhrazeno</td><td style="padding:6px 0;text-align:right;font-weight:600;">${p.priceKc.toLocaleString('cs-CZ')} Kč</td></tr>
    </table>
    <p><strong>Fakturu</strong> vám zašleme v samostatném e-mailu do 14 dnů od platby.</p>
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
  /** Záloha, pokud je ještě dostupná; jinak `null` a e-mail ji nezmiňuje. */
  zalohaKc?: number | null
  paymentUrl: string
}

/** Cena s řádkem „nebo záloha …“ — jen když je záloha opravdu dostupná. */
function cenaSZalohou(priceKc: number, zalohaKc: number | null | undefined): string {
  const cena = `${priceKc.toLocaleString('cs-CZ')} Kč`
  if (!zalohaKc) return cena
  return `${cena}<br><span style="font-weight:400;color:#64748b;">nebo záloha ${zalohaKc.toLocaleString('cs-CZ')} Kč</span>`
}

// Sent immediately after a registration is created (before payment). Distinct from
// buildConfirmationEmail, which goes out only AFTER the payment settles. The point
// is to close the "am I even registered?" gap: the parent gets instant proof we
// have the registration, plus a clear path to pay. Spot is reserved only on payment.
export function buildRegistrationReceivedEmail(p: RegistrationReceivedParams): { subject: string; html: string } {
  const body = `
    <p>Dobrý den,</p>
    <p>děkujeme za registraci, máme ji u nás uloženou. Aby bylo místo pro <strong>${esc(p.childName)}</strong> závazně rezervované, zbývá poslední krok: <strong>dokončit platbu</strong>. Kapacita je omezená, místo proto rezervujeme až po přijetí platby.</p>
    <p style="text-align:center;margin:24px 0;">
      <a href="${esc(p.paymentUrl)}" style="display:inline-block;background:#4f46e5;color:#fff;text-decoration:none;font-weight:600;padding:12px 28px;border-radius:10px;">Zaplatit a rezervovat místo</a>
    </p>
    <table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:14px;">
      <tr><td style="padding:6px 0;color:#64748b;">Tábor</td><td style="padding:6px 0;text-align:right;font-weight:600;">${esc(p.programName)}</td></tr>
      <tr><td style="padding:6px 0;color:#64748b;">Místo</td><td style="padding:6px 0;text-align:right;font-weight:600;">${esc(p.locationName)}</td></tr>
      <tr><td style="padding:6px 0;color:#64748b;">Termín</td><td style="padding:6px 0;text-align:right;font-weight:600;">${esc(p.termLabel)}</td></tr>
      <tr><td style="padding:6px 0;color:#64748b;">Cena</td><td style="padding:6px 0;text-align:right;font-weight:600;">${cenaSZalohou(p.priceKc, p.zalohaKc)}</td></tr>
    </table>
    <p style="font-size:14px;color:#475569;">Po zaplacení vám obratem přijde <strong>potvrzení</strong>, fakturu zašleme do 14 dnů. Přibližně týden před táborem pošleme <strong>nástupní list</strong> s podrobnostmi.</p>
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

/**
 * Nástupní list.
 *
 * Provozní doba se bere z `PROVOZNI_DOBA` (`site.ts`) — stejně jako na /kontakt,
 * /tabory, v sekci „Co máte jisté“ na úvodce a v §18 VOP. Dřív tu stálo 8:00 – 16:00, jenže VOP
 * (§24) opravňují pořadatele účtovat 150 Kč za každých započatých 30 minut po
 * skončení programu: rodič se řídil e-mailem, pořadatel VOP a rozcházeli se
 * o hodinu, za kterou padala pokuta.
 *
 * Seznam povinných dokumentů je doslovně převzatý z §27 VOP
 * (`src/app/podminky/page.tsx`) — VOP je slibují rodiči právě v nástupním
 * listu, takže se tahle dvě místa nesmí rozejít. Formulace se tu nevymýšlí
 * nová; když se změní §27, musí se změnit i tahle šablona.
 */
export function buildNastupniListEmail(p: NastupniListParams): { subject: string; html: string } {
  const body = `
    <p>Dobrý den,</p>
    <p>blíží se termín tábora, na který je <strong>${esc(p.childName)}</strong> přihlášen/a. Posíláme nástupní list s praktickými informacemi.</p>
    <table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:14px;">
      <tr><td style="padding:6px 0;color:#64748b;">Tábor</td><td style="padding:6px 0;text-align:right;font-weight:600;">${esc(p.programName)}</td></tr>
      <tr><td style="padding:6px 0;color:#64748b;">Termín</td><td style="padding:6px 0;text-align:right;font-weight:600;">${esc(p.termLabel)}</td></tr>
      <tr><td style="padding:6px 0;color:#64748b;">Čas</td><td style="padding:6px 0;text-align:right;font-weight:600;">${PROVOZNI_DOBA.od} – ${PROVOZNI_DOBA.do}</td></tr>
      <tr><td style="padding:6px 0;color:#64748b;">Místo</td><td style="padding:6px 0;text-align:right;font-weight:600;">${esc(p.venueName)}<br>${esc(p.venueAddress)}</td></tr>
    </table>
    <p style="font-weight:600;margin-bottom:4px;">Co s sebou:</p>
    <ul style="margin:0 0 16px;padding-left:20px;font-size:14px;line-height:1.6;">
      <li>přezůvky</li>
      <li>svačinu a pití (oběd zajištěn)</li>
      <li>pohodlné oblečení</li>
    </ul>
    <p style="font-weight:600;margin-bottom:4px;">Povinné dokumenty při nástupu:</p>
    <ul style="margin:0 0 8px;padding-left:20px;font-size:14px;line-height:1.6;">
      <li>vlastnoručně podepsané <strong>Prohlášení o bezinfekčnosti</strong> (ne starší než 1 den)</li>
      <li><strong>kopii průkazu zdravotní pojišťovny</strong> dítěte</li>
    </ul>
    <p style="font-size:14px;color:#475569;margin:0 0 16px;">
      Oba dokumenty předá zákonný zástupce v den nástupu vedoucímu tábora. Bez jejich
      předání nemůže být dítěti umožněna účast na táboře.
    </p>
    <p>V případě nemoci nebo dotazů nám dejte vědět na ${esc(p.contactEmail)} nebo ${esc(p.contactPhone)}.</p>
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
  /** Záloha, pokud je ještě dostupná (`zalohaDostupna`); jinak `null`. */
  zalohaKc?: number | null
  paymentUrl: string
}

/**
 * Upomínka na nedokončenou platbu.
 *
 * Město se schválně neskloňuje. Dřív tu stálo „v ${'${p.locationName}'}", což
 * u nominativu z `LOCATIONS` vyrobilo „v Praha" — past, kterou popisuje
 * komentář u `getVenuesSentence` v `src/lib/site.ts`. Řešením není
 * skloňovací tabulka, ale věta, která pád nepotřebuje: město je proto
 * v tabulce jako samostatný řádek, stejně jako v potvrzení registrace.
 */
export function buildPaymentReminderEmail(p: PaymentReminderParams): { subject: string; html: string } {
  const body = `
    <p>Dobrý den,</p>
    <p>děkujeme za zájem o náš <strong>${esc(p.programName)}</strong>. Registraci pro <strong>${esc(p.childName)}</strong> máme rozepsanou, ale zatím u ní nevidíme dokončenou platbu. Místo se rezervuje až po zaplacení (volná místa se obsazují průběžně).</p>
    <p>Dokončit ji můžete jedním kliknutím:</p>
    <p style="text-align:center;margin:24px 0;">
      <a href="${esc(p.paymentUrl)}" style="display:inline-block;background:#4f46e5;color:#fff;text-decoration:none;font-weight:600;padding:12px 28px;border-radius:10px;">Dokončit platbu</a>
    </p>
    <table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:14px;">
      <tr><td style="padding:6px 0;color:#64748b;">Místo</td><td style="padding:6px 0;text-align:right;font-weight:600;">${esc(p.locationName)}</td></tr>
      <tr><td style="padding:6px 0;color:#64748b;">Termín</td><td style="padding:6px 0;text-align:right;font-weight:600;">${esc(p.termLabel)}</td></tr>
      <tr><td style="padding:6px 0;color:#64748b;">Cena</td><td style="padding:6px 0;text-align:right;font-weight:600;">${cenaSZalohou(p.priceKc, p.zalohaKc)}</td></tr>
    </table>
    <p>Pokud už o místo nemáte zájem, nic neřešte — stačí tento e-mail ignorovat.</p>
    <p>S pozdravem,<br>tým Weeks</p>`
  return {
    subject: `Dokončení registrace – ${p.programName}`,
    html: layout('Dokončení registrace', body),
  }
}

// ── Záloha a doplatek ─────────────────────────────────────────────────────────

export interface ZalohaConfirmationParams {
  childName: string
  programName: string
  termLabel: string
  locationName: string
  /** Kolik rodič právě zaplatil (záloha). */
  zaplaceno: number
  /** Kolik zbývá doplatit. */
  zbyvaKc: number
  /** ISO datum splatnosti doplatku. */
  doplatekDo: string
  doplatekUrl: string
}

/**
 * Potvrzení po zaplacení zálohy. Odesílá se jen u první platby (stejný claim
 * jako `buildConfirmationEmail`), takže nahrazuje plné potvrzení, ne ho doplňuje.
 */
export function buildConfirmationZalohaEmail(p: ZalohaConfirmationParams): { subject: string; html: string } {
  const body = `
    <p>Dobrý den,</p>
    <p>děkujeme, záloha pro <strong>${esc(p.childName)}</strong> je přijatá. Místo je závazně rezervované.</p>
    <table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:14px;">
      <tr><td style="padding:6px 0;color:#64748b;">Tábor</td><td style="padding:6px 0;text-align:right;font-weight:600;">${esc(p.programName)}</td></tr>
      <tr><td style="padding:6px 0;color:#64748b;">Místo</td><td style="padding:6px 0;text-align:right;font-weight:600;">${esc(p.locationName)}</td></tr>
      <tr><td style="padding:6px 0;color:#64748b;">Termín</td><td style="padding:6px 0;text-align:right;font-weight:600;">${esc(p.termLabel)}</td></tr>
      <tr><td style="padding:6px 0;color:#64748b;">Uhrazeno</td><td style="padding:6px 0;text-align:right;font-weight:600;">${p.zaplaceno.toLocaleString('cs-CZ')} Kč</td></tr>
      <tr><td style="padding:6px 0;color:#64748b;">Zbývá</td><td style="padding:6px 0;text-align:right;font-weight:600;">${p.zbyvaKc.toLocaleString('cs-CZ')} Kč do ${formatDatumCs(p.doplatekDo)}</td></tr>
    </table>
    <p style="text-align:center;margin:24px 0;">
      <a href="${esc(p.doplatekUrl)}" style="display:inline-block;background:#4f46e5;color:#fff;text-decoration:none;font-weight:600;padding:12px 28px;border-radius:10px;">Doplatit ${p.zbyvaKc.toLocaleString('cs-CZ')} Kč</a>
    </p>
    <p><strong>Fakturu</strong> za zálohu vám zašleme do 14 dnů od platby. Fakturu za doplatek pošleme zvlášť, až ho přijmeme.</p>
    <p>Doplatek vám připomeneme e-mailem předem. Přibližně týden před táborem pošleme <strong>nástupní list</strong>, ale až po úplné úhradě.</p>
    <p>S pozdravem,<br>tým Weeks</p>`
  return {
    subject: `Záloha přijata – ${p.programName}`,
    html: layout('Záloha přijata 🎉', body),
  }
}

export interface DoplatekReceivedParams {
  childName: string
  programName: string
  termLabel: string
  /** Částka doplatku, která právě přišla. */
  doplatekKc: number
}

/** Potvrzení přijatého doplatku. Místo je tím uhrazené celé. */
export function buildDoplatekPrijatEmail(p: DoplatekReceivedParams): { subject: string; html: string } {
  const body = `
    <p>Dobrý den,</p>
    <p>přijali jsme doplatek <strong>${p.doplatekKc.toLocaleString('cs-CZ')} Kč</strong> za <strong>${esc(p.childName)}</strong>. Místo na táboře je tím uhrazené celé.</p>
    <table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:14px;">
      <tr><td style="padding:6px 0;color:#64748b;">Tábor</td><td style="padding:6px 0;text-align:right;font-weight:600;">${esc(p.programName)}</td></tr>
      <tr><td style="padding:6px 0;color:#64748b;">Termín</td><td style="padding:6px 0;text-align:right;font-weight:600;">${esc(p.termLabel)}</td></tr>
    </table>
    <p><strong>Fakturu</strong> za doplatek vám zašleme do 14 dnů od platby.</p>
    <p>Přibližně týden před táborem vám pošleme <strong>nástupní list</strong> s praktickými informacemi.</p>
    <p>S pozdravem,<br>tým Weeks</p>`
  return {
    subject: `Doplatek přijat – ${p.programName}`,
    html: layout('Doplatek přijat ✅', body),
  }
}

export interface DoplatekReminderParams {
  childName: string
  programName: string
  termLabel: string
  zbyvaKc: number
  /** ISO datum splatnosti. */
  doplatekDo: string
  paymentUrl: string
}

/**
 * Připomínka doplatku — posílá se 14 a 3 dny před `doplatekDo`. Text je pro
 * obě stejný; cron vybírá okno, ne obsah.
 */
export function buildDoplatekReminderEmail(p: DoplatekReminderParams): { subject: string; html: string } {
  const castka = `${p.zbyvaKc.toLocaleString('cs-CZ')} Kč`
  const body = `
    <p>Dobrý den,</p>
    <p>připomínáme doplatek za <strong>${esc(p.childName)}</strong>. Zaplacená záloha místo drží, zbývá doplatit <strong>${castka}</strong> do <strong>${formatDatumCs(p.doplatekDo)}</strong>.</p>
    <p style="text-align:center;margin:24px 0;">
      <a href="${esc(p.paymentUrl)}" style="display:inline-block;background:#4f46e5;color:#fff;text-decoration:none;font-weight:600;padding:12px 28px;border-radius:10px;">Doplatit ${castka}</a>
    </p>
    <table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:14px;">
      <tr><td style="padding:6px 0;color:#64748b;">Tábor</td><td style="padding:6px 0;text-align:right;font-weight:600;">${esc(p.programName)}</td></tr>
      <tr><td style="padding:6px 0;color:#64748b;">Termín</td><td style="padding:6px 0;text-align:right;font-weight:600;">${esc(p.termLabel)}</td></tr>
    </table>
    <p>Pokud doplatek nedorazí včas, řídíme se čl. 21.4 VOP.</p>
    <p>S pozdravem,<br>tým Weeks</p>`
  return {
    subject: `Doplatek za ${p.programName} – splatný do ${formatDatumCs(p.doplatekDo)}`,
    html: layout('Připomínka doplatku', body),
  }
}

export interface DoplatekOverdueRow {
  registrationId: string
  childName: string
  parentEmail: string
  zbyvaKc: number
  doplatekDo: string
}

/**
 * Interní upozornění týmu: přihlášky s nedoplacenou zálohou po termínu.
 * Posílá se jednou den po `doplatekDo`; dál se řeší ručně (VOP čl. 21.4).
 */
export function buildDoplatekOverdueAlert(rows: DoplatekOverdueRow[]): { subject: string; html: string } {
  const items = rows
    .map(
      (r) =>
        `<li><strong>${esc(r.childName)}</strong> · ${esc(r.parentEmail)} · zbývá ${r.zbyvaKc.toLocaleString('cs-CZ')} Kč (do ${formatDatumCs(r.doplatekDo)}) · <code>${esc(r.registrationId)}</code></li>`
    )
    .join('')
  const body = `
    <p>Po termínu doplatku nejsou uhrazené tyto přihlášky. Řešte je ručně (VOP čl. 21.4).</p>
    <ul style="margin:0 0 16px;padding-left:20px;font-size:14px;line-height:1.6;">${items}</ul>`
  return {
    subject: `Nedoplaceno po termínu doplatku: ${rows.length}`,
    html: layout('Nedoplatky po termínu', body),
  }
}
