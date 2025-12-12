import { defineType, defineField } from 'sanity'

export const campDate = defineType({
  name: 'campDate',
  title: 'Termín tábora',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Název termínu',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'startDate',
      title: 'Datum začátku',
      type: 'date',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'endDate',
      title: 'Datum konce',
      type: 'date',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'capacity',
      title: 'Kapacita',
      type: 'number',
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'registrationUrl',
      title: 'URL přihlášky (DDM)',
      type: 'url',
      description: 'Odkaz na přihlašovací formulář v systému DDM',
    }),
    defineField({
      name: 'status',
      title: 'Stav',
      type: 'string',
      options: {
        list: [
          { title: 'Otevřeno', value: 'open' },
          { title: 'Obsazeno', value: 'full' },
          { title: 'Již brzy', value: 'coming_soon' },
          { title: 'Ukončeno', value: 'closed' },
        ],
      },
      initialValue: 'coming_soon',
    }),
    defineField({
      name: 'price',
      title: 'Cena (Kč)',
      type: 'number',
    }),
    defineField({
      name: 'program',
      title: 'Program',
      type: 'reference',
      to: [{ type: 'program' }],
    }),
  ],
  orderings: [
    {
      title: 'Datum začátku',
      name: 'startDateAsc',
      by: [{ field: 'startDate', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      startDate: 'startDate',
      status: 'status',
    },
    prepare({ title, startDate, status }) {
      const statusLabels: Record<string, string> = {
        open: 'Otevřeno',
        full: 'Obsazeno',
        coming_soon: 'Již brzy',
        closed: 'Ukončeno',
      }
      return {
        title,
        subtitle: `${startDate} - ${statusLabels[status] || status}`,
      }
    },
  },
})
