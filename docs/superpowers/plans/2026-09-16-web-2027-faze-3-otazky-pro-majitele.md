# Fáze 3 — otázky pro majitele a co zbývá

Vzniklo při odchodu od DDM Praha 6 (fáze 3 přestavby webu 2027, větev `feat/web-2027`,
20 + 9 commitů, `df7d4ca..11f6942`). **Nejsou to návrhy, jsou to věci, které jsem
nemohl rozhodnout**: právní formulace, obchodní údaje a fakta, která se nedají doložit
z kódu ani z dat.

Pravidlo, podle kterého se dělilo: *odstranit prokazatelně nepravdivý údaj* je oprava
a udělal jsem ji. *Stanovit ten správný* je rozhodnutí a je tady.

> **Dva tvrdé blokátory otevření prodeje** jsou níž označené takhle. Dokud nejsou
> vyřešené, nesmí jít žádný turnus do stavu `otevreno`.

---

## Blokátory otevření prodeje

**B1 — Chybí výslovný souhlas pro zdravotní údaje.** `/gdpr` slibuje souhlas podle
čl. 9 odst. 2 písm. a) GDPR pro zdravotní omezení a alergie, ale `src/lib/registration.ts`
má jen čtyři obecné souhlasy (VOP, GDPR, foto, marketing) a `child_health_notes` se
sbírá bez samostatného. Text slibuje víc, než formulář umí. Nejlevnější poctivá cesta:
páté nepovinné zaškrtávátko u pole se zdravotními poznámkami, výchozí nezaškrtnuté,
a bez něj údaj neukládat. **Text souhlasu musí napsat člověk** — proto jsem to neudělal.

**B2 — Cena turnusů léto 2027 není stanovená.** Z obchodních podmínek zmizely ceny
zrušených formátů (2 990 Kč víkendový MIX, 4 990 Kč letní příměstský) a nahradil je
odkaz na cenu u konkrétního turnusu. Oba turnusy mají dnes `priceKc: null`.

**B3 — Comgate, Fakturoid a bankovní účet pořád běží na Lukášově OSVČ** (IČO 24878511).
Web už jmenuje Weeks s.r.o. všude; doklady zatím ne.

---

## Právní texty — 16 otázek z přepisu `/gdpr` a `/podminky`

## Otázky pro majitele (10)

**1. Cenová tabulka v čl. 20 podmínek.** Uvádí „MIX – Víkendový tábor 2 990 Kč" a
„Letní příměstský tábor 4 990 Kč" — tedy ceny formátů, které se už nekonají; oba
dnešní turnusy mají `priceKc: null`. Nechal jsem ji **beze změny**.
*Návrh:* cena patří k turnusu; v podmínkách nechat jen větu, že cena tábora je uvedená
u konkrétního termínu na weeks.cz a je závazná v okamžiku odeslání přihlášky. Nutné
rozhodnout dřív, než se otevře první turnus.

**2. Číslo účtu v čl. 21.2** (2267467012/3030, Air Bank) pochází od dosavadního
pořadatele — fyzické osoby. Po změně na Weeks s.r.o. potřebuju vědět, jestli platí dál,
nebo jaké číslo účtu tam má být. Nechal jsem ho beze změny.

**3. Datum účinnosti.** Dokumenty měly každý dvě data (1. 12. 2024 a 1. 5. 2026).
Zvolil jsem **16. 9. 2026** — den změny; čl. 12 podmínek sám říká, že změny nabývají
účinnosti zveřejněním. Pokud se nasazuje jindy, datum posuňte na den nasazení.

**4. Zvláštní kategorie osobních údajů a souhlas v přihlášce.** Zásady (čl. 4) říkají,
že zdravotní omezení a alergie zpracováváme na základě **výslovného** souhlasu podle
čl. 9 odst. 2 písm. a) GDPR. Přihláška má ale jediné obecné zaškrtávátko
`gdpr_consent` (`src/lib/registration.ts`), ne samostatný souhlas pro zdravotní údaje.
Má formulář dostat samostatné zaškrtávátko, nebo se má upravit text souhlasu? To je
právní rozhodnutí, sám jsem ho neudělal.

**5. Doba uchování registračních údajů.** Zásady říkají „1 rok po skončení tábora",
VOP čl. 25 říká „nejdéle 5 let od konání tábora". Která lhůta platí?

**6. Zděděná obchodní ustanovení.** Celé jádro VOP (storno 0/50/100 %, výjimky, poplatek
150 Kč za každých započatých 30 minut pozdního vyzvednutí, 3 pracovní dny na platbu,
10 pracovních dní na vrácení, 5 pracovních dní na reklamaci) je převzaté od dosavadního
pořadatele. Platí beze změny i pro Weeks s.r.o.? Neměnil jsem je.

