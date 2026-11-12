// Ikony redesignu (jedna sada, tah 1,8 px). Vygenerováno z prototypu – nové ikony přidávej sem, ne z lucide,
// ať web drží jeden styl.
const CESTY = {
  sipka: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  dolu: '<path d="M6 9l6 6 6-6"/>',
  misto: '<path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.500C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
  kalendar: '<rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M8 3v4M16 3v4M3.5 10h17"/>',
  ok: '<path d="M5 12.500l4.5 4.500L19 7.5"/>',
  minus: '<path d="M6 12h12"/>',
  tel: '<path d="M5 4h4l2 5-2.5 1.500a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.5 7l8.5 6 8.5-6"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  ig: '<rect x="4" y="4" width="16" height="16" rx="4.5"/><circle cx="12" cy="12" r="3.5"/><circle cx="16.7" cy="7.3" r="0.6" fill="currentColor"/>',
  fb: '<path d="M14 8.500V7a1.5 1.5 0 0 1 1.5-1.500H17V3h-2a4 4 0 0 0-4 4v1.500H9V11h2v10h3V11h2.500l.5-2.500H14z"/>',
  ven: '<path d="M14 5h5v5M19 5l-8 8M11 7H6a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-5"/>',
  stit: '<path d="M12 3l7 3v5.500c0 4.5-3 7.8-7 9.5-4-1.7-7-5-7-9.500V6l7-3z"/><path d="M9 12l2.2 2.200L15.2 10"/>',
  hodiny: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  pribor: '<path d="M6 3v6a2.5 2.5 0 0 0 5 0V3M8.5 3v18M17 21v-8h-3v-3c0-3.2 1.3-5.8 3-7v10"/>',
  lide: '<circle cx="9" cy="8.5" r="3"/><path d="M3.5 19c.6-3 2.8-4.5 5.5-4.500s4.9 1.5 5.5 4.5"/><circle cx="17" cy="9.5" r="2.3"/><path d="M16.5 14.600c2.2.2 3.7 1.6 4.2 4"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  hvezda: '<path d="M12 3.5l2.6 5.3 5.9.9-4.2 4.1 1 5.800L12 16.900l-5.3 2.7 1-5.800L3.5 9.700l5.9-.9z"/>',
  krabice: '<path d="M12 3l8 4.500v9L12 21l-8-4.500v-9L12 3z"/><path d="M4 7.5l8 4.5 8-4.500M12 12v9"/>',
  osoba: '<circle cx="12" cy="8.5" r="3.6"/><path d="M4.8 20c.9-3.6 3.7-5.6 7.2-5.6s6.3 2 7.2 5.6"/>',
  kod: '<path d="M8 7l-5 5 5 5M16 7l5 5-5 5M13.6 5l-3.2 14"/>',
  hra: '<rect x="2.5" y="7" width="19" height="10" rx="5"/><path d="M7.5 10.4v3.2M5.9 12h3.2"/><circle cx="15.4" cy="10.9" r="0.7" fill="currentColor"/><circle cx="17.6" cy="13.1" r="0.7" fill="currentColor"/>',
  zvuk: '<path d="M4 9.5v5h3.5L12 18V6L7.5 9.5H4z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/>',
  jiskra: '<path d="M11 3l1.9 5.6 5.6 1.9-5.6 1.9L11 18l-1.9-5.6-5.6-1.9 5.6-1.9L11 3z"/><path d="M19 16v4.4M16.8 18.2h4.4"/>',
  vlajka: '<path d="M6 21V4M6 4.5h11.5l-2.6 4 2.6 4H6"/>',
  tuzka: '<path d="M4 20l1-4.5L16.5 4a2.1 2.1 0 0 1 3 3L8 18.5 4 20z"/><path d="M14.5 6l3 3"/>',
  cip: '<rect x="7" y="7" width="10" height="10" rx="1.5"/><path d="M10 3.5V7M14 3.5V7M10 17v3.5M14 17v3.5M3.5 10H7M3.5 14H7M17 10h3.5M17 14h3.5"/>',
  zarovka: '<path d="M9.5 17.5h5M10.5 20.5h3M12 3.5a6 6 0 0 0-3.6 10.8c.7.5 1.1 1.2 1.1 2v1.2h5v-1.2c0-.8.4-1.5 1.1-2A6 6 0 0 0 12 3.5z"/>',
  slunce: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5V5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8"/>',
  dvere: '<path d="M6 21V4.5A1.5 1.5 0 0 1 7.5 3h9A1.5 1.5 0 0 1 18 4.5V21M3.5 21h17"/><circle cx="14.5" cy="12.5" r="0.7" fill="currentColor"/>',
  kapka: '<path d="M12 3.5c3 3.7 5.5 6.7 5.5 10a5.5 5.5 0 0 1-11 0c0-3.3 2.5-6.3 5.5-10z"/>',
} as const

export type IkonaId = keyof typeof CESTY

export function Ikona({ id, className }: { id: IkonaId; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      dangerouslySetInnerHTML={{ __html: CESTY[id] }}
    />
  )
}

const HVEZDA = '<path d="M10 1.800l2.5 5.2 5.7.8-4.1 4 1 5.700L10 14.800l-5.1 2.7 1-5.7-4.1-4 5.7-.800z"/>'

/** Hvězdy u hodnocení (výchozí pět). Číslo vedle nich píše volající. */
export function Hvezdy({ pocet = 5 }: { pocet?: number } = {}) {
  return (
    <span className="hvezdy" aria-hidden="true">
      {Array.from({ length: pocet }, (_, i) => i).map((i) => (
        <svg key={i} viewBox="0 0 20 20" fill="currentColor" dangerouslySetInnerHTML={{ __html: HVEZDA }} />
      ))}
    </span>
  )
}
