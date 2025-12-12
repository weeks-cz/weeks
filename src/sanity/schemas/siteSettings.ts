import { defineType, defineField } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Nastavení webu',
  type: 'document',
  fields: [
    defineField({
      name: 'heroHeadline',
      title: 'Hero nadpis',
      type: 'string',
    }),
    defineField({
      name: 'heroSubheadline',
      title: 'Hero podnadpis',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'waitlistMode',
      title: 'Režim čekací listiny',
      type: 'boolean',
      description: 'Zapnout, pokud ještě nejsou otevřené přihlášky',
      initialValue: true,
    }),
    defineField({
      name: 'contactEmail',
      title: 'Kontaktní e-mail',
      type: 'string',
    }),
    defineField({
      name: 'contactPhone',
      title: 'Kontaktní telefon',
      type: 'string',
    }),
    defineField({
      name: 'hwlabAddress',
      title: 'Adresa HWLabu',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'hwlabMapUrl',
      title: 'URL mapy HWLabu',
      type: 'url',
    }),
    defineField({
      name: 'socialFacebook',
      title: 'Facebook URL',
      type: 'url',
    }),
    defineField({
      name: 'socialInstagram',
      title: 'Instagram URL',
      type: 'url',
    }),
    defineField({
      name: 'ddmUrl',
      title: 'DDM Praha 6 URL',
      type: 'url',
      initialValue: 'https://ddmpraha6.cz',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Nastavení webu',
      }
    },
  },
})
