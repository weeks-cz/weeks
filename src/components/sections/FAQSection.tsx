'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useLocation } from '@/contexts/LocationContext'

const baseFaqs = [
  {
    question: 'Je kemp vhodný pro úplné začátečníky?',
    answer: 'Ano. Program přizpůsobujeme úrovni každého dítěte. Začátečníci začínají s asistovanými projekty a postupně získávají samostatnost. Pokročilí dostanou složitější výzvy. Není potřeba žádná předchozí zkušenost s technologiemi.',
  },
  {
    question: 'Jak vypadá typický den?',
    answer: '8:30 - příchod dětí, 9:00 - seznámení a úvod, 9:30-10:30 - workshop (3D tisk, IoT…), 10:30 - svačina, 10:45-12:00 - praktická část, 12:00-13:00 - oběd, 13:00-14:00 - poobědová pauza s venkovní aktivitou, 14:00-15:00 - projekty, 15:00 - odpolední pauza, 15:15-16:30 - samostatná práce, 16:30 - postupný odchod. Střídáme tvoření, přestávky i venkovní aktivity.',
  },
  {
    question: 'Co má dítě mít s sebou?',
    answer: 'Jen dobrou náladu a svačinu na dopoledne (oběd zajišťujeme my). Všechno technické vybavení, nástroje i materiály jsou na místě. Máme k dispozici počítače pro všechny.',
  },
  {
    question: 'Kolik stojí jeden víkend?',
    answer: 'Víkendový Tábor chytrých technologií stojí 2 990 Kč (sobota + neděle, 16 hodin programu). Jednodenní tábory (3D tisk nebo IoT) stojí 1 490 Kč (sobota, 8 hodin programu). Obě ceny zahrnují materiály, obědy a všechny vytvořené projekty si děti odnášejí domů.',
  },
  {
    question: 'Musí dítě přijít oba dny, nebo jen jeden?',
    answer: 'Víkendový Tábor chytrých technologií je koncipován jako celek sobota + neděle, protože projekty na sebe navazují. Pokud vám víkendový formát nevyhovuje, nabízíme jednodenní tábory zaměřené na 3D tisk nebo IoT & elektroniku – ty probíhají jen v sobotu.',
  },
  {
    question: 'Je zajištěn oběd pro děti s alergiemi?',
    answer: 'Ano, při registraci se ptáme na stravovací omezení a alergie. Spolupracujeme s dodavatelem, který dokáže připravit bezlepkové, vegetariánské i jiné speciální varianty. Potřeby dítěte vždy zohledníme.',
  },
  {
    question: 'Můžu jako rodič zůstat s dítětem?',
    answer: 'První den můžete dítě doprovodit dovnitř a podívat se na prostory. Během programu ale prosíme rodiče, aby odešli - děti se lépe soustředí a více se otevřou vrstevníkům. Samozřejmě jsme vám k dispozici telefonicky a v případě jakéhokoliv problému vás kontaktujeme.',
  },
  {
    question: 'Co když se dítěti kemp nebude líbit?',
    answer: 'Mrzelo by nás to — ozvěte se nám a společně najdeme řešení. Vrácení peněz a storno se řídí storno podmínkami v našich obchodních podmínkách (VOP); v případě nemoci doložené lékařským potvrzením řešíme situaci individuálně.',
  },
  {
    type: 'location',
    question: 'Kde jsou kempy?',
    answerKey: 'locationAnswer',
  },
  {
    type: 'organizer',
    question: 'Kdo organizuje kempy?',
    answerKey: 'organizerAnswer',
  },
]

const kvFaqOverrides: Record<number, { question: string; answer: string }> = {
  3: {
    question: 'Kolik stojí letní příměstský tábor?',
    answer: 'Letní příměstský tábor chytrých technologií stojí 4 990 Kč za celý týden (pondělí–pátek, přibližně 40 hodin programu). Cena zahrnuje materiály pro všechny projekty i obědy. Vše, co děti vytvoří, si odnášejí domů.',
  },
  4: {
    question: 'Jak probíhá příměstský tábor?',
    answer: 'Tábor probíhá celý týden od pondělí do pátku, obvykle od 8 do 16 hodin. Každý den se střídají různé aktivity — 3D tisk, IoT & elektronika, VR a základy programování. Na konci týdne si děti odnášejí vlastní projekty, které v průběhu týdne vytvořily.',
  },
}

function FAQItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [isOpen, setIsOpen] = useState(false)
  const answerId = `faq-answer-${index}`
  const indexLabel = `Q${String(index + 1).padStart(2, '0')}`

  return (
    <div className="border-t border-white/10 last:border-b last:border-b-white/10">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-5 flex items-center justify-between text-left focus:outline-none focus:ring-2 focus:ring-accent-400 focus:ring-offset-0 rounded-lg"
        aria-expanded={isOpen}
        aria-controls={answerId}
      >
        <div className="flex items-center gap-4 flex-1 min-w-0 pr-4">
          <span className="font-mono text-xs text-accent-400/70 flex-shrink-0">{indexLabel}</span>
          <span className="font-display font-semibold text-white">{question}</span>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-accent-400/70 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id={answerId}
            role="region"
            aria-labelledby={`faq-question-${index}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="pb-5 pl-12 text-slate-400">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function FAQSection() {
  const location = useLocation()

  const faqs = baseFaqs.map((faq, index) => {
    if (!location.isDefault && kvFaqOverrides[index]) return kvFaqOverrides[index]
    if (faq.type === 'location') return { question: faq.question, answer: location.faq.locationAnswer }
    if (faq.type === 'organizer') return { question: faq.question, answer: location.faq.organizerAnswer }
    return faq
  })

  return (
    <section id="faq" className="section-padding bg-night">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <p className="data-label mb-4 text-center">06 / OTÁZKY</p>
          <h2 className="heading-2 text-center mb-8">
            Časté dotazy <span className="text-gradient">rodičů</span>
          </h2>

          <div className="space-y-0">
            {faqs.map((faq, index) => (
              <FAQItem key={faq.question} question={faq.question} answer={faq.answer || ''} index={index} />
            ))}
          </div>

          <p className="text-center text-slate-400 mt-12">
            Máte další otázky?{' '}
            <a href="#kontakt" className="text-accent-400 hover:text-accent-300">
              Kontaktujte nás
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  )
}
