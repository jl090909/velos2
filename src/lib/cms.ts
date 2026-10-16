import config from '@payload-config'
import type { ComponentProps } from 'react'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { getPayload } from 'payload'

/** Lexical document shape, derived from the renderer so the site never depends on generated types. */
export type RichTextData = ComponentProps<typeof RichText>['data']

export type MediaRef = {
  alt: string
  height?: number
  url: string
  width?: number
}

export type JobOpening = {
  applyUrl?: string
  closingDate?: string
  description: RichTextData | null
  employmentType: string
  experience?: string
  id: number | string
  location: string
  postedAt: string
  requirements: string[]
  responsibilities: string[]
  slug: string
  summary: string
  team: string
  title: string
  workMode: string
}

export type WhitepaperCard = {
  downloadUrl: string
  id: number | string
  keyPoints: string[]
  kind: string
  publishedDate: string
  readOnlinePath?: string
  readTime: string
  series: string
  slug: string
  subtitle: string
  summary: string
  title: string
}

export type KnowledgeArticle = {
  authorName: string
  authorRole?: string
  body: RichTextData | null
  category: string
  excerpt: string
  heroImage: MediaRef | null
  id: number | string
  publishedDate: string
  readingTime: string
  slug: string
  tags: string[]
  title: string
}

export type CmsResult<T> = {
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

/** Reads an array field of `{ <key>: string }` rows (or plain strings) into a string list. */
const listOf = (value: unknown, ...keys: string[]): string[] => {
  if (!Array.isArray(value)) {
    return []
  }
  return value
    .map((entry) => {
      if (typeof entry === 'string') {
        return entry
      }
      if (isRecord(entry)) {
        for (const key of keys) {
          const candidate = entry[key]
          if (typeof candidate === 'string' && candidate.length > 0) {
            return candidate
          }
        }
      }
      return ''
    })
    .filter((entry) => entry.length > 0)
}

const mediaRef = (value: unknown): MediaRef | null => {
  if (!isRecord(value)) {
    return null
  }
  const url = str(value.url)
  if (url.length === 0) {
    return null
  }
  return {
    alt: str(value.alt),
    height: typeof value.height === 'number' ? value.height : undefined,
    url,
    width: typeof value.width === 'number' ? value.width : undefined,
  }
}

const richText = (value: unknown): RichTextData | null =>
  isRecord(value) ? (value as unknown as RichTextData) : null

const reason = (error: unknown): string => (error instanceof Error ? error.message : String(error))

const client = async () => getPayload({ config })

const toJob = (raw: unknown): JobOpening => {
  const doc = isRecord(raw) ? raw : {}
  return {
    applyUrl: optional(doc.applyUrl),
    closingDate: optional(doc.closingDate),
    description: richText(doc.description),
    employmentType: str(doc.employmentType, 'Full-time'),
    experience: optional(doc.experience),
    id: str(doc.id, 'unknown'),
    location: str(doc.location),
    postedAt: str(doc.postedAt),
    requirements: listOf(doc.requirements, 'item'),
    responsibilities: listOf(doc.responsibilities, 'item'),
    slug: str(doc.slug),
    summary: str(doc.summary),
    team: str(doc.team),
    title: str(doc.title),
    workMode: str(doc.workMode),
  }
}

const toWhitepaper = (raw: unknown): WhitepaperCard => {
  const doc = isRecord(raw) ? raw : {}
  const uploaded = mediaRef(doc.pdf)
  const downloadUrl = uploaded?.url ?? str(doc.pdfPath)
  const readOnlinePath = optional(doc.readOnlinePath)
  return {
    downloadUrl,
    id: str(doc.id, 'unknown'),
    keyPoints: listOf(doc.keyPoints, 'point'),
    kind: str(doc.kind, 'Whitepaper'),
    publishedDate: str(doc.publishedDate),
    readOnlinePath,
    readTime: str(doc.readTime),
    series: str(doc.series),
    slug: str(doc.slug),
    subtitle: str(doc.subtitle),
    summary: str(doc.summary),
    title: str(doc.title),
  }
}

const toArticle = (raw: unknown): KnowledgeArticle => {
  const doc = isRecord(raw) ? raw : {}
  return {
    authorName: str(doc.authorName),
    authorRole: optional(doc.authorRole),
    body: richText(doc.body),
    category: str(doc.category, 'OT Security'),
    excerpt: str(doc.excerpt),
    heroImage: mediaRef(doc.heroImage),
    id: str(doc.id, 'unknown'),
    publishedDate: str(doc.publishedDate),
    readingTime: str(doc.readingTime),
    slug: str(doc.slug),
    tags: listOf(doc.tags, 'tag'),
    title: str(doc.title),
  }
}

/**
 * Every reader swallows CMS failures and returns an empty result plus a server-side log, so a
 * database outage degrades a section instead of taking down the marketing site.
 */
export const getOpenJobs = async (): Promise<CmsResult<JobOpening[]>> => {
  try {
    const payload = await client()
    const { docs } = await payload.find({
      collection: 'jobs',
      depth: 0,
      limit: 100,
      sort: '-postedAt',
      where: { postingStatus: { equals: 'open' } },
    })
    return { data: docs.map((doc) => toJob(doc as unknown)), error: null }
  } catch (error) {
    console.error('[cms] getOpenJobs failed:', error)
    return { data: [], error: reason(error) }
  }
}

export const getJobBySlug = async (slug: string): Promise<CmsResult<JobOpening | null>> => {
  try {
    const payload = await client()
    const { docs } = await payload.find({
      collection: 'jobs',
      depth: 0,
      limit: 1,
      where: { postingStatus: { equals: 'open' }, slug: { equals: slug } },
    })
    return { data: docs.length > 0 ? toJob(docs[0] as unknown) : null, error: null }
  } catch (error) {
    console.error('[cms] getJobBySlug failed:', error)
    return { data: null, error: reason(error) }
  }
}

export const getWhitepapers = async (): Promise<CmsResult<WhitepaperCard[]>> => {
  try {
    const payload = await client()
    const { docs } = await payload.find({
      collection: 'whitepapers',
      depth: 1,
      limit: 100,
      sort: '-publishedDate',
    })
    return { data: docs.map((doc) => toWhitepaper(doc as unknown)), error: null }
  } catch (error) {
    console.error('[cms] getWhitepapers failed:', error)
    return { data: [], error: reason(error) }
  }
}

export const getKnowledgeArticles = async (): Promise<CmsResult<KnowledgeArticle[]>> => {
  try {
    const payload = await client()
    const { docs } = await payload.find({
      collection: 'knowledge-hub-articles',
      depth: 1,
      limit: 100,
      sort: '-publishedDate',
    })
    return { data: docs.map((doc) => toArticle(doc as unknown)), error: null }
  } catch (error) {
    console.error('[cms] getKnowledgeArticles failed:', error)
    return { data: [], error: reason(error) }
  }
}

export const getKnowledgeArticleBySlug = async (
  slug: string,
): Promise<CmsResult<KnowledgeArticle | null>> => {
  try {
    const payload = await client()
    const { docs } = await payload.find({
      collection: 'knowledge-hub-articles',
      depth: 1,
      limit: 1,
      where: { slug: { equals: slug } },
    })
    return { data: docs.length > 0 ? toArticle(docs[0] as unknown) : null, error: null }
  } catch (error) {
    console.error('[cms] getKnowledgeArticleBySlug failed:', error)
    return { data: null, error: reason(error) }
  }
}
