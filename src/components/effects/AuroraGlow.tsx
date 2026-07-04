import { cn } from '@/lib/utils'

export function AuroraGlow({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn('absolute inset-0 overflow-hidden', className)}>
      <div className="aurora w-[40rem] h-[40rem] -top-40 -left-20 bg-primary-600/50" />
      <div className="aurora w-[30rem] h-[30rem] top-1/3 right-0 bg-accent-500/40 [animation-delay:-6s]" />
      <div className="aurora w-[24rem] h-[24rem] bottom-0 left-1/3 bg-cta-500/25 [animation-delay:-12s]" />
    </div>
  )
}
