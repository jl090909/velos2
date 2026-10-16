import type { CollectionConfig } from 'payload'

import { hasRole, publishedOrStaff } from '../access'
import { slugField } from '../fields/slug'
import { revalidateOnChange } from '../hooks/revalidate'

export const Jobs: CollectionConfig = {
  slug: 'jobs',
  labels: {
    singular: 'Job opening',
    plural: 'Job openings',
  },
  admin: {
    useAsTitle: 'title',
    group: 'Careers',
    defaultColumns: ['title', 'team', 'location', 'postingStatus', '_status', 'postedAt'],
    description: 'Open roles appear at /company/careers. Only "Open" + published rows are public.',
  },
  access: {
    create: hasRole('admin', 'hr'),
    delete: hasRole('admin'),
    read: publishedOrStaff('hr'),
    update: hasRole('admin', 'hr'),
  },
  defaultSort: '-postedAt',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    slugField(),
    {
      name: 'team',
      type: 'text',
      required: true,
      admin: { description: 'e.g. Engineering, Research, Sales Engineering' },
    },
    {
      name: 'location',
      type: 'text',
      required: true,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'workMode',
          type: 'select',
          required: true,
          defaultValue: 'Hybrid',
          options: ['On-site', 'Hybrid', 'Remote'],
        },
        {
          name: 'employmentType',
          type: 'select',
          required: true,
          defaultValue: 'Full-time',
          options: ['Full-time', 'Part-time', 'Contract', 'Internship'],
        },
      ],
    },
    {
      name: 'experience',
      type: 'text',
      admin: { description: 'e.g. 4-7 years' },
    },
    {
      name: 'summary',
      type: 'textarea',
      required: true,
      maxLength: 280,
      admin: { description: 'One or two lines. Shown in the careers table tooltip and search results.' },
    },
    {
      name: 'description',
      type: 'richText',
      required: true,
    },
    {
      name: 'responsibilities',
      type: 'array',
      labels: { singular: 'Responsibility', plural: 'Responsibilities' },
      fields: [{ name: 'item', type: 'text', required: true }],
    },
    {
      name: 'requirements',
      type: 'array',
      labels: { singular: 'Requirement', plural: 'Requirements' },
      fields: [{ name: 'item', type: 'text', required: true }],
    },
    {
      name: 'applyUrl',
      type: 'text',
      admin: {
        description:
          'External application link (ATS, mailto). Leave empty and candidates are routed to /company/contact.',
      },
    },
    {
      // Deliberately not called "status": Payload's drafts feature already owns `_status`, and both
      // fields would otherwise map onto the same generated postgres enum type (enum_jobs_status).
      name: 'postingStatus',
      type: 'select',
      required: true,
      defaultValue: 'open',
      index: true,
      options: [
        { label: 'Open - listed publicly', value: 'open' },
        { label: 'Closed - hidden from the site', value: 'closed' },
      ],
    },
    {
      name: 'postedAt',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: { position: 'sidebar' },
    },
    {
      name: 'closingDate',
      type: 'date',
      admin: { position: 'sidebar' },
    },
  ],
  hooks: revalidateOnChange({ paths: ['/company/careers'], slugPrefixes: ['/company/careers/'] }),
  versions: {
    drafts: true,
  },
}
