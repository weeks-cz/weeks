# IoT Platform — v1 Integration into Weeks Ecosystem

## Purpose

Migrate friend's (`step4n`) educational IoT learning platform into the Weeks ecosystem as a standalone, pre-production subdomain. This is v1 — infrastructure and onboarding only. Deep integration with `weeks-hub` (user progress sync, SSO, content sync) and public launch (link from `weeks.cz`) are explicitly deferred to v2.

The primary deliverable of v1 is not a technical feature — it is a **stable, beginner-friendly Git workflow** that enables `step4n` (absolute Git beginner) to iterate on content while the rest of the Weeks ecosystem maintains production safety.

## Source Project

**Origin:** [`step4n/iot`](https://github.com/step4n/iot)

**Tech:** Vanilla JavaScript static site. No build step, no `package.json`, no dependencies. Single `index.html` + `app.js` + `style.css` + `assets/`. PIN-protected, `localStorage`-based progress, 21 Arduino tasks across 3 difficulty levels, star/reward system.

**Key implication:** Because there is no backend, any deep integration with `weeks-hub` (sync of user progress, enrolled camp correlation) requires backend work that is out of scope for v1.

## Scope Decisions (v1)

| # | Topic | Decision |
|---|-------|----------|
| 1 | v1 Scope | Infrastructure + onboarding only. No `weeks-hub` integration. No public launch. |
| 2 | Repository | `lxkask/weeks-iot` (user's personal GitHub, matching `lxkask/weeks` and `lxkask/weeks-hub`) |
| 2a | Repository Visibility | **Private** for v1. Can flip to public later if/when content stabilizes and there's a reason to open-source it. |
| 3 | Migration Method | `git clone` + push to new empty repo (preserves full history; leaves `step4n/iot` intact as origin) |
| 4 | Subdomain | `iot.weeks.cz` |
| 5 | Branches | `main` (production, protected) + `dev` (default, working, preview deploy) |
| 6 | Visibility | `X-Robots-Tag: noindex, nofollow` header via `vercel.json`. No link from `weeks.cz`. Existing in-app PIN stays. |
| 7 | Vercel | Same Vercel team as `weeks` and `weeks-hub`. `step4n` gets no Vercel access — preview URLs visible via GitHub checks only. |
| 8 | `step4n` Access | GitHub Collaborator, role: **Write**. Can push to `dev`, blocked from `main` by branch protection. No Admin. No Vercel. |
| 9 | Onboarding Doc | Czech `README.md`. VS Code first (built-in Git UI). CLI as reference only. No contact details. No screenshots. |

## Architecture

### Repository Structure (Day 1)

```
weeks-iot/
├── index.html              # unchanged from step4n/iot
├── app.js                  # unchanged
├── style.css               # unchanged
├── assets/                 # unchanged
├── arduino-ukoly-kody.txt  # unchanged
├── README.md               # rewritten — Czech onboarding doc (see below)
├── .gitignore              # basic: node_modules, .DS_Store, .vscode/settings.json
├── robots.txt              # User-agent: * / Disallow: /
└── vercel.json             # headers for noindex
```

**Non-goal:** no code changes to `step4n`'s original application. The migration is byte-identical except for the three new files (`README.md`, `.gitignore`, `robots.txt`, `vercel.json`) and the overwritten `README.md`.

### `vercel.json`

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

### Branch Protection on `main`

GitHub Settings → Branches → Add rule for `main`:

- ✅ Require a pull request before merging
- ✅ Require approvals: **1** (Lukáš)
- ❌ Require status checks (no CI in v1)
- ✅ Restrict who can push to `main` (PRs only)
- ❌ Allow force pushes
- ❌ Allow deletions
- **"Include administrators"**: NOT enabled — Lukáš (repo admin) keeps the ability to push directly to `main` for emergency fixes or administrative commits. `step4n` (Write role) is still blocked.

`dev` is unprotected: `step4n` can push directly, force-push, or recover from mistakes without friction.

### Default Branch

**Default branch: `dev`.** Cloning gives `step4n` `dev` by default. New PRs auto-target `main`. This aligns the mental model: "work happens on `dev`, things travel to `main` only by approval."

## Vercel Configuration

**Project:** `weeks-iot` (same Vercel team as `weeks` / `weeks-hub`)

- Framework preset: **Other**
- Build command: *(empty)*
- Output directory: `./`
- Install command: *(empty)*
- Root directory: `./`

**Git integration:**
- Production Branch: `main` → `iot.weeks.cz`
- Preview branches: `dev` and all others → auto-generated `*.vercel.app` URLs
- Every push to `dev` triggers a preview deploy. URL surfaces in GitHub commit checks and in the Vercel bot comment on PRs.

## DNS (subreg.cz)

Single CNAME record:

```
iot   CNAME   cname.vercel-dns.com
```

Vercel auto-provisions TLS via Let's Encrypt (~2 minutes after domain added in project settings).

## GitHub Collaborator Setup

1. Owner (`lxkask`) invites `step4n` to `lxkask/weeks-iot` with role **Write**.
2. `step4n` accepts invite (GitHub email notification).
3. Branch protection on `main` is the guardrail — `Write` role alone would let him push to `main`, but the protection rule blocks it.

## Onboarding README (Czech)

The `README.md` is the core deliverable. Written for an absolute Git beginner on Windows using VS Code. Sections:

1. **Co to je** — 3-4 sentence project description, subdomain, pre-production status.
2. **První nastavení (uděláš jednou)** — install VS Code + Git for Windows (defaults), clone via VS Code Source Control panel, confirm `dev` branch is active.
3. **Jak to pustit u sebe** — open `index.html` directly or use VS Code "Live Server" extension.
4. **Jak pracovat na změnách (90 % času)** — step-by-step: check branch → pull → edit → stage in Source Control panel → commit message → Commit → Sync Changes (push).
5. **Kam se koukat na deploy** — GitHub commit → Vercel check → preview URL (stable, bookmarkable).
6. **Jak to dostat do produkce** — open PR `dev → main` on GitHub UI, notify Lukáš, wait for approval + merge.
7. **Co když něco pokazím** — `dev` is safe, revert via GitHub UI, ask Lukáš.
8. **CLI reference (pro zvědavé)** — brief mapping of the same actions to terminal commands for curious future-step4n.

**Explicitly omitted:** contact details (out-of-band), screenshots (reducible context, defer if needed).

## Non-Goals (Explicit)

The following are deferred to v2 and will require a new brainstorming session:

- ❌ Link from `weeks.cz` to `iot.weeks.cz`
- ❌ Any `weeks-hub` integration (dashboard card, data sync, notifications)
- ❌ Backend of any kind (the platform stays vanilla JS + `localStorage`)
- ❌ GA4 / FB Pixel / cookie consent banner
- ❌ User accounts, database, authentication (existing PIN stays)
- ❌ Refactor of `step4n`'s application code
- ❌ CI (lint, tests) — unnecessary for vanilla JS static site
- ❌ Additional documentation (`CONTRIBUTING.md`, `ARCHITECTURE.md`, etc.)

The following are **explicitly not decided in v1** and will be re-opened in v2:

- Whether platform gets its own backend (Sanity, Supabase, other)
- How user progress syncs to `weeks-hub`
- Whether stack migrates (vanilla JS → Next.js / SvelteKit / other)
- SSO with `app.weeks.cz` (shared Google OAuth with `weeks-hub`)
- Whether content becomes CMS-editable (currently hardcoded in `app.js`)
- Market-facing integration (landing page on `weeks.cz`, ads, SEO)

**Reason for these boundaries:** `step4n` needs a stable environment to learn Git workflow before the tech stack underneath him changes. Once he has been working on `dev` branch for a month or two and the content is where it should be, v2 opens with clearer requirements.

## Manual Setup Steps (one-time, for Lukáš)

These steps are captured here for future reference; the implementation plan will break them into actionable order:

1. Create empty `lxkask/weeks-iot` on GitHub, **Private** visibility
2. Clone `step4n/iot` locally; verify the source branch name (`main` or `master`); add `lxkask/weeks-iot` as new remote; push the source branch to `main` on the new remote; create and push `dev` branch from the same commit
3. Add `README.md`, `.gitignore`, `robots.txt`, `vercel.json` (commit to `dev` first, then PR to `main` to seed production)
4. Configure repo settings: default branch `dev`, branch protection on `main`
5. Invite `step4n` as Write collaborator
6. Create Vercel project → import `lxkask/weeks-iot` → preset Other
7. Add `iot.weeks.cz` domain in Vercel project settings
8. Add CNAME on subreg.cz: `iot → cname.vercel-dns.com`
9. Wait for TLS, verify `https://iot.weeks.cz` responds with `X-Robots-Tag: noindex, nofollow`
10. Send `step4n` the repo URL + a short message pointing him at `README.md`

## Success Criteria

v1 is complete when:

- [ ] `https://iot.weeks.cz` serves `step4n`'s application unchanged
- [ ] Response headers include `X-Robots-Tag: noindex, nofollow`
- [ ] `step4n` has Write access to `lxkask/weeks-iot`
- [ ] `main` branch is protected; direct pushes are blocked
- [ ] `dev` is the default branch
- [ ] Every push to `dev` produces a working Vercel preview URL
- [ ] `README.md` is in place, in Czech, covering the VS Code + GitHub flow end-to-end
- [ ] `step4n` has read the README and can (in principle) push a change to `dev` and open a PR
- [ ] No link to `iot.weeks.cz` exists anywhere on `weeks.cz`

## References

- Source: https://github.com/step4n/iot
- Target: https://github.com/lxkask/weeks-iot *(to be created)*
- Related project memory: `weeks_hub.md` (sibling dashboard, out of scope for v1)
- Related project memory: `camps_api_contract.md` (pattern used by `weeks-hub` — similar API pattern may apply in v2)
