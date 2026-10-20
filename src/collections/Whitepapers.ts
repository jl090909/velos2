import type { CollectionConfig } from 'payload'

import { hasRole, publishedOrStaff } from '../access'
import { slugField } from '../fields/slug'
import { revalidateOnChange } from '../hooks/revalidate'

export const Whitepapers: CollectionConfig = {
  slug: 'whitepapers',
  labels: {
    singular: 'Whitepaper',
    plural: 'Whitepapers & case studies',
  },
  admin: {
    useAsTitle: 'title',
    group: 'Resources',
    defaultColumns: ['title', 'kind', 'publishedDate', '_status'],
    description:
      'Every whitepaper, case study and brochure in the library. A record with a Body also gets its own page at /resources/<slug>/; a record without one stays a card that links to its PDF.',
  },
  access: {
    create: hasRole('admin', 'tech'),
    delete: hasRole('admin'),
    read: publishedOrStaff('tech'),
    update: hasRole('admin', 'tech'),
  },
  defaultSort: '-publishedDate',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    slugField(),
    {
      type: 'row',
      fields: [
        {
          name: 'kind',
          type: 'select',
          required: true,
          defaultValue: 'Whitepaper',
          options: ['Whitepaper', 'Case Study', 'Brochure'],
        },
        {
          name: 'series',
          type: 'text',
          admin: { description: 'e.g. POV Whitepaper Series - August 2026' },
        },
      ],
    },
    {
      name: 'subtitle',
      type: 'text',
    },
    {
      name: 'summary',
      type: 'textarea',
      required: true,
      admin: { description: 'Card description on /resources.' },
    },
    {
      name: 'body',
      type: 'richText',
      admin: {
        description:
          'The full text of the case study or paper. Filling this in gives the record its own page at /resources/<slug>/ and turns the card into a "Read online" link. Leave it empty for a PDF-only entry.',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'sector',
          type: 'text',
          admin: { description: 'Optional, case studies only. Shown in the At a glance box, e.g. Airports, Maritime.' },
        },
        {
          name: 'region',
          type: 'text',
          admin: { description: 'Optional, case studies only. e.g. United Kingdom, Middle East.' },
        },
      ],
    },
    {
      name: 'quote',
      type: 'textarea',
      maxLength: 400,
      admin: { description: 'Optional pull quote shown beside the body. Leave empty to render the page without one.' },
    },
    {
      type: 'row',
      fields: [
        { name: 'quoteAuthor', type: 'text', admin: { description: 'Name or role to attribute the quote to.' } },
        { name: 'quoteRole', type: 'text' },
      ],
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description:
          'Optional cover image for this paper. Without one, the card and the hero show a titled placeholder block. Alt text comes from the media record.',
      },
    },
    {
      name: 'coverImageCaption',
      type: 'text',
      admin: {
        description:
          'Optional caption: shown over the foot of the image on the featured hero, and under the image on a card.',
      },
    },
    {
      name: 'keyPoints',
      type: 'array',
      labels: { singular: 'Key point', plural: 'Key points' },
      fields: [{ name: 'point', type: 'text', required: true }],
    },
    {
      name: 'readTime',
      type: 'text',
      admin: { description: 'e.g. ~28 min read or 2 pages - PDF' },
    },
    {
      name: 'pdf',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Optional. The Download PDF button uses this file when present.' },
    },
    {
      name: 'pdfPath',
      type: 'text',
      admin: {
        description:
          'Optional public path, e.g. /resources/rethinking-ot-cyber-risk-beyond-cvss.pdf. Used when no PDF is uploaded.',
      },
    },
    {
      name: 'readOnlinePath',
      type: 'text',
      admin: {
        description:
          'Optional. Only needed when the HTML edition lives somewhere other than /resources/<slug>/. Leave blank and a record with a Body links to its own page; a record without one links straight to the PDF.',
      },
    },
    {
      name: 'publishedDate',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: { position: 'sidebar' },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Reserved for future homepage use.' },
    },
  ],
  hooks: revalidateOnChange({ paths: ['/resources', '/sitemap.xml'], slugPrefixes: ['/resources/'] }),
  versions: {
    drafts: true,
  },
}
