import config from '@payload-config'
import type { ComponentProps } from 'react'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { getPayload } from 'payload'
import type { Where } from 'payload'

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

const REQUIRED_ENV = ['DATABASE_URL', 'PAYLOAD_SECRET'] as const

let warnedMissingEnv = false

/**
 * Every Payload initialisation needs a database URL and a secret, on every host. Without them the
 * raw failure is a bare "missing secret key" that says nothing about which environment is broken,
 * so name the variables once and let the sections degrade to their empty state.
 */
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
      `[cms] CMS reads are disabled in this environment: ${missing.join(', ')} not set. Set them in ` +
        'the hosting provider (see docs/CMS.md) and redeploy. The site keeps serving without CMS ' +
        'content until then.',
    )
  }
  return `cms-not-configured:${missing.join(',')}`
}

const client = async () => getPayload({ config })

/**
 * Public pages must never render drafts.
 *
 * The Local API bypasses access control unless `overrideAccess: false` is passed, so a site-side
 * `payload.find()` happily returns drafts even though the same query over REST does not. Every reader
 * therefore asks for published docs explicitly AND runs with access control enabled.
 */
const publishedOnly = (): Where => ({ _status: { equals: 'published' } })

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
  const problem = configProblem()
  if (problem) {
    return { data: [], error: problem }
  }

  try {
    const payload = await client()
    const { docs } = await payload.find({
      overrideAccess: false,
      collection: 'jobs',
      depth: 0,
      limit: 100,
      sort: '-postedAt',
      where: { ...publishedOnly(), postingStatus: { equals: 'open' } },
    })
    return { data: docs.map((doc) => toJob(doc as unknown)), error: null }
  } catch (error) {
    console.error('[cms] getOpenJobs failed:', reason(error))
    return { data: [], error: reason(error) }
  }
}

export const getJobBySlug = async (slug: string): Promise<CmsResult<JobOpening | null>> => {
  const problem = configProblem()
  if (problem) {
    return { data: null, error: problem }
  }

  try {
    const payload = await client()
    const { docs } = await payload.find({
      overrideAccess: false,
      collection: 'jobs',
      depth: 0,
      limit: 1,
      where: { ...publishedOnly(), postingStatus: { equals: 'open' }, slug: { equals: slug } },
    })
    return { data: docs.length > 0 ? toJob(docs[0] as unknown) : null, error: null }
  } catch (error) {
    console.error('[cms] getJobBySlug failed:', reason(error))
    return { data: null, error: reason(error) }
  }
}

export const getWhitepapers = async (): Promise<CmsResult<WhitepaperCard[]>> => {
  const problem = configProblem()
  if (problem) {
    return { data: [], error: problem }
  }

  try {
    const payload = await client()
    const { docs } = await payload.find({
      overrideAccess: false,
      collection: 'whitepapers',
      depth: 1,
      limit: 100,
      sort: '-publishedDate',
      where: publishedOnly(),
    })
    return { data: docs.map((doc) => toWhitepaper(doc as unknown)), error: null }
  } catch (error) {
    console.error('[cms] getWhitepapers failed:', reason(error))
    return { data: [], error: reason(error) }
  }
}

export const getKnowledgeArticles = async (): Promise<CmsResult<KnowledgeArticle[]>> => {
  const problem = configProblem()
  if (problem) {
    return { data: [], error: problem }
  }

  try {
    const payload = await client()
    const { docs } = await payload.find({
      overrideAccess: false,
      collection: 'knowledge-hub-articles',
      depth: 1,
      limit: 100,
      sort: '-publishedDate',
      where: publishedOnly(),
    })
    return { data: docs.map((doc) => toArticle(doc as unknown)), error: null }
  } catch (error) {
    console.error('[cms] getKnowledgeArticles failed:', reason(error))
    return { data: [], error: reason(error) }
  }
}

export const getKnowledgeArticleBySlug = async (
  slug: string,
): Promise<CmsResult<KnowledgeArticle | null>> => {
  const problem = configProblem()
  if (problem) {
    return { data: null, error: problem }
  }

  try {
    const payload = await client()
    const { docs } = await payload.find({
      overrideAccess: false,
      collection: 'knowledge-hub-articles',
      depth: 1,
      limit: 1,
      where: { ...publishedOnly(), slug: { equals: slug } },
    })
    return { data: docs.length > 0 ? toArticle(docs[0] as unknown) : null, error: null }
  } catch (error) {
    console.error('[cms] getKnowledgeArticleBySlug failed:', reason(error))
    return { data: null, error: reason(error) }
  }
}

export type CustomerCard = {
  displayOrder: number
  featured: boolean
  id: number | string
  logo: MediaRef | null
  name: string
  quote?: string
  quoteAuthor?: string
  quoteRole?: string
  region: string
  sector: string
  slug: string
  summary: string
  websiteUrl?: string
}

