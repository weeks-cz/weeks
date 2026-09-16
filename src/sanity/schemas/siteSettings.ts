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
      name: 'socialFacebook',
      title: 'Facebook URL',
      type: 'url',
    }),
    defineField({
      name: 'socialInstagram',
      title: 'Instagram URL',
      type: 'url',
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
