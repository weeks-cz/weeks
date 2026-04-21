# IoT Platform v1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate `step4n/iot` to `lxkask/weeks-iot`, deploy at `iot.weeks.cz` (noindex, no public link), set up `main`+`dev` branch workflow, and write a Czech onboarding README scoped for a total Git beginner.

**Architecture:** Vanilla JS static site on Vercel. Two branches: `main` (production, protected, deploys to `iot.weeks.cz`) and `dev` (default, unprotected, deploys to preview URL). `step4n` gets `Write` collaborator role on GitHub only — no Vercel access. Subdomain is hidden via `X-Robots-Tag: noindex` header and by not linking it from anywhere.

**Tech Stack:** Git, GitHub, Vercel, DNS at subreg.cz, VS Code (step4n's environment).

---

## Design Reference

Spec: `docs/superpowers/specs/2026-04-21-iot-platform-v1-design.md`

## Scope Check

Self-contained: one cohesive migration + setup + docs task. No subsystem decomposition needed.

## Execution Roles

Each task is labelled:
- **[Agent]** — I can execute this end-to-end in our session (git, file writes, curl verification)
- **[Lukáš]** — you execute in a browser/UI (GitHub settings, Vercel, subreg.cz)
- **[Agent+Lukáš]** — coordinated: you click, I run commands

## File/Directory Plan

**New repo on GitHub:** `lxkask/weeks-iot` (Private)

**Local working directory for migration:** `C:\Users\lukol\weeks-iot` (parallel to existing `C:\Users\lukol\weeks-hub`)

**Files to create inside `weeks-iot/` (on top of step4n's existing files):**
- `README.md` — Czech onboarding doc (full content in Task 3)
- `.gitignore` — minimal basics
- `robots.txt` — disallow all crawlers
- `vercel.json` — `X-Robots-Tag` header configuration

**Files preserved unchanged from `step4n/iot`:**
- `index.html`, `app.js`, `style.css`, `assets/`, `arduino-ukoly-kody.txt`
- Original `README.md` gets **overwritten** (step4n's original was a local-preview readme; we replace with onboarding for the new workflow)

## Pre-flight Confirmation

Before executing: confirm these prerequisites are true. If any is false, pause.

- [ ] Lukáš is logged into GitHub as `lxkask`
- [ ] Lukáš has admin access to the Vercel team that owns `weeks` and `weeks-hub` projects
- [ ] Lukáš has admin access to subreg.cz DNS for `weeks.cz`
- [ ] step4n's GitHub username confirmed (assumed `step4n` based on repo URL — verify before inviting)

---

## Task 1: [Lukáš] Create empty GitHub repo

**Goal:** An empty `lxkask/weeks-iot` repo exists on GitHub, Private, no initial commits.

- [ ] **Step 1: Open GitHub new-repo page**

Navigate to: https://github.com/new

- [ ] **Step 2: Fill in the form**

- **Owner:** `lxkask`
- **Repository name:** `weeks-iot`
- **Description:** `Educational IoT platform for Weeks camps (Arduino, 21 tasks, star/reward system). Pre-production.`
- **Visibility:** **Private**
- **Initialize repository:** leave ALL checkboxes OFF (no README, no .gitignore, no license — we push our own first commit)

- [ ] **Step 3: Create**

Click "Create repository". Confirm URL is `https://github.com/lxkask/weeks-iot`.

- [ ] **Step 4: Confirm to agent**

Tell me "repo created" so I can proceed with Task 2.

---

## Task 2: [Agent] Local clone + migration to new remote

**Goal:** Local working copy at `C:\Users\lukol\weeks-iot` has full history from `step4n/iot`, new remote pointing at `lxkask/weeks-iot`, and `main` branch pushed.

- [ ] **Step 1: Clone step4n's repo into the target location**

```bash
git clone https://github.com/step4n/iot.git /c/Users/lukol/weeks-iot
```

Expected: clone succeeds, directory `C:/Users/lukol/weeks-iot/` exists with `index.html`, `app.js`, etc.

- [ ] **Step 2: Determine the source default branch name**

```bash
cd /c/Users/lukol/weeks-iot && git branch --show-current
```

Expected output: either `main` or `master`. Note the result; subsequent commands use `<source-branch>` to mean whichever it is.

- [ ] **Step 3: If source branch is `master`, rename local branch to `main`**

Only if Step 2 output was `master`:

```bash
cd /c/Users/lukol/weeks-iot && git branch -m master main
```

- [ ] **Step 4: Replace origin with new remote**

```bash
cd /c/Users/lukol/weeks-iot && git remote remove origin && git remote add origin https://github.com/lxkask/weeks-iot.git
```

Verify:
```bash
cd /c/Users/lukol/weeks-iot && git remote -v
```

Expected: `origin  https://github.com/lxkask/weeks-iot.git (fetch/push)`.

- [ ] **Step 5: Push `main` to new remote**

```bash
cd /c/Users/lukol/weeks-iot && git push -u origin main
```

Expected: push succeeds, GitHub repo page now shows step4n's original files under `main` branch.

- [ ] **Step 6: Create and push `dev` branch from same commit**

```bash
cd /c/Users/lukol/weeks-iot && git checkout -b dev && git push -u origin dev
```

Expected: `dev` branch exists on GitHub, identical to `main`.

- [ ] **Step 7: Confirm branches on GitHub**

Browser check by Lukáš (optional): https://github.com/lxkask/weeks-iot/branches — should show both `main` and `dev`.

---

## Task 3: [Agent] Write the four new files on `dev`

**Goal:** `dev` branch contains `README.md`, `.gitignore`, `robots.txt`, `vercel.json`, committed as a single "onboarding scaffolding" commit.

- [ ] **Step 1: Ensure we are on `dev`**

```bash
cd /c/Users/lukol/weeks-iot && git checkout dev
```

- [ ] **Step 2: Write `.gitignore`**

Create `C:\Users\lukol\weeks-iot\.gitignore` with content:

```gitignore
# OS
.DS_Store
Thumbs.db

# Editors
.vscode/settings.json
.idea/

# Node (in case someone ever runs npm later)
node_modules/
npm-debug.log*

# Vercel
.vercel/

# Local
*.local
```

- [ ] **Step 3: Write `robots.txt`**

Create `C:\Users\lukol\weeks-iot\robots.txt` with content:

```
User-agent: *
Disallow: /
```

- [ ] **Step 4: Write `vercel.json`**

Create `C:\Users\lukol\weeks-iot\vercel.json` with content:

```json
{
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

- [ ] **Step 5: Overwrite `README.md` with Czech onboarding doc**

Create `C:\Users\lukol\weeks-iot\README.md` with content (full Czech text below):

````markdown
# Weeks IoT

Výuková IoT platforma pro děti z Weeks táborů. 21 úkolů s Arduinem ve třech obtížnostech (začátečník, pokročilý, expert), sbírání hvězdiček a odměnový systém. Běží na `iot.weeks.cz`, **momentálně není veřejně propagovaná** — zatím se na ni neodkazuje z `weeks.cz` ani odjinud.

Tento README je návod pro tebe, jak s tímhle projektem pracovat. Je psaný od nuly, předpokládá že jsi Git a GitHub nepoužíval. Pokud něco nedává smysl, napiš.

---

## První nastavení (uděláš jednou)

1. **Nainstaluj VS Code** (pokud ještě nemáš): https://code.visualstudio.com — výchozí instalátor, klikej Next.
2. **Nainstaluj Git pro Windows**: https://git-scm.com/download/win — stáhne se `.exe`, při instalaci nech **všechno default**, klikej Next. Git umožní VS Code komunikovat s GitHubem.
3. **Přihlas se do VS Code pomocí GitHubu** (jen jednou):
   - Otevři VS Code
   - Klikni na ikonu **účtu** úplně vlevo dole
   - Vyber "Sign in with GitHub"
   - V prohlížeči odsouhlas přístup
4. **Naklonuj tento projekt** (stáhne ho k sobě do počítače):
   - Ve VS Code stiskni `Ctrl+Shift+P`, napiš "Git: Clone" a Enter
   - Vlož URL: `https://github.com/lxkask/weeks-iot`
   - Vyber složku, kam to uložit. Doporučuju `C:\Users\[tvé jméno]\weeks-iot`
   - Až to skončí, VS Code se zeptá "Open the cloned repository?" → **Ano, otevřít**
5. **Ujisti se, že jsi na správném branchi:**
   - V **levém dolním rohu** VS Code vidíš název aktuálního branche
   - **Musí tam být `dev`**
   - Pokud tam je `main`, klikni na to, v nabídce nahoře vyber `dev`

Hotovo, teď můžeš pracovat.

## Jak si projekt pustit u sebe v počítači

Je to statický web (jen HTML, CSS, JavaScript), takže nic se nekompiluje. Dvě možnosti, jak to otevřít:

**Nejjednodušší (stačí):**
- Otevři soubor `index.html` ve File Exploreru → dvojklik → otevře se v prohlížeči

**Lepší (doporučené):**
- Ve VS Code nainstaluj rozšíření **Live Server** (ikona "Extensions" vlevo → vyhledej "Live Server" od Ritwick Dey → Install)
- Pak klikni pravým na `index.html` → "Open with Live Server"
- Vše se automaticky obnovuje, když soubor uložíš

## Jak pracovat na změnách (tohle budeš dělat 90 % času)

**1. Před začátkem práce stáhni nejnovější verzi ze serveru.**

Ve VS Code klikni na ikonu **Source Control** (třetí shora v levém panelu, vypadá jako rozvětvení). Nahoře klikni na tři tečky `...` → **Pull**. Tím se k tobě stáhne, co mezitím přibylo.

**2. Uprav co potřebuješ** v HTML / JS / CSS / assets.

**3. Zkontroluj svoje změny.**

V Source Control panelu vidíš **seznam změněných souborů**. Klikni na soubor, abys viděl diff (zelené = přidané řádky, červené = smazané).

**4. Přidej změny ke commitu.**

Vedle každého souboru je `+` (stage this change). Klikni na něj u souborů, které chceš zahrnout. Nebo klikni `+` vedle "Changes" pro všechny naráz.

**5. Napiš commit message.**

Nahoře v Source Control panelu je textové pole. Napiš krátce česky, co jsi udělal. Příklady:

- `Opravil jsem překlep v druhém úkolu`
- `Přidal jsem nový úkol na blikání dvou LED`
- `Změnil jsem barvu hvězdiček`

**6. Commit.**

Klikni zelené tlačítko **Commit** nahoře v Source Control.

**7. Pošli změny na GitHub.**

Nahoře se objeví modré tlačítko **Sync Changes** (nebo "Push"). Klikni.

**Co se stane pak:** za cca 30 sekund Vercel automaticky nasadí tvoji změnu na preview URL. Produkce (`iot.weeks.cz`) se **nezmění**, dokud to nemergnu do `main` (viz níže).

## Kam se koukat na svůj deploy (preview URL)

Každý push na `dev` spustí Vercel, který udělá preview deploy.

1. Otevři https://github.com/lxkask/weeks-iot/commits/dev
2. U tvého commitu vidíš buď oranžové kolečko (buildí se), zelenou fajfku (hotovo) nebo červený křížek (rozbito)
3. Klikni na fajfku → v rozbaleném seznamu najdi řádek `Vercel – Preview` → klikni `Details`
4. Tím se dostaneš na URL typu `https://weeks-iot-git-dev-lxkask.vercel.app`
5. **Tato URL je stabilní** (nemění se mezi deploye na `dev`) — můžeš si ji uložit do záložek

Preview URL se chová úplně stejně jako produkce, je to jen pro tebe a tým.

## Jak to dostat do "produkce" (na iot.weeks.cz)

**NEDĚLEJ sám.** Produkci (`main` branch) jsem chránil, aby tam nešlo nic omylem pushnout. Postup:

1. Otevři https://github.com/lxkask/weeks-iot
2. Nahoře klikni záložku **Pull requests** → **New pull request**
3. Nastav: `base: main` ← `compare: dev` (mělo by být default, ale zkontroluj)
4. Klikni **Create pull request**
5. Nahoře napiš výstižný titulek (česky je OK), dole popis co tam je nového
6. Klikni **Create pull request** (ten dole napravo)
7. **Napiš mi** (Lukáš) — WhatsApp / mail / telefon — že je PR k review
8. Projedu to, napíšu připomínky nebo schválím a udělám **Merge**
9. Po mergi se za ~30 sekund nová verze objeví na `iot.weeks.cz`

## Co když něco pokazím

Neboj se. Na `dev` branchi nemůžeš rozbít produkci. Kdykoli se něco pokazí:

- **Ideální první krok:** napiš mi a projdeme to spolu.
- **Revert na GitHubu:** otevři poslední commit na `dev` → tři tečky vpravo → "Revert". Vytvoří to nový commit, který undo-ne předchozí.
- **Smazal jsi něco lokálně a nevíš co dál:** neuděj nic dalšího a napiš mi. `dev` na GitHubu máš pořád nedotčený, stačí to stáhnout.

## Co do tohoto repa NEDÁVAT

- Hesla, API klíče, cokoli citlivého (nemáme `.env` — pokud ho vytvoříš, `.gitignore` ho ignoruje)
- Velké binární soubory (>10 MB) — pokud máš, zeptej se
- Osobní data dětí — platforma má fungovat bez nich (jen lokální progress v prohlížeči)

## CLI reference (pro zvědavé, není nutné)

Tytéž akce jako výše, jen v terminálu (VS Code má terminál pod `Ctrl+``):

```bash
# Stáhni nejnovější
git pull

# Ukaž, co se změnilo
git status

# Stage vše
git add .

# Commit
git commit -m "popis změny"

# Push
git push

# Přepnout branch (kdybys nechtěně byl na main)
git checkout dev
```

## Když máš otázku

Nejsou hloupé otázky. Raději se zeptej než zkoušej naslepo.
````

- [ ] **Step 6: Stage and commit all four files**

```bash
cd /c/Users/lukol/weeks-iot && git add README.md .gitignore robots.txt vercel.json && git commit -m "chore: add onboarding README, gitignore, robots, vercel config"
```

Expected: one commit on `dev` containing four new files.

- [ ] **Step 7: Push `dev`**

```bash
cd /c/Users/lukol/weeks-iot && git push origin dev
```

Expected: `dev` branch on GitHub now contains the four new files in addition to step4n's originals.

- [ ] **Step 8: Confirm on GitHub**

Browser: https://github.com/lxkask/weeks-iot/tree/dev — should show `README.md`, `robots.txt`, `vercel.json`, `.gitignore`, plus step4n's files.

---

## Task 4: [Lukáš] Configure repo settings on GitHub

**Goal:** Default branch is `dev`, `main` is protected, `step4n` is invited as Write collaborator.

- [ ] **Step 1: Change default branch to `dev`**

1. Go to https://github.com/lxkask/weeks-iot/settings
2. In left sidebar click **Branches** (under "Code and automation")
3. Under "Default branch", click the **swap arrows** icon
4. In the dropdown select `dev`, click **Update**
5. Confirm the warning dialog

Verify: refreshing https://github.com/lxkask/weeks-iot should now show `dev` files by default.

- [ ] **Step 2: Add branch protection rule for `main`**

Same page (Settings → Branches):

1. Under "Branch protection rules" click **Add branch ruleset** (or "Add rule" if that's what's shown — GitHub renamed this)
2. **Ruleset Name:** `main protection`
3. **Enforcement status:** Active
4. **Target branches:** Add target → Include by pattern → `main`
5. **Branch rules → enable:**
   - ✅ **Restrict deletions**
   - ✅ **Require a pull request before merging**
     - Required approvals: **1**
     - Other sub-options: leave defaults (dismiss stale approvals: off, require review from code owners: off)
   - ✅ **Block force pushes**
6. **Bypass list:** leave empty (do NOT add Repository admin — we want admin to bypass *without* explicit bypass entry; alternatively you can add Repository admin if you prefer explicit documentation, but the spec says admins should be able to push directly for hotfixes)

Wait — two different settings schools here. Either leave bypass empty and rely on the **classic "Include administrators"** checkbox (older Branch Protection UI), or in the newer Rulesets UI add **Repository admin** to **Bypass list**. The effect is the same: Lukáš (admin) can push directly to `main` for hotfixes.

7. Click **Create**

Verify: if you (or I) try to push directly to `main`, GitHub blocks it (unless you override as admin).

- [ ] **Step 3: Invite step4n as collaborator**

1. Go to https://github.com/lxkask/weeks-iot/settings/access
2. Click **Add people**
3. Enter step4n's GitHub username (confirm with step4n if unsure)
4. Select role: **Write**
5. Click **Add [username] to this repository**
6. GitHub sends him an email invitation. He must click accept before he can push.

- [ ] **Step 4: Confirm to agent**

Tell me when:
- Default branch is `dev`
- `main` branch protection is active
- step4n has been invited (accepting can happen asynchronously)

---

## Task 5: [Lukáš] Create Vercel project

**Goal:** `weeks-iot` project exists in the same Vercel team as `weeks` and `weeks-hub`, wired to `lxkask/weeks-iot` GitHub repo.

- [ ] **Step 1: Go to Vercel Add New**

Navigate to https://vercel.com/new and make sure you're in the correct team (top-left dropdown).

- [ ] **Step 2: Import `lxkask/weeks-iot`**

1. In the "Import Git Repository" section, find `lxkask/weeks-iot`
2. If it's not there: click "Adjust GitHub App Permissions" → grant Vercel access to the new repo → return
3. Click **Import**

- [ ] **Step 3: Configure the project**

On the configuration screen:

- **Project Name:** `weeks-iot`
- **Framework Preset:** **Other**
- **Root Directory:** `./` (leave default)
- **Build and Output Settings:** expand, and:
  - Build Command: leave empty (or toggle off "Override")
  - Output Directory: leave empty
  - Install Command: leave empty
- **Environment Variables:** none

Click **Deploy**.

- [ ] **Step 4: Wait for first deploy**

Takes ~30-60 seconds. When it says "Congratulations", the site is live on a Vercel-assigned `.vercel.app` URL.

- [ ] **Step 5: Verify production branch**

Go to Vercel project → **Settings** → **Git**. Confirm **Production Branch: `main`**. If it shows `dev`, switch it to `main`.

(If `main` was empty at the time of import because we pushed `dev` first, Vercel might have picked `dev`. Switch to `main` explicitly.)

- [ ] **Step 6: Confirm to agent**

Tell me the `.vercel.app` URL and that the first deploy succeeded.

---

## Task 6: [Lukáš] Add `iot.weeks.cz` domain to Vercel project

**Goal:** Vercel knows to serve `iot.weeks.cz` from this project.

- [ ] **Step 1: Open Domains settings**

In Vercel project → **Settings** → **Domains**.

- [ ] **Step 2: Add domain**

1. In the "Add a domain" field type: `iot.weeks.cz`
2. Click **Add**
3. Vercel shows DNS instructions. It will say: "Add a CNAME record pointing to `cname.vercel-dns.com`." Note this — you'll need it in Task 7.

- [ ] **Step 3: Leave domain "pending DNS"**

Vercel now waits for DNS. Move on to Task 7; come back after to verify.

---

## Task 7: [Lukáš] Add DNS CNAME at subreg.cz

**Goal:** `iot.weeks.cz` resolves to Vercel.

- [ ] **Step 1: Log in to subreg.cz**

Go to the subreg.cz DNS panel for `weeks.cz`.

- [ ] **Step 2: Add CNAME record**

- **Type:** CNAME
- **Name/Host:** `iot`
- **Value/Target:** `cname.vercel-dns.com`
- **TTL:** default (usually 3600 / 1 hour)

- [ ] **Step 3: Save**

- [ ] **Step 4: Wait for propagation**

DNS usually propagates within 1-5 minutes from subreg.cz. Vercel auto-detects and provisions TLS.

- [ ] **Step 5: Return to Vercel Domains**

Refresh the Vercel Domains page. `iot.weeks.cz` should flip from "Pending" to "Valid Configuration" with a TLS lock icon.

---

## Task 8: [Agent+Lukáš] Seed `main` with the onboarding files via PR

**Goal:** `main` branch contains `README.md`, `robots.txt`, `vercel.json`, `.gitignore`. This exercises the PR workflow end-to-end and (critically) gets `vercel.json` onto `main` so that the production domain serves the `X-Robots-Tag` header. Must happen **before** end-to-end verification (Task 9).

- [ ] **Step 1: [Agent] Make sure `dev` is up-to-date on origin**

```bash
cd /c/Users/lukol/weeks-iot && git push origin dev
```

(No-op if nothing changed since Task 3.)

- [ ] **Step 2: [Lukáš] Open PR in browser**

Navigate to: https://github.com/lxkask/weeks-iot/compare/main...dev

1. Click **Create pull request**
2. Title: `chore: seed onboarding scaffolding on main`
3. Description: `First PR through the dev → main workflow. Adds README (Czech onboarding), robots.txt, vercel.json (noindex header), .gitignore.`
4. Click **Create pull request**

(`gh` CLI is not installed in this environment, so PR creation is browser-based.)

- [ ] **Step 3: [Lukáš] Approve and merge**

On the PR page:

1. **Files changed** — quick review (4 new files)
2. Scroll down, click **Merge pull request** → **Confirm merge**
3. **Do NOT delete `dev` branch** after merge — it's our permanent working branch

- [ ] **Step 4: [Agent] Pull `main` locally to sync**

```bash
cd /c/Users/lukol/weeks-iot && git fetch origin && git checkout main && git pull
```

Expected: local `main` now matches `origin/main` with the four new files.

- [ ] **Step 5: [Agent] Switch back to dev (default working branch)**

```bash
cd /c/Users/lukol/weeks-iot && git checkout dev
```

- [ ] **Step 6: Wait for Vercel to redeploy `main`**

After merge, Vercel automatically redeploys `main`. Check Vercel dashboard or wait ~30-60 seconds before Task 9 verification.

---

## Task 9: [Agent] Verify production deploy end-to-end

**Goal:** `https://iot.weeks.cz` serves step4n's app over TLS with the noindex header. Preview on `dev` also works.

- [ ] **Step 1: Check TLS + basic response**

```bash
curl -sI https://iot.weeks.cz
```

Expected: `HTTP/2 200`, valid TLS handshake.

- [ ] **Step 2: Check `X-Robots-Tag` header**

```bash
curl -sI https://iot.weeks.cz | grep -i "x-robots-tag"
```

Expected: `x-robots-tag: noindex, nofollow` (case may vary).

If missing, `vercel.json` wasn't honored — check that `main` branch on GitHub contains `vercel.json` (it should, via PR merge in Task 8). Confirm Vercel's latest production deployment was *after* the PR merge.

- [ ] **Step 3: Check `robots.txt` is served**

```bash
curl -s https://iot.weeks.cz/robots.txt
```

Expected:
```
User-agent: *
Disallow: /
```

- [ ] **Step 4: Visual smoke test**

Browser: open https://iot.weeks.cz. Expected: step4n's PIN entry screen renders. Enter PIN (ask step4n what it is for non-breaking visual test), see the three difficulty sections.

- [ ] **Step 5: Check preview URL works on `dev`**

Get preview URL from GitHub commits/dev page → Vercel check → Details.

```bash
curl -sI https://weeks-iot-git-dev-lxkask.vercel.app  # use actual preview URL
```

Expected: `HTTP/2 200` and same `X-Robots-Tag` header.

---

## Task 10: [Lukáš] Hand-off message to step4n

**Goal:** step4n has everything he needs to start.

- [ ] **Step 1: Send step4n this message** (Czech, paste and adapt as needed):

```
Čau,

tvůj IoT projekt jsem přestěhoval pod náš Weeks ekosystém. Běží teď na
https://iot.weeks.cz (zatím nikde neodkazované, pro tým jenom).

Původní `step4n/iot` ti zůstal, nic jsem tam neměnil. Nová verze je
na https://github.com/lxkask/weeks-iot a právě jsem tě pozval jako
spolupracovníka. Dostaneš mail s invite → klikni Accept.

Pak otevři README.md na GitHubu nebo v repu po naklonování — je tam
krok za krokem psaný návod, jak to rozjet ve VS Code, jak dělat změny
a jak to posílat do produkce. Je psaný pro člověka co s Gitem
začíná, takže bez problému.

Krátce:
- Budeš pracovat na `dev` branchi (tam si můžeš dělat cokoli,
  produkci to neohrozí)
- Každý tvůj push vygeneruje preview URL, kde si to hned prohlédneš
- Když budeš chtít něco dostat naostro na iot.weeks.cz, uděláš Pull
  Request a já to projdu a smergnu

Kdyby cokoli, píš.
```

- [ ] **Step 2: Confirm step4n received and opened the repo**

Wait for him to accept invite. GitHub emails you when he accepts.

---

## Success Criteria (copy from spec, verify all)

- [ ] `https://iot.weeks.cz` serves step4n's application unchanged (Task 9 Step 4)
- [ ] Response headers include `X-Robots-Tag: noindex, nofollow` (Task 9 Step 2)
- [ ] step4n has Write access to `lxkask/weeks-iot` (Task 4 Step 3)
- [ ] `main` branch is protected; direct pushes by step4n are blocked (Task 4 Step 2)
- [ ] `dev` is the default branch (Task 4 Step 1)
- [ ] Every push to `dev` produces a working Vercel preview URL (Task 9 Step 5)
- [ ] `README.md` is in place, in Czech, covering the VS Code + GitHub flow end-to-end (Task 3 Step 5)
- [ ] step4n has the repo URL and knows to read the README (Task 10 Step 1)
- [ ] No link to `iot.weeks.cz` exists anywhere on `weeks.cz` (no code changes in `weeks_web` — implicit)

---

## Known Quirks / Gotchas

- **Vercel may pick `dev` as production branch on first import** if `main` happens to be empty relative to `dev` at import time. Task 5 Step 5 catches this.
- **Branch protection UI has two flavors** (classic "Branch protection rules" vs. newer "Rulesets"). Task 4 Step 2 covers rulesets. If you see the classic UI, the equivalent is: Require PR → Require approvals: 1 → do NOT check "Include administrators".
- **`robots.txt` vs `X-Robots-Tag`** — both configured for belt-and-suspenders. `X-Robots-Tag` is the stronger signal (applies to any URL, not just crawlable ones).
- **`gh` CLI is not installed** in the session environment. Any GitHub operations that would benefit from `gh` are routed through browser UI (Lukáš) or through plain `git` + `curl`.
- **step4n's PIN**: his app is PIN-protected. Agent can't test past the PIN without the PIN from step4n. Task 9 Step 4 notes this.
- **`weeks-iot` local directory must not conflict**: if `C:\Users\lukol\weeks-iot` already exists for any reason, Task 2 Step 1 fails. Check before running.

---

## Post-v1 (explicit non-goals, reference only)

Documented in spec. Not implemented here. Future v2 work will need its own brainstorm + spec + plan cycle.
