# IoT Platform — v2 Next.js Refactor Design

## Purpose

Clean rewrite of `step4n`'s vanilla JavaScript IoT learning platform into a Next.js 16 application aligned with the rest of the Weeks technical ecosystem (`weeks_web`, `weeks-hub`). Preserve full feature parity with step4n's current app, polish all existing themes with Weeks design DNA, and fix security + code quality findings as part of the rewrite. Deep integration with `weeks-hub` and public launch are still deferred to v3.

This spec defines v2 scope. Execution happens in a follow-up session (not in the session that produced this spec). During v2 development, step4n continues working on the vanilla codebase on the `dev` branch — see §9 for coordination.

## Source Project Baseline

**Repo:** `lxkask/weeks-iot`, branch `main` at time of spec writing.

**What's there:** Vanilla JS static site, migrated from `step4n/iot` in v1. Key metrics:
- `app.js` — 4012 lines (~141 KB). Single monster function `createIotCampScreen(container, options)` at lines 1672–3992 (~2320 lines).
- `style.css` — 1523 lines (~28 KB), dark theme with CSS custom properties.
- `index.html` — 18 lines, shell only.
- `assets/` — ~20 task diagram PNGs + ~20 avatar PNGs under `avatar-icons/`.
- `arduino-ukoly-kody.txt` — 372 lines, reference sheet.

**Feature surface** (must preserve in v2):
- **21 Arduino tasks** organized into 3 sections (beginner, advanced, expert)
- **Code validation engine** — ~493 lines (`TASK_SOLUTIONS` object) with regex/pattern matching per task
- **8+ visual themes**: Classic (default), Sunrise, Forest, Ice, Ember, Lagoon, Sand, Midnight
- **Style shop** — unlock themes via stars (directUnlockCost, randomSpinStarCost, randomSpinTokenCost, tokenMilestone)
- **Avatar shop** — 20+ avatars (alpaca, bear, duck, fox, kid, koala, etc.) unlockable via stars
- **Reward economy**: stars, tokens, help cards, wiring cards, skip cards
- **Level badges**: PRVNI LED → IOT MAG → ARCHITEKT → EXPERT
- **3-level PIN system**: daily PIN (rotates by date via `buildDailyPin`), lecturer PIN, admin password
- **Bonuses**: no-help bonus stars, first-try bonus, daily challenge stars
- **Section unlocks** — advanced/expert cost stars to unlock
- **Progress persistence** — localStorage, schema at `CONFIG_VERSION = 4`
- **Uses weeks.cz HWLab photo** as CSS body background (already integrated visually)

## Scope Decisions

| # | Topic | Decision |
|---|-------|----------|
| 1 | Scope type | Clean rewrite (Option A). Discard step4n's implementation. Keep data structures (tasks, validation, themes, avatars). |
| 2 | Feature parity | **Full parity on day 1 of v2 launch.** All 8 themes, style shop, avatar shop, reward economy, daily challenges, bonuses, level badges, 3-level PINs, section unlocks. |
| 3 | Design polish | **Option B.** Every step4n theme gets Weeks DNA infused (typography, spacing, glassmorphism) while preserving colors + mood. No new "Weeks" theme added. |
| 4 | Branch strategy | Long-lived `v2-nextjs` branch. step4n's `dev` branch unchanged. Cutover by PR `v2-nextjs → main` at launch. |
| 5 | Codex workflow | step4n uses Codex CLI locally (b1). README focused on project-specific Codex prompt templates. |
| 6 | Data migration | Fresh localStorage key `iot-camp-screen-state-v5`. step4n's v4 data ignored (pre-production, no real users). |
| 7 | Deploy | Same Vercel project (`weeks-iot`). Production branch stays `main`. `v2-nextjs` is preview-only until cutover. |
| 8 | step4n Vercel access | Still none (GitHub-only, matching v1). |
| 9 | step4n coordination | Manual: I watch his `dev` branch commits, port his vanilla additions into v2-nextjs before cutover. Features added post-cutover queue into v2.1+. |

## Architecture

### Tech Stack (aligned with weeks_web + weeks-hub)

- **Next.js 16** — App Router
- **TypeScript**
- **Tailwind CSS v4** (matches weeks-hub; weeks_web uses older v3)
- **Framer Motion** — page transitions, modal animations
- **Lucide React** — icon set
- **Static export** (`output: 'export'` in `next.config.ts`) — no backend, no SSR. Production is a pure static HTML/JS deploy on Vercel.
- **Client-only** — `"use client"` on all components that use state/localStorage.

