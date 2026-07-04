'use client'

import { useEffect, useRef } from 'react'
import { useInView, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'

export function CountUp({ value, suffix = '', className }: { value: number; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const reduced = useReducedMotion()
  const motionVal = useMotionValue(0)
  const spring = useSpring(motionVal, { duration: 1.6, bounce: 0 })

  useEffect(() => {
    if (inView) motionVal.set(value)
  }, [inView, value, motionVal])

  useEffect(() => {
    return spring.on('change', (v) => {
      if (ref.current) ref.current.textContent = `${Math.round(v)}${suffix}`
    })
  }, [spring, suffix])

  if (reduced) return <span className={className}>{`${value}${suffix}`}</span>
  return <span ref={ref} className={className}>{`0${suffix}`}</span>
}
