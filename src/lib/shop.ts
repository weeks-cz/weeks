export interface ShopProduct {
  slug: string
  name: string
  subtitle: string
  price: number
  ageRange: string
  level: string
  leadTime: string
  image: string
  description: string
  longDescription: string
  includes: string[]
  highlights: string[]
  idealFor: string[]
  projects: string[]
  badge: string
}

export const shopProducts: ShopProduct[] = [
  {
    slug: 'iot-starter-kit',
    name: 'Weeks Start sada',
    subtitle: 'První chytré zapojení doma',
    price: 1490,
    ageRange: '10-14 let',
    level: 'Začátečník',
    leadTime: 'Odeslání do 5 pracovních dnů',
    image: '/images/gallery/iot-arduino-breadboard.jpg',
    description: 'Základní sada chytré elektroniky pro první projekty ve Weeks Učebně a samostatné tvoření doma.',
    longDescription: 'Weeks Start sada je připravená pro děti, které chtějí doma začít s chytrou elektronikou bez hledání náhodných návodů. V ceně sady je přístup do Weeks Učebny, kde dítě najde projekty pro svou sadu, postupuje vlastním tempem a může navázat na známé prostředí z tábora nebo kroužku.',
    includes: [
      'Arduino kompatibilní deska s USB kabelem',
      'Nepájivé pole a sada propojovacích kabelů',
      'LED diody, odporová sada a tlačítka',
      'Buzzer a základní senzorická sada',
      'Přístup do Weeks Učebny s projekty pro tuto sadu',
    ],
    highlights: [
      'Projekty v Učebně jsou součástí ceny',
      'Bez předchozí zkušenosti s elektronikou',
      'Vhodné jako první domácí technická laboratoř',
    ],
    idealFor: [
      'Děti, které chtějí začít stavět podle vedených projektů',
      'Rodiče, kteří chtějí smysluplný technický dárek',
      'Domácí pokračování po prvním setkání s Weeks',
    ],
    projects: [
      'Semafor s tlačítkem',
      'Noční světlo se senzorem',
      'Reakční hra s LEDkami',
    ],
    badge: 'Nejlepší start',
  },
  {
    slug: 'smart-home-lab',
    name: 'Weeks Home Lab',
    subtitle: 'Chytrá domácnost na stole',
    price: 2290,
    ageRange: '11-15 let',
    level: 'Mírně pokročilý',
    leadTime: 'Odeslání do 7 pracovních dnů',
    image: '/images/gallery/iot-circuit-design.jpg',
    description: 'Sada pro děti, které chtějí doma stavět chytrá zařízení se senzory, displejem a reálnými scénáři.',
    longDescription: 'Weeks Home Lab staví na základech chytré elektroniky a přidává reálnější domácí scénáře: měření teploty, světla nebo pohybu, spouštění akcí podle podmínek a první návrh malé chytré domácnosti. Přístup do Weeks Učebny je v ceně, takže dítě pracuje podle projektů připravených právě pro tuto sadu.',
    includes: [
      'Řídicí deska kompatibilní s Arduino projekty',
      'Senzor teploty a vlhkosti',
      'Senzor světla a pohybu',
      'LCD nebo OLED displej pro zobrazení dat',
      'Přístup do Weeks Učebny s chytrými scénáři',
    ],
    highlights: [
      'Více senzorů, reálnější výstupy a měření',
      'Projekty pro konkrétní sadu ve Weeks Učebně',
      'Dobře funguje po absolvování Weeks programu',
    ],
    idealFor: [
      'Děti, které už někdy zapojovaly jednoduchý obvod',
      'Rodiny, které chtějí propojit hraní, tvoření a učení',
      'Pokračování v podobných projektech po táboře nebo kroužku',
    ],
    projects: [
      'Digitální teploměr',
      'Alarm s pohybovým senzorem',
      'Mini meteorologická stanice',
    ],
    badge: 'Domácí projekty',
  },
  {
    slug: 'sensor-explorer-box',
    name: 'Weeks Explorer sada',
    subtitle: 'Experimenty, měření a vlastní nápady',
    price: 2890,
    ageRange: '12-16 let',
    level: 'Pokročilý',
    leadTime: 'Odeslání do 7 pracovních dnů',
    image: '/images/gallery/iot-plant-sensor.jpg',
    description: 'Rozšířená sada chytré elektroniky pro děti, které chtějí měřit, experimentovat a navrhovat vlastní prototypy.',
    longDescription: 'Weeks Explorer sada počítá s tím, že dítě chce víc svobody. Kromě základní elektroniky obsahuje více senzorů, modul pro ovládání výstupů a materiál pro vlastní návrhy. V Učebně najde delší projekty pro tuto sadu i inspiraci, jak na rozdělané nápady navázat doma.',
    includes: [
      'Rozšířená Arduino kompatibilní sada s napájením a kabeláží',
      'Více druhů senzorů pro měření okolí',
      'Modul pro spínání výstupů a signalizaci',
      'Prvky pro stavbu vlastního prototypu',
      'Přístup do Weeks Učebny s delšími projekty',
    ],
    highlights: [
      'Největší prostor pro vlastní tvorbu',
      'Učebna pomáhá držet směr i u otevřenějších projektů',
      'Dobrá příprava na složitější chytrá zařízení',
    ],
    idealFor: [
      'Děti, které už vědí, že je chytrá elektronika baví',
      'Domácí kutily se zájmem o techniku',
      'Absolventy Weeks programu, kteří chtějí pokračovat doma',
    ],
    projects: [
      'Chytrý květináč',
      'Měření prostředí v pokoji',
      'Vlastní senzorický prototyp',
    ],
    badge: 'Pro zvídavce',
  },
]

export function formatPrice(price: number) {
  return new Intl.NumberFormat('cs-CZ', {
    style: 'currency',
    currency: 'CZK',
    maximumFractionDigits: 0,
  }).format(price)
}

export function getShopProduct(slug: string) {
  return shopProducts.find((product) => product.slug === slug)
}
