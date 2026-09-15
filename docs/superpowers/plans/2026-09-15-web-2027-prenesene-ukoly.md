# Přestavba webu 2027 — přenesené úkoly a otázky

Co se během fáze 2 našlo, ale nepatřilo do ní. Vzniklo z revizí jednotlivých úkolů
a ze závěrečné revize fáze; je to závazný vstup do dalších fází, ne seznam přání.

**Pravidlo, podle kterého se dělilo:** do opravy šlo, co je nepravdivé, rozbité nebo
porušuje závazné omezení. Co je jen nedodělané, jde do fáze, která ho má na starosti.

---

## Otázky pro Lukáše

Nemám je z čeho rozhodnout — jsou to věcná rozhodnutí o nabídce nebo o právních textech.

1. **Odveze si dítě IoT zařízení domů?** Web to slibuje, ale obsah přenesený ze
   zanikajících stránek říká, že hardware zůstává v laboratoři. Dvě tvrzení, jedno musí pryč.
2. **Je VR součástí nabídky?** `vr` je v zaměření obou turnusů, ale v programu týdne se neobjevuje.
3. **Platí zápis na Kudyznudy.cz pro celý provoz, nebo jen pro Prahu?** Odznak byl od
   května 2026 omezený jen na Prahu, bez zdůvodnění v kódu. Zrušením měst by se rozlezl na
   celý web, takže je zatím odstraněný — vrátí se jedním řádkem.
4. **Má v obchodních podmínkách zůstat cenová tabulka** s „MIX víkendový 2 990 Kč" a
   „letní příměstský 4 990 Kč"? Jsou to ceny formátů, které se ruší; oba turnusy mají dnes cenu `null`.
5. **Pět otázek k právním textům** — spojovací věta k přenesenému oddílu, odkaz na čl. 16
   vs. 17, názvosloví táborů a dvoje data účinnosti v jednom dokumentu. Podrobně v reportu
   úkolu 10.

---

## Fáze 3 — odchod od DDM

**Nejdřív ze všeho (blokuje nasazení čehokoliv):**

- `src/app/opengraph-image.tsx` stahuje font z Google Fonts **bez timeoutu a bez záložní
  větve**. Když je cizí služba nedostupná, spadne `next build` — a s ním i nasazení opravy,
  která s náhledovým obrázkem vůbec nesouvisí. Commitnout subsetové řezy do repozitáře a
  číst je z disku.

**Odchod od DDM (vlastní náplň fáze):**

- `/o-nas` a `/kontakt` — popisy pro vyhledávače i viditelný text pořád prodávají víkendové
  kempy a jmenují DDM Praha 6 a HWLab. **S HWLab není nic domluvené.**
- `scripts/generate-og-image.js` dál generuje náhled s texty „Víkendové i jednodenní formáty"
  a „pořádá DDM Praha 6 ve spolupráci s HWLab". Není v `npm scripts`, ale je to nastražená mina.
- `src/lib/ddm-scraper.ts` a jeho tři konzumenti (`api/camps`, `api/capacity`,
  `api/cron/capacity-notify`), `registrationType`, `ddmId`.
- `src/lib/locations.ts` — drží ho ještě `/api/capacity`, `/api/cron/nastupni-list` a e-maily.
- Zbytky v `CLAUDE.md`: „Current term status" s aktivními DDM odkazy, „`/kveten` — live",
  seznam zaměření neodpovídající `FocusId`, strom jmenující dokumenty přesunuté do `weeks-internal`.

**Právní a identifikační rozpory (vyžadují rozhodnutí, ne jen kód):**

- **Web na jedné doméně jmenuje tři různé subjekty.** Patička, kontakt a FAQ říkají
  Weeks s.r.o. (IČO 29984360); pražská část podmínek říká DDM Praha 6; přenesená VOP říká
  Lukáš Kubík (IČO 24878511). K tomu FAQ tvrdí platbu přes Comgate, zatímco `/podminky`
  tvrdí registraci přes systém DDM.
- **Pro pražský turnus nejsou na webu obchodní podmínky upravující prodej.** Přenesená VOP
  se svým zněním vztahuje jen na Karlovy Vary (čl. 16 i místo konání), ale `RegistrationForm`
  na ni posílá všechny.
- **`/gdpr` si protiřečí v rozsahu údajů:** jeden oddíl tvrdí „sbíráme pouze e-mail",
  druhý vyjmenovává osm kategorií včetně alergií a zdravotních omezení.
- Pole `program` se do registrace ukládá jako id zaměření (`turnus.focus[0]`), které se
  v `location.programs` nedohledá — na faktuře z Fakturoidu i v e-mailu rodiči by místo názvu
  tábora skončilo holé „3d-tisk". Varování je nad `TURNUSY`, past hlídá test.

**Obsah:**

- Vrátit blok důvěry, který zmizel se smazanou `TrustSection` — pojištění, poměr 1:5,
  proškolení lektoři, okamžitý kontakt. Specifikace pro to předepisuje sekci **„Kde a s kým"**
  postavenou jen na doložitelných faktech (FabLab jako *místo konání*, ne partner).

---

## Fáze 5 — dotažení

- **Seznam turnusů a filtr nejsou v prerenderovaném HTML `/tabor`** (na úvodce ano) — pro
  vyhledávače i pro návštěvníka bez JavaScriptu je pod nadpisem klíčové sekce prázdno.
- **Obsah zachráněný do `src/lib/focus.ts` nikdo nevykresluje** — modely tiskáren, hardware,
  14 fotek a otázky rodičů leží v datech, ač to specifikace slibuje ukázat u turnusů.
  `/tabor` místo toho používá `ProjectGallery` s natvrdo zadaným seznamem.
- `EventSchema` je jen na úvodce, ne na stránce, na kterou ukazuje.
- Živá obsazenost se načítá jen na `/tabor`, ne na stránce turnusu.
- `pocet` ve `filtrMest` se počítá z nefiltrovaného seznamu — město s jedním uzavřeným
  turnusem by hlásilo vyšší číslo, než kolik karet je vidět.
- Náhledový obrázek hardcoduje věk a města místo odvození z dat.
- Vzorec `prodejny` / `vyprodano` je zkopírovaný na čtyřech místech — patří do `src/lib/turnusy.ts`.
- 45 osiřelých obrázků (~14 MB) a 6 nepoužitých exportů v `src/lib/analytics.ts`.
- Nezalomitelná mezera je v `TurnusCard` a v testu zapsaná jako neviditelný znak místo ` `.

---

## Provozní kontrola před nasazením

- Ověřit dotazem, jestli v `registrations` nejsou řádky s `payment_amount IS NULL` — ty by
  po fázi 1 nešlo doplatit (vrátí 400).
- Comgate, Fakturoid i bankovní účet pořád běží na Lukášově OSVČ (IČO 24878511). Než se
  začne prodávat pod Weeks s.r.o., musí se převést.
