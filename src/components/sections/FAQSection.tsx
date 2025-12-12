'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    question: 'Pro koho jsou tábory určeny?',
    answer: 'Tábory jsou určeny pro děti ve věku 10-15 let, které zajímá technika, programování nebo kreativní tvorba. Není potřeba žádná předchozí zkušenost.',
  },
  {
    question: 'Jak probíhá přihlášení?',
    answer: 'Přihlášení probíhá přes systém DDM Praha 6. Po kliknutí na tlačítko "Přihlásit se" budete přesměrováni na registrační formulář DDM.',
  },
  {
    question: 'Co je v ceně tábora zahrnuto?',
    answer: 'V ceně je zahrnuto: celý program, veškeré materiály, oběd a svačiny, pojištění a výrobky, které si děti odnesou domů.',
  },
  {
    question: 'Kde se tábory konají?',
    answer: 'Tábory se konají v HWLabu na Vyšehradě v Praze. Místo je dobře dostupné MHD (metro C, zastávka Vyšehrad).',
  },
  {
    question: 'Jaký je maximální počet dětí?',
    answer: 'Na jednom táboře je maximálně 12 dětí, aby každý dostal dostatek individuální pozornosti od lektorů.',
  },
  {
    question: 'Potřebuje moje dítě vlastní notebook?',
    answer: 'Ne, veškeré vybavení včetně počítačů poskytujeme. Děti si nemusí nosit nic kromě dobré nálady.',
  },
]

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border-b border-gray-200 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-5 flex items-center justify-between text-left"
      >
        <span className="font-semibold text-gray-900 pr-4">{question}</span>
        <ChevronDown
          className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
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
            Časté dotazy
          </h2>
          <p className="text-xl text-gray-600 mb-12 text-center">
            Odpovědi na nejčastější otázky rodičů.
          </p>

          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm">
            {faqs.map((faq) => (
              <FAQItem key={faq.question} {...faq} />
            ))}
          </div>

          <p className="text-center text-gray-500 mt-8">
            Máte další otázky?{' '}
            <a href="#kontakt" className="text-primary-600 hover:underline">
              Napište nám
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  )
}
