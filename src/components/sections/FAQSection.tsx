'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    question: 'Je kemp vhodný pro úplné začátečníky?',
    answer: 'Ano. Program přizpůsobujeme úrovni každého dítěte. Začátečníci začínají s asistovanými projekty a postupně získávají samostatnost. Pokročilí dostanou složitější výzvy. Není potřeba žádná předchozí zkušenost s technologiemi.',
  },
  {
    question: 'Jak vypadá typický den?',
    answer: '9:00 - příchod a rozcvička, 9:30-11:30 - workshop 1 (např. 3D modelování), 11:30-12:00 - svačina a venkovní přestávka, 12:00-13:30 - workshop 2 (např. programování), 13:30-14:30 - oběd, 14:30-16:30 - projekt podle výběru, 16:30-17:00 - prezentace a závěr. Program střídáme, aby děti neseděly 8 hodin u počítače.',
  },
  {
    question: 'Co má dítě mít s sebou?',
    answer: 'Jen dobrou náladu a svačinu na dopoledne (oběd zajišťujeme my). Všechno technické vybavení, nástroje i materiály jsou na místě. Máme k dispozici počítače pro všechny.',
  },
  {
    question: 'Kolik stojí jeden víkend?',
    answer: 'Cena je 2 990 Kč za víkend (sobota + neděle, celkem 16 hodin programu). Zahrnuje veškeré materiály, obědy a všechny vytvořené projekty si děti odnášejí domů.',
  },
  {
    question: 'Musí dítě přijít oba dny, nebo jen jeden?',
    answer: 'Víkendový kemp je koncipován jako celek sobota + neděle, protože projekty na sebe navazují. Jednotlivé dny neprodáváme. V případě závažných důvodů nás prosím kontaktujte a pokusíme se najít řešení.',
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
    answer: 'Pokud dítě první den rozhodne, že to není pro něj, vrátíme 50% ceny. Naším cílem je, aby se děti bavily a učily se zároveň - pokud to nefunguje, nechceme nikoho nutit.',
  },
]

function FAQItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [isOpen, setIsOpen] = useState(false)
  const answerId = `faq-answer-${index}`

  return (
    <div className="border-b border-gray-200 last:border-0">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-5 flex items-center justify-between text-left focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-lg"
        aria-expanded={isOpen}
        aria-controls={answerId}
      >
        <span className="font-semibold text-gray-900 pr-4">{question}</span>
        <ChevronDown
          className={`w-5 h-5 text-gray-500 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
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
            <p className="pb-5 text-gray-600">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function FAQSection() {
  return (
    <section className="section-padding bg-gray-50">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="heading-2 text-gray-900 mb-4 text-center">
            Časté dotazy <span className="text-gradient">rodičů</span>
          </h2>
          <p className="text-xl text-gray-600 mb-12 text-center">
            Odpovědi na nejčastější otázky. Nenašli jste odpověď? Napište nám.
          </p>

          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm">
            {faqs.map((faq, index) => (
              <FAQItem key={faq.question} {...faq} index={index} />
            ))}
          </div>

          <p className="text-center text-gray-500 mt-8">
            Máte další otázky?{' '}
            <a href="#kontakt" className="text-primary-600 hover:underline font-medium">
              Kontaktujte nás
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  )
}
