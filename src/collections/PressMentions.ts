import type { CollectionConfig } from 'payload'

import { hasRole, publishedOrStaff } from '../access'
import { revalidateOnChange } from '../hooks/revalidate'

export const PressMentions: CollectionConfig = {
  slug: 'press-mentions',
  labels: {
    singular: 'Press mention',
    plural: 'Press & media mentions',
  },
  admin: {
    useAsTitle: 'headline',
    group: 'Company',
    defaultColumns: ['headline', 'outlet', 'kind', 'publishedDate', '_status'],
    description: 'Drives /company/media. One record per piece of coverage or brand asset announcement.',
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
      name: 'headline',
      type: 'text',
      required: true,
    },
    {
      type: 'row',
      fields: [
        { name: 'outlet', type: 'text', required: true, admin: { description: 'Publication or channel, e.g. Industrial Cyber Review.' } },
        {
          name: 'kind',
          type: 'select',
          required: true,
          defaultValue: 'News',
          options: ['News', 'Feature', 'Interview', 'Award', 'Analyst note'],
        },
      ],
    },
    {
      name: 'url',
      type: 'text',
      required: true,
      admin: { description: 'Public link to the coverage. Required so the page never shows a dead mention.' },
    },
    {
      name: 'publishedDate',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
    },
    {
      name: 'excerpt',
      type: 'textarea',
      maxLength: 300,
      admin: { description: 'Optional short quote or summary from the piece.' },
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Optional outlet logo. Shown as a mark on the mention.' },
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description:
          'Optional cover image for this mention - the piece itself, or the announcement art. Alt text comes from the media record.',
      },
    },
    {
      name: 'coverImageCaption',
      type: 'text',
      admin: { description: 'Optional caption shown under the cover image.' },
    },
  ],
  hooks: revalidateOnChange({ paths: ['/company/media'] }),
  versions: {
    drafts: true,
  },
}
