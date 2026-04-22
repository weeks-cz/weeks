# IoT Platform v2 Next.js Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Clean rewrite of vanilla JS IoT learning platform (`lxkask/weeks-iot`) into Next.js 16 with full feature parity, Weeks design DNA, and security audit. Deployed preview-only until final cutover.

**Architecture:** Next.js 16 App Router + TypeScript, static export, client-only state via React Context + localStorage. Data (21 tasks, validation, 8 themes, avatars, rewards) ported 1:1 from step4n's `app.js`. UI rewritten as focused React components with Tailwind CSS v4 + Framer Motion + Lucide icons.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS v4, Framer Motion, Lucide React.

---

## Design Reference

Spec: `docs/superpowers/specs/2026-04-22-iot-platform-v2-nextjs-refactor-design.md`

## Scope

Single cohesive refactor: scaffold → data port → state → UI components → design polish → audit → docs → cutover. No decomposition needed — all phases belong to one implementation.

## Execution Context

This plan runs in a **separate session** from the one that produced it. It does NOT run in the current `weeks_web` directory — it operates on the `weeks-iot` repo at `C:\Users\lukol\weeks-iot`.

Before starting execution:
- Ensure `C:\Users\lukol\weeks-iot` exists (if not, clone: `git clone https://github.com/lxkask/weeks-iot /c/Users/lukol/weeks-iot`)
- Confirm step4n has NOT pushed breaking changes to `main` recently (if he has, resync base before Task 1)

## Pre-flight Confirmation

- [ ] `lxkask/weeks-iot` repo exists on GitHub with `main` + `dev` branches (done in v1)
- [ ] Local checkout exists at `C:\Users\lukol\weeks-iot`
- [ ] Node.js ≥ 20 LTS installed (`node --version`)
- [ ] npm ≥ 10 installed (`npm --version`)
- [ ] Git authenticated for `lxkask`

## File Structure Plan

**New files created in `weeks-iot/` on the `v2-nextjs` branch:**

```
weeks-iot/
├── legacy-vanilla/             # moved from root: step4n's old files for reference during port
│   ├── app.js
│   ├── style.css
│   ├── index.html
│   ├── arduino-ukoly-kody.txt
│   └── assets/                 # (copied to public/ for v2)
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── admin/page.tsx
│   │   ├── globals.css
│   │   └── not-found.tsx
│   ├── components/
│   │   ├── screens/{PinEntry,TaskList,TaskDetail,StyleShop,AvatarShop,LevelBadges}.tsx
│   │   ├── task/{CodeValidator,HelpCards,TaskImage}.tsx
│   │   ├── ui/{Button,PanelGlass,StarBadge,LevelBadge,ProgressBar,Modal}.tsx
│   │   └── providers/GameStateProvider.tsx
│   ├── lib/
│   │   ├── storage.ts
│   │   ├── tasks.ts
│   │   ├── task-solutions.ts
│   │   ├── avatars.ts
│   │   ├── themes.ts
│   │   ├── rewards.ts
│   │   ├── pin.ts
│   │   ├── config.ts
│   │   └── validation.ts
│   └── types/index.ts
├── public/
│   ├── task-images/
│   └── avatars/
├── next.config.ts
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
├── package.json
├── .eslintrc.json
├── .gitignore (updated: add node_modules, .next, out/)
├── README.md (rewritten — v2 Codex-first workflow)
├── robots.txt (kept)
├── vercel.json (updated: static export config)
└── docs/audit-findings-v2.md
```

**Moved:** step4n's original files relocated to `legacy-vanilla/` folder — kept in repo for reference during port. They will be deleted at the cutover PR.

**Deleted at cutover:** `legacy-vanilla/` folder (once v2 is verified working).

---

## Phase 0: Branch Setup

### Task 1: [Lukáš manual] Configure Vercel so `v2-nextjs` is preview-only

**Purpose:** Prevent accidental production deploy from the refactor branch.

- [ ] **Step 1: Open Vercel project `weeks-iot` → Settings → Git**
- [ ] **Step 2: Under "Ignored Build Step" (or equivalent), leave default (all branches deploy as previews by default; only `main` goes to production).**

Already correct by default — Vercel only treats `main` as production. `v2-nextjs` will get preview deploys automatically. No action needed in most cases; this task is a confirmation checkbox.

- [ ] **Step 3: Confirm in Vercel → Environments → Production that branch is still `main`.**

---

### Task 2: [Agent] Create `v2-nextjs` branch locally and push

**Files:** n/a (branch-only change)

- [ ] **Step 1: Ensure clean working tree on main**

```bash
cd /c/Users/lukol/weeks-iot && git checkout main && git pull && git status
```

Expected: "nothing to commit, working tree clean" and "up to date with 'origin/main'".

- [ ] **Step 2: Create branch from current main**

```bash
cd /c/Users/lukol/weeks-iot && git checkout -b v2-nextjs
```

- [ ] **Step 3: Push to remote with upstream tracking**

```bash
cd /c/Users/lukol/weeks-iot && git push -u origin v2-nextjs
```

Expected: branch created on GitHub. Verify: https://github.com/lxkask/weeks-iot/branches should show `v2-nextjs`.

- [ ] **Step 4: Commit**

(No files changed — branch creation is the commit.)

---

### Task 3: [Agent] Move step4n's legacy files into `legacy-vanilla/`

**Files:**
- Create directory: `legacy-vanilla/`
- Move: `app.js`, `style.css`, `index.html`, `arduino-ukoly-kody.txt`, `assets/` → into `legacy-vanilla/`

- [ ] **Step 1: Create the directory**

```bash
cd /c/Users/lukol/weeks-iot && mkdir legacy-vanilla
```

- [ ] **Step 2: Move files**

```bash
cd /c/Users/lukol/weeks-iot && git mv app.js style.css index.html arduino-ukoly-kody.txt assets legacy-vanilla/
```

- [ ] **Step 3: Verify**

```bash
cd /c/Users/lukol/weeks-iot && ls legacy-vanilla/ && ls -la
```

Expected: `legacy-vanilla/` contains the 5 files/dirs; repo root has only `README.md`, `robots.txt`, `vercel.json`, `.gitignore`, `.git/`, `legacy-vanilla/`.

- [ ] **Step 4: Commit**

```bash
cd /c/Users/lukol/weeks-iot && git commit -m "chore: move step4n's vanilla files to legacy-vanilla/ for port reference"
git push
```

---

## Phase 1: Next.js Scaffold

### Task 4: [Agent] Initialize Next.js app

**Files:** auto-generated by `create-next-app` into root

- [ ] **Step 1: Scaffold Next.js app into repo root (skips git init, uses existing)**

```bash
cd /c/Users/lukol/weeks-iot && npx create-next-app@latest . --typescript --tailwind --app --eslint --src-dir --import-alias "@/*" --no-turbopack --use-npm
```

When prompted "Ok to proceed?": yes. If it complains about non-empty directory: proceed / overwrite only conflicting files (should not conflict since step4n's files are in `legacy-vanilla/`).

Expected outcome: new files in root — `package.json`, `next.config.ts` (or `.js`), `tsconfig.json`, `tailwind.config.ts`, `postcss.config.js` (or `.mjs`), `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`, `.eslintrc.json`, `.gitignore` (merged).

- [ ] **Step 2: Verify install works**

```bash
cd /c/Users/lukol/weeks-iot && npm run dev
```

Expected: Next.js dev server starts on `http://localhost:3000`, renders default template. Kill with `Ctrl+C`.

- [ ] **Step 3: Commit scaffold**

```bash
cd /c/Users/lukol/weeks-iot && git add -A && git commit -m "chore: scaffold Next.js 16 app with TypeScript + Tailwind" && git push
```

---

### Task 5: [Agent] Pin and install aligned dependencies

**Files:** `package.json`

- [ ] **Step 1: Upgrade/install exact deps matching Weeks ecosystem**

```bash
cd /c/Users/lukol/weeks-iot && npm install tailwindcss@^4 framer-motion@latest lucide-react@latest
```

- [ ] **Step 2: Verify versions**

```bash
cd /c/Users/lukol/weeks-iot && cat package.json | grep -E '"(next|react|tailwindcss|framer-motion|lucide-react|typescript)"'
```

Expected: `next` ≥ 16, `react` ≥ 19, `tailwindcss` ≥ 4, `framer-motion` present, `lucide-react` present, `typescript` ≥ 5.

- [ ] **Step 3: Commit**

```bash
cd /c/Users/lukol/weeks-iot && git add package.json package-lock.json && git commit -m "chore: install Tailwind v4 + Framer Motion + Lucide" && git push
```

---

### Task 6: [Agent] Configure Next.js for static export

**Files:** `next.config.ts`

- [ ] **Step 1: Replace `next.config.ts` with**

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
```

Rationale: `output: "export"` produces static HTML in `out/`. `images.unoptimized` avoids needing a runtime image optimizer. `trailingSlash` avoids Vercel redirect quirks on subpaths.

- [ ] **Step 2: Verify export works**

```bash
cd /c/Users/lukol/weeks-iot && npm run build
```

Expected: `out/` directory created with `index.html`. No errors.

- [ ] **Step 3: Commit**

```bash
cd /c/Users/lukol/weeks-iot && git add next.config.ts && git commit -m "chore: configure Next.js for static export" && git push
```

---

### Task 7: [Agent] Update `vercel.json` for static deploy + preserve headers

**Files:** `vercel.json`

- [ ] **Step 1: Replace `vercel.json` contents**

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "out",
  "framework": null,
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Robots-Tag", "value": "noindex, nofollow" }
      ]
    }
  ]
}
```

- [ ] **Step 2: Commit**

```bash
cd /c/Users/lukol/weeks-iot && git add vercel.json && git commit -m "chore: configure Vercel for Next.js static export + keep noindex" && git push
```

Preview deploy on `v2-nextjs` should pick this up and serve the default Next.js page with noindex header.

- [ ] **Step 3: Verify preview deploy**

Get preview URL from GitHub commits/v2-nextjs page. Then:

```bash
curl -skI https://<preview-url>.vercel.app 2>&1 | grep -iE "HTTP/|x-robots-tag"
```

Expected: `HTTP/2 200` and `x-robots-tag: noindex, nofollow`.

---

### Task 8: [Agent] Configure Outfit font via next/font/google

**Files:** `src/app/layout.tsx`

- [ ] **Step 1: Replace `src/app/layout.tsx`**

```typescript
import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Weeks IoT",
  description: "Výuková IoT platforma pro děti z Weeks táborů",
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="cs" data-theme="classic" className={outfit.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
```

- [ ] **Step 2: Update `tailwind.config.ts` to use the font**

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-outfit)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 3: Verify build**

```bash
cd /c/Users/lukol/weeks-iot && npm run build
```

