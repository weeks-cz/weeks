import { describe, it, expect } from 'vitest'
import { serializeJsonLd } from './json-ld'

describe('serializeJsonLd', () => {
  it('běžná data serializuje jako JSON.stringify', () => {
    const schema = { '@type': 'BreadcrumbList', name: 'Letní příměstský tábor' }
    expect(serializeJsonLd(schema)).toBe(JSON.stringify(schema))
  })

  it('název produktu nemůže ukončit skriptovou značku', () => {
    // Názvy produktů v drobečkách e-shopu chodí z weeks-hubu, tedy zvenčí.
    const vystup = serializeJsonLd({ name: '</script><script>alert(1)</script>' })
    expect(vystup).not.toContain('</script>')
    expect(vystup).not.toContain('</SCRIPT>')
  })

  it('escapuje každé `<`, ne jen to první', () => {
    const vystup = serializeJsonLd({ a: '<', b: '<<', c: 'x<y<z' })
    expect(vystup).not.toContain('<')
    // 1 + 2 + 2 = 5 výskytů `<` napříč třemi hodnotami
    expect(vystup.match(/u003c/g)).toHaveLength(5)
  })

  it('escapuje oddělovače řádků, které by rozbily skript', () => {
    const vystup = serializeJsonLd({ name: 'a b c' })
    expect(vystup).not.toContain(' ')
    expect(vystup).not.toContain(' ')
    expect(vystup).toContain('\\u2028')
    expect(vystup).toContain('\\u2029')
  })

  it('escapování nemění data — po zpětném přečtení sedí původní hodnota', () => {
    const puvodni = { name: '</script> a <b> & konec', dalsi: 'a b' }
    expect(JSON.parse(serializeJsonLd(puvodni))).toEqual(puvodni)
  })
})