### Directory Structure

```
src/
├── app/
│   ├── layout.tsx              # root layout — Outfit font, GameStateProvider, global styles
│   ├── page.tsx                # main screen — SPA-style navigation (PIN / TaskList / TaskDetail / Shop / Profile)
│   ├── admin/page.tsx          # admin area behind admin PIN — config editor, stats
│   ├── globals.css             # Tailwind + CSS vars for themes
│   └── not-found.tsx           # 404 page
├── components/
│   ├── screens/
│   │   ├── PinEntry.tsx        # 3-level PIN entry (daily/lecturer/admin)
│   │   ├── TaskList.tsx        # 3 sections — task cards with progress/locks
│   │   ├── TaskDetail.tsx      # task description, hints, code validator, rewards UI
│   │   ├── StyleShop.tsx       # theme unlocks with live mini-preview per theme
│   │   ├── AvatarShop.tsx      # avatar picker/unlocks
│   │   └── LevelBadges.tsx     # badge progression view
│   ├── task/
│   │   ├── CodeValidator.tsx   # Arduino code input + validation (uses task-solutions.ts)
│   │   ├── HelpCards.tsx       # help/wiring/skip card UI
│   │   └── TaskImage.tsx       # task diagram display with zoom
│   ├── ui/                     # Button, PanelGlass, StarBadge, LevelBadge, ProgressBar, Modal
│   └── providers/
│       └── GameStateProvider.tsx  # React Context — entire game state
├── lib/
│   ├── storage.ts              # localStorage wrapper with version migration + error recovery
│   ├── tasks.ts                # sections + tasks data (ported from step4n's `sections` array)
│   ├── task-solutions.ts       # validation logic (ported from step4n's TASK_SOLUTIONS)
│   ├── avatars.ts              # AVATAR_OPTIONS data
│   ├── themes.ts               # STYLE_OPTIONS data + theme application
│   ├── rewards.ts              # reward economy (costs, bonuses, purchases)
│   ├── pin.ts                  # daily PIN generator (from `buildDailyPin`)
│   ├── config.ts               # DEFAULT_CONFIG (with comment: client-side, not a security boundary)
│   └── validation.ts           # input sanitization, Arduino code normalizer
├── types/
│   └── index.ts                # Task, Section, Avatar, Theme, GameState, TaskState, AccountState
└── public/
    ├── task-images/            # step4n's PNG diagrams (led.png, servo-motor.png, ...)
    └── avatars/                # step4n's avatar PNGs (alpaca-brown.png, fox-purple.png, ...)
```

### State Management

- Single **React Context** (`GameStateProvider`) holds the entire game state: current screen, user state (unlocked themes, owned avatars, stars, tokens, level, progress per task), config (PINs, costs).
- `storage.ts` serializes/deserializes to `localStorage` under key `iot-camp-screen-state-v5`.
- State updates go through a reducer or setter helpers; no Redux/Zustand — Context + `useReducer` is enough.
- Task validation is a synchronous pure function in `task-solutions.ts`, invoked from `CodeValidator` component.

### Theme System

Each theme declares CSS custom properties:

```css
[data-theme="classic"] {
  --theme-bg: #0d1427;
  --theme-panel: rgba(31, 40, 63, 0.6);
  --theme-accent: #71b0ff;
  --theme-accent-soft: rgba(113, 153, 255, 0.18);
  --theme-text: #f8fafc;
  --theme-muted: #a6b2c8;
  --theme-star: #ffbc5b;
  --theme-success: #2dd4a6;
}
[data-theme="sunrise"] { /* warm palette ... */ }
[data-theme="forest"]  { /* green palette ... */ }
[data-theme="ice"]     { /* cool blue ... */ }
[data-theme="ember"]   { /* red-orange ... */ }
[data-theme="lagoon"]  { /* teal ... */ }
[data-theme="sand"]    { /* warm sand ... */ }
[data-theme="midnight"]{ /* deep dark ... */ }
```

Tailwind accesses them via `bg-[color:var(--theme-panel)]` or a plugin that surfaces them as `bg-theme-panel`, `text-theme-accent` utilities.

