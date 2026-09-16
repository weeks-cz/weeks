/**
 * Serializace schema.org dat do obsahu `<script type="application/ld+json">`.
 *
 * `JSON.stringify` **neescapuje** `<`, takze retezec obsahujici `</script>`
 * ukonci skriptovou znacku a zbytek prohlizec vykresli jako HTML. U schematu
 * skladaneho z natvrdo psanych textu je to neskodne, ale nazvy produktu
 * v drobeckach e-shopu chodi z weeks-hubu (`getShopProductBySlug` vola vzdalene
 * API), tedy zvenci. Kdo umi pojmenovat produkt, umel by na weeks.cz vlozit
 * vlastni skript.
 *
 * Escapujeme proto `<` na jeho unikovou sekvenci. Uvnitr JSON retezce je to tyz
 * znak, takze se vyznam dat nemeni a strojove cteni schematu zustava beze zmeny
 * - jen nemuze vzniknout `</script>`. Navic escapujeme oddelovace radku U+2028
 * a U+2029: v JSON platne jsou, v JavaScriptu ale ukoncuji radek a rozbily by
 * skript.
 *
 * Znaky i unikove sekvence se skladaji pres `String.fromCharCode` zamerne. Holy
 * zapis `/</g` neprojde pres esbuild (plete si `<` se zacatkem typoveho
 * argumentu) a holy znak U+2028 ve zdroji rozbije parser uplne, protoze ho cte
 * jako konec radku.
 */
const ZPETNE_LOMITKO = String.fromCharCode(0x5c)

const NAHRADY: Array<[string, string]> = [
  [String.fromCharCode(0x3c), ZPETNE_LOMITKO + 'u003c'],
  [String.fromCharCode(0x2028), ZPETNE_LOMITKO + 'u2028'],
  [String.fromCharCode(0x2029), ZPETNE_LOMITKO + 'u2029'],
]

export function serializeJsonLd(schema: unknown): string {
  return NAHRADY.reduce(
    (text, [znak, unik]) => text.split(znak).join(unik),
    JSON.stringify(schema)
  )
}
