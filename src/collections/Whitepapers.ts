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
    description: 'Drives the cards at /resources. Upload the PDF, then paste the public file path.',
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
          'Optional in-site URL for the HTML edition, e.g. /resources/rethinking-ot-cyber-risk-beyond-cvss. Blank means the card links straight to the PDF.',
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
  hooks: revalidateOnChange({ paths: ['/resources'] }),
  versions: {
    drafts: true,
  },
}
