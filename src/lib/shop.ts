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
  badge: string
}

export const shopProducts: ShopProduct[] = [
  {
    slug: 'iot-starter-kit',
    name: 'IoT Starter Kit',
    subtitle: 'První kroky s Arduinem a senzory',
    price: 1490,
    ageRange: '10-14 let',
    level: 'Začátečník',
    leadTime: 'Odeslání do 5 pracovních dnů',
    image: '/images/gallery/iot-arduino-breadboard.jpg',
    description: 'Základní sada pro děti, které chtějí pochopit elektroniku, senzory a první automatizace.',
    longDescription: 'Sada je navržena jako domácí pokračování po kroužku nebo táboře. Děti si postaví první zapojení, naučí se pracovat s tlačítkem, LEDkou, buzzerem a jednoduchým senzorem. Materiál je vybraný tak, aby byl vstup do světa Arduino projektů co nejpříjemnější.',
    includes: [
      'Arduino kompatibilní deska s USB kabelem',
      'Nepájivé pole a sada propojovacích kabelů',
      'LED diody, odporová sada a tlačítka',
      'Buzzer a základní senzorická sada',
      'Stručný návod s prvními 5 projekty',
    ],
    highlights: [
      'Bez předchozí zkušenosti',
      'Vhodné jako dárek i první domácí laboratoř',
      'Navazuje na to, co děti zkouší na Weeks',
    ],
    idealFor: [
      'Děti, které baví rozebírat, zkoušet a stavět',
      'Rodiče, kteří chtějí smysluplný technický dárek',
      'Začátek přípravy na kroužky a tábory Weeks',
    ],
    badge: 'Nejlepší start',
  },
  {
    slug: 'smart-home-lab',
    name: 'Smart Home Lab',
    subtitle: 'Chytrá domácnost na stole',
    price: 2290,
    ageRange: '11-15 let',
    level: 'Mírně pokročilý',
    leadTime: 'Odeslání do 7 pracovních dnů',
    image: '/images/gallery/iot-circuit-design.jpg',
    description: 'Sada pro děti, které už chtějí víc než jen blikat LEDkou a zajímá je automatizace a měření.',
    longDescription: 'Smart Home Lab staví na základech a přidává reálnější scénáře: měření teploty, světla nebo pohybu, spouštění akcí podle podmínek a první návrh malé chytré domácnosti. Sada je vhodná pro zvídavé děti, které chtějí zkusit vlastní mini projekty doma.',
    includes: [
      'Řídicí deska kompatibilní s Arduino projekty',
      'Senzor teploty a vlhkosti',
      'Senzor světla a pohybu',
      'LCD nebo OLED displej pro zobrazeni dat',
      'Projektový návod se 3 chytrými scénáři',
    ],
    highlights: [
      'Více senzorů a reálnější výstupy',
      'Skvělé pro samostatné mini projekty doma',
      'Dobře funguje po absolvování Weeks IoT dne',
    ],
    idealFor: [
      'Děti, které už někdy Arduino zkusily',
      'Pokročilejší domácí bastlení',
      'Rodiny, které chtějí propojit hraní a učení',
    ],
    badge: 'Domácí projekty',
  },
  {
    slug: 'sensor-explorer-box',
    name: 'Sensor Explorer Box',
    subtitle: 'Experimenty, měření a vlastní nápady',
    price: 2890,
    ageRange: '12-16 let',
    level: 'Pokročilý',
    leadTime: 'Odeslání do 7 pracovních dnů',
    image: '/images/gallery/iot-plant-sensor.jpg',
    description: 'Rozšířená sada pro děti, které chtějí experimentovat, měřit a navrhovat vlastní funkční prototypy.',
    longDescription: 'Tahle verze počítá s tím, že dítě chce víc svobody. Kromě základní elektroniky obsahuje více senzorů, modul pro ovládání výstupů a materiál pro vlastní návrhy. Hodí se tam, kde už dítě ví, že ho IoT opravdu baví a chce si zkoušet věci po svém.',
    includes: [
      'Rozšířená Arduino sada s napájením a kabeláží',
      'Více druhů senzorů pro měření okolí',
      'Modul pro spínání výstupů a signalizaci',
      'Prvky pro stavbu vlastního prototypu',
      'Inspirace na delší samostatné projekty',
    ],
    highlights: [
      'Největší prostor pro vlastní tvorbu',
      'Vhodné pro děti s vlastní motivací',
      'Dobrá příprava na složitější projekty',
    ],
    idealFor: [
      'Absolventy IoT programu Weeks',
      'Domácí kutily se zájmem o techniku',
      'Školní nebo kroužkové projekty',
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
