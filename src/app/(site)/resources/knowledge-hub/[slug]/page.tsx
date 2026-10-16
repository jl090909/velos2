import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'

import { SiteFooter } from '@/components/SiteFooter'
import { getKnowledgeArticleBySlug } from '@/lib/cms'
import { formatDate } from '@/lib/format'

export const revalidate = 300

type Props = {
  params: Promise<{ slug: string }>
}

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { slug } = await params
  const { data: article } = await getKnowledgeArticleBySlug(slug)
  if (!article) {
    return { title: 'Article not found - Velos Shield' }
  }
  return {
    description: article.excerpt,
    title: `${article.title} - Knowledge Hub - Velos Shield`,
  }
}

export default async function KnowledgeArticlePage({ params }: Props) {
  const { slug } = await params
  const { data: article } = await getKnowledgeArticleBySlug(slug)

  if (!article) {
    notFound()
  }

  return (
    <>
      <article className="pt-20 pb-10 max-w-3xl mx-auto px-6">
        <Link
          href="/resources/knowledge-hub"
          className="text-[13px] font-semibold tracking-[.14em] uppercase text-muted-foreground no-underline hover:text-[#003C64] transition-colors"
        >
          Knowledge Hub
        </Link>
        <h1 className="text-3xl md:text-5xl font-bold tracking-[-.05em] leading-[1.06] mt-6 mb-5 text-[#003C64]">
          {article.title}
        </h1>
        <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-6">{article.excerpt}</p>
        <div className="flex flex-wrap items-center gap-3 pb-8 border-b border-border/50">
          <span className="text-[11px] font-semibold tracking-[.14em] uppercase px-3 py-1 rounded-full bg-[#FF612A]/10 text-[#FF612A]">
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
          <img
            alt={article.heroImage.alt || article.title}
            className="w-full rounded-[1.35rem] mt-8 shadow-[0_16px_40px_rgba(15,23,42,.08)]"
            src={article.heroImage.url}
          />
        ) : null}

        <div className="mt-10">
          {article.body ? (
            <RichText
              className="text-[16px] leading-relaxed text-muted-foreground [&_a]:text-[#003C64] [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-[#FF612A]/40 [&_blockquote]:pl-5 [&_blockquote]:italic [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-[-.03em] [&_h2]:text-[#003C64] [&_h2]:mt-10 [&_h2]:mb-3 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-[#003C64] [&_h3]:mt-8 [&_h3]:mb-2 [&_li]:mb-1.5 [&_p]:mb-5 [&_strong]:text-[#003C64] [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-6"
              data={article.body}
            />
          ) : null}
        </div>

        {article.tags.length > 0 ? (
          <div className="mt-12 flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <span key={tag} className="text-xs px-3 py-1.5 rounded-full border border-border/60 bg-white text-muted-foreground">
                {tag}
              </span>
            ))}
          </div>
        ) : null}

        <div className="mt-12 pt-8 border-t border-border/50 flex flex-wrap gap-3">
          <Link
            href="/resources/knowledge-hub"
            className="inline-flex items-center justify-center rounded-full h-11 px-6 text-sm font-medium border border-border/70 no-underline text-muted-foreground hover:text-[#003C64] hover:border-[#003C64]/40 transition-colors"
          >
            All articles
          </Link>
          <Link
            href="/demo"
            className="inline-flex items-center justify-center rounded-full h-11 px-6 text-sm font-semibold bg-[linear-gradient(180deg,#0f5c8f_0%,#003C64_48%,#002640_100%)] text-[#FF612A] hover:bg-[linear-gradient(180deg,#ff8a4d_0%,#FF612A_48%,#e04f0a_100%)] hover:text-[#003C64] transition-all no-underline"
          >
            Request a demo
          </Link>
        </div>
      </article>

      <SiteFooter />
    </>
  )
}
