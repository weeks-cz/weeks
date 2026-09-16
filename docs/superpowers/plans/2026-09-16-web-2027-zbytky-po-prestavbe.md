# Co zůstalo po přestavbě webu 2027

Soupis věcí, které jsem při přestavbě našel a **vědomě neopravil**. Každá má
důvod, proč zůstala, a odhad, co stojí ji nechat ležet. Není to seznam vad
k okamžité opravě — je to poznámka pro toho, kdo bude web dělat příště, aby
je nemusel objevovat znovu.

Otázky, které potřebují rozhodnutí majitele, mají vlastní dokumenty:
- `2026-09-16-web-2027-faze-3-otazky-pro-majitele.md` — právní texty, ceny, IČO
- `2026-09-16-web-2027-faze-5-otazky-pro-majitele.md` — co si dítě odveze domů,
  tiskárny, resin, souhlasy s fotkami, oběd v ceně

---

## Obsah a texty

**FAQ odkazuje na místo, kam se návštěvník nemusí dostat.**
`src/lib/site.ts` — odpověď na „Co si dítě odveze domů?" posílá čtenáře „u
každého zaměření zvlášť". FAQ zaměření se ale vykresluje **jen** na stránce
turnusu; na úvodce a na `/tabor`, kde `getSiteFaq()` běží taky, žádný takový
blok není. Odkaz tam nemá kam vést.
*Proč zůstalo:* správná oprava závisí na odpovědi majitele (otázka č. 1 fáze 5).
Až bude jasné, co platí, napíše se to na jedno místo a tenhle odkaz zmizí.

**Galerie „Co si vaše dítě odnese domů" stojí nad fotkami procesu.**
`src/app/tabor/[turnus]/page.tsx` — sekce s `ProjectGallery` sousedí s odpovědí
„Micro:bity a Arduina zůstávají v laboratoři" a mezi 14 fotkami je šest z IoT
(„Práce s Arduino breadboardem", „Programování Arduina", „Detail breadboardu").
Text sekce už elektroniku neslibuje, ale nadpis nad fotkami ji implicitně řadí
mezi to, co jde domů.
*Proč zůstalo:* stejná závislost jako výš.

**Měkčí varianty téhož slibu.**
`src/app/tabor/page.tsx` — „hotový výrobek, který si dítě odveze domů" a „co dítě
vytvoří v pondělí, si v pátek odnese domů". V pondělí je 3D tisk, takže obojí
drží; uvedeno pro úplnost, kdyby se měnil harmonogram.

---

## Testy a kód

**Název testu tvrdí opak toho, co web dělá.**
`src/lib/focus.test.ts` — test se jmenuje „3D tisk jmenuje konkrétní modely
tiskáren, se kterými děti pracují" a kontroluje, že pole `printers` má aspoň
čtyři položky. Data se zachovat měla, takže test je věcně v pořádku — ale web ty
modely od fáze 5 **nevykresluje** (inventář nedomluveného prostoru). Stačí test
přejmenovat a odkázat na komentář u dat.

**Vazbu schematu úvodky hlídá test čtením zdroje.**
`src/components/seo/schema-turnusy.test.ts` — test čte `NejblizsiTurnusy.tsx`
a `page.tsx` a hledá v nich řetězce. Je to záměr, ne nedopatření: komponentu
v prostředí `node` bez jsdom vykreslit nejde a vazba mezi dvěma soubory se jinak
pokrýt nedá. Kdyby repozitář někdy dostal jsdom a testing-library, tenhle test
se má nahradit vykreslením komponenty.

---

## Přístupnost a výkon

**`/registrace` má skok nadpisových úrovní** `h1 → h3` (mezi tím nic).
Jediná cesta na webu, kde skok zbyl.

**Devět fotek na `/eshop` nemá `loading="lazy"`** — produktové karty pod prvním
přehybem. Předchází přestavbě, e-shop se v ní měnil jen o strukturovaná data.

---

## Odloženo vědomě z dřívějších fází

- **VOP §12 vs §27** — křížový odkaz v komentáři, drobnost v právním textu.
- **`go/[slug]`** — QR slugy ponechány schválně, ať fungují vytištěné kódy.
- **Data týmu na více místech** — `o-nas/page.tsx` a `KdeASKym.tsx` drží každé
  svůj seznam. Sjednotit se má, až bude jasné, jestli tým na `/o-nas` zůstává
  v dnešní podobě.
- **`analytics.ts` — dva anglické komentáře** (hlavička souboru a jedno
  pokračování věty) zbyly po překladu do češtiny.
