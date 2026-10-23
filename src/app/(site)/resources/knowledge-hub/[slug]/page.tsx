import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { JSXConvertersFunction } from '@payloadcms/richtext-lexical/react'

import { SiteFooter } from '@/components/SiteFooter'
import { ImageAccordion } from '@/components/site/ImageAccordion'
import { getKnowledgeArticleBySlug, mediaUrl, type RichTextData } from '@/lib/cms'
import { formatDate } from '@/lib/format'

export const revalidate = 300

type Props = {
  params: Promise<{ slug: string }>
}

type LexicalNode = {
  children?: { text?: string }[]
  tag?: string
  type?: string
}

type LexicalBody = {
  root?: {
    children?: LexicalNode[]
    [key: string]: unknown
  }
}

const BODY_CLASS = [
  'text-[15.2px] leading-relaxed text-muted-foreground',
  '[&_a]:text-[#003C64] [&_a]:underline',
  '[&_blockquote]:border-l-2 [&_blockquote]:border-[#FF612A]/40 [&_blockquote]:pl-5 [&_blockquote]:italic',
  '[&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-[#003C64] [&_h3]:mt-8 [&_h3]:mb-2',
  '[&_h4]:text-lg [&_h4]:font-semibold [&_h4]:text-[#003C64] [&_h4]:mt-6 [&_h4]:mb-2',
  '[&_img]:mt-6 [&_img]:mb-1 [&_img]:w-full [&_img]:rounded-[1.15rem]',
  '[&_li]:mb-1.5 [&_p]:mb-5 [&_strong]:text-[#003C64]',
  '[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-6 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-6',
].join(' ')

type UploadNode = {
  fields?: { caption?: string } | null
  value?: {
    alt?: string
    height?: number
    sizes?: { hero?: { height?: number; url?: string; width?: number } }
    url?: string
    width?: number
  } | null
}

/**
 * Upload nodes render as a figure with the caption an editor typed on that node, not just the file.
 *
 * Payload's default upload converter emits the image alone, which loses the one line that ties a photo
 * to the argument next to it - and in an accordion tray that context is the difference between an
 * illustration and decoration. The hero size (1600x900) is preferred over the original.
 */
const converters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  upload: ({ node }) => {
    const upload = node as unknown as UploadNode
    const media = upload.value
    const url = media?.sizes?.hero?.url ?? media?.url
    if (!url) {
      return null
    }
    const src = mediaUrl(url)
    return (
      <figure className="my-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt={media?.alt ?? ''}
          className="w-full rounded-[1.15rem]"
          height={media?.sizes?.hero?.height ?? media?.height}
          loading="lazy"
          src={src}
          width={media?.sizes?.hero?.width ?? media?.width}
        />
        {upload.fields?.caption ? (
          <figcaption className="mt-1.5 text-[12.35px] leading-relaxed text-[#5A6472]">{upload.fields.caption}</figcaption>
        ) : null}
      </figure>
    )
  },
})

const nodeText = (node: LexicalNode): string =>
  (node.children ?? [])
    .map((child) => (typeof child?.text === 'string' ? child.text : ''))
    .join('')
    .trim()

/**
 * Splits the CMS body at its h2 headings.
 *
 * Anything before the first h2 is the lede and renders as normal prose; each h2 becomes an accordion
 * row with everything up to the next h2 in its tray. A body without h2 headings stays a plain article,
 * so an author who has not used headings does not lose the page to an empty accordion.
 */
const splitBody = (body: unknown): { lead: LexicalNode[]; sections: { nodes: LexicalNode[]; title: string }[] } => {
  const children = ((body as LexicalBody | null)?.root?.children ?? []) as LexicalNode[]
  const lead: LexicalNode[] = []
  const sections: { nodes: LexicalNode[]; title: string }[] = []

  for (const node of children) {
    if (node?.type === 'heading' && node?.tag === 'h2') {
      sections.push({ nodes: [], title: nodeText(node) || 'Section' })
    } else if (sections.length === 0) {
      lead.push(node)
    } else {
      sections[sections.length - 1].nodes.push(node)
    }
  }

  return { lead, sections }
}

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { slug } = await params
  const { data: article } = await getKnowledgeArticleBySlug(slug)
  if (!article) {
    return { title: 'Article not found - Velos Shield' }
  }
  return pageMetadata({
    path: `/resources/knowledge-hub/${slug}/`,
    description: article.excerpt,
    title: `${article.title} - Knowledge Hub - Velos Shield`,
  })
}

