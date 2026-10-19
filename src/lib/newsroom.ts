import config from '@payload-config'
import { getPayload } from 'payload'
import type { Payload, Where } from 'payload'

import type { MediaRef, RichTextData } from './cms'
import { newsroomStatus, type NewsroomCategory, type NewsroomStatus } from './newsroom-meta'

/**
 * Newsroom readers. SERVER-ONLY.
 *
 * Draft isolation is the trap that matters (docs/CMS.md): Payload's Local API bypasses access control
 * unless `overrideAccess: false` is passed, so a site-side `payload.find()` happily returns drafts
 * while the same query over REST does not. Every public reader here therefore:
 *
 *   1. passes `overrideAccess: false`, AND
 *   2. filters `_status = published` explicitly, AND
 *   3. filters `publishAt <= now`, so a story that is marked published but dated in the future is
 *      still invisible until its time arrives.
 *
 * Nothing in this module writes, and no reader is ever used for a mutation.
 */

export type NewsroomArticle = {
  authorName: string
  authorRole?: string
  body: RichTextData | null
  category: NewsroomCategory
  coverCaption?: string
  coverImage: MediaRef | null
  featured: boolean
  id: number | string
  publishAt: string
  readingTime?: string
  seoDescription?: string
  seoTitle?: string
  slug: string
  status: NewsroomStatus
  summary: string
  tags: string[]
  title: string
}

