'use client'

import { useState, useCallback, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

export interface GalleryImage {
  src: string
  alt: string
  featured?: boolean
}

interface GallerySectionProps {
  images: GalleryImage[]
  accentColor?: 'primary' | 'trust' | 'accent'
  title?: string
  subtitle?: string
}

export function GallerySection({
  images,
  accentColor = 'primary',
  title = 'Co si děti odnesou domů',
  subtitle = 'Podívejte se na ukázky projektů z našich táborů',
}: GallerySectionProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index)
    document.body.style.overflow = 'hidden'
  }, [])

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null)
    document.body.style.overflow = ''
  }, [])

  const goNext = useCallback(() => {
    setLightboxIndex((prev) => (prev !== null ? (prev + 1) % images.length : null))
  }, [images.length])

  const goPrev = useCallback(() => {
    setLightboxIndex((prev) => (prev !== null ? (prev - 1 + images.length) % images.length : null))
  }, [images.length])

  // Keyboard navigation
  useEffect(() => {
    if (lightboxIndex === null) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft') goPrev()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [lightboxIndex, closeLightbox, goNext, goPrev])

  const textColorMap = {
    primary: 'text-primary-600',
    trust: 'text-trust-600',
    accent: 'text-accent-600',
  }

  return (
    <>
      <section className="section-padding bg-paper">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <p className="mono-label mb-4">{title.split(' ').slice(0, -1).join(' ')}</p>
            <h2 className="heading-2 text-ink mb-4">
              {title.split(' ').slice(0, -1).join(' ')}{' '}
              <span className={textColorMap[accentColor]}>
                {title.split(' ').slice(-1)}
              </span>
            </h2>
            <p className="text-lg text-ink-500 max-w-2xl">
              {subtitle}
            </p>
          </motion.div>

          {/* Bento Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 grid-flow-dense gap-3 md:gap-4 max-w-6xl mx-auto auto-rows-[200px] md:auto-rows-[220px]">
            {images.map((image, index) => {
              const isFeatured = image.featured
              return (
                <motion.button
                  key={image.src}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => openLightbox(index)}
                  className={`relative overflow-hidden rounded-md group cursor-pointer focus:outline-none focus:ring-2 focus:ring-${accentColor}-500 focus:ring-offset-2 border border-ink/15 ${
                    isFeatured ? 'col-span-2 row-span-2 shadow-hard' : ''
                  }`}
                  aria-label={`Zobrazit: ${image.alt}`}
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      sizes={isFeatured ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 768px) 50vw, 25vw'}
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  </div>
                </motion.button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            onClick={closeLightbox}
            role="dialog"
            aria-modal="true"
            aria-label="Galerie"
          >
            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Zavřít"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Prev */}
            <button
              onClick={(e) => { e.stopPropagation(); goPrev() }}
              className="absolute left-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Předchozí"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Next */}
            <button
              onClick={(e) => { e.stopPropagation(); goNext() }}
              className="absolute right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Další"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Image */}
            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative max-w-5xl max-h-[85vh] w-full h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[lightboxIndex].src}
                alt={images[lightboxIndex].alt}
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
            </motion.div>

            {/* Caption + counter */}
            <div className="absolute bottom-4 left-0 right-0 text-center">
              <p className="text-white/90 font-medium mb-1">{images[lightboxIndex].alt}</p>
              <p className="text-white/50 text-sm">{lightboxIndex + 1} / {images.length}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
