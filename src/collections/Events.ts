import type { CollectionConfig } from 'payload'

import { hasRole, publishedOrStaff } from '../access'
import { slugField } from '../fields/slug'
import { revalidateOnChange } from '../hooks/revalidate'

export const Events: CollectionConfig = {
  slug: 'events',
  labels: {
    singular: 'Event',
    plural: 'Events',
  },
  admin: {
    useAsTitle: 'title',
    group: 'Company',
    defaultColumns: ['title', 'eventType', 'startDate', 'city', 'country', '_status'],
    description: 'Drives /company/events. Past events move to the archive automatically by date.',
  },
  access: {
    create: hasRole('admin', 'tech'),
    delete: hasRole('admin'),
    read: publishedOrStaff('tech'),
    update: hasRole('admin', 'tech'),
  },
  defaultSort: 'startDate',
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
          name: 'eventType',
          type: 'select',
          required: true,
          defaultValue: 'Conference',
          options: ['Conference', 'Exhibition', 'Webinar', 'Meetup', 'Speaking'],
        },
        {
          name: 'booth',
          type: 'text',
          admin: { description: 'e.g. Stand 412. Optional.' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'startDate',
          type: 'date',
          required: true,
          admin: { description: 'Drives both the ordering and the past/upcoming grouping.' },
        },
        {
          name: 'endDate',
          type: 'date',
          admin: { description: 'Leave empty for single-day events.' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'venue', type: 'text' },
        { name: 'city', type: 'text' },
        { name: 'country', type: 'text' },
      ],
    },
    {
      name: 'summary',
      type: 'textarea',
      required: true,
      maxLength: 320,
      admin: { description: 'One or two lines shown on the card.' },
    },
    {
      name: 'description',
      type: 'richText',
      admin: { description: 'Optional detail shown on the event page: agenda, talk abstract, stand details.' },
    },
    {
      name: 'registrationUrl',
      type: 'text',
      admin: { description: 'Optional registration or "meet us there" link.' },
    },
    {
      name: 'websiteUrl',
      type: 'text',
      admin: { description: 'Optional link to the event organiser page.' },
    },
  ],
  hooks: revalidateOnChange({ paths: ['/company/events'], slugPrefixes: ['/company/events/'] }),
  versions: {
    drafts: true,
  },
}