- [ ] **Step 4: Commit**

```bash
cd /c/Users/lukol/weeks-iot && git add src/app/layout.tsx tailwind.config.ts && git commit -m "feat: configure Outfit font + default theme attribute" && git push
```

---

### Task 9: [Agent] Copy step4n's assets into `public/`

**Files:**
- Copy from `legacy-vanilla/assets/` (except README.md and avatar-icons) → `public/task-images/`
- Copy from `legacy-vanilla/assets/avatar-icons/` → `public/avatars/`

- [ ] **Step 1: Create directories**

```bash
cd /c/Users/lukol/weeks-iot && mkdir -p public/task-images public/avatars
```

- [ ] **Step 2: Copy task diagrams**

```bash
cd /c/Users/lukol/weeks-iot && cp legacy-vanilla/assets/*.png public/task-images/
```

Expected: all task PNGs (led.png, servo-motor.png, detekce-pohybu.png, etc.) in `public/task-images/`.

- [ ] **Step 3: Copy avatars**

```bash
cd /c/Users/lukol/weeks-iot && cp legacy-vanilla/assets/avatar-icons/*.png public/avatars/
```

Expected: all avatar PNGs (alpaca-brown.png, fox-purple.png, etc.) in `public/avatars/`.

- [ ] **Step 4: Verify counts**

```bash
cd /c/Users/lukol/weeks-iot && ls public/task-images/ | wc -l && ls public/avatars/ | wc -l
```

Expected: ~20 task images, ~20 avatars (match counts in `legacy-vanilla/`).

- [ ] **Step 5: Commit**

```bash
cd /c/Users/lukol/weeks-iot && git add public/ && git commit -m "chore: copy task diagrams + avatars to public/" && git push
```

---

## Phase 2: Data Porting (Types First, Then Data Modules)

### Task 10: [Agent] Define TypeScript types

**Files:** `src/types/index.ts` (create)

- [ ] **Step 1: Create `src/types/index.ts`**

Read `legacy-vanilla/app.js` lines 41–1545 (constants, default state functions) to derive correct shape.

```typescript
export type ThemeId =
  | "classic" | "sunrise" | "forest" | "ice"
  | "ember" | "lagoon" | "sand" | "midnight";

export type SectionId = "beginner" | "advanced" | "expert";

export type ThemeAccent =
  | "blue" | "orange" | "green" | "cyan"
  | "red" | "teal" | "sand" | "purple";

export type UnlockType = "default" | "shop";

export interface ThemeOption {
  id: ThemeId;
  label: string;
  description: string;
  accent: ThemeAccent;
  unlockType: UnlockType;
}

export interface AvatarOption {
  id: string;
  label: string;
  filename: string;
  unlockType: UnlockType;
  cost?: number;
}

export interface LevelBadge {
  id: string;
  label: string;
  icon: string; // HTML entity e.g. "&#127942;"
  minStars?: number;
}

export interface Task {
  id: string;
  sectionId: SectionId;
  title: string;
  description: string;
  reward: number;
  imageKey?: string;
  hints?: { code?: string; wiring?: string };
}

export interface Section {
  id: SectionId;
  label: string;
  tasks: Task[];
  unlockCost?: number; // only for advanced/expert
}

export interface TaskState {
  status: "locked" | "available" | "completed";
  helpCodeUsed: boolean;
  helpWiringUsed: boolean;
  skipUsed: boolean;
  firstTry: boolean;
}

export interface AccountState {
  nickname?: string;
  avatarId: string;
  stars: number;
  tokens: number;
  unlockedThemes: ThemeId[];
  unlockedAvatars: string[];
  currentTheme: ThemeId;
  dailyChallengeDate?: string;
  dailyChallengeCompleted: boolean;
  levelBadges: string[];
}

export interface ScreenState {
  currentScreen:
    | "pin-entry" | "task-list" | "task-detail"
    | "style-shop" | "avatar-shop" | "level-badges"
    | "admin";
  activeTaskId?: string;
  pinLevel: "none" | "daily" | "lecturer" | "admin";
}

export interface GameState {
  version: number;
  account: AccountState;
  tasks: Record<string, TaskState>;
  sections: Record<SectionId, { unlocked: boolean }>;
  screen: ScreenState;
}

export interface Config {
  dailyPin: string;
  lecturerPin: string;
  adminPassword: string;
  maxStudents: number;
  helpCodeCost: number;
  helpWiringCost: number;
  skipCost: number;
}

export interface ValidationResult {
  valid: boolean;
  feedback?: string;
}
```

- [ ] **Step 2: Type-check**

```bash
cd /c/Users/lukol/weeks-iot && npx tsc --noEmit
```

Expected: no errors (types not yet used anywhere).

- [ ] **Step 3: Commit**

```bash
cd /c/Users/lukol/weeks-iot && git add src/types/index.ts && git commit -m "feat(types): define core TypeScript types for game state" && git push
```

---

### Task 11: [Agent] Port config

**Files:** `src/lib/config.ts` (create)

- [ ] **Step 1: Read source**

From `legacy-vanilla/app.js`, lines 1–39 contain:
- `CONFIG_VERSION`, `DAILY_ACCESS_MODE`, `MAX_STUDENTS_LIMIT`
- `DEFAULT_CONFIG` (dailyPin, lecturerPin, adminPassword, maxStudents, help/wiring/skip costs)
- `STYLE_SHOP_CONFIG`, `AVATAR_SHOP_CONFIG`, `REWARD_CONFIG`, `SECTION_UNLOCK_COSTS`
- `PREVIEW_ALLOW_ANY_PIN`, `REQUIRE_LECTURER_PIN_FOR_CHECK`

- [ ] **Step 2: Create `src/lib/config.ts`**

```typescript
import type { Config } from "@/types";

/**
 * Client-side config. NOT a security boundary.
 * PINs are visible in bundled JS to anyone with devtools.
 * For production admin gating, a backend is required (deferred to v3).
 */

export const CONFIG_VERSION = 5;
export const STORAGE_KEY = "iot-camp-screen-state-v5";

export const DAILY_ACCESS_MODE = "manual" as const;
export const MAX_STUDENTS_LIMIT = 25;

export const DEFAULT_CONFIG: Config = {
  dailyPin: "123",
  lecturerPin: "2468",
  adminPassword: "321",
  maxStudents: 15,
  helpCodeCost: 15,
  helpWiringCost: 15,
  skipCost: 30,
};

export const STYLE_SHOP_CONFIG = {
  directUnlockCost: 40,
  randomSpinStarCost: 15,
  randomSpinTokenCost: 1,
  tokenMilestone: 3,
} as const;

export const AVATAR_SHOP_CONFIG = {
  directUnlockCost: 30,
  randomSpinCost: 12,
} as const;

export const REWARD_CONFIG = {
  noHelpBonusStars: 2,
  firstTryBonusStars: 1,
  dailyChallengeStars: 6,
} as const;

export const SECTION_UNLOCK_COSTS: Record<"advanced" | "expert", number> = {
  advanced: 25,
  expert: 40,
};

export const PREVIEW_ALLOW_ANY_PIN = false;
export const REQUIRE_LECTURER_PIN_FOR_CHECK = false;
```

- [ ] **Step 3: Type-check**

```bash
cd /c/Users/lukol/weeks-iot && npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
cd /c/Users/lukol/weeks-iot && git add src/lib/config.ts && git commit -m "feat(config): port config constants from vanilla" && git push
```

---

### Task 12: [Agent] Port themes

**Files:** `src/lib/themes.ts` (create)

- [ ] **Step 1: Read source**

`legacy-vanilla/app.js` lines 48–113 contain `STYLE_OPTIONS` array.

- [ ] **Step 2: Create `src/lib/themes.ts`**

```typescript
import type { ThemeOption } from "@/types";

export const STYLE_OPTIONS: ThemeOption[] = [
  { id: "classic",  label: "Classic",  description: "Původní vzhled screenu.",                                            accent: "blue",   unlockType: "default" },
  { id: "sunrise",  label: "Sunrise",  description: "Teplejší barvy a světlejší akcenty.",                                accent: "orange", unlockType: "shop" },
  { id: "forest",   label: "Forest",   description: "Zelenější laboratorní styl.",                                        accent: "green",  unlockType: "shop" },
  { id: "ice",      label: "Ice",      description: "Chladný modrý styl s ostřejšími kontrasty.",                         accent: "cyan",   unlockType: "shop" },
  { id: "ember",    label: "Ember",    description: "Těžký červeno-oranžový styl s výrazným kontrastem.",                 accent: "red",    unlockType: "shop" },
  { id: "lagoon",   label: "Lagoon",   description: "Tyrkysový styl inspirovaný vodou a laboratorní grafikou.",           accent: "teal",   unlockType: "shop" },
  { id: "sand",     label: "Sand",     description: "Světlejší pískový motiv s teplými akcenty.",                          accent: "sand",   unlockType: "shop" },
  { id: "midnight", label: "Midnight", description: "Hluboká noční paleta s tmavými odstíny.",                            accent: "purple", unlockType: "shop" },
];

export function getTheme(id: string): ThemeOption | undefined {
  return STYLE_OPTIONS.find((t) => t.id === id);
}

export function applyTheme(themeId: string): void {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme", themeId);
}
```

