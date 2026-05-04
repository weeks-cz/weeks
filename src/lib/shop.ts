export type ShopProductType = 'set' | 'upgrade-kit' | 'project'

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
  type: ShopProductType
  categoryLabel: string
  unlocks: string
  compatibility?: string
}

export const shopProducts: ShopProduct[] = [
  {
    slug: 'iot-starter-kit',
    name: 'Weeks Starter sada',
    subtitle: 'První chytré zapojení doma',
    price: 1490,
    ageRange: '10-14 let',
    level: 'Začátečník',
    leadTime: 'Sbíráme zájem',
    image: '/images/gallery/iot-arduino-breadboard.jpg',
    description: 'Základní sada chytré elektroniky pro první lekce ve Weeks Učebně a bezpečný domácí start.',
    longDescription: 'Weeks Starter sada je vstupenka do chytré elektroniky bez shánění náhodných součástek. Dítě dostane řídicí desku, nepájivé pole, kabely a základní senzory, aby mohlo ve Weeks Učebně projít prvními projekty od LEDek přes tlačítka až po jednoduchá měření.',
    includes: [
      'Arduino kompatibilní deska s USB kabelem',
      'Nepájivé pole a sada propojovacích kabelů',
      'LED diody, RGB LED, odpory a tlačítka',
      'Bzučák, fotorezistor, potenciometr a jednoduchý teplotní senzor',
      'Servo motor pro první pohyblivé projekty',
      'Přístup do Weeks Učebny k projektům pro Starter sadu',
    ],
    highlights: [
      'Obsahuje základní elektroniku, kterou další sady už znovu nekopírují',
      'Vhodná i bez předchozí zkušenosti s programováním',
      'Připraví dítě na navazující Home Lab a Explorer kity',
    ],
    idealFor: [
      'Děti, které chtějí začít stavět podle vedených projektů',
      'Rodiče, kteří chtějí technický dárek s jasným postupem',
      'Domácí pokračování po prvním setkání s Weeks',
    ],
    projects: [
      'Semafor s tlačítkem',
      'Noční světlo se senzorem',
      'Reakční hra s LEDkami',
      'Mini trezor s bzučákem',
    ],
    badge: 'Nejlepší start',
    type: 'set',
    categoryLabel: 'Celá sada',
    unlocks: 'Odemkne základní Starter část Weeks Učebny.',
  },
  {
    slug: 'smart-home-lab',
    name: 'Weeks Home Lab',
    subtitle: 'Chytrá domácnost na stole',
    price: 2290,
    ageRange: '11-15 let',
    level: 'Mírně pokročilý',
    leadTime: 'Sbíráme zájem',
    image: '/images/gallery/iot-circuit-design.jpg',
    description: 'Kompletní sada pro domácí chytrá zařízení se senzory, displejem, WiFi deskou a reálnými scénáři.',
    longDescription: 'Weeks Home Lab je celá sada pro děti, které chtějí stavět chytrou domácnost na stole. Obsahuje základní výbavu i specifické komponenty pro měření prostředí, upozornění, jednoduché alarmy a první internetové propojení. Hodí se pro zákazníka, který ještě žádnou Weeks sadu nemá.',
    includes: [
      'Vše důležité ze Starter sady: deska, breadboard, kabely, LEDky, odpory a tlačítka',
      'ESP deska pro WiFi projekty',
      'Senzor teploty a vlhkosti, senzor světla a senzor pohybu',
      'I2C OLED displej pro zobrazování hodnot',
      'Magnetický kontakt, bzučák a sada pro signalizaci',
      'Přístup do Weeks Učebny k Home Lab projektům',
    ],
    highlights: [
      'Kompletní balení pro zákazníky bez Starter sady',
      'Reálné domácí scénáře: měření, alarmy a notifikace',
      'Kdo už má Starter sadu, může místo toho zvolit levnější Home Lab kit',
    ],
    idealFor: [
      'Děti, které už někdy zapojovaly jednoduchý obvod',
      'Rodiny, které chtějí propojit hraní, tvoření a učení',
      'Začátek s IoT bez nutnosti vlastnit předchozí sadu',
    ],
    projects: [
      'Domácí meteostanice',
      'Chytrý hlídač šuplíku',
      'Hlídač potopy',
      'Parkovací asistent',
    ],
    badge: 'Chytrá domácnost',
    type: 'set',
    categoryLabel: 'Celá sada',
    unlocks: 'Odemkne Starter i Home Lab část Weeks Učebny.',
  },
  {
    slug: 'sensor-explorer-box',
    name: 'Weeks Explorer sada',
    subtitle: 'Experimenty, měření a vlastní nápady',
    price: 2890,
    ageRange: '12-16 let',
    level: 'Pokročilý',
    leadTime: 'Sbíráme zájem',
    image: '/images/gallery/iot-plant-sensor.jpg',
    description: 'Rozšířená kompletní sada pro IoT projekty s motory, světly, ovladači a větším prostorem pro vlastní prototypy.',
    longDescription: 'Weeks Explorer sada je nejširší balení pro děti, které chtějí za hranici základních zapojení. Spojuje základní výbavu, Home Lab komponenty a rozšíření pro pohyb, světelné efekty, ovládání a delší projekty. Hodí se pro zákazníka, který chce rovnou největší balení.',
    includes: [
      'Základní výbava pro zapojování: deska, breadboard, kabely, odpory, LEDky a tlačítka',
      'ESP32 deska pro WiFi a Bluetooth projekty',
      'Senzory prostředí včetně BME280 a kapacitního senzoru vlhkosti půdy',
      'Adresovatelný RGB LED pásek nebo NeoPixel kroužek',
      'Rotační enkodér, krokový motor 28BYJ-48 s driverem ULN2003',
      'Přístup do Weeks Učebny k Explorer projektům',
    ],
    highlights: [
      'Největší prostor pro vlastní tvorbu a experimenty',
      'Obsahuje komponenty pro světla, ovladače, motory i měření',
      'Kdo už má Starter sadu, může navázat levněji přes Explorer kit',
    ],
    idealFor: [
      'Děti, které už vědí, že je chytrá elektronika baví',
      'Domácí kutily se zájmem o techniku',
      'Absolventy Weeks programu, kteří chtějí pokračovat doma',
    ],
    projects: [
      'Květinový záchranář',
      'Chytrý notifikátor',
      'Chytrý knob',
      'Automatizace rolet',
    ],
    badge: 'Pro zvídavce',
    type: 'set',
    categoryLabel: 'Celá sada',
    unlocks: 'Odemkne Starter, Home Lab i Explorer část Weeks Učebny.',
  },
  {
    slug: 'home-lab-upgrade-kit',
    name: 'Home Lab kit',
    subtitle: 'Rozšíření pro majitele Starter sady',
    price: 890,
    ageRange: '11-15 let',
    level: 'Navazující',
    leadTime: 'Sbíráme zájem',
    image: '/images/gallery/iot-circuit-design.jpg',
    description: 'Doplňkový balíček se specifickými Home Lab komponenty bez znovunakupování Arduina, breadboardu a kabelů.',
    longDescription: 'Home Lab kit je určený pro děti, které už mají Weeks Starter sadu. Neposíláme znovu základní výbavu, ale jen komponenty potřebné pro další úroveň: WiFi desku, senzory prostředí, displej a prvky pro domácí alarmy. Ze Starter sady tak vznikne Home Lab.',
    includes: [
      'ESP deska pro WiFi projekty',
      'Senzor teploty a vlhkosti BME280 nebo DHT22',
      'I2C OLED displej 0.96"',
      'PIR senzor pohybu a magnetický kontakt',
      'Senzor úniku vody a piezo bzučák',
      'Odemčení Home Lab projektů ve Weeks Učebně',
    ],
    highlights: [
      'Levnější cesta pro zákazníky, kteří už mají Starter sadu',
      'Bez duplicitních základních součástek',
      'Přidá WiFi, displej a domácí senzory',
    ],
    idealFor: [
      'Majitele Weeks Starter sady',
      'Děti, které chtějí po základech přejít na chytrou domácnost',
      'Rodiče, kteří nechtějí platit podruhé za stejnou základní elektroniku',
    ],
    projects: [
      'Domácí meteostanice',
      'Chytrý hlídač šuplíku',
      'Hlídač potopy',
      'Parkovací asistent',
    ],
    badge: 'Upgrade bez duplicit',
    type: 'upgrade-kit',
    categoryLabel: 'Navazující kit',
    unlocks: 'Rozšíří Starter sadu a odemkne Home Lab část Učebny.',
    compatibility: 'Počítá s tím, že doma už máte Weeks Starter sadu nebo podobnou základní Arduino výbavu.',
  },
  {
    slug: 'explorer-upgrade-kit',
    name: 'Explorer kit',
    subtitle: 'Rozšíření ze Starter/Home Lab na pokročilé projekty',
    price: 1190,
    ageRange: '12-16 let',
    level: 'Pokročilý',
    leadTime: 'Sbíráme zájem',
    image: '/images/gallery/iot-plant-sensor.jpg',
    description: 'Doplňkový balíček pro pokročilé projekty se světly, motory, ovladačem a senzory pro vlastní prototypy.',
    longDescription: 'Explorer kit navazuje na Starter nebo Home Lab výbavu. Přidává komponenty, které dávají projektům pohyb, světlo, fyzické ovládání a větší samostatnost. Je to cesta pro zákazníka, který nechce kupovat celou Explorer sadu, protože základní elektroniku už doma má.',
    includes: [
      'ESP32 deska pro WiFi a Bluetooth projekty',
      'Kapacitní senzor vlhkosti půdy v2.0',
      'NeoPixel RGB kroužek nebo krátký adresovatelný LED pásek',
      'Rotační enkodér s tlačítkem',
      'Krokový motor 28BYJ-48 s driverem ULN2003',
      'Odemčení Explorer projektů ve Weeks Učebně',
    ],
    highlights: [
      'Pokročilé komponenty bez duplicitní základní výbavy',
      'Vhodné jako další level po Starter nebo Home Lab sadě',
      'Otevírá delší projekty s IoT, světly a pohybem',
    ],
    idealFor: [
      'Majitele Starter nebo Home Lab sady',
      'Děti, které chtějí stavět výraznější domácí projekty',
      'Pokračování po táboře, kroužku nebo domácím workshopu',
    ],
    projects: [
      'Květinový záchranář',
      'Chytrý notifikátor',
      'Chytrý knob',
      'Automatizace rolet',
    ],
    badge: 'Další level',
    type: 'upgrade-kit',
    categoryLabel: 'Navazující kit',
    unlocks: 'Doplní pokročilé komponenty a odemkne Explorer část Učebny.',
    compatibility: 'Nejlépe funguje se Starter sadou. Pokud už máte Home Lab, část senzorů se využije i v Explorer projektech.',
  },
  {
    slug: 'kvetinovy-zachranar',
    name: 'Květinový záchranář',
    subtitle: 'Chytrý monitor rostlin',
    price: 390,
    ageRange: '11-15 let',
    level: 'Mírně pokročilý',
    leadTime: 'Sbíráme zájem',
    image: '/images/gallery/iot-plant-sensor.jpg',
    description: 'Malý projekt, který hlídá vlhkost půdy a upozorní, když rostlina potřebuje zalít.',
    longDescription: 'Květinový záchranář je samostatný projekt pro děti, které chtějí postavit něco praktického. Senzor se zapíchne do hlíny, ESP vyhodnocuje vlhkost a upozorní LEDkou, bzučákem nebo přes WiFi. V Učebně se odemkne jen tento projekt.',
    includes: [
      'ESP deska',
      'Kapacitní senzor vlhkosti půdy v2.0',
      'LED nebo pasivní bzučák',
      'Nepájivé pole a propojovací kabely',
      'Přístup k jednomu projektu ve Weeks Učebně',
    ],
    highlights: [
      'Levnější než celá sada',
      'Řeší reálný domácí problém',
      'Učebna odemkne pouze tento projekt',
    ],
    idealFor: [
      'První samostatný IoT projekt',
      'Děti, které mají rády praktické vychytávky',
      'Vyzkoušení Weeks Učebny bez nákupu celé sady',
    ],
    projects: ['Květinový záchranář'],
    badge: 'Malý projekt',
    type: 'project',
    categoryLabel: 'Samostatný projekt',
    unlocks: 'Odemkne pouze projekt Květinový záchranář.',
  },
  {
    slug: 'domaci-meteostanice',
    name: 'Domácí meteostanice',
    subtitle: 'Monitor prostředí v pokoji',
    price: 490,
    ageRange: '11-15 let',
    level: 'Mírně pokročilý',
    leadTime: 'Sbíráme zájem',
    image: '/images/gallery/iot-circuit-design.jpg',
    description: 'Projekt s displejem, který měří teplotu, vlhkost a tlak a může posílat data do grafů.',
    longDescription: 'Domácí meteostanice ukazuje aktuální stav v pokoji na malém OLED displeji. Dítě si vyzkouší práci se senzorem, displejem i odesíláním dat na internetovou službu pro jednoduché grafy. V Učebně se odemkne jen tento projekt.',
    includes: [
      'ESP deska',
      'BME280 nebo DHT22 senzor',
      'I2C OLED displej 0.96"',
      'Nepájivé pole a propojovací kabely',
      'Přístup k jednomu projektu ve Weeks Učebně',
    ],
    highlights: [
      'Viditelný výsledek na displeji',
      'Dobré propojení elektroniky, programování a dat',
      'Učebna odemkne pouze tento projekt',
    ],
    idealFor: [
      'Děti, které baví měření a grafy',
      'Noční stolek, pracovní stůl nebo dětský pokoj',
      'Praktický projekt na doma',
    ],
    projects: ['Domácí meteostanice'],
    badge: 'Malý projekt',
    type: 'project',
    categoryLabel: 'Samostatný projekt',
    unlocks: 'Odemkne pouze projekt Domácí meteostanice.',
  },
  {
    slug: 'chytry-notifikator',
    name: 'Chytrý notifikátor',
    subtitle: 'RGB lampička podle internetu',
    price: 390,
    ageRange: '12-16 let',
    level: 'Pokročilý',
    leadTime: 'Sbíráme zájem',
    image: '/images/gallery/iot-arduino-programming.jpg',
    description: 'Designový projekt s RGB světlem, které mění barvu podle počasí, zpráv nebo vlastních pravidel.',
    longDescription: 'Chytrý notifikátor je malá RGB lampička řízená ESP deskou. Dítě ji naprogramuje tak, aby svítila podle počasí, notifikace nebo hodnot z internetu. Projekt je vizuální, dobře se ukazuje a v Učebně se odemkne samostatně.',
    includes: [
      'ESP deska',
      'NeoPixel RGB kroužek nebo krátký LED pásek',
      'Základní difuzor nebo šablona pro stínítko',
      'Propojovací kabely',
      'Přístup k jednomu projektu ve Weeks Učebně',
    ],
    highlights: [
      'Atraktivní světelný výsledek',
      'Ukazuje propojení internetu a fyzického zařízení',
      'Učebna odemkne pouze tento projekt',
    ],
    idealFor: [
      'Děti, které baví světla a vizuální efekty',
      'Ukázku na akci nebo domácí stůl',
      'První pokročilejší IoT automatizaci',
    ],
    projects: ['Chytrý notifikátor'],
    badge: 'Malý projekt',
    type: 'project',
    categoryLabel: 'Samostatný projekt',
    unlocks: 'Odemkne pouze projekt Chytrý notifikátor.',
  },
  {
    slug: 'parkovaci-asistent',
    name: 'Parkovací asistent',
    subtitle: 'Ultrazvukový semafor do garáže',
    price: 350,
    ageRange: '10-14 let',
    level: 'Začátečník',
    leadTime: 'Sbíráme zájem',
    image: '/images/gallery/iot-arduino-breadboard.jpg',
    description: 'Jednoduchý projekt, který měří vzdálenost a ukazuje zelenou, žlutou nebo červenou.',
    longDescription: 'Parkovací asistent je přehledný projekt na vysvětlení senzorů. Ultrazvuk měří vzdálenost, LEDky ukazují stav a dítě si vyzkouší podmínky v kódu. V Učebně se odemkne jen tento projekt.',
    includes: [
      'Arduino kompatibilní nebo ESP deska',
      'Ultrazvukový senzor HC-SR04',
      'Zelená, žlutá a červená LED dioda',
      'Odpory, nepájivé pole a kabely',
      'Přístup k jednomu projektu ve Weeks Učebně',
    ],
    highlights: [
      'Srozumitelný princip měření vzdálenosti',
      'Rychle viditelný výsledek',
      'Učebna odemkne pouze tento projekt',
    ],
    idealFor: [
      'Začátečníky, kteří už zvládnou LEDky',
      'Praktickou ukázku senzorů',
      'Krátký domácí projekt',
    ],
    projects: ['Parkovací asistent'],
    badge: 'Malý projekt',
    type: 'project',
    categoryLabel: 'Samostatný projekt',
    unlocks: 'Odemkne pouze projekt Parkovací asistent.',
  },
]

export const productTypeLabels: Record<ShopProductType, string> = {
  set: 'Celé sady',
  'upgrade-kit': 'Navazující kity',
  project: 'Malé projekty',
}

export const productTypeDescriptions: Record<ShopProductType, string> = {
  set: 'Kompletní balení pro zákazníky, kteří doma ještě nemají potřebnou základní elektroniku.',
  'upgrade-kit': 'Doplňky pro majitele Starter sady. Přidají jen nové komponenty a odemknou další úroveň Učebny.',
  project: 'Levnější samostatné projekty. V Učebně se odemkne pouze konkrétní projekt, ne celá sada.',
}

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

export function getShopProductsByType(type: ShopProductType) {
  return shopProducts.filter((product) => product.type === type)
}
