// Renders a faithful preview of the registration-received email to PNG + HTML.
// Mirrors layout()/body from src/lib/email.ts exactly. Run:
//   node scripts/preview-registration-email.mjs
import { chromium } from 'playwright-core'
import { writeFileSync } from 'node:fs'

// ── mirror of layout() in src/lib/email.ts ────────────────────────────────────
const layout = (title, bodyHtml) => `<!DOCTYPE html>
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

// ── mirror of buildRegistrationReceivedEmail() body with sample data ──────────
const p = {
  childName: 'Tomáš Novák',
  programName: 'Letní příměstský tábor chytrých technologií',
  termLabel: '27. – 31. července 2026',
  locationName: 'Karlovy Vary',
  priceKc: 4990,
  paymentUrl: 'https://weeks.cz/platba/ukazka?location=karlovy-vary',
}
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

const html = layout('Registrace přijata ✅', body)
writeFileSync('scripts/.pw-shots/registration-email.html', html, 'utf8')

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 640, height: 900 }, deviceScaleFactor: 2 })
await page.setContent(html, { waitUntil: 'networkidle' })
await page.screenshot({ path: 'scripts/.pw-shots/registration-email.png', fullPage: true })
await browser.close()
console.log('Preview written: scripts/.pw-shots/registration-email.{html,png}  (subject: "Máme vaši registraci – zbývá dokončit platbu")')