export type EventItem = {
  booth?: string
  city: string
  country: string
  description: RichTextData | null
  endDate?: string
  eventType: string
  id: number | string
  registrationUrl?: string
  slug: string
  startDate: string
  summary: string
  title: string
  venue: string
  websiteUrl?: string
}

export type PressMention = {
  excerpt?: string
  headline: string
  id: number | string
  kind: string
  logo: MediaRef | null
  outlet: string
  publishedDate: string
  url: string
}

const num = (value: unknown, fallback = 0): number => (typeof value === "number" ? value : fallback)

const toCustomer = (raw: unknown): CustomerCard => {
  const doc = isRecord(raw) ? raw : {}
  return {
    displayOrder: num(doc.displayOrder, 100),
    featured: doc.featured === true,
    id: str(doc.id, "unknown"),
    logo: mediaRef(doc.logo),
    name: str(doc.name),
    quote: optional(doc.quote),
    quoteAuthor: optional(doc.quoteAuthor),
    quoteRole: optional(doc.quoteRole),
    region: str(doc.region),
    sector: str(doc.sector),
    slug: str(doc.slug),
    summary: str(doc.summary),
    websiteUrl: optional(doc.websiteUrl),
  }
}

const toEvent = (raw: unknown): EventItem => {
  const doc = isRecord(raw) ? raw : {}
  return {
    booth: optional(doc.booth),
    city: str(doc.city),
    country: str(doc.country),
    description: richText(doc.description),
    endDate: optional(doc.endDate),
    eventType: str(doc.eventType, "Conference"),
    id: str(doc.id, "unknown"),
    registrationUrl: optional(doc.registrationUrl),
    slug: str(doc.slug),
    startDate: str(doc.startDate),
    summary: str(doc.summary),
    title: str(doc.title),
    venue: str(doc.venue),
    websiteUrl: optional(doc.websiteUrl),
  }
}

const toPressMention = (raw: unknown): PressMention => {
  const doc = isRecord(raw) ? raw : {}
  return {
    excerpt: optional(doc.excerpt),
    headline: str(doc.headline),
    id: str(doc.id, "unknown"),
    kind: str(doc.kind, "News"),
    logo: mediaRef(doc.logo),
    outlet: str(doc.outlet),
    publishedDate: str(doc.publishedDate),
    url: str(doc.url),
  }
}

export const getCustomers = async (): Promise<CmsResult<CustomerCard[]>> => {
  const problem = configProblem()
  if (problem) {
    return { data: [], error: problem }
  }

  try {
    const payload = await client()
    const { docs } = await payload.find({
      overrideAccess: false,
      collection: 'customers',
      depth: 1,
      limit: 100,
      sort: 'displayOrder',
      where: publishedOnly(),
    })
    const customers = docs.map((doc) => toCustomer(doc as unknown))
    // featured first, then the editor-controlled order - done here so a single Postgres sort stays portable
    customers.sort((a, b) => Number(b.featured) - Number(a.featured) || a.displayOrder - b.displayOrder || a.name.localeCompare(b.name))
    return { data: customers, error: null }
  } catch (error) {
    console.error('[cms] getCustomers failed:', reason(error))
    return { data: [], error: reason(error) }
  }
}

export const getEvents = async (): Promise<CmsResult<EventItem[]>> => {
  const problem = configProblem()
  if (problem) {
    return { data: [], error: problem }
  }

  try {
    const payload = await client()
    const { docs } = await payload.find({
      overrideAccess: false,
      collection: 'events',
      depth: 0,
      limit: 200,
      sort: 'startDate',
      where: publishedOnly(),
    })
    return { data: docs.map((doc) => toEvent(doc as unknown)), error: null }
  } catch (error) {
    console.error('[cms] getEvents failed:', reason(error))
    return { data: [], error: reason(error) }
  }
}

export const getEventBySlug = async (slug: string): Promise<CmsResult<EventItem | null>> => {
  const problem = configProblem()
  if (problem) {
    return { data: null, error: problem }
  }

  try {
    const payload = await client()
    const { docs } = await payload.find({
      overrideAccess: false,
      collection: 'events',
      depth: 0,
      limit: 1,
      where: { ...publishedOnly(), slug: { equals: slug } },
    })
    return { data: docs.length > 0 ? toEvent(docs[0] as unknown) : null, error: null }
  } catch (error) {
    console.error('[cms] getEventBySlug failed:', reason(error))
    return { data: null, error: reason(error) }
  }
}

export const getPressMentions = async (): Promise<CmsResult<PressMention[]>> => {
  const problem = configProblem()
  if (problem) {
    return { data: [], error: problem }
  }

  try {
    const payload = await client()
    const { docs } = await payload.find({
      overrideAccess: false,
      collection: 'press-mentions',
      depth: 1,
      limit: 200,
      sort: '-publishedDate',
      where: publishedOnly(),
    })
    return { data: docs.map((doc) => toPressMention(doc as unknown)), error: null }
  } catch (error) {
    console.error('[cms] getPressMentions failed:', reason(error))
    return { data: [], error: reason(error) }
  }
}
