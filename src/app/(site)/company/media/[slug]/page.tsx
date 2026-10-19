import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { ArticleView } from '@/components/newsroom/ArticleView'
import { getNewsroomArticleBySlug, getNewsroomArticles, pickRelated } from '@/lib/newsroom'

/**
 * A single Newsroom story - /company/media/<slug>/.
 *
 * The layout lives in src/components/newsroom/ArticleView so the CMS preview renders EXACTLY the same
 * markup (only a banner differs). Draft isolation is enforced by the reader, not by this page:
 * getNewsroomArticleBySlug requires `_status = published` AND `publishAt <= now` with access ON.
 */

export const revalidate = 300

type Props = {
  params: Promise<{ slug: string }>
}

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { slug } = await params
  const { data: article } = await getNewsroomArticleBySlug(slug)
  if (!article) {
    return { title: 'Story not found - Velos Shield' }
  }
  const description = article.seoDescription ?? article.summary
  return {
    description,
    openGraph: {
      description,
      publishedTime: article.publishAt || undefined,
      title: article.seoTitle ?? article.title,
      type: 'article',
    },
    robots: { follow: true, index: true },
    title: `${article.seoTitle ?? article.title} - Newsroom - Velos Shield`,
  }
}

export default async function NewsroomArticlePage({ params }: Props) {
  const { slug } = await params
  const { data: article } = await getNewsroomArticleBySlug(slug)

  if (!article) {
    notFound()
  }

  const { data: all } = await getNewsroomArticles({ limit: 60 })
  const related = pickRelated(all, article)

  return <ArticleView article={article} related={related} />
}
