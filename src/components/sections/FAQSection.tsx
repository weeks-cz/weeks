'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { getSiteFaq } from '@/lib/site'

function FAQItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [isOpen, setIsOpen] = useState(false)
  const answerId = `faq-answer-${index}`

  return (
    <div className="border-b border-ink/15 last:border-0">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-5 flex items-center gap-4 text-left focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-md"
        aria-expanded={isOpen}
        aria-controls={answerId}
      >
        <span className="font-mono text-sm text-ink/40 w-9 shrink-0" aria-hidden="true">
          Q{String(index + 1).padStart(2, '0')}
        </span>
        <span className="font-display font-semibold text-ink pr-4 flex-1">{question}</span>
        <ChevronDown
          className={`w-5 h-5 text-ink/50 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
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
            <p className="pb-5 pl-[52px] text-ink-500">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function FAQSection() {
  const faqs = getSiteFaq()

  return (
    <section id="faq" className="section-padding bg-paper-soft border-b border-ink/15">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <p className="mono-label mb-4">FAQ</p>
          <h2 className="heading-2 text-ink mb-4">
            Časté dotazy <span className="text-primary-600">rodičů</span>
          </h2>
          <p className="text-xl text-ink-500 mb-12">
            Odpovědi na nejčastější otázky. Nenašli jste odpověď? Napište nám.
          </p>

          <div className="border-t border-ink/15">
            {faqs.map((faq, index) => (
              <FAQItem key={faq.question} question={faq.question} answer={faq.answer} index={index} />
            ))}
          </div>

          <p className="text-ink-500 mt-8">
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
