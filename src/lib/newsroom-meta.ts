/**
 * Newsroom shared vocabulary - PURE module (no Payload, no Next, no database).
 *
 * Imported by the collection config (admin + validation), by the public readers and by the
 * dashboards, so the three states a story can be in are defined in exactly ONE place.
 *
 * Why there is no `status` select field on the collection: Payload's drafts already own a `_status`
 * column that maps onto a generated postgres enum (`enum_newsroom_articles_status`). A second select
 * named `status` collides with it and the schema push fails with
 * `invalid input value for enum` (the same trap is recorded in docs/CMS.md for the other
 * collections). The newsroom state is therefore DERIVED from `_status` + `publishAt`, which is what
 * the public site actually needs:
 *
 *   published  - `_status = published` and the publication time has arrived
 *   scheduled  - `_status = published` OR draft, but `publishAt` is still in the future
 *   draft      - `_status = draft` with no future publication time
 */

export const NEWSROOM_CATEGORIES = [
  'Latest News',
  'Product News',
  'Research & Insights',
  'Company Announcements',
  'Press Coverage',
  'Events & Media',
] as const

export type NewsroomCategory = (typeof NEWSROOM_CATEGORIES)[number]

/**
 * Categories offered in the Newsroom's FILTER BAR.
 *
 * Deliberately narrower than the vocabulary above: the page still renders a Product News band and a
 * Research & Insights band (both come from the data), but those two are not offered as filters - a
 * product/design decision, not a data one. Their filtered URLs keep working if they are reached
 * directly; only the chips are withheld.
 */
export const NEWSROOM_FILTER_CATEGORIES: readonly NewsroomCategory[] = NEWSROOM_CATEGORIES.filter(
  (category) => category !== 'Product News' && category !== 'Research & Insights',
)

export type NewsroomStatus = 'draft' | 'published' | 'scheduled'

export const isNewsroomCategory = (value: unknown): value is NewsroomCategory =>
  typeof value === 'string' && (NEWSROOM_CATEGORIES as readonly string[]).includes(value)

/** URL segment for a category filter: `Product News` -> `product-news`. */
export const categorySlug = (category: string): string =>
  category
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

export const categoryFromSlug = (slug: string | null | undefined): NewsroomCategory | null => {
  if (!slug) {
    return null
  }
  for (const category of NEWSROOM_CATEGORIES) {
    if (categorySlug(category) === slug) {
      return category
    }
  }
  return null
}

/** The document fields the derivation needs - structurally typed so it accepts a raw REST doc. */
export type StatusBearing = {
  _status?: null | string
  publishAt?: null | string
  schedulePublication?: boolean | null
}

/**
 * `draft` / `scheduled` / `published`, derived from the draft flag, the publication date AND the
 * editor's explicit auto-publish intent.
 *
 * The intent flag matters: a draft is allowed to carry a publication date without going live, so
 * "save a draft, preview it, then decide" cannot be sabotaged by a date that has already passed. Only
 * a draft the editor marked for scheduling is published by the queue.
 */
export const newsroomStatus = (doc: StatusBearing, now: Date = new Date()): NewsroomStatus => {
  if (doc._status === 'published') {
    return 'published'
  }
  if (doc.schedulePublication !== true) {
    return 'draft'
  }
  const publishAt = doc.publishAt ? new Date(doc.publishAt) : null
  const due = publishAt !== null && !Number.isNaN(publishAt.getTime()) && publishAt.getTime() <= now.getTime()
  // Due but not yet ticked by the queue: still a draft on the page, and the daily view says so rather
  // than claiming it is live.
  return due ? 'draft' : 'scheduled'
}

export const STATUS_LABEL: Record<NewsroomStatus, string> = {
  draft: 'Draft',
  published: 'Published',
  scheduled: 'Scheduled',
}

/** Human label for the byline/date line, tolerant of junk input. */
export const formatNewsroomDate = (value: null | string | undefined): string => {
  if (!value) {
    return ''
  }
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return ''
  }
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}
