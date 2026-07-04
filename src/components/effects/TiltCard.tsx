'use client'

import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'

export function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const srx = useSpring(rx, { stiffness: 200, damping: 25 })
  const sry = useSpring(ry, { stiffness: 200, damping: 25 })

  if (reduced) return <div className={className}>{children}</div>

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 900 }}
      onMouseMove={(e) => {
        const rect = ref.current?.getBoundingClientRect()
        if (!rect) return
        ry.set(((e.clientX - rect.left) / rect.width - 0.5) * 6)
        rx.set(-((e.clientY - rect.top) / rect.height - 0.5) * 6)
      }}
      onMouseLeave={() => {
        rx.set(0)
        ry.set(0)
      }}
    >
      {children}
    </motion.div>
  )
}
