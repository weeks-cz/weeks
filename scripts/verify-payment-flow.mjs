// Safe local smoke test of the KV registration → payment handoff UI.
// Uses the already-installed Chromium via playwright-core. Does NOT submit the
// final registration (that would write a real row to the shared production
// Supabase) and does NOT complete a Comgate payment.
//
// Run: node scripts/verify-payment-flow.mjs
import { chromium } from 'playwright-core'

const BASE = process.env.BASE_URL || 'http://localhost:3000'
const REG_URL = `${BASE}/registrace?location=karlovy-vary&program=letni-primestsky&term=kv-2026-07-27-letni`
const OUT = 'scripts/.pw-shots'

const log = (...a) => console.log('•', ...a)
let failures = 0
const check = (cond, msg) => {
  if (cond) log('PASS:', msg)
  else { console.error('  ✗ FAIL:', msg); failures++ }
}

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 1280, height: 1400 } })
page.on('console', (m) => { if (m.type() === 'error') console.error('   [browser console.error]', m.text()) })

try {
  // ── Step A: registration form renders for a valid camp/term link ──────────
  log('Navigating to', REG_URL)
  const reg = await page.goto(REG_URL, { waitUntil: 'networkidle' })
  check(reg?.status() === 200, `registrace page returned ${reg?.status()}`)

  const h1 = await page.locator('h1').first().textContent()
  check(/Registrace na tábor/.test(h1 || ''), `step 1 heading present ("${h1?.trim()}")`)
  // The "Neplatný odkaz" fallback would mean program/term IDs are wrong.
  check(!(await page.getByText('Neplatný odkaz na registraci').count()), 'valid camp/term link (no "Neplatný odkaz" fallback)')
  check(await page.getByText('Letní příměstský tábor').count() > 0, 'camp name shown in header')

  await page.screenshot({ path: `${OUT}/01-step1.png` })

  // ── Step B: dev autofill → jump to summary (step 5), no DB write ───────────
  const autofill = page.getByRole('button', { name: /Dev: vyplnit testovací data/ })
  check(await autofill.count() > 0, 'dev autofill button present (NODE_ENV=development)')
  await autofill.click()

  await page.getByText('Shrnutí registrace').waitFor({ timeout: 5000 })
  check(true, 'reached step 5 (Shrnutí registrace)')
  check(await page.getByText('4 990 Kč').count() > 0, 'summary shows correct price 4 990 Kč')
  check(await page.getByText('Jan Testovací').count() > 0, 'summary shows autofilled parent')
  check(await page.getByText('Tomáš Testovací').count() > 0, 'summary shows autofilled child')

  const payBtn = page.getByRole('button', { name: /Přejít k platbě/ })
  check(await payBtn.count() > 0, 'final "Přejít k platbě" button present')
  await page.screenshot({ path: `${OUT}/02-summary.png` })
  log('STOP before final submit — not creating a production registration row.')

  // ── Step C: /platba page renders the pay UI (dummy id, no DB row) ──────────
  // A random UUID is not a real registration; the page still renders the pay
  // button. We do NOT click it (would POST comgate/create → 404 for a fake id).
  const dummyId = '00000000-0000-0000-0000-000000000000'
  const pay = await page.goto(`${BASE}/platba/${dummyId}?location=karlovy-vary`, { waitUntil: 'networkidle' })
  check(pay?.status() === 200, `/platba page returned ${pay?.status()}`)
  check(await page.getByText('Platba bankovním převodem').count() > 0, 'payment UI heading present')
  check(await page.getByText(/TESTOVACÍ REŽIM/).count() > 0, 'test-mode banner shown (NEXT_PUBLIC_COMGATE_TEST not "false")')
  check(await page.getByRole('button', { name: /Přejít k platbě/ }).count() > 0, 'pay button present on /platba')
  await page.screenshot({ path: `${OUT}/03-platba.png` })
} catch (e) {
  console.error('SCRIPT ERROR:', e.message)
  failures++
} finally {
  await browser.close()
}

console.log(failures === 0 ? '\n✅ ALL CHECKS PASSED' : `\n❌ ${failures} CHECK(S) FAILED`)
process.exit(failures === 0 ? 0 : 1)