**7. Seznam zpracovatelů v zásadách.** Sloučil jsem oba dosavadní seznamy, takže tam
zůstávají i Meta Platforms (Facebook Pixel), Google Analytics a Sanity. Pixel podle
projektové dokumentace zatím neběží. Nechat je uvedené dopředu, nebo je vypustit,
dokud se nespustí reklamy?

**8. Backend pořád jede na starém subjektu.** `src/lib/locations.ts` má u Prahy
organizátora „DDM Praha 6" a u Karlových Varů „Lukáš Kubík, IČO 24878511"; daňové
doklady vystavuje ten účet Fakturoidu, který je nastavený v proměnných prostředí.
Dokud se tohle nepřenese, VOP by jmenovaly Weeks s.r.o., ale potvrzovací e-mail a
faktura by mohly jmenovat někoho jiného. Kdy a kdo to překlopí? (Teď to nevadí — žádný
turnus není `otevreno` — ale je to blokátor pro otevření prodeje.)

**9. Oprávnění a role.** Podmínky nově říkají, že Weeks s.r.o. je **provozovatel webu
i pořadatel táborů**, a u čl. 17 jsem větu o živnostenském oprávnění fyzické osoby
nahradil zápisem v obchodním rejstříku ze `SITE.court`. Potvrďte prosím, že s.r.o.
má odpovídající živnostenské oprávnění pro pořádání táborů (mimoškolní výchova a
vzdělávání) — to z kódu ověřit nejde.

**10. Věková hranice.** Podmínky (čl. 3) teď říkají 9–15 let podle `turnus.ageRange`,
ale validace přihlášky v `src/lib/registration.ts` přijímá dítě ve věku 5–18 let.
Buď se má zpřísnit validace, nebo v podmínkách uvést, jak se odchylka řeší.

---

## Otázky pro majitele — doplnění (celkem 15)

**11. Devět nově formulovaných účelů zpracování v oddílu 2 zásad.** Vypsání rozsahu
údajů podle `registration.ts` bylo zadané, ale účely, které u jednotlivých údajů
stojí, v předchozím znění nebyly. Podle čl. 13 odst. 1 písm. c) GDPR je účel údaj,
kterým se správce váže — je to tedy nový závazek, ne přepis. Projděte prosím
konkrétně tyhle řádky `src/app/gdpr/page.tsx` (čísla po opravném kole 2):

- ř. 134 „pro identifikaci smluvní strany" (jméno zákonného zástupce)
- ř. 137 „pro vystavení daňového dokladu" (fakturační adresa)
- ř. 143 „pro případ ošetření dítěte" (zdravotní pojišťovna)
- **ř. 144 „pro zajištění bezpečnosti a stravování dítěte" (zdravotní omezení a alergie)** — původní znění mělo dvě oddělené položky: „Stravovací omezení a alergie – pro zajištění bezpečnosti dítěte" a „Zdravotní omezení – pouze pokud jsou relevantní pro bezpečnou účast". Sloučením do jedné položky se účel rozšířil o stravování. **Tohle je zvláštní kategorie osobních údajů — tady rozšíření účelu váží víc než u jména nebo adresy**
- ř. 145 „pro přizpůsobení zadání" (dosavadní zkušenosti)
- ř. 149–151 celý blok vyzvedávání vč. „abychom dítě nepředali nikomu jinému"
- ř. 155–156 popis jednotlivých souhlasů (povinné × nepovinné)
- ř. 160 poznámka k objednávce
- ř. 180 „pro vyřízení Vašeho dotazu" (kontaktní formulář)

Nic z toho jsem neměnil ani nemazal — jen to nesmí projít bez přečtení.

**12. Kontaktní formulář nemá uvedený právní základ ani dobu uchování.** Rozsah
(jméno, e-mail, text zprávy) je nově vypsaný v oddílu 2, ale oddíly 3, 4 a 5 ho
nepokrývají — zprávy z formuláře nejsou ani plnění smlouvy, ani marketingový souhlas.
Základ jsem **nevymýšlel**. Vypsat údaj bez základu je průhlednější než ho zamlčet,
ale doplnit ho musí majitel (spolu s dobou uchování zpráv ve Formspree).

**13. Čl. 12 × čl. 29 podmínek si po sjednocení odporují.** Čl. 12 říká, že změny
Podmínek nabývají účinnosti zveřejněním; čl. 29 říká, že na přihlášky odeslané před
účinností změny platí původní znění VOP. U spotřebitelské smlouvy je jednostranná
změna účinná pouhým zveřejněním navíc napadnutelná. Dokud byly dokumenty dva,
každé pravidlo platilo pro svůj text — teď stojí vedle sebe.