Theme application = set `data-theme` attribute on `<html>` element. Stored in React state, persisted via `storage.ts`.

### Data Flow Summary

```
User input (PIN entry, Arduino code, shop action)
  ↓
React component event handler
  ↓
GameStateProvider reducer action (e.g., UNLOCK_THEME, COMPLETE_TASK, PURCHASE_HELP)
  ↓
New game state → saved to localStorage via storage.ts
  ↓
UI re-renders with updated state (tasks marked done, stars incremented, etc.)
```

## Design System (Weeks DNA)

### Shared across all themes

- **Font**: Outfit (step4n already uses — fix in Next.js `layout.tsx` via `next/font/google`)
- **Type scale**: Tailwind default (12/14/16/18/20/24/32/40) — consistent with weeks_web
- **Spacing**: Tailwind default rhythm (4/8/12/16/24/32/48 px)
- **Border radius**: `rounded-xl` (12px) for panels, `rounded-lg` (8px) for buttons — matches weeks-hub
- **Glassmorphism panel pattern**: `bg-[rgba(var(--theme-panel-rgb),0.6)] backdrop-blur-md border border-white/10`
- **Button shape**: 40px min-height, 14px font-weight 600, 8–16px horizontal padding
- **Shadow elevation**: `shadow-[0_28px_80px_rgba(0,0,0,0.36)]` for elevated panels (matches step4n's `--shadow` CSS var)
- **Framer Motion transitions**: fade + slide (20px) on route/screen changes; scale on modals

### Per-theme variation

Themes only affect the CSS variable values. Shape, spacing, typography, radius, and animations are shared across all themes.

### Differences vs step4n baseline

| Element | step4n now | v2 after polish |
|---------|-----------|-----------------|
| Panel backgrounds | `rgba(31,40,63,0.9)` solid | `rgba(31,40,63,0.6)` + `backdrop-blur-md` |
| Buttons | Various inline styles | Single `<Button variant="primary/secondary/ghost">` component |
| Spacing | Ad-hoc `rem` values | Tailwind 4/8/12/16/24 scale |
| Transitions | Mostly none / basic CSS | Framer Motion fade + slide |
| Task cards | Custom CSS rules | Tailwind panel + consistent hover states |
| Badges (stars, levels) | Inline styling | `<StarBadge>`, `<LevelBadge>` components |

### Style Shop preview

Each theme card in the shop renders a **live mini-preview**: a small mock-up showing a heading + star badge + button in that theme's colors. So the kid sees what they're paying for, not just a name.

### Explicitly not changed

- No new "Weeks" theme
- No new color palettes — step4n's 8 themes stay intact
- No light mode (step4n is dark-only; v2 stays dark-only)

## Security & Audit Scope

### Per-category findings to address during the port

**Input handling & XSS:**
- Audit all 4 `innerHTML =` usages in step4n's `app.js`. Convert to React JSX where XSS auto-escapes. If any interpolates user input, ensure it's escaped.
- Arduino code input — auto-escaped by React render. Validation layer preserved.
- PIN input — numeric-only, max-length enforced in React `<input>` with `inputMode="numeric"` + `pattern="[0-9]*"` + `maxLength`.
- URL params / `window.name` / `postMessage` — if step4n's code reads any, validate strictly in v2.

**Data validation:**
- Port all 493 lines of `TASK_SOLUTIONS` 1:1. Document any regex flagged for review later.
- Quick scan for ReDoS (catastrophic backtracking) patterns — flag but don't fix unless trivial.

**Secrets / config exposure:**
- `DEFAULT_CONFIG` with `dailyPin: "123"`, `lecturerPin: "2468"`, `adminPassword: "321"` is **client-visible** — anyone with devtools sees it.
- Keep same defaults in `lib/config.ts` with a prominent comment: *"Client-side only. This is NOT a security boundary. For true admin gating in production, a backend is required (deferred to v3)."*
- Recommend in audit findings doc: either (a) admin-configurable PINs set during camp install, or (b) accept that kids will find PINs in 5 minutes and design UX accordingly (which is already step4n's reality).

**Daily PIN (`buildDailyPin`):**
- Port algorithm as-is. Audit whether it's trivially predictable; flag in findings doc. Not fixing in v2 (same reality as admin PIN — client-side).

**localStorage robustness:**
- `storage.ts` wrapper implements:
  - Try/catch on `JSON.parse` — corrupt data → reset to default + console.warn
  - Try/catch on `setItem` — quota exceeded or disabled → graceful in-memory fallback with banner UI warning
  - Version check — key includes `-v5` suffix; wrong version → fresh state

**Dependency audit:**
- Run `npm audit` after scaffold. Block launch if any HIGH-severity CVE on direct dep. Mitigate MEDIUM/LOW per judgment.
- Keep dep set minimal: next, react, tailwindcss, framer-motion, lucide-react.

### Out of scope

- ❌ Penetration testing
- ❌ CSP header tuning (static deploy has safe defaults)
- ❌ Rate limiting (no backend)
- ❌ Refactoring step4n's Arduino validation regexes — porting 1:1; optimization is a v2.1+ task

### Audit deliverable

At end of v2 port, create `docs/audit-findings-v2.md` in repo:
- Table: finding → severity (low/med/high) → status (fixed-in-v2 / deferred-to-v3)
- Section explaining what is/isn't a security boundary (e.g., client-side PIN ≠ cryptographic boundary)
- Recommendations for when the platform grows (auth, backend, per-kid data, etc.)

## Branch Strategy & Coordination with step4n

### During v2 development (parallel period)

```
main (production = vanilla on iot.weeks.cz)
├── dev            ← step4n works here on vanilla (unchanged workflow)
└── v2-nextjs      ← v2 Next.js refactor (preview only, not production)
```

- `main` = production, serves vanilla JS on `iot.weeks.cz`, unchanged throughout v2 dev
- `dev` = step4n's working branch (vanilla). Still PRs `dev → main` to deploy vanilla updates
- `v2-nextjs` = refactor work. Vercel configured so this branch produces previews (`weeks-iot-git-v2-nextjs-*.vercel.app`), **not production deployments**.

### Cutover procedure

When v2-nextjs is feature-complete and audit-passed:

1. Review step4n's `dev` branch commits since v2-nextjs started. Port any new vanilla features into v2-nextjs (React/TS versions of whatever he added).
2. Final manual smoke test on v2-nextjs preview URL — exercise PIN entry, a task from each section, shop, theme swap, avatar pick, admin.
3. Open PR `v2-nextjs → main`. Description lists delta + audit findings summary.
4. Merge. Vercel auto-deploys → `iot.weeks.cz` now serves Next.js.
5. Reset step4n's `dev` branch:
   - Coordinate with step4n: "everything is now Next.js, your `dev` branch gets reset"
   - Force-push `main` to `dev` (or delete `dev` and recreate from `main`)
   - step4n's future work is on Next.js code, still via `dev → main` PR flow via Codex CLI

### Post-cutover

- `dev` branch reset to match `main` (Next.js state)
- step4n updates his local clone, resumes work with new `README.md` (v2 version)
- Features step4n added to vanilla **after** v2 port started (and weren't ported) queue as v2.1+ issues

## step4n's v2 README (content outline)

Czech, Codex-first workflow, preserves tone from v1 README. Sections:

1. **Co to je** — same platform, new tech layer (Next.js)
2. **Proč se to změnilo** — one sentence: refactor so we can integrate with Weeks ecosystem later + improved performance + better maintainability
3. **První nastavení (pokud ještě nemá Node.js + Codex CLI)**
   - Install Node.js LTS from https://nodejs.org
   - Install Codex CLI per OpenAI docs
   - Clone via VS Code or `git clone https://github.com/lxkask/weeks-iot`
   - `npm install` → `npm run dev` → open `localhost:3000`
4. **Jak pracovat s Codexem (main section, ~60% of README)**

   Prompt templates for common tasks. Examples:

   - **Add new Arduino task**:
     > "V projektu weeks-iot chci přidat nový úkol do sekce 'advanced'. Úkol se jmenuje 'Měření teploty DS18B20'. Má 3 hvězdičky za dokončení. Instrukce: [popis]. Validační regex kontroluje: použití OneWire knihovny, DallasTemperature, print teploty. Přidej obrázek do public/task-images/ (jméno ds18b20.png, nahraju ho sám po generování). Soubory: src/lib/tasks.ts (data), src/lib/task-solutions.ts (validace)."

   - **Fix task text**:
     > "V src/lib/tasks.ts najdi úkol s id 'xxx' a oprav mu popis — místo 'zapoj katodu k GND' má být 'zapoj katodu (kratší nožka) k GND'."

   - **Add new theme**:
     > "Vytvoř novou theme 'aurora' — zelenofialová polární záře paleta. Přidej do src/lib/themes.ts a definuj CSS proměnné v src/app/globals.css pod [data-theme='aurora']. Unlock cost v shopu: 40 hvězdiček."

   - **Post-Codex checklist**:
     > - Koukni v Source Control ve VS Code, co Codex změnil
     > - Commit + sync changes (push na `dev`)
     > - Otevři preview URL na GitHubu, vyzkoušej změnu
     > - Když funguje → PR `dev → main` → napiš Lukášovi
     > - Když nefunguje → "Nefunguje X, viz Y. Oprav." → Codexu

5. **Kam se koukat na preview + produkci** — GitHub commit → Vercel check → Details (stable preview URL pattern)
6. **Lokální dev** — `npm run dev`, hot reload, `localhost:3000`
7. **Co když něco pokazím** — revert via GitHub, ping Lukáš
8. **Co NEDÁVAT do repa** — hesla, citlivá data, soubory >10 MB
9. **CLI reference** — basic git + npm commands

**Key shift from v1 README:** instead of "click Source Control in VS Code", it's example Codex prompts. step4n talks to AI, doesn't click UI.

## Explicit Non-Goals (v2)

- ❌ `weeks-hub` integration (dashboard card, data sync, notifications) — **v3**
- ❌ Supabase / any database / backend — **v3**
- ❌ Google OAuth / SSO / login / auth — **v3**
- ❌ Link from `weeks.cz` to `iot.weeks.cz`
- ❌ GA4 / FB Pixel / analytics / cookie banner
- ❌ Multi-language support (stays Czech-only; v2 standardizes diacritics during port)
- ❌ Custom CMS / admin UI for task creation via web (tasks added via Codex + git push)
- ❌ Per-kid accounts / email identities (anonymous tablet experience stays)
- ❌ Unit / e2e test suite (manual smoke test only; add targeted tests if regression hits)
- ❌ Refactor of `TASK_SOLUTIONS` validation regexes (1:1 port)
- ❌ i18n infrastructure

## Deferred Decisions (v3+)

These are not decided in v2. Each will need its own brainstorming session:

- Whether kids get per-child accounts or stay anonymous (GDPR implications for minors)
- How user progress syncs to `weeks-hub` (polling? real-time subscription? batch export?)
- Whether platform migrates to a backend or stays client-only
- Whether content (tasks, themes) becomes CMS-editable vs. stays in code
- SSO integration with `app.weeks.cz` (Google OAuth for team admins, not kids)
- GDPR-safe analytics if demand emerges
- Multi-tenant support if Weeks sells the platform to other camps

## Success Criteria for v2

- [ ] Next.js 16 app at `weeks-iot-git-v2-nextjs-*.vercel.app` renders step4n's PIN entry, task list, task detail, all 8 themes, style shop, avatar shop, admin area
- [ ] All 21 tasks can be completed end-to-end with correct validation outcomes
- [ ] Reward economy matches step4n's defaults (help/wiring/skip cards, star costs, bonuses, daily challenges)
- [ ] Themes render with Weeks DNA (Outfit typography, glassmorphism panels, Tailwind spacing) while preserving original colors
- [ ] `localStorage` under `iot-camp-screen-state-v5` key persists progress across reloads
- [ ] `docs/audit-findings-v2.md` exists and enumerates findings with severity + status
- [ ] `README.md` rewritten for v2 (Codex-first workflow)
- [ ] `iot.weeks.cz` response still has `X-Robots-Tag: noindex, nofollow`
- [ ] `main` now serves Next.js static export (post-cutover); `dev` reset to match

## References

- v1 spec: `docs/superpowers/specs/2026-04-21-iot-platform-v1-design.md`
- v1 plan: `docs/superpowers/plans/2026-04-21-iot-platform-v1.md`
- Source repo at time of spec: `https://github.com/lxkask/weeks-iot` (main + dev branches, vanilla JS)
- Ecosystem reference: `weeks_web` (Next.js 16, Tailwind v3, App Router), `weeks-hub` (Next.js 16, Tailwind v4, App Router, Framer Motion, glassmorphism)