export type NewsroomResult<T> = {
  data: T
  error: null | string
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const str = (value: unknown, fallback = ''): string => {
  if (typeof value === 'string') {
    return value
  }
  if (typeof value === 'number') {
    return String(value)
  }
  return fallback
}

const optional = (value: unknown): string | undefined => {
  const out = str(value)
  return out.length > 0 ? out : undefined
}

const reason = (error: unknown): string => (error instanceof Error ? error.message : String(error))

const mediaRef = (value: unknown): MediaRef | null => {
  if (!isRecord(value)) {
    return null
  }
  const url = str(value.url)
  if (url.length === 0) {
    return null
  }
  const sizes = isRecord(value.sizes) ? value.sizes : null
  const card = sizes && isRecord(sizes.card) ? sizes.card : null
  return {
    alt: str(value.alt),
    height: typeof (card?.height ?? value.height) === 'number' ? ((card?.height ?? value.height) as number) : undefined,
    url: card ? str(card.url, url) : url,
    width: typeof (card?.width ?? value.width) === 'number' ? ((card?.width ?? value.width) as number) : undefined,
  }
}

const richText = (value: unknown): RichTextData | null => (isRecord(value) ? (value as unknown as RichTextData) : null)

const REQUIRED_ENV = ['DATABASE_URL', 'PAYLOAD_SECRET'] as const

let warnedMissingEnv = false

const configProblem = (): null | string => {
  const missing = REQUIRED_ENV.filter((key) => {
    const value = process.env[key]
    return value === undefined || value.trim() === ''
  })
  if (missing.length === 0) {
    return null
  }
  if (!warnedMissingEnv) {
    warnedMissingEnv = true
    console.error(
      `[newsroom] CMS reads are disabled in this environment: ${missing.join(', ')} not set. ` +
        'The Newsroom renders its empty state until they are configured (see docs/CMS.md).',
    )
  }
  return `cms-not-configured:${missing.join(',')}`
}

const client = async (): Promise<Payload> => getPayload({ config })

/** Published AND already due. Both conditions are required - see the note at the top of this file. */
const publicWhere = (): Where => ({
  and: [{ _status: { equals: 'published' } }, { publishAt: { less_than_equal: new Date().toISOString() } }],
})

export const toNewsroomArticle = (raw: unknown): NewsroomArticle => {
  const doc = isRecord(raw) ? raw : {}
  const tags = Array.isArray(doc.tags)
    ? doc.tags
        .map((entry) => (isRecord(entry) ? str(entry.tag) : str(entry)))
        .filter((tag) => tag.length > 0)
    : []
  return {
    authorName: str(doc.authorName, 'Velos Shield'),
    authorRole: optional(doc.authorRole),
    body: richText(doc.body),
    category: str(doc.category, 'Latest News') as NewsroomCategory,
    coverCaption: optional(doc.coverImageCaption),
    coverImage: mediaRef(doc.coverImage),
    featured: doc.featured === true,
    id: str(doc.id, 'unknown'),
    publishAt: str(doc.publishAt),
    readingTime: optional(doc.readingTime),
    seoDescription: optional(doc.seoDescription),
    seoTitle: optional(doc.seoTitle),
    slug: str(doc.slug),
    status: newsroomStatus({ _status: str(doc._status), publishAt: str(doc.publishAt) }),
    summary: str(doc.summary),
    tags,
    title: str(doc.title),
  }
}

export type NewsroomQuery = {
  category?: NewsroomCategory | null
  limit?: number
  q?: string | null
}

const escapeLike = (value: string): string => value.replace(/[%_\\]/g, (match) => `\\${match}`)

/**
 * Every published story, newest first. One read serves the whole index page: the sections, the hero,
 * the category filter and the search all slice this list, so a busy Newsroom costs ONE query.
 */
export const getNewsroomArticles = async (query: NewsroomQuery = {}): Promise<NewsroomResult<NewsroomArticle[]>> => {
  const problem = configProblem()
  if (problem) {
    return { data: [], error: problem }
  }
  const term = query.q?.trim()
  const constraints: Where[] = [publicWhere()]
  if (query.category) {
    constraints.push({ category: { equals: query.category } })
  }
  if (term && term.length > 0) {
    const like = escapeLike(term)
    constraints.push({
      or: [
        { title: { like } },
        { summary: { like } },
        { authorName: { like } },
        { 'tags.tag': { like } },
      ],
    })
  }

  try {
    const payload = await client()
    const { docs } = await payload.find({
      collection: 'newsroom-articles',
      depth: 1,
      limit: query.limit ?? 200,
      overrideAccess: false,
      sort: '-publishAt',
      where: constraints.length === 1 ? constraints[0] : { and: constraints },
    })
    return { data: docs.map((doc) => toNewsroomArticle(doc as unknown)), error: null }
  } catch (error) {
    console.error('[newsroom] getNewsroomArticles failed:', reason(error))
    return { data: [], error: reason(error) }
  }
}

export const getNewsroomArticleBySlug = async (slug: string): Promise<NewsroomResult<NewsroomArticle | null>> => {
  const problem = configProblem()
  if (problem) {
    return { data: null, error: problem }
  }
  try {
    const payload = await client()
    const { docs } = await payload.find({
      collection: 'newsroom-articles',
      depth: 1,
      limit: 1,
      overrideAccess: false,
      where: { and: [publicWhere(), { slug: { equals: slug } }] },
    })
    return { data: docs.length > 0 ? toNewsroomArticle(docs[0] as unknown) : null, error: null }
  } catch (error) {
    console.error('[newsroom] getNewsroomArticleBySlug failed:', reason(error))
    return { data: null, error: reason(error) }
  }
}

/**
 * The DRAFT reader used by the preview route only. It never runs for an anonymous caller: the route
 * resolves the Payload session first and refuses anyone who is not signed in as staff, and the read
 * itself still runs with `overrideAccess: false` against that user.
 *
 * findByID rather than a `where: { id: { equals } }` filter: ids are typed by the database, and an
 * equality match on a stringified id is a silent empty result - which on a preview route would be
 * indistinguishable from "not signed in".
 */
export const getNewsroomDraftById = async (
  id: string,
  user: unknown,
): Promise<NewsroomResult<NewsroomArticle | null>> => {
  const problem = configProblem()
  if (problem) {
    return { data: null, error: problem }
  }
  try {
    const payload = await client()
    const doc = await payload.findByID({
      id,
      collection: 'newsroom-articles',
      depth: 1,
      draft: true,
      overrideAccess: false,
      user: (user ?? undefined) as never,
    })
    return { data: doc ? toNewsroomArticle(doc as unknown) : null, error: null }
  } catch (error) {
    console.error('[newsroom] getNewsroomDraftById failed:', reason(error))
    return { data: null, error: reason(error) }
  }
}

/** Related stories: same category first, then the newest of the rest, never the article itself. */
export const pickRelated = (articles: NewsroomArticle[], current: NewsroomArticle, limit = 3): NewsroomArticle[] => {
  const others = articles.filter((article) => String(article.id) !== String(current.id))
  const sameCategory = others.filter((article) => article.category === current.category)
  const rest = others.filter((article) => article.category !== current.category)
  return [...sameCategory, ...rest].slice(0, limit)
}
