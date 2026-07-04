export function Marquee({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden" aria-hidden="false">
      <div className="marquee-track gap-16 pr-16">
        {children}
        <div aria-hidden="true" className="flex gap-16">
          {children}
        </div>
      </div>
    </div>
  )
}