**14. Znění VOP pro sezónu 2026 není nikde archivované.** Zákazníci sezóny 2026
uzavřeli smlouvu podle předchozího znění a čl. 29 na něj odkazuje, jenže to znění
na webu po téhle změně není. Archivovat ho na trvalé URL (např. `/podminky/2026`)?

**15. Datum účinnosti je v kódu natvrdo (doplňuje otázku č. 3).** V obou souborech
stojí „16. září 2026" a větev zatím není nasazená. Nasadí-li se jindy, text bude
lhát o vlastní účinnosti — datum se musí v den nasazení ručně přepsat (`gdpr/page.tsx`
hlavička a patička, `podminky/page.tsx` hlavička a patička).

## Otázky pro majitele — doplnění (celkem 16)

**16. Účel, právní základ a doba uchování u provozních zpracovatelů.** Nová položka
`Upstash` v oddílu 8 uvádí účel „ochrana formulářů před zneužitím", jenže oddíl 3 ten
účel nezná, oddíl 4 k němu neuvádí právní základ a oddíl 5 neříká, jak dlouho se IP
adresa drží (v kódu je to okno rate limitu — 600 sekund, `src/lib/rate-limit.ts`).
Čtenář se tak dozví, kdo údaje zpracovává, ale ne proč a jak dlouho. Nabízejí se dvě
cesty, rozhodnout je musí majitel:

- **a)** doplnit „ochranu formulářů před zneužitím" mezi účely v oddílu 3 a přidat
  k ní právní základ podle čl. 6 odst. 1 písm. f) (oprávněný zájem) v oddílu 4, nebo
- **b)** dopsat dobu uchování přímo k položce v oddílu 8 a nechat oddíly 3 a 4 být.

**Rozhodnutí se netýká jen Upstash.** Stejnou mezeru mají i **Sentry** (chybové
záznamy serveru), **Vercel** (hosting, provozní logy) a **Sanity** (správa obsahu) —
jsou uvedené jako zpracovatelé, ale bez účelu v oddílu 3, bez základu v oddílu 4
a bez doby uchování v oddílu 5. Ať už se zvolí kterákoliv cesta, měla by se použít
na celý oddíl 8 najednou, ne jen na nově doplněnou položku.


---

## Otázky ze závěrečné revize fáze

nebo údaje, které kód nezná.

**O1 — Formulář prohlášení o bezinfekčnosti.** Čl. 27 VOP tvrdí, že formulář je
součástí nástupního listu. Není a e-mail nic nepřikládá. Vyrobit a přikládat,
nebo větu z VOP škrtnout?

**O2 — Cena turnusů léto 2027.** Není stanovená nikde. Do VOP se žádná částka
nedopsala; až bude, patří do `turnusy.ts`.

**O3 — Doložitelnost kvalifikace lektorů.** Tvrzení o „aktivních programátorech,
inženýrech a designérech s praxí z oboru“ jsem odstranil. Pokud to doložit umíte,
dá se vrátit — ale musí existovat něco, na co se dá při dotazu ukázat.

**O4 — Strážný test proti stavu `otevreno`.** Obě jeho původní odůvodnění jsou
vyřešená. Nechal jsem ho jako záměrnou brzdu. Má zůstat?

**O5 — Chybí výslovný souhlas pro zdravotní údaje. (tvrdý blokátor prodeje.)**
`/gdpr` slibuje „Výslovný souhlas se zvláštní kategorií údajů (čl. 9 odst. 2
písm. a) GDPR)“ pro zdravotní omezení a alergie dítěte, ale `consentsSchema`
v `src/lib/registration.ts` má jen čtyři obecné souhlasy (`vop_consent`,
`gdpr_consent`, `photo_consent`, `marketing_consent`) a `child_health_notes` se
sbírá bez vlastního. Dokud se to nevyřeší, nesmí žádný turnus jít do prodeje.
Jde o právní rozhodnutí o znění souhlasu, ne o technický úkol, proto neuděláno.

**O6 — Adresa FabLabu je nenavigovatelná.** `src/lib/cities.ts` má
`street: 'Dykova'` bez čísla popisného a `city: 'Stará Role'` místo Karlových
Varů. Souřadnice `geo` venue jsou navíc doslovná kopie souřadnic města (obojí
`50.2318 / 12.8714`), takže špendlík v mapě ukazuje na centrum Karlových Varů,
ne na budovu. Tahle adresa jde do nástupního listu, do strukturovaných dat
i na `/kontakt`. **Správné hodnoty jsem nevymýšlel.** Potřebuji od vás číslo
popisné, správný název obce pro poštovní adresu a souřadnice vchodu.

