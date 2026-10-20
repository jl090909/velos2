import type { CollectionConfig } from 'payload'

import { hasRole, publishedOrStaff } from '../access'
import { slugField } from '../fields/slug'
import { revalidateOnChange } from '../hooks/revalidate'

export const Customers: CollectionConfig = {
  slug: 'customers',
  labels: {
    singular: 'Customer',
    plural: 'Customers',
  },
  admin: {
    useAsTitle: 'name',
    group: 'Company',
    defaultColumns: ['name', 'sector', 'region', 'featured', '_status'],
    description:
      'The customer wall at /customers. Publish only what is approved for public use. A long-form story lives in Whitepapers & case studies and is linked from the caseStudyDoc field.',
  },
  access: {
    create: hasRole('admin', 'tech'),
    delete: hasRole('admin'),
    read: publishedOrStaff('tech'),
    update: hasRole('admin', 'tech'),
  },
  defaultSort: 'displayOrder',
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: { description: 'Customer or site name, e.g. "International airport operator". Use the anonymised wording when the name is not cleared for publication.' },
    },
    slugField(),
    {
      type: 'row',
      fields: [
        {
          name: 'sector',
          type: 'text',
          required: true,
          admin: { description: 'e.g. Manufacturing, Energy, Airports, Maritime' },
        },
        {
          name: 'region',
          type: 'text',
          admin: { description: 'e.g. Middle East, India, UK' },
        },
      ],
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Shown on the logo wall. Leave empty and the card shows the name instead.' },
    },
    {
      name: 'summary',
      type: 'textarea',
      required: true,
      maxLength: 320,
      admin: { description: 'One or two lines on what the deployment achieved.' },
    },
    {
      name: 'caseStudyDoc',
      type: 'relationship',
      relationTo: 'whitepapers',
      admin: {
        description:
          'The full case study, written in Whitepapers & case studies. Pick it here and the card gains a "Read the case study" link to its /resources/<slug>/ page. The story itself is edited in that collection, not here.',
      },
    },
    {
      name: 'caseStudy',
      type: 'richText',
      admin: {
        hidden: true,
        description: 'Legacy field: case studies moved to Whitepapers & case studies (use caseStudyDoc above).',
      },
    },
    {
      name: 'quote',
      type: 'textarea',
      maxLength: 400,
      admin: { description: 'Optional quote. Leave empty to render the card without one.' },
    },
    {
      type: 'row',
      fields: [
        { name: 'quoteAuthor', type: 'text', admin: { description: 'Name or role to attribute the quote to.' } },
        { name: 'quoteRole', type: 'text' },
      ],
    },
    {
      name: 'websiteUrl',
      type: 'text',
      admin: { description: 'Optional external link for the customer or the case study.' },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'displayOrder',
          type: 'number',
          defaultValue: 100,
          admin: { description: 'Lower numbers appear first.' },
        },
        {
          name: 'featured',
          type: 'checkbox',
          defaultValue: false,
          admin: { description: 'Featured customers are listed first on /customers.' },
        },
      ],
    },
  ],
  hooks: revalidateOnChange({ paths: ['/customers', '/sitemap.xml'], slugPrefixes: ['/customers/'] }),
  versions: {
    drafts: true,
  },
}
