import { defineType, defineField } from 'sanity'

export const program = defineType({
  name: 'program',
  title: 'Program',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Název programu',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'description',
      title: 'Krátký popis',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
      name: 'content',
      title: 'Detailní obsah',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'icon',
      title: 'Ikona',
      type: 'string',
      description: 'Název ikony z Lucide Icons (např. "Printer", "Glasses", "Cpu")',
    }),
    defineField({
      name: 'image',
      title: 'Obrázek',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'color',
      title: 'Barva',
      type: 'string',
      options: {
        list: [
          { title: 'Primary (Indigo)', value: 'primary' },
          { title: 'Accent (Cyan)', value: 'accent' },
          { title: 'Trust (Emerald)', value: 'trust' },
          { title: 'CTA (Amber)', value: 'cta' },
        ],
      },
    }),
    defineField({
      name: 'order',
      title: 'Pořadí zobrazení',
      type: 'number',
    }),
  ],
  orderings: [
    {
      title: 'Pořadí',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
      media: 'image',
    },
  },
})
