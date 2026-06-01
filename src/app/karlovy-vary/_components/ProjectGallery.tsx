'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

// Reálné fotky toho, co si děti na táboře vyrobí a odnesou domů.
// Nejsilnější přesvědčovací prvek pro rodiče — hmatatelný výsledek.
const projects = [
  { src: '/images/gallery/3d-dragon-desk.jpg', label: 'Vlastní 3D model', tag: '3D tisk' },
  { src: '/images/gallery/3d-resin-figurines.jpg', label: 'Detailní figurky', tag: '3D tisk' },
  { src: '/images/gallery/iot-plant-sensor.jpg', label: 'Chytrý senzor rostliny', tag: 'IoT' },
  { src: '/images/gallery/3d-prints-collection.jpg', label: 'Hotové výtisky', tag: '3D tisk' },
  { src: '/images/gallery/iot-arduino-breadboard.jpg', label: 'Vlastní Arduino obvod', tag: 'IoT' },
  { src: '/images/gallery/3d-cat-lowpoly.jpg', label: 'Navržené modely', tag: '3D modelování' },
]

export function ProjectGallery() {
  return (
    <section className="section-padding bg-white">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-accent-50 text-accent-700 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Hmatatelný výsledek
          </span>
          <h2 className="heading-2 text-gray-900 mb-4">
            Co si vaše dítě <span className="text-gradient">odnese domů</span>
          </h2>
          <p className="text-lg text-gray-600">
            Žádné pracovní listy do šuplíku. Každé dítě si odnáší vlastnoručně navržené
            a vytisknuté 3D modely i sestavené chytré zařízení — a hlavně zkušenost, že to dokáže.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 max-w-5xl mx-auto">
          {projects.map((p, i) => (
            <motion.figure
              key={p.src}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="group relative aspect-[4/3] rounded-2xl overflow-hidden shadow-sm"
            >
              <Image
                src={p.src}
                alt={p.label}
                fill
                sizes="(max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/10 to-transparent" />
              <figcaption className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                <span className="inline-block px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-sm text-white/90 text-[10px] sm:text-xs font-medium mb-1">
                  {p.tag}
                </span>
                <p className="text-white font-semibold text-sm sm:text-base leading-tight">{p.label}</p>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  )
}