**O7 — Je účet Fakturoidu vedený na Weeks s.r.o.?** Z kódu se to nezjistí —
identita dodavatele na faktuře pochází z nastavení účtu Fakturoidu, ne z repozitáře.
Faktura je poslední dokument, který rodič dostane, a je to jediné místo, kde by
mohl bývalý provozovatel zůstat, aniž to kdokoli v kódu uvidí. Prosím o kontrolu
v nastavení Fakturoidu.

---

## Rozhodnutí, která jsem udělal sám

Kde plán nebo revize narazily na rozpor, rozhodl jsem a šel dál, aby se práce
nezastavila. Tohle jsou ta, která mají cenu, když jsou špatně — každé jde vzít zpět.

| # | Rozhodnutí | Co to stojí, když je špatně |
|---|---|---|
| 1 | Sekce „Kde a s kým" **netvrdí pojištění účastníků** ani dobu odezvy. Web to dnes netvrdí nikde jinde a pro Weeks s.r.o. to nedoložím. | Úvodka postrádá argument, který rodiče zajímá, dokud ho nepotvrdíte. |
| 2 | **Název tábora se odvozuje i pro vyprodaný turnus.** Původní návrh ho pouštěl jen u turnusu v prodeji — jenže nástupní list a faktura běží typicky až po vyprodání, takže by na faktuře skončilo holé `3d-tisk`. | Název by vznikl i pro turnus, který se nikdy neprodával. Neškodné. |
| 3 | **Analytika dostává `term_id`, ne čitelný název.** Rozměr navázaný na textaci se rozpadne při prvním přejmenování. | Nic — žádná historická data zatím neexistují. |
| 4 | **Cenová tabulka a cizí bankovní účet z podmínek odstraněny hned**, ne až po vašem rozhodnutí. `/podminky` je indexovaná, takže to nebyl odložený úkol, ale publikovaná nepravda o ceně a o čísle účtu. | Podmínky dočasně neuvádějí cenu, kterou stejně nikdo nemůže zaplatit. |
| 5 | **`public/og-image-v2.jpg` smazán.** Byl veřejně dosažitelný a stálo v něm „pořádá DDM Praha 6 ve spolupráci s HWLab". | Žádné — náhledový obrázek dnes generuje kód. |
| 6 | **`locations.ts` zkrácen z 229 na 45 řádků** na mapu měst → kontakt. Zbytek (ceny zrušených formátů, cizí místa konání, texty) nikdo nečetl. | Kdyby se ukázalo, že něco z toho někdo potřebuje, je to v historii gitu. |
| 7 | **Formulace „zkušení lektoři" a „odborníci z praxe" ponechány**, tvrzení o certifikacích a ověřených referencích odstraněna. Rozlišuji hodnotící přívlastek od tvrzení o ověřitelném faktu. | Mírné nadsazení v marketingové rovině. |
| 8 | **`/firmy` zůstává mrtvým odkazem v navigaci**, protože ji staví hned další fáze. | Kdyby k tomu nedošlo, je v hlavním menu 404. |

---

## Drobnosti, které zbyly vědomě

- `src/app/api/cron/nastupni-list/route.ts` — komentář odkazuje na čl. 12 VOP („Změny
  podmínek"), měl mířit na čl. 27 („Nástupní list"). Předexistující, jednořádkové.
- `src/lib/analytics.ts` — několik nevolaných funkcí s natvrdo zadanými cenami zrušených
  formátů (1 490 / 2 990 Kč). Ověřeno, že je nikdo nevolá, takže do Mety žádná falešná
  cena nejde. Je to poslední místo v `src/` s cenami zaniklé nabídky.
- `src/app/go/[slug]/route.ts` a `scripts/generate-qr.mjs` — slugy `ddm` a `hwlab`
  v přesměrování pro QR kódy. **Schválně ponecháno**: fyzické plakáty z jara 2026 můžou
  být pořád venku a smazáním by kódy přestaly fungovat.
- `public/images/hwlab/` — 32 fotek, používá se jedna (na úvodce). Je to fotka z tábora
  Weeks, takže popisek je pravdivý; jen ta složka se jmenuje po místě, kde se dnes nekoná.
- Tým je na třech místech zvlášť (`KdeASKym.tsx`, `/o-nas`, `CLAUDE.md`). Levná oprava je
  přesunout ho do `src/lib/site.ts`.
