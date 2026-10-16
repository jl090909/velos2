import type { CollectionConfig } from 'payload'

import { hasRole, publishedOrStaff } from '../access'
import { slugField } from '../fields/slug'
import { revalidateOnChange } from '../hooks/revalidate'

export const KnowledgeHubArticles: CollectionConfig = {
  slug: 'knowledge-hub-articles',
  labels: {
    singular: 'Knowledge Hub article',
    plural: 'Knowledge Hub articles',
  },
  admin: {
    useAsTitle: 'title',
    group: 'Resources',
    defaultColumns: ['title', 'category', 'authorName', 'publishedDate', '_status'],
    description: 'Technical articles for /resources/knowledge-hub.',
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
          name: 'category',
          type: 'select',
          required: true,
          defaultValue: 'OT Security',
          options: [
            'OT Security',
            'Threat Intelligence',
            'Compliance & Standards',
            'Architecture',
            'Field Notes',
          ],
        },
        {
          name: 'authorName',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'authorRole',
      type: 'text',
      admin: { description: 'e.g. Principal OT Security Researcher' },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      required: true,
      maxLength: 300,
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Optional. Falls back to the Knowledge Hub default banner.' },
    },
    {
      name: 'body',
      type: 'richText',
      required: true,
    },
    {
      name: 'tags',
      type: 'array',
      fields: [{ name: 'tag', type: 'text', required: true }],
    },
    {
      name: 'readingTime',
      type: 'text',
      admin: { description: 'e.g. 6 min read' },
    },
    {
      name: 'publishedDate',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: { position: 'sidebar' },
    },
  ],
  hooks: revalidateOnChange({ paths: ['/resources/knowledge-hub'], slugPrefixes: ['/resources/knowledge-hub/'] }),
  versions: {
    drafts: true,
  },
}