export default async function KnowledgeArticlePage({ params }: Props) {
  const { slug } = await params
  const { data: article } = await getKnowledgeArticleBySlug(slug)

  if (!article) {
    notFound()
  }

  const body = article.body as unknown as LexicalBody | null
  const { lead, sections } = splitBody(article.body)
  const sectionData = (nodes: LexicalNode[]): RichTextData =>
    ({ root: { ...(body?.root ?? {}), children: nodes } }) as unknown as RichTextData

  return (
    <>
      <article className="mx-auto max-w-3xl px-6 pt-20 pb-10">
        <Link
          className="text-[12.35px] font-semibold uppercase tracking-[.14em] text-muted-foreground no-underline transition-colors hover:text-[#003C64]"
          href="/resources/knowledge-hub"
        >
          Knowledge Hub
        </Link>
        <h1 className="mt-6 mb-5 text-3xl font-bold leading-[1.06] tracking-[-.05em] text-[#003C64] md:text-5xl">
          {article.title}
        </h1>
        <p className="mb-6 text-base leading-relaxed text-muted-foreground md:text-lg">{article.excerpt}</p>
        <div className="flex flex-wrap items-center gap-3 border-b border-border/50 pb-8">
          <span className="rounded-full bg-[#FF612A]/10 px-3 py-1 text-[10.45px] font-semibold uppercase tracking-[.14em] text-[#FF612A]">
            {article.category}
          </span>
          <span className="text-xs text-muted-foreground">
            {article.authorName}
            {article.authorRole ? ` - ${article.authorRole}` : ''}
          </span>
          {article.publishedDate ? <span className="text-xs text-muted-foreground">{formatDate(article.publishedDate)}</span> : null}
          {article.readingTime ? <span className="text-xs text-muted-foreground">{article.readingTime}</span> : null}
        </div>

        {article.heroImage ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            alt={article.heroImage.alt || article.title}
            className="mt-8 w-full rounded-[1.35rem] shadow-[0_16px_40px_rgba(15,23,42,.08)]"
            src={article.heroImage.url}
          />
        ) : null}

        {article.body ? (
          <div className="mt-10">
            {lead.length > 0 ? (
              <RichText className={`${BODY_CLASS} text-[17.1px] md:text-[18.05px]`} converters={converters} data={sectionData(lead)} />
            ) : null}

            {sections.length > 0 ? (
              <div className="mt-10">
                <p className="mb-4 text-[10.45px] font-semibold uppercase tracking-[.18em] text-muted-foreground">In this note</p>
                <ImageAccordion
                  items={sections.map((section, index) => ({
                    content: <RichText className={BODY_CLASS} converters={converters} data={sectionData(section.nodes)} />,
                    id: `section-${index}`,
                    title: section.title,
                  }))}
                />
              </div>
            ) : (
              <RichText className={BODY_CLASS} converters={converters} data={article.body} />
            )}
          </div>
        ) : null}

        {article.tags.length > 0 ? (
          <div className="mt-12 flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <span className="rounded-full border border-border/60 bg-white px-3 py-1.5 text-xs text-muted-foreground" key={tag}>
                {tag}
              </span>
            ))}
          </div>
        ) : null}

        <div className="mt-12 flex flex-wrap gap-3 border-t border-border/50 pt-8">
          <Link
            className="inline-flex h-11 items-center justify-center rounded-full border border-border/70 px-6 text-sm font-medium text-muted-foreground no-underline transition-colors hover:border-[#003C64]/40 hover:text-[#003C64]"
            href="/resources/knowledge-hub"
          >
            All articles
          </Link>
          <Link
            className="inline-flex h-11 items-center justify-center rounded-full bg-[linear-gradient(180deg,#0f5c8f_0%,#003C64_48%,#002640_100%)] px-6 text-sm font-semibold text-[#FF612A] no-underline transition-all hover:bg-[linear-gradient(180deg,#ff8a4d_0%,#FF612A_48%,#e04f0a_100%)] hover:text-[#003C64]"
            href="/demo"
          >
            Request a demo
          </Link>
        </div>
      </article>

      <SiteFooter />
    </>
  )
}
