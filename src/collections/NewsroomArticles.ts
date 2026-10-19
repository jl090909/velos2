import type { CollectionConfig } from 'payload'

import { hasRole, publishedOrStaff } from '../access'
import { slugField } from '../fields/slug'
import { revalidateOnChange } from '../hooks/revalidate'
import { NEWSROOM_CATEGORIES } from '../lib/newsroom-meta'

/**
 * Newsroom articles - the editorial feed behind /company/media/.
 *
 * Publishing model (spec Phase 4): Create / Edit -> Save draft -> Preview -> Publish, with no
 * approval queue. Payload's own drafts give the reviewer the exact three buttons a newsroom needs
 * (`Save draft`, `Publish`, `Unpublish`) and enforce access on every mutation server-side; the
 * derived `draft | scheduled | published` state is computed from `_status` + `publishAt` in
 * src/lib/newsroom-meta.ts (see that file for why there is no `status` column).
 *
 * Roles: admin + tech write the newsroom. HR owns Careers and is deliberately not granted it;
 * `editor` stays read-only, exactly as it is for the other content collections.
 */
export const NewsroomArticles: CollectionConfig = {
  slug: 'newsroom-articles',
  labels: {
    plural: 'Newsroom articles',
    singular: 'Newsroom article',
  },
  admin: {
    useAsTitle: 'title',
    group: 'Newsroom',
    defaultColumns: ['title', 'category', 'featured', '_status', 'publishAt', 'updatedAt'],
    description: 'Stories published in the Newsroom at /company/media.',
    // The Preview button in the admin opens the REAL public article layout for the CURRENT draft.
    // That route re-checks the session server-side, so it renders nothing for an anonymous caller.
    preview: (doc) => (doc?.id ? `/newsroom-preview/${String(doc.id)}/` : null),
  },
  access: {
    create: hasRole('admin', 'tech'),
    delete: hasRole('admin'),
    read: publishedOrStaff('tech'),
    update: hasRole('admin', 'tech'),
  },
  defaultSort: '-publishAt',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      index: true,
    },
    slugField(),
    {
      name: 'summary',
      type: 'textarea',
      required: true,
      maxLength: 320,
      admin: { description: 'Standfirst shown on cards, in search results and as the default meta description.' },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'category',
          type: 'select',
          required: true,
          defaultValue: 'Latest News',
          index: true,
          options: [...NEWSROOM_CATEGORIES],
        },
        {
          name: 'featured',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Featured stories lead the Newsroom: the newest one becomes the hero.',
            position: 'sidebar',
          },
        },
      ],
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Hero and card image. Its Alt text comes from the media record.' },
    },
    {
      name: 'coverImageCaption',
      type: 'text',
    },
    {
      name: 'body',
      type: 'richText',
      required: true,
      admin: { description: 'Headings, paragraphs, lists, links, quotations, inline images and video embeds.' },
    },
    {
      type: 'collapsible',
      label: 'Byline',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'authorName', type: 'text', required: true, admin: { description: 'Shown as the article byline.' } },
            { name: 'authorRole', type: 'text' },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Publication',
      fields: [
        {
          name: 'publishAt',
          type: 'date',
          required: true,
          defaultValue: () => new Date().toISOString(),
          index: true,
          admin: {
            description: 'Publication date shown on the site.',
            position: 'sidebar',
          },
        },
        {
          name: 'schedulePublication',
          type: 'checkbox',
          defaultValue: false,
          index: true,
          label: 'Publish automatically at the date above',
          admin: {
            description:
              'Off by default. While it is off, a saved draft stays a draft no matter what date it carries - Publish is what makes it public. Switch it on to let the queue publish a draft at the publication date.',
            position: 'sidebar',
          },
        },
        {
          name: 'readingTime',
          type: 'text',
          admin: { description: 'Optional, e.g. "6 min read".' },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'SEO',
      fields: [
        { name: 'seoTitle', type: 'text', admin: { description: 'Defaults to the headline.' } },
        { name: 'seoDescription', type: 'textarea', maxLength: 320, admin: { description: 'Defaults to the standfirst.' } },
      ],
    },
    {
      name: 'tags',
      type: 'array',
      fields: [{ name: 'tag', type: 'text', required: true }],
    },
  ],
  hooks: revalidateOnChange({
    paths: ['/company/media', '/sitemap.xml'],
    slugPrefixes: ['/company/media/'],
  }),
  versions: {
    drafts: {
      autosave: false,
      // Payload's own "Publish at" field would duplicate `publishAt`; scheduling is handled by
      // `publishAt` plus the newsroom-publish-due task so the editor sees ONE scheduled date.
      schedulePublish: false,
    },
  },
}