**Note:** Descriptions in `legacy-vanilla/app.js` lack diacritics (step4n's Codex stripped them). The port **adds proper Czech diacritics** — this is the "standardize diacritics during port" action from spec non-goals.

- [ ] **Step 3: Type-check + commit**

```bash
cd /c/Users/lukol/weeks-iot && npx tsc --noEmit && git add src/lib/themes.ts && git commit -m "feat(themes): port theme options with restored Czech diacritics" && git push
```

---

### Task 13: [Agent] Port avatars

**Files:** `src/lib/avatars.ts` (create)

- [ ] **Step 1: Read source**

`legacy-vanilla/app.js` lines 114–153 contain `AVATAR_OPTIONS` array. List of PNG files in `legacy-vanilla/assets/avatar-icons/` already copied to `public/avatars/`.

- [ ] **Step 2: Create `src/lib/avatars.ts`**

Port the `AVATAR_OPTIONS` array. Each entry should reference `/avatars/<filename>.png`. Preserve step4n's order and unlock types exactly.

Schema:
```typescript
import type { AvatarOption } from "@/types";
import { AVATAR_SHOP_CONFIG } from "./config";

export const DEFAULT_AVATAR_ID: string = /* first entry */ "fox-purple";

export const AVATAR_OPTIONS: AvatarOption[] = [
  // Port from legacy-vanilla/app.js lines 114-153. Example:
  { id: "fox-purple", label: "Fox", filename: "fox-purple.png", unlockType: "default" },
  { id: "dog-blue",   label: "Dog",  filename: "dog-blue.png",  unlockType: "shop", cost: AVATAR_SHOP_CONFIG.directUnlockCost },
  // ...
];

export function getAvatar(id: string): AvatarOption | undefined {
  return AVATAR_OPTIONS.find((a) => a.id === id);
}
```

- [ ] **Step 3: Verify filenames exist in `public/avatars/`**

```bash
cd /c/Users/lukol/weeks-iot && node -e "const a=require('./src/lib/avatars.ts'); /* manual check */"
```

Simpler: cross-check with `ls public/avatars/` — every `filename` field must exist in that directory. If a file is missing, it was typo — fix.

- [ ] **Step 4: Type-check + commit**

```bash
cd /c/Users/lukol/weeks-iot && npx tsc --noEmit && git add src/lib/avatars.ts && git commit -m "feat(avatars): port avatar options from vanilla" && git push
```

---

### Task 14: [Agent] Port level badges + section unlocks data

**Files:** Merge into `src/lib/rewards.ts` (part 1 of rewards — data; logic comes later in Task 16)

- [ ] **Step 1: Read source**

`legacy-vanilla/app.js` lines 41–47 (LEVEL_BADGES), 33–37 (SECTION_UNLOCK_COSTS already in config.ts).

- [ ] **Step 2: Create `src/lib/rewards.ts` (data section only for now)**

```typescript
import type { LevelBadge } from "@/types";
import { REWARD_CONFIG, SECTION_UNLOCK_COSTS } from "./config";

export const LEVEL_BADGES: LevelBadge[] = [
  { id: "prvni-led", label: "PRVNÍ LED",  icon: "🏆", minStars: 0 },
  { id: "iot-mag",   label: "IOT MÁG",    icon: "🎖️", minStars: 10 },
  { id: "architekt", label: "ARCHITEKT",  icon: "🏭", minStars: 30 },
  { id: "expert",    label: "EXPERT",     icon: "✨", minStars: 60 },
];

// Note: step4n used HTML entities ("&#127942;" etc.) — converted to Unicode emoji
// for React rendering safety. Same visual result, no dangerouslySetInnerHTML needed.

export { REWARD_CONFIG, SECTION_UNLOCK_COSTS };
```

**Decision:** Emoji icons rendered directly as Unicode (safer than HTML entity interpolation in React).

- [ ] **Step 3: Type-check + commit**

```bash
cd /c/Users/lukol/weeks-iot && npx tsc --noEmit && git add src/lib/rewards.ts && git commit -m "feat(rewards): port level badges (data)" && git push
```

---

### Task 15: [Agent] Port PIN logic

**Files:** `src/lib/pin.ts` (create)

- [ ] **Step 1: Read source**

`legacy-vanilla/app.js` lines 1550–1564 contain `buildDailyPin()` and related date helpers.

- [ ] **Step 2: Create `src/lib/pin.ts`**

```typescript
import { DEFAULT_CONFIG } from "./config";

/**
 * Generates a "daily" PIN derived from the date. Client-side logic — visible to
 * anyone who reads the bundle. Serves to rotate PIN so yesterday's PIN doesn't
 * keep working, not as a real security mechanism.
 */
export function getTodayKey(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function buildDailyPin(date: Date = new Date()): string {
  // Port exact algorithm from legacy-vanilla/app.js buildDailyPin().
  // Typically something like: seed = day_of_year; pin = hash(seed) % 10000 padded to 4.
  // Replicate literal behavior from source.
  const key = getTodayKey(date);
  let hash = 0;
  for (const c of key) {
    hash = (hash * 31 + c.charCodeAt(0)) >>> 0;
  }
  return String(hash % 10000).padStart(4, "0");
}

export type PinLevel = "daily" | "lecturer" | "admin";

export function verifyPin(input: string, level: PinLevel): boolean {
  switch (level) {
    case "daily":
      return input === buildDailyPin() || input === DEFAULT_CONFIG.dailyPin;
    case "lecturer":
      return input === DEFAULT_CONFIG.lecturerPin;
    case "admin":
      return input === DEFAULT_CONFIG.adminPassword;
  }
}
```

**Verification:** read step4n's `buildDailyPin` in `legacy-vanilla/app.js` and ensure the algorithm above matches his. If different, use his exact formula — consistency > cleanness.

- [ ] **Step 3: Type-check + commit**

```bash
cd /c/Users/lukol/weeks-iot && npx tsc --noEmit && git add src/lib/pin.ts && git commit -m "feat(pin): port daily PIN logic + verification" && git push
```

---

### Task 16: [Agent] Port validation utilities

**Files:** `src/lib/validation.ts` (create)

- [ ] **Step 1: Read source**

`legacy-vanilla/app.js` lines 1565–1614 contain: `escapeHtml`, `normalizeEmail`, `isValidEmail`, `buildNicknameFromEmail`, `buildDateSeed`, `hasAll`, `hasAny`, `countMatches`, `normalizeCodeForValidation`.

- [ ] **Step 2: Create `src/lib/validation.ts`**

```typescript
/**
 * In React/JSX rendering, escape is automatic. escapeHtml is kept for
 * cases where we genuinely need to sanitize strings (e.g., into
 * dangerouslySetInnerHTML — which we should avoid anyway).
 */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeEmail(email));
}

export function buildNicknameFromEmail(email: string): string {
  const local = normalizeEmail(email).split("@")[0] ?? "";
  return local.replace(/[^a-z0-9]/gi, "") || "student";
}

export function buildDateSeed(dateKey: string): number {
  let h = 0;
  for (const c of dateKey) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h;
}

export function hasAll(text: string, patterns: (string | RegExp)[]): boolean {
  return patterns.every((p) =>
    typeof p === "string" ? text.includes(p) : p.test(text)
  );
}

export function hasAny(text: string, patterns: (string | RegExp)[]): boolean {
  return patterns.some((p) =>
    typeof p === "string" ? text.includes(p) : p.test(text)
  );
}

export function countMatches(text: string, pattern: RegExp): number {
  const flags = pattern.flags.includes("g") ? pattern.flags : pattern.flags + "g";
  const re = new RegExp(pattern.source, flags);
  return (text.match(re) ?? []).length;
}

export function normalizeCodeForValidation(code: string): string {
  // Port exact transformations from legacy-vanilla/app.js normalizeCodeForValidation().
  // Typically: lowercase, collapse whitespace, strip comments, normalize string quotes.
  return code
    .replace(/\/\/.*$/gm, "")              // line comments
    .replace(/\/\*[\s\S]*?\*\//g, "")      // block comments
    .replace(/\s+/g, " ")                  // collapse whitespace
    .trim();
}
```

**Verify against source:** open `legacy-vanilla/app.js` around line 1565 and confirm `normalizeCodeForValidation` transformations match. Adjust if step4n's version differs.

- [ ] **Step 3: Type-check + commit**

```bash
cd /c/Users/lukol/weeks-iot && npx tsc --noEmit && git add src/lib/validation.ts && git commit -m "feat(validation): port input/code normalization utilities" && git push
```

---

### Task 17: [Agent] Port tasks data

**Files:** `src/lib/tasks.ts` (create)

- [ ] **Step 1: Read source**

`legacy-vanilla/app.js` lines 780–1491 contain `sections` array with all 21 tasks across beginner/advanced/expert. Lines 648–686 contain `TASK_IMAGE_CONFIG` mapping tasks to image filenames. Lines 1491–1545 contain `SECTION_TASK_ORDER`.

- [ ] **Step 2: Create `src/lib/tasks.ts`**

Port `sections` directly. Convert any image keys from step4n's mapping; ensure `imageKey` in each task maps to a file that exists in `public/task-images/`.

```typescript
import type { Section } from "@/types";
import { SECTION_UNLOCK_COSTS } from "./config";

export const SECTIONS: Section[] = [
  {
    id: "beginner",
    label: "Začátečník",
    tasks: [
      // ... 21 tasks across 3 sections, ported 1:1 from step4n
    ],
  },
  {
    id: "advanced",
    label: "Pokročilý",
    unlockCost: SECTION_UNLOCK_COSTS.advanced,
    tasks: [
      // ...
    ],
  },
  {
    id: "expert",
    label: "Expert",
    unlockCost: SECTION_UNLOCK_COSTS.expert,
    tasks: [
      // ...
    ],
  },
];

export function getAllTasks(): Section["tasks"] {
  return SECTIONS.flatMap((s) => s.tasks);
}

export function findTask(id: string) {
  return getAllTasks().find((t) => t.id === id);
}

export function findSectionByTaskId(id: string) {
  return SECTIONS.find((s) => s.tasks.some((t) => t.id === id));
}
```

**This is a large mechanical port.** Preserve step4n's exact task IDs, titles, descriptions, reward values, image keys. Restore Czech diacritics where step4n stripped them.

- [ ] **Step 3: Type-check + verify image mappings**

```bash
cd /c/Users/lukol/weeks-iot && npx tsc --noEmit
```

Manually: for each task with `imageKey: "x"`, check `public/task-images/x.png` exists.

- [ ] **Step 4: Commit**

```bash
cd /c/Users/lukol/weeks-iot && git add src/lib/tasks.ts && git commit -m "feat(tasks): port 21 Arduino tasks across 3 sections" && git push
```

---

### Task 18: [Agent] Port task validation logic (TASK_SOLUTIONS)

**Files:** `src/lib/task-solutions.ts` (create)

- [ ] **Step 1: Read source**

`legacy-vanilla/app.js` lines 155–647 contain `TASK_SOLUTIONS` object — 493 lines mapping each task ID to a validation function or spec.

- [ ] **Step 2: Create `src/lib/task-solutions.ts`**

Preserve structure. Each task's validator becomes a typed function.

```typescript
import type { ValidationResult } from "@/types";
import { normalizeCodeForValidation, hasAll, hasAny, countMatches } from "./validation";

type Validator = (rawCode: string) => ValidationResult;

export const TASK_SOLUTIONS: Record<string, Validator> = {
  // Port each task's validator from legacy-vanilla/app.js lines 155-647.
  // Example structure:
  "prvni-led": (raw) => {
    const code = normalizeCodeForValidation(raw);
    if (!hasAll(code, [/pinMode\(\s*\d+\s*,\s*OUTPUT/i, /digitalWrite\(\s*\d+\s*,\s*HIGH/i])) {
      return { valid: false, feedback: "Chybí pinMode OUTPUT a digitalWrite HIGH." };
    }
    return { valid: true };
  },
  // ... 20 more task validators
};

export function validateTaskCode(taskId: string, code: string): ValidationResult {
  const validator = TASK_SOLUTIONS[taskId];
  if (!validator) {
    return { valid: false, feedback: "Pro tento úkol není definována validace." };
  }
  return validator(code);
}
```

**Port fidelity:** copy step4n's exact regex patterns and condition logic. Don't "improve" validators — that's a v2.1+ task. If a validator in the source uses an obscure trick, replicate it literally with a comment explaining what it does.

- [ ] **Step 3: Type-check + commit**

```bash
cd /c/Users/lukol/weeks-iot && npx tsc --noEmit && git add src/lib/task-solutions.ts && git commit -m "feat(tasks): port TASK_SOLUTIONS validation (1:1 from vanilla)" && git push
```

---

### Task 19: [Agent] Complete rewards logic (purchases, bonuses)

**Files:** `src/lib/rewards.ts` (extend)

- [ ] **Step 1: Read source**

Scattered in `legacy-vanilla/app.js` — search for `helpCodeCost`, `helpWiringCost`, `skipCost`, `noHelpBonusStars`, `firstTryBonusStars`, `dailyChallengeStars` usages to find the purchase/bonus functions.

- [ ] **Step 2: Extend `src/lib/rewards.ts`**

Append to existing file:

```typescript
import type { AccountState, TaskState } from "@/types";
import { DEFAULT_CONFIG, AVATAR_SHOP_CONFIG, STYLE_SHOP_CONFIG } from "./config";

export function canAfford(account: AccountState, cost: number): boolean {
  return account.stars >= cost;
}

export function deductStars(account: AccountState, cost: number): AccountState {
  return { ...account, stars: Math.max(0, account.stars - cost) };
}

export function awardStars(account: AccountState, stars: number): AccountState {
  return { ...account, stars: account.stars + stars };
}

export function addToken(account: AccountState): AccountState {
  return { ...account, tokens: account.tokens + 1 };
}

export function computeTaskReward(task: { reward: number }, taskState: TaskState): number {
  let total = task.reward;
  if (!taskState.helpCodeUsed && !taskState.helpWiringUsed && !taskState.skipUsed) {
    total += REWARD_CONFIG.noHelpBonusStars;
  }
  if (taskState.firstTry) {
    total += REWARD_CONFIG.firstTryBonusStars;
  }
  return total;
}

export function purchaseHelpCode(account: AccountState): AccountState | null {
  if (!canAfford(account, DEFAULT_CONFIG.helpCodeCost)) return null;
  return deductStars(account, DEFAULT_CONFIG.helpCodeCost);
}

export function purchaseHelpWiring(account: AccountState): AccountState | null {
  if (!canAfford(account, DEFAULT_CONFIG.helpWiringCost)) return null;
  return deductStars(account, DEFAULT_CONFIG.helpWiringCost);
}

export function purchaseSkip(account: AccountState): AccountState | null {
  if (!canAfford(account, DEFAULT_CONFIG.skipCost)) return null;
  return deductStars(account, DEFAULT_CONFIG.skipCost);
}

export function purchaseThemeDirect(account: AccountState, themeId: string): AccountState | null {
  const cost = STYLE_SHOP_CONFIG.directUnlockCost;
  if (!canAfford(account, cost)) return null;
  if (account.unlockedThemes.includes(themeId as any)) return null;
  return {
    ...deductStars(account, cost),
    unlockedThemes: [...account.unlockedThemes, themeId as any],
  };
}

export function purchaseAvatarDirect(account: AccountState, avatarId: string): AccountState | null {
  const cost = AVATAR_SHOP_CONFIG.directUnlockCost;
  if (!canAfford(account, cost)) return null;
  if (account.unlockedAvatars.includes(avatarId)) return null;
  return {
    ...deductStars(account, cost),
    unlockedAvatars: [...account.unlockedAvatars, avatarId],
  };
}

export function awardDailyChallenge(account: AccountState): AccountState {
  return { ...awardStars(account, REWARD_CONFIG.dailyChallengeStars), dailyChallengeCompleted: true };
}

export function computeLevelBadges(stars: number): string[] {
  return LEVEL_BADGES.filter((b) => stars >= (b.minStars ?? 0)).map((b) => b.id);
}
```

- [ ] **Step 3: Type-check + commit**

```bash
cd /c/Users/lukol/weeks-iot && npx tsc --noEmit && git add src/lib/rewards.ts && git commit -m "feat(rewards): port purchase + bonus logic" && git push
```

---

## Phase 3: State Management

### Task 20: [Agent] Implement storage wrapper with error recovery

**Files:** `src/lib/storage.ts` (create)

- [ ] **Step 1: Create `src/lib/storage.ts`**

```typescript
import type { GameState, AccountState, TaskState, ScreenState } from "@/types";
import { CONFIG_VERSION, STORAGE_KEY } from "./config";
import { DEFAULT_AVATAR_ID } from "./avatars";
import { getAllTasks, SECTIONS } from "./tasks";

function createDefaultTaskState(): TaskState {
  return {
    status: "available",
    helpCodeUsed: false,
    helpWiringUsed: false,
    skipUsed: false,
    firstTry: true,
  };
}

function createDefaultAccountState(): AccountState {
  return {
    avatarId: DEFAULT_AVATAR_ID,
    stars: 0,
    tokens: 0,
    unlockedThemes: ["classic"],
    unlockedAvatars: [DEFAULT_AVATAR_ID],
    currentTheme: "classic",
    dailyChallengeCompleted: false,
    levelBadges: ["prvni-led"],
  };
}

function createDefaultScreenState(): ScreenState {
  return { currentScreen: "pin-entry", pinLevel: "none" };
}

export function createDefaultGameState(): GameState {
  const tasks: Record<string, TaskState> = {};
  for (const t of getAllTasks()) {
    tasks[t.id] = createDefaultTaskState();
  }
  const sections: GameState["sections"] = {
    beginner: { unlocked: true },
    advanced: { unlocked: false },
    expert: { unlocked: false },
  };
  return {
    version: CONFIG_VERSION,
    account: createDefaultAccountState(),
    tasks,
    sections,
    screen: createDefaultScreenState(),
  };
}

export function loadGameState(): GameState {
  if (typeof window === "undefined") return createDefaultGameState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return createDefaultGameState();
    const parsed = JSON.parse(raw) as GameState;
    if (parsed.version !== CONFIG_VERSION) return createDefaultGameState();
    return parsed;
  } catch (err) {
    console.warn("[storage] corrupt state, resetting:", err);
    return createDefaultGameState();
  }
}

export function saveGameState(state: GameState): { ok: boolean; error?: string } {
  if (typeof window === "undefined") return { ok: true };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return { ok: true };
  } catch (err) {
    console.warn("[storage] write failed:", err);
    return { ok: false, error: String(err) };
  }
}

export function resetGameState(): GameState {
  if (typeof window !== "undefined") {
    try { window.localStorage.removeItem(STORAGE_KEY); } catch {}
  }
  return createDefaultGameState();
}
```

- [ ] **Step 2: Type-check + commit**

```bash
cd /c/Users/lukol/weeks-iot && npx tsc --noEmit && git add src/lib/storage.ts && git commit -m "feat(storage): localStorage wrapper with error recovery + version check" && git push
```

---

### Task 21: [Agent] Implement GameStateProvider

**Files:** `src/components/providers/GameStateProvider.tsx` (create)

- [ ] **Step 1: Create `src/components/providers/GameStateProvider.tsx`**

```typescript
"use client";

import { createContext, useContext, useEffect, useReducer, type ReactNode } from "react";
import type { GameState } from "@/types";
import { createDefaultGameState, loadGameState, saveGameState } from "@/lib/storage";
import { applyTheme } from "@/lib/themes";

type Action =
  | { type: "HYDRATE"; state: GameState }
  | { type: "SET_SCREEN"; screen: GameState["screen"] }
  | { type: "SET_PIN_LEVEL"; level: GameState["screen"]["pinLevel"] }
  | { type: "OPEN_TASK"; taskId: string }
  | { type: "COMPLETE_TASK"; taskId: string; reward: number }
  | { type: "USE_HELP_CODE"; taskId: string }
  | { type: "USE_HELP_WIRING"; taskId: string }
  | { type: "USE_SKIP"; taskId: string }
  | { type: "PURCHASE_THEME"; themeId: string }
  | { type: "PURCHASE_AVATAR"; avatarId: string }
  | { type: "SET_THEME"; themeId: string }
  | { type: "SET_AVATAR"; avatarId: string }
  | { type: "UNLOCK_SECTION"; sectionId: "advanced" | "expert" }
  | { type: "AWARD_DAILY_CHALLENGE" }
  | { type: "RESET" };

import {
  computeTaskReward,
  awardStars,
  purchaseHelpCode,
  purchaseHelpWiring,
  purchaseSkip,
  purchaseThemeDirect,
  purchaseAvatarDirect,
  awardDailyChallenge,
  deductStars,
  computeLevelBadges,
} from "@/lib/rewards";
import { SECTION_UNLOCK_COSTS } from "@/lib/config";
import { findTask } from "@/lib/tasks";

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "HYDRATE":
      return action.state;

    case "SET_SCREEN":
      return { ...state, screen: action.screen };

    case "SET_PIN_LEVEL":
      return { ...state, screen: { ...state.screen, pinLevel: action.level } };

    case "OPEN_TASK":
      return { ...state, screen: { ...state.screen, activeTaskId: action.taskId, currentScreen: "task-detail" } };

    case "COMPLETE_TASK": {
      const task = findTask(action.taskId);
      if (!task) return state;
      const ts = state.tasks[action.taskId];
      if (ts?.status === "completed") return state; // idempotent
      const reward = computeTaskReward({ reward: action.reward }, ts);
      const newAccount = awardStars(state.account, reward);
      newAccount.levelBadges = computeLevelBadges(newAccount.stars);
      return {
        ...state,
        account: newAccount,
        tasks: { ...state.tasks, [action.taskId]: { ...ts, status: "completed" } },
      };
    }

    case "USE_HELP_CODE": {
      const acc = purchaseHelpCode(state.account);
      if (!acc) return state;
      const ts = state.tasks[action.taskId];
      return { ...state, account: acc, tasks: { ...state.tasks, [action.taskId]: { ...ts, helpCodeUsed: true, firstTry: false } } };
    }

    case "USE_HELP_WIRING": {
      const acc = purchaseHelpWiring(state.account);
      if (!acc) return state;
      const ts = state.tasks[action.taskId];
      return { ...state, account: acc, tasks: { ...state.tasks, [action.taskId]: { ...ts, helpWiringUsed: true, firstTry: false } } };
    }

    case "USE_SKIP": {
      const acc = purchaseSkip(state.account);
      if (!acc) return state;
      const ts = state.tasks[action.taskId];
      return { ...state, account: acc, tasks: { ...state.tasks, [action.taskId]: { ...ts, skipUsed: true, firstTry: false, status: "completed" } } };
    }

    case "PURCHASE_THEME": {
      const acc = purchaseThemeDirect(state.account, action.themeId);
      if (!acc) return state;
      return { ...state, account: acc };
    }

    case "PURCHASE_AVATAR": {
      const acc = purchaseAvatarDirect(state.account, action.avatarId);
      if (!acc) return state;
      return { ...state, account: acc };
    }

    case "SET_THEME": {
      if (!state.account.unlockedThemes.includes(action.themeId as any)) return state;
      return { ...state, account: { ...state.account, currentTheme: action.themeId as any } };
    }

    case "SET_AVATAR": {
      if (!state.account.unlockedAvatars.includes(action.avatarId)) return state;
      return { ...state, account: { ...state.account, avatarId: action.avatarId } };
    }

    case "UNLOCK_SECTION": {
      const cost = SECTION_UNLOCK_COSTS[action.sectionId];
      if (state.account.stars < cost) return state;
      if (state.sections[action.sectionId].unlocked) return state;
      return {
        ...state,
        account: deductStars(state.account, cost),
        sections: { ...state.sections, [action.sectionId]: { unlocked: true } },
      };
    }

    case "AWARD_DAILY_CHALLENGE":
      return { ...state, account: awardDailyChallenge(state.account) };

    case "RESET":
      return createDefaultGameState();

    default:
      return state;
  }
}

interface GameStateContextValue {
  state: GameState;
  dispatch: React.Dispatch<Action>;
}

const GameStateContext = createContext<GameStateContextValue | null>(null);

export function GameStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, createDefaultGameState());

  // Hydrate from localStorage on mount
  useEffect(() => {
    const loaded = loadGameState();
    dispatch({ type: "HYDRATE", state: loaded });
  }, []);

  // Persist on every state change
  useEffect(() => {
    saveGameState(state);
  }, [state]);

  // Apply theme on state change
  useEffect(() => {
    applyTheme(state.account.currentTheme);
  }, [state.account.currentTheme]);

  return <GameStateContext.Provider value={{ state, dispatch }}>{children}</GameStateContext.Provider>;
}

export function useGameState() {
  const ctx = useContext(GameStateContext);
  if (!ctx) throw new Error("useGameState must be inside GameStateProvider");
  return ctx;
}
```

**Reducer cases left as comments:** implement each case during execution. Each action delegates to the pure helpers in `rewards.ts` where applicable — keep reducer thin.

- [ ] **Step 2: Wire provider into `src/app/layout.tsx`**

Modify `src/app/layout.tsx` to wrap `{children}` with `<GameStateProvider>`.

- [ ] **Step 3: Type-check + commit**

```bash
cd /c/Users/lukol/weeks-iot && npx tsc --noEmit && git add src/components/providers/GameStateProvider.tsx src/app/layout.tsx && git commit -m "feat(state): GameStateProvider with localStorage persistence + theme apply" && git push
```

---

## Phase 4: Theme CSS + UI Primitives

### Task 22: [Agent] Theme CSS variables in globals.css

**Files:** `src/app/globals.css`

- [ ] **Step 1: Rewrite `src/app/globals.css`**

Read `legacy-vanilla/style.css` lines 1–60 for step4n's `:root` theme variables (Classic). For each of 8 themes, define a `[data-theme="<id>"]` block with the theme's colors. Keep step4n's exact color values.

Template:
```css
@import "tailwindcss";

:root,
[data-theme="classic"] {
  --theme-bg: #0d1427;
  --theme-panel: rgba(31, 40, 63, 0.6);
  --theme-panel-rgb: 31, 40, 63;
  --theme-accent: #71b0ff;
  --theme-accent-soft: rgba(113, 153, 255, 0.18);
  --theme-text: #f8fafc;
  --theme-muted: #a6b2c8;
  --theme-star: #ffbc5b;
  --theme-success: #2dd4a6;
  --theme-shadow: 0 28px 80px rgba(0, 0, 0, 0.36);
}

[data-theme="sunrise"] {
  --theme-bg: #1a0e1f;
  --theme-panel: rgba(53, 32, 25, 0.6);
  /* ... port warm palette ... */
}

/* 6 more themes */

body {
  background: var(--theme-bg);
  color: var(--theme-text);
  background-image:
    linear-gradient(180deg, rgba(7,13,26,0.92) 0%, rgba(10,17,31,0.9) 34%, rgba(13,20,39,0.96) 100%),
    url("https://weeks.cz/_next/image?q=75&url=%2Fimages%2Fhwlab%2Fhwlab-7976.webp&w=3840");
  background-size: cover;
  background-attachment: fixed;
}

.panel-glass {
  background: var(--theme-panel);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.75rem;
  box-shadow: var(--theme-shadow);
}
```

**Exact color values** must come from `legacy-vanilla/style.css` (step4n's existing palette variants per theme). If step4n didn't define all 8 themes in CSS (he may have had JS switches), generate palette extensions that match the theme's `accent` color with consistent dark-mode saturation.

- [ ] **Step 2: Build + preview**

```bash
cd /c/Users/lukol/weeks-iot && npm run build && npm run dev
```

Open `localhost:3000` → no errors. Page still shows Next.js default, but body background should be dark + HWLab photo.

- [ ] **Step 3: Commit**

```bash
cd /c/Users/lukol/weeks-iot && git add src/app/globals.css && git commit -m "feat(theme): CSS variables for 8 themes + glass panel primitive" && git push
```

---

### Task 23: [Agent] UI primitives (Button, PanelGlass, StarBadge, LevelBadge, ProgressBar, Modal)

**Files:** `src/components/ui/*.tsx` (create 6 files)

- [ ] **Step 1: Create `src/components/ui/Button.tsx`**

```typescript
"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:   "bg-[color:var(--theme-accent)] text-[#0d1427] hover:brightness-110",
  secondary: "bg-[color:var(--theme-panel)] text-[color:var(--theme-text)] border border-white/10 hover:bg-white/5",
  ghost:     "bg-transparent text-[color:var(--theme-text)] hover:bg-white/5",
  danger:    "bg-red-500 text-white hover:bg-red-600",
};

const SIZE_CLASSES: Record<Size, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", className = "", ...rest },
  ref
) {
  return (
    <button
      ref={ref}
      className={`inline-flex items-center justify-center rounded-lg font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`}
      {...rest}
    />
  );
});
```

- [ ] **Step 2: Create `src/components/ui/PanelGlass.tsx`**

```typescript
import type { HTMLAttributes, ReactNode } from "react";

interface PanelGlassProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function PanelGlass({ className = "", children, ...rest }: PanelGlassProps) {
  return (
    <div className={`panel-glass p-6 ${className}`} {...rest}>
      {children}
    </div>
  );
}
```

- [ ] **Step 3: Create `src/components/ui/StarBadge.tsx`**

```typescript
import { Star } from "lucide-react";

export function StarBadge({ count }: { count: number }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-[color:var(--theme-panel)] px-3 py-1 text-sm font-semibold">
      <Star className="h-4 w-4 fill-[color:var(--theme-star)] text-[color:var(--theme-star)]" />
      {count}
    </span>
  );
}
```

- [ ] **Step 4: Create `src/components/ui/LevelBadge.tsx`**

```typescript
import type { LevelBadge as LevelBadgeType } from "@/types";

export function LevelBadge({ badge, achieved }: { badge: LevelBadgeType; achieved: boolean }) {
  return (
    <div className={`flex flex-col items-center gap-1 ${achieved ? "" : "opacity-40 grayscale"}`}>
      <div className="text-4xl">{badge.icon}</div>
      <div className="text-xs font-semibold tracking-wide uppercase">{badge.label}</div>
    </div>
  );
}
```

- [ ] **Step 5: Create `src/components/ui/ProgressBar.tsx`**

```typescript
export function ProgressBar({ value, max }: { value: number; max: number }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
      <div
        className="h-full rounded-full bg-[color:var(--theme-accent)] transition-all"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
```

- [ ] **Step 6: Create `src/components/ui/Modal.tsx`**

```typescript
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import type { ReactNode } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="panel-glass w-full max-w-lg p-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              {title && <h2 className="text-xl font-bold">{title}</h2>}
              <button onClick={onClose} className="rounded p-1 hover:bg-white/10" aria-label="Zavřít">
                <X className="h-5 w-5" />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

- [ ] **Step 7: Type-check + commit**

```bash
cd /c/Users/lukol/weeks-iot && npx tsc --noEmit && git add src/components/ui/ && git commit -m "feat(ui): Button, PanelGlass, StarBadge, LevelBadge, ProgressBar, Modal" && git push
```

---

## Phase 5: Screens

### Task 24: [Agent] PinEntry screen

**Files:** `src/components/screens/PinEntry.tsx` (create)

- [ ] **Step 1: Create `src/components/screens/PinEntry.tsx`**

```typescript
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { PanelGlass } from "@/components/ui/PanelGlass";
import { useGameState } from "@/components/providers/GameStateProvider";
import { verifyPin, type PinLevel } from "@/lib/pin";

export function PinEntry() {
  const { dispatch } = useGameState();
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // Try admin first (longest), then lecturer, then daily
    const levels: PinLevel[] = ["admin", "lecturer", "daily"];
    const matched = levels.find((l) => verifyPin(value, l));
    if (!matched) {
      setError("Špatný PIN. Zkus znovu.");
      return;
    }

    dispatch({ type: "SET_PIN_LEVEL", level: matched });
    dispatch({
      type: "SET_SCREEN",
      screen: { currentScreen: matched === "admin" ? "admin" : "task-list", pinLevel: matched },
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex min-h-screen items-center justify-center p-4"
    >
      <PanelGlass className="w-full max-w-sm">
        <h1 className="mb-2 text-2xl font-bold text-center">Weeks IoT</h1>
        <p className="mb-6 text-center text-sm text-[color:var(--theme-muted)]">
          Zadej PIN pro vstup
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={10}
            value={value}
            onChange={(e) => setValue(e.target.value.replace(/\D/g, ""))}
            className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-center text-2xl tracking-widest focus:border-[color:var(--theme-accent)] focus:outline-none"
            placeholder="● ● ● ●"
            autoFocus
          />
          {error && <p className="text-center text-sm text-red-400">{error}</p>}
          <Button type="submit" size="lg" className="w-full">Vstoupit</Button>
        </form>
      </PanelGlass>
    </motion.div>
  );
}
```

- [ ] **Step 2: Type-check + commit**

```bash
cd /c/Users/lukol/weeks-iot && npx tsc --noEmit && git add src/components/screens/PinEntry.tsx && git commit -m "feat(screens): PinEntry with 3-level PIN verification" && git push
```

---

### Task 25: [Agent] TaskList screen

**Files:** `src/components/screens/TaskList.tsx` (create)

- [ ] **Step 1: Create `src/components/screens/TaskList.tsx`**

```typescript
"use client";

import { motion } from "framer-motion";
import { Lock, Check } from "lucide-react";
import { PanelGlass } from "@/components/ui/PanelGlass";
import { StarBadge } from "@/components/ui/StarBadge";
import { Button } from "@/components/ui/Button";
import { useGameState } from "@/components/providers/GameStateProvider";
import { SECTIONS } from "@/lib/tasks";
import type { Task, SectionId } from "@/types";

export function TaskList() {
  const { state, dispatch } = useGameState();

  function openTask(t: Task) {
    dispatch({ type: "OPEN_TASK", taskId: t.id });
    dispatch({ type: "SET_SCREEN", screen: { currentScreen: "task-detail", activeTaskId: t.id, pinLevel: state.screen.pinLevel } });
  }

  function unlockSection(sectionId: "advanced" | "expert") {
    dispatch({ type: "UNLOCK_SECTION", sectionId });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-5xl p-6 space-y-8"
    >
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Úkoly</h1>
        <StarBadge count={state.account.stars} />
      </header>

      {SECTIONS.map((section) => {
        const unlocked = state.sections[section.id].unlocked;
        return (
          <section key={section.id}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">{section.label}</h2>
              {!unlocked && section.unlockCost && (
                <Button
                  variant="secondary"
                  onClick={() => unlockSection(section.id as "advanced" | "expert")}
                  disabled={state.account.stars < section.unlockCost}
                >
                  <Lock className="mr-2 h-4 w-4" />
                  Odemknout za {section.unlockCost} ⭐
                </Button>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {section.tasks.map((t) => {
                const ts = state.tasks[t.id];
                const done = ts?.status === "completed";
                return (
                  <PanelGlass
                    key={t.id}
                    className={`cursor-pointer transition-transform hover:scale-[1.02] ${!unlocked ? "pointer-events-none opacity-40" : ""}`}
                    onClick={() => unlocked && openTask(t)}
                  >
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <h3 className="font-semibold">{t.title}</h3>
                      {done && <Check className="h-5 w-5 text-[color:var(--theme-success)]" />}
                    </div>
                    <p className="text-sm text-[color:var(--theme-muted)] line-clamp-2">
                      {t.description}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <StarBadge count={t.reward} />
                    </div>
                  </PanelGlass>
                );
              })}
            </div>
          </section>
        );
      })}
    </motion.div>
  );
}
```

- [ ] **Step 2: Type-check + commit**

```bash
cd /c/Users/lukol/weeks-iot && npx tsc --noEmit && git add src/components/screens/TaskList.tsx && git commit -m "feat(screens): TaskList with 3 sections + section unlocks" && git push
```

---

### Task 26: [Agent] Task components (CodeValidator, HelpCards, TaskImage)

**Files:** `src/components/task/{CodeValidator,HelpCards,TaskImage}.tsx` (create 3 files)

- [ ] **Step 1: Create `src/components/task/CodeValidator.tsx`**

```typescript
"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { validateTaskCode } from "@/lib/task-solutions";

interface Props {
  taskId: string;
  onSuccess: () => void;
}

export function CodeValidator({ taskId, onSuccess }: Props) {
  const [code, setCode] = useState("");
  const [result, setResult] = useState<{ valid: boolean; feedback?: string } | null>(null);

  function handleCheck() {
    const r = validateTaskCode(taskId, code);
    setResult(r);
    if (r.valid) onSuccess();
  }

  return (
    <div className="space-y-3">
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="w-full rounded-lg border border-white/10 bg-black/40 p-3 font-mono text-sm focus:border-[color:var(--theme-accent)] focus:outline-none"
        rows={10}
        placeholder="// sem vlož svůj Arduino kód..."
        spellCheck={false}
      />
      <Button onClick={handleCheck} disabled={!code.trim()}>Zkontrolovat</Button>
      {result && (
        <div className={`flex items-start gap-2 rounded-lg p-3 text-sm ${result.valid ? "bg-[color:var(--theme-success)]/10 text-[color:var(--theme-success)]" : "bg-red-500/10 text-red-400"}`}>
          {result.valid ? <Check className="h-5 w-5" /> : <X className="h-5 w-5" />}
          <div>{result.valid ? "Super! Úkol splněn." : result.feedback ?? "Zkus to znovu."}</div>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Create `src/components/task/HelpCards.tsx`**

```typescript
"use client";

import { Button } from "@/components/ui/Button";
import { DEFAULT_CONFIG } from "@/lib/config";
import { useGameState } from "@/components/providers/GameStateProvider";
import type { TaskState } from "@/types";

interface Props {
  taskId: string;
  taskState: TaskState;
}

export function HelpCards({ taskId, taskState }: Props) {
  const { state, dispatch } = useGameState();
  const stars = state.account.stars;

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
      <Button
        variant="secondary"
        disabled={taskState.helpCodeUsed || stars < DEFAULT_CONFIG.helpCodeCost}
        onClick={() => dispatch({ type: "USE_HELP_CODE", taskId })}
      >
        💡 Ukaž kód ({DEFAULT_CONFIG.helpCodeCost} ⭐)
      </Button>
      <Button
        variant="secondary"
        disabled={taskState.helpWiringUsed || stars < DEFAULT_CONFIG.helpWiringCost}
        onClick={() => dispatch({ type: "USE_HELP_WIRING", taskId })}
      >
        🔌 Ukaž zapojení ({DEFAULT_CONFIG.helpWiringCost} ⭐)
      </Button>
      <Button
        variant="secondary"
        disabled={taskState.skipUsed || stars < DEFAULT_CONFIG.skipCost}
        onClick={() => dispatch({ type: "USE_SKIP", taskId })}
      >
        ⏭ Přeskočit ({DEFAULT_CONFIG.skipCost} ⭐)
      </Button>
    </div>
  );
}
```

- [ ] **Step 3: Create `src/components/task/TaskImage.tsx`**

```typescript
"use client";

import Image from "next/image";
import { useState } from "react";
import { Modal } from "@/components/ui/Modal";

export function TaskImage({ imageKey, alt }: { imageKey: string; alt: string }) {
  const [zoomed, setZoomed] = useState(false);
  const src = `/task-images/${imageKey}.png`;
  return (
    <>
      <button
        onClick={() => setZoomed(true)}
        className="block w-full overflow-hidden rounded-lg border border-white/10"
      >
        <Image src={src} alt={alt} width={600} height={400} className="w-full" />
      </button>
      <Modal open={zoomed} onClose={() => setZoomed(false)} title={alt}>
        <Image src={src} alt={alt} width={1200} height={800} className="w-full" />
      </Modal>
    </>
  );
}
```

- [ ] **Step 4: Type-check + commit**

```bash
cd /c/Users/lukol/weeks-iot && npx tsc --noEmit && git add src/components/task/ && git commit -m "feat(task): CodeValidator, HelpCards, TaskImage components" && git push
```

---

### Task 27: [Agent] TaskDetail screen

**Files:** `src/components/screens/TaskDetail.tsx` (create)

- [ ] **Step 1: Create `src/components/screens/TaskDetail.tsx`**

```typescript
"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PanelGlass } from "@/components/ui/PanelGlass";
import { StarBadge } from "@/components/ui/StarBadge";
import { CodeValidator } from "@/components/task/CodeValidator";
import { HelpCards } from "@/components/task/HelpCards";
import { TaskImage } from "@/components/task/TaskImage";
import { useGameState } from "@/components/providers/GameStateProvider";
import { findTask } from "@/lib/tasks";

export function TaskDetail() {
  const { state, dispatch } = useGameState();
  const taskId = state.screen.activeTaskId;
  if (!taskId) return null;
  const task = findTask(taskId);
  if (!task) return null;
  const taskState = state.tasks[taskId];

  function goBack() {
    dispatch({ type: "SET_SCREEN", screen: { currentScreen: "task-list", pinLevel: state.screen.pinLevel } });
  }

  function handleSuccess() {
    dispatch({ type: "COMPLETE_TASK", taskId: taskId!, reward: task!.reward });
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="mx-auto max-w-3xl p-6 space-y-6"
    >
      <header className="flex items-center justify-between">
        <Button variant="ghost" onClick={goBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Zpět
        </Button>
        <StarBadge count={task.reward} />
      </header>

      <PanelGlass>
        <h1 className="mb-2 text-2xl font-bold">{task.title}</h1>
        <p className="whitespace-pre-line text-[color:var(--theme-muted)]">{task.description}</p>
      </PanelGlass>

      {task.imageKey && (
        <PanelGlass>
          <TaskImage imageKey={task.imageKey} alt={task.title} />
        </PanelGlass>
      )}

      {taskState.helpCodeUsed && task.hints?.code && (
        <PanelGlass>
          <h3 className="mb-2 font-semibold">Ukázkový kód</h3>
          <pre className="overflow-x-auto rounded bg-black/40 p-3 font-mono text-sm">{task.hints.code}</pre>
        </PanelGlass>
      )}

      {taskState.helpWiringUsed && task.hints?.wiring && (
        <PanelGlass>
          <h3 className="mb-2 font-semibold">Schéma zapojení</h3>
          <p className="text-sm text-[color:var(--theme-muted)]">{task.hints.wiring}</p>
        </PanelGlass>
      )}

      <PanelGlass>
        <h3 className="mb-3 font-semibold">Tvůj kód</h3>
        <CodeValidator taskId={task.id} onSuccess={handleSuccess} />
      </PanelGlass>

      <PanelGlass>
        <h3 className="mb-3 font-semibold">Pomocníci</h3>
        <HelpCards taskId={task.id} taskState={taskState} />
      </PanelGlass>
    </motion.div>
  );
}
```

- [ ] **Step 2: Type-check + commit**

```bash
cd /c/Users/lukol/weeks-iot && npx tsc --noEmit && git add src/components/screens/TaskDetail.tsx && git commit -m "feat(screens): TaskDetail with validator, hints, help cards" && git push
```

---

### Task 28: [Agent] StyleShop + AvatarShop + LevelBadges screens

**Files:** `src/components/screens/{StyleShop,AvatarShop,LevelBadges}.tsx` (create 3)

Similar pattern: list items from `STYLE_OPTIONS` / `AVATAR_OPTIONS` / `LEVEL_BADGES`, render as grid cards, show unlocked/locked state + purchase button. Each purchase dispatches the corresponding action to `GameStateProvider`.

Keep components under 150 lines each. Use `<PanelGlass>`, `<Button>`, `<StarBadge>`, `<LevelBadge>` primitives.

- [ ] **Step 1: Create `src/components/screens/StyleShop.tsx`** — grid of 8 theme cards with live mini-preview (3-line mock-up: header + badge + button rendered using each theme's CSS var values). Purchase via `dispatch({ type: "PURCHASE_THEME", themeId })`. Select unlocked via `dispatch({ type: "SET_THEME", themeId })`.

- [ ] **Step 2: Create `src/components/screens/AvatarShop.tsx`** — grid of avatar cards with `<Image>` from `/avatars/<filename>`. Purchase via `PURCHASE_AVATAR`. Select via `SET_AVATAR`.

- [ ] **Step 3: Create `src/components/screens/LevelBadges.tsx`** — horizontal row of `<LevelBadge>` components, `achieved` prop based on `state.account.stars` vs `badge.minStars`.

- [ ] **Step 4: Type-check + commit**

```bash
cd /c/Users/lukol/weeks-iot && npx tsc --noEmit && git add src/components/screens/ && git commit -m "feat(screens): StyleShop, AvatarShop, LevelBadges" && git push
```

---

### Task 29: [Agent] Main page orchestration

**Files:** `src/app/page.tsx`

- [ ] **Step 1: Replace `src/app/page.tsx`**

```typescript
"use client";

import { useGameState } from "@/components/providers/GameStateProvider";
import { PinEntry } from "@/components/screens/PinEntry";
import { TaskList } from "@/components/screens/TaskList";
import { TaskDetail } from "@/components/screens/TaskDetail";
import { StyleShop } from "@/components/screens/StyleShop";
import { AvatarShop } from "@/components/screens/AvatarShop";
import { LevelBadges } from "@/components/screens/LevelBadges";

export default function HomePage() {
  const { state } = useGameState();
  const screen = state.screen.currentScreen;

  switch (screen) {
    case "pin-entry":    return <PinEntry />;
    case "task-list":    return <TaskList />;
    case "task-detail":  return <TaskDetail />;
    case "style-shop":   return <StyleShop />;
    case "avatar-shop":  return <AvatarShop />;
    case "level-badges": return <LevelBadges />;
    default:             return <PinEntry />;
  }
}
```

- [ ] **Step 2: Verify build + dev preview**

```bash
cd /c/Users/lukol/weeks-iot && npm run build && npm run dev
```

Visit `localhost:3000` → PIN entry should render. Enter daily PIN (e.g., `123`) → TaskList appears with beginner section unlocked.

- [ ] **Step 3: Commit**

```bash
cd /c/Users/lukol/weeks-iot && git add src/app/page.tsx && git commit -m "feat(app): main page switches between screens based on state" && git push
```

---

### Task 30: [Agent] Admin page

**Files:** `src/app/admin/page.tsx`

- [ ] **Step 1: Create `src/app/admin/page.tsx`**

```typescript
"use client";

import { useGameState } from "@/components/providers/GameStateProvider";
import { PanelGlass } from "@/components/ui/PanelGlass";
import { Button } from "@/components/ui/Button";
import { getAllTasks } from "@/lib/tasks";
import { buildDailyPin } from "@/lib/pin";
import { DEFAULT_CONFIG } from "@/lib/config";

export default function AdminPage() {
  const { state, dispatch } = useGameState();

  if (state.screen.pinLevel !== "admin") {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <PanelGlass>
          <p>Přístup jen s admin PINem.</p>
          <Button
            className="mt-4"
            onClick={() => dispatch({ type: "SET_SCREEN", screen: { currentScreen: "pin-entry", pinLevel: "none" } })}
          >
            Zpět na PIN
          </Button>
        </PanelGlass>
      </div>
    );
  }

  const completedCount = Object.values(state.tasks).filter((t) => t.status === "completed").length;
  const totalCount = getAllTasks().length;

  return (
    <div className="mx-auto max-w-3xl p-6 space-y-4">
      <h1 className="text-3xl font-bold">Admin</h1>

      <PanelGlass>
        <h2 className="mb-2 text-lg font-semibold">PINy</h2>
        <ul className="space-y-1 text-sm">
          <li>Daily (dnes): <code>{buildDailyPin()}</code></li>
          <li>Daily (fixed fallback): <code>{DEFAULT_CONFIG.dailyPin}</code></li>
          <li>Lecturer: <code>{DEFAULT_CONFIG.lecturerPin}</code></li>
          <li>Admin: <code>{DEFAULT_CONFIG.adminPassword}</code></li>
        </ul>
      </PanelGlass>

      <PanelGlass>
        <h2 className="mb-2 text-lg font-semibold">Statistiky</h2>
        <p>Dokončeno: {completedCount} / {totalCount}</p>
        <p>Hvězdičky: {state.account.stars}</p>
        <p>Tokeny: {state.account.tokens}</p>
      </PanelGlass>

      <Button variant="danger" onClick={() => dispatch({ type: "RESET" })}>
        Reset stavu (smaže progress)
      </Button>
    </div>
  );
}
```

- [ ] **Step 2: Type-check + commit**

```bash
cd /c/Users/lukol/weeks-iot && npx tsc --noEmit && git add src/app/admin/page.tsx && git commit -m "feat(admin): admin page with PIN display + stats + reset" && git push
```

---

## Phase 6: Design Polish

### Task 31: [Agent] Apply Weeks DNA across themes

**Files:** `src/app/globals.css` (refine), potentially `tailwind.config.ts`

- [ ] **Step 1: Review each theme's rendering in browser**

Run dev server, enter daily PIN, visit TaskList. In DevTools, change `<html data-theme="classic">` to each of the 8 themes in turn. Note visual issues per theme:
- Does any theme have unreadable text due to contrast?
- Does glassmorphism panel look wrong on any background?
- Are button colors accessible on all themes?

- [ ] **Step 2: Adjust theme CSS variables to ensure**
- Panel background alpha 0.55–0.65 depending on background darkness
- Text color contrast ≥ 4.5:1 against panel
- Accent color distinguishable on panel

Edit `src/app/globals.css` per-theme overrides as needed.

- [ ] **Step 3: Consolidate shared design tokens**

Ensure all themes use identical:
- Border radius (12px panels, 8px buttons)
- Shadow (`--theme-shadow: 0 28px 80px rgba(0,0,0,0.36)`)
- Typography scale (Tailwind defaults, Outfit font)

- [ ] **Step 4: Commit**

```bash
cd /c/Users/lukol/weeks-iot && git add src/app/globals.css && git commit -m "polish(theme): refine theme CSS vars for consistent Weeks DNA" && git push
```

---

### Task 32: [Agent] Framer Motion screen transitions

**Files:** `src/app/page.tsx` (enhance)

- [ ] **Step 1: Wrap screen switcher in `AnimatePresence`**

```typescript
"use client";

import { AnimatePresence } from "framer-motion";
import { useGameState } from "@/components/providers/GameStateProvider";
import { PinEntry } from "@/components/screens/PinEntry";
import { TaskList } from "@/components/screens/TaskList";
import { TaskDetail } from "@/components/screens/TaskDetail";
import { StyleShop } from "@/components/screens/StyleShop";
import { AvatarShop } from "@/components/screens/AvatarShop";
import { LevelBadges } from "@/components/screens/LevelBadges";

const SCREENS = {
  "pin-entry":    PinEntry,
  "task-list":    TaskList,
  "task-detail":  TaskDetail,
  "style-shop":   StyleShop,
  "avatar-shop":  AvatarShop,
  "level-badges": LevelBadges,
} as const;

export default function HomePage() {
  const { state } = useGameState();
  const Component = SCREENS[state.screen.currentScreen] ?? PinEntry;
  return (
    <AnimatePresence mode="wait">
      <Component key={state.screen.currentScreen} />
    </AnimatePresence>
  );
}
```

Each screen already uses its own `motion.div` with entrance animation — `AnimatePresence mode="wait"` waits for exit before enter.

- [ ] **Step 2: Add exit animations to each screen's top-level `motion.div`** — `exit={{ opacity: 0, y: -20 }}`. Edit each of PinEntry, TaskList, TaskDetail, StyleShop, AvatarShop, LevelBadges.

- [ ] **Step 3: Commit**

```bash
cd /c/Users/lukol/weeks-iot && git add -A && git commit -m "polish(anim): screen transitions via AnimatePresence" && git push
```

---

## Phase 7: Audit + Documentation

### Task 33: [Agent] Security + code audit write-up

**Files:** `docs/audit-findings-v2.md` (create)

- [ ] **Step 1: Create `docs/audit-findings-v2.md`**

```markdown
# v2 Security & Code Audit Findings

## Summary

This document records findings from the audit performed during the v2 Next.js refactor of `lxkask/weeks-iot`. Severity is assessed relative to the app's purpose (educational tablet app for kids at camps) and deployment context (pre-production, noindex, no PII collection).

## Findings Table

| # | Finding | Severity | Status | Notes |
|---|---------|----------|--------|-------|
| 1 | Client-side PINs (daily/lecturer/admin) visible in bundle | Info | Accepted | Not a security boundary. Documented in lib/config.ts. Upgrade in v3 via backend. |
| 2 | buildDailyPin deterministic from date only | Info | Accepted | Same as #1. Rotates daily, preventable brute-force acceptable for use case. |
| 3 | innerHTML usages (4 in step4n's vanilla) | Low | Fixed in v2 | All converted to React JSX auto-escape during port. |
| 4 | No Subresource Integrity on Google Fonts | Low | Accepted | Served via next/font/google which handles self-hosting + caching. |
| 5 | localStorage read corruption → app crash | Medium | Fixed in v2 | storage.ts wraps JSON.parse in try/catch, resets on error. |
| 6 | TASK_SOLUTIONS regexes untested for ReDoS | Low | Deferred to v2.1 | Manual scan shows no catastrophic backtracking patterns. Will add test matrix later. |
| 7 | No CSP headers | Low | Deferred to v3 | Static export on Vercel has safe defaults. Add when adding third-party embeds. |
| 8 | Image assets served from same origin without cache-busting | Info | Accepted | Next.js `<Image>` handles cache headers. |

## What is / isn't a security boundary

**IS a security boundary:**
- TLS on iot.weeks.cz (Vercel-managed)
- noindex header (via vercel.json)

**IS NOT a security boundary:**
- Any PIN in client JS (daily, lecturer, admin) — assume kids will find these
- Section unlocks, star costs, help card costs — all client-enforced game mechanics, not authentication

## Recommendations for v3

- If per-kid accounts are introduced: move to Supabase Auth with proper RLS
- If weeks-hub integration: introduce API keys / service tokens, never expose in client
- If CMS for tasks: admin UI should require @weeks.cz Google OAuth (matches weeks-hub)
- If public launch: add CSP, HSTS preload, subresource integrity for any CDN assets

## Audit methodology

- Read every occurrence of `innerHTML`, `eval`, `dangerouslySetInnerHTML`, `document.write` in step4n's `app.js`
- Traced every `localStorage.*` call for error handling
- Ran `npm audit` (see section below)
- Reviewed regex patterns in TASK_SOLUTIONS for ReDoS risk
- Verified TLS + noindex via `curl -sI https://iot.weeks.cz`

## `npm audit` snapshot

[paste output of `npm audit --omit=dev --json` summarized as text table: package → severity → upgrade path]
```

Fill findings table based on actual audit during port. Remove/add rows as needed.

- [ ] **Step 2: Run `npm audit`**

```bash
cd /c/Users/lukol/weeks-iot && npm audit --omit=dev
```

Paste summary into "`npm audit` snapshot" section. If HIGH-severity vulnerabilities exist, upgrade the dep before proceeding.

- [ ] **Step 3: Commit**

```bash
cd /c/Users/lukol/weeks-iot && git add docs/audit-findings-v2.md && git commit -m "docs: security + code audit findings for v2" && git push
```

---

### Task 34: [Agent] Rewrite README for v2 (Codex workflow)

**Files:** `README.md` (rewrite)

- [ ] **Step 1: Replace `README.md` with v2 content**

Full Czech content — see the spec's "step4n's v2 README" section (spec §9). Summarized structure:

1. Co to je
2. Proč se to změnilo (1 věta)
3. První nastavení (Node.js, Codex CLI, git clone, npm install, npm run dev)
4. Jak pracovat s Codexem (core — 60% of doc)
   - Prompt šablony: přidat Arduino úkol, opravit text, přidat theme
   - Post-Codex checklist
5. Kam se koukat na preview + produkci
6. Lokální dev
7. Co když něco pokazím
8. Co NEDÁVAT do repa
9. CLI reference (git + npm)

Target length: ~200–250 lines of Czech markdown.

- [ ] **Step 2: Commit**

```bash
cd /c/Users/lukol/weeks-iot && git add README.md && git commit -m "docs: rewrite README for v2 (Next.js + Codex workflow)" && git push
```

---

## Phase 8: Cutover

### Task 35: [Agent+Lukáš] Incorporate step4n's post-v1 vanilla changes

**Files:** depends on what step4n added

This task runs **immediately before the cutover PR**. Goal: any features step4n added to `dev` branch (vanilla) while v2 was in progress get ported into the Next.js version.

- [ ] **Step 1: Diff step4n's dev vs v1 baseline**

```bash
cd /c/Users/lukol/weeks-iot && git fetch origin && git log origin/main..origin/dev --oneline
```

Review each commit. Categorize:
- **New task added** → port to `src/lib/tasks.ts` + `src/lib/task-solutions.ts` + add image to `public/task-images/`
- **Task description edit** → mirror in `src/lib/tasks.ts`
- **Theme added** → port to `src/lib/themes.ts` + `src/app/globals.css`
- **Config change** → mirror in `src/lib/config.ts`
- **Style fix** → evaluate whether it applies to Next.js port (may be obsolete)

- [ ] **Step 2: Port each relevant commit into v2-nextjs**

For each commit, read diff in `origin/dev` and apply equivalent change to v2-nextjs branch. Commit with message `port(from-dev): <original commit message>`.

- [ ] **Step 3: Verify step4n's vanilla `main` features all present in v2-nextjs**

Checklist matching spec §2 "Feature surface" — go through each item and exercise it in preview URL.

- [ ] **Step 4: Commit porting work**

```bash
cd /c/Users/lukol/weeks-iot && git push origin v2-nextjs
```

---

### Task 36: [Agent] Final smoke test on preview URL

- [ ] **Step 1: Get preview URL**

Vercel preview URL for `v2-nextjs` from GitHub commits/v2-nextjs page → Vercel check → Details.

- [ ] **Step 2: Smoke test checklist**

Open preview URL in browser. Go through:
- [ ] PIN entry accepts daily PIN (`123`), routes to TaskList
- [ ] TaskList shows 3 sections (beginner unlocked, advanced/expert locked)
- [ ] Open a beginner task → TaskDetail renders with description + image
- [ ] Enter Arduino code → Check button validates → success marks task complete + awards stars
- [ ] Help code / help wiring / skip buttons work (when stars available)
- [ ] After earning enough stars, unlock advanced section
- [ ] StyleShop renders 8 themes with live preview
- [ ] Purchase a theme (if enough stars), switch to it, verify visual change
- [ ] AvatarShop renders avatars, purchase + select works
- [ ] Level badges screen shows progression based on stars
- [ ] PIN entry → admin PIN (`321`) → routes to admin page
- [ ] Admin page shows stats, reset button works
- [ ] Close browser, reopen → progress restored from localStorage
- [ ] `curl -skI <preview-url>` shows `x-robots-tag: noindex, nofollow`

- [ ] **Step 3: Document any issues found**

If anything fails: create GitHub issue or inline fix + commit. Re-run smoke test.

---

### Task 37: [Agent+Lukáš] Cutover PR `v2-nextjs → main`

- [ ] **Step 1: Delete legacy-vanilla folder**

```bash
cd /c/Users/lukol/weeks-iot && git rm -r legacy-vanilla/ && git commit -m "chore: remove legacy-vanilla/ at cutover" && git push
```

- [ ] **Step 2: Update `.gitignore` for Next.js builds**

Ensure `.gitignore` includes:

```
node_modules/
.next/
out/
*.log
.vercel
```

```bash
cd /c/Users/lukol/weeks-iot && git add .gitignore && git commit -m "chore: gitignore Next.js build artifacts" && git push
```

- [ ] **Step 3: [Lukáš] Open PR v2-nextjs → main**

https://github.com/lxkask/weeks-iot/compare/main...v2-nextjs → Create pull request

Title: `feat: v2 Next.js refactor with full parity + design polish + audit`

Description:
```
Clean rewrite from vanilla JS to Next.js 16 with full feature parity
with step4n's original. Weeks design DNA applied to all 8 themes.
Security + code audit performed — see docs/audit-findings-v2.md.

Breaking: localStorage schema bumped to v5 (fresh start, no migration
— pre-production so no real users affected).

After merge:
1. Vercel auto-deploys main → iot.weeks.cz serves Next.js
2. Reset dev branch to main (step4n's workflow continues on Next.js)
3. Message step4n with v2 README + Codex workflow guide
```

- [ ] **Step 4: [Lukáš] Review + merge**

Review files changed. Merge PR. Vercel auto-deploys.

- [ ] **Step 5: [Agent] Verify production**

```bash
curl -skI https://iot.weeks.cz
curl -s  https://iot.weeks.cz/robots.txt
```

Expected: 200, `x-robots-tag: noindex, nofollow`, `robots.txt` content unchanged.

Open `https://iot.weeks.cz` in browser. Expected: Next.js version renders (PIN entry screen with Outfit font + glass panel).

---

### Task 38: [Agent+Lukáš] Reset `dev` branch to `main` + notify step4n

- [ ] **Step 1: [Agent] Reset dev to main**

```bash
cd /c/Users/lukol/weeks-iot && git fetch origin && git checkout dev && git reset --hard origin/main && git push -f origin dev
```

(Force push on `dev` is authorized because `dev` is unprotected and by convention a "working" branch — step4n will re-pull.)

- [ ] **Step 2: [Lukáš] Notify step4n**

```
Čau,

dokončil jsem ten refaktor, o kterém jsem ti psal. iot.weeks.cz teď
běží na Next.js. Tvoje všechny features jsou přenesené (21 úkolů, 8
themes, avatary, reward ekonomika, PINy).

Pár věcí pro tebe:

1) Aktualizuj si lokální repo — branch `dev` jsem resetoval na `main`.
   Nejjednodušeji: ve VS Code smaž lokální složku weeks-iot a naklonuj
   ji znova (git clone https://github.com/lxkask/weeks-iot).

2) Přečti si nové README.md — popisuje jak teď pracovat (Codex CLI
   místo klikání v Source Control, ale celkový flow dev → main stejný).

3) Kód je teď v Next.js. Když chceš přidat nový úkol, nebo něco opravit,
   pusť Codex v repu: `codex`. Prompty najdeš v README.

4) Co jsi měl rozpracované na dev branchi — všechno je přenesené do
   Next.js verze. Pokud ti něco chybí, napiš, dohledám.

Díky za tvůj původní kód, byl dobrý základ. 💪
```

- [ ] **Step 3: Confirm step4n is working on v2**

After step4n pulls + accepts + acknowledges, mark cutover complete. Close v2-nextjs branch (optional: delete on GitHub).

---

## Success Criteria (verify after Task 38)

- [ ] `https://iot.weeks.cz` serves Next.js static export (not vanilla) — View Source shows `__next` scripts
- [ ] All 21 tasks completable end-to-end with correct validation
- [ ] 8 themes switchable via style shop, each renders with Weeks DNA (Outfit typography, glass panels)
- [ ] Progress persists via localStorage `iot-camp-screen-state-v5`
- [ ] `docs/audit-findings-v2.md` exists with filled severity table
- [ ] `README.md` is in place, v2 version with Codex workflow
- [ ] `X-Robots-Tag: noindex, nofollow` header still present on production
- [ ] `dev` branch reset to match `main` (both on Next.js)
- [ ] step4n has received hand-off message and re-cloned repo

---

## Known Quirks / Gotchas

- **static export + dynamic Context:** `output: 'export'` requires components not to depend on server-side features. Our usage is all client (useState, useReducer, useEffect) — works, but all components must have `"use client"` directive where hooks are used.
- **localStorage on first SSR render:** During build, Next.js does a static prerender without `window`. `loadGameState` is guarded with `typeof window === "undefined"` check. `useEffect` triggers hydration on client.
- **Font loading FOUC:** Outfit via `next/font/google` is self-hosted, no FOUC in production; dev may flash briefly.
- **Body background image from weeks.cz:** CSS URL points to `https://weeks.cz/_next/image?q=75&url=%2Fimages%2Fhwlab%2Fhwlab-7976.webp&w=3840`. This is a cross-origin resource — test that it loads in production. Alternative: copy the image into `public/` to avoid cross-origin dependency.
- **Port fidelity for TASK_SOLUTIONS:** step4n's validators may have non-obvious corner cases. Don't "optimize" — port literally and flag in audit doc.
- **Czech diacritics:** step4n's strings lack diacritics (Codex stripped them). Port restores proper Czech text. Ensure source file encoding is UTF-8 (Next.js default).

---

## Post-v2 (reference only, not in scope)

See spec §11 "Deferred Decisions (v3+)":
- weeks-hub integration
- Supabase backend
- Per-kid accounts + GDPR handling
- CMS for tasks/themes
- Analytics
- Multi-language
- Multi-tenant
