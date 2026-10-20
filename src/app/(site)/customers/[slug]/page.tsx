import { notFound, permanentRedirect } from 'next/navigation'

import { getCustomerBySlug } from '@/lib/cms'

/**
 * Customer story - /customers/<slug>/.
 *
 * The long-form story moved to Whitepapers & case studies, so this address keeps working as a
 * permanent redirect to the case study's own page at /resources/<slug>/. Old links, sitemap entries
 * and the customer card all funnel to one URL, and there is only one place an editor has to update.
 *
 * A customer with no linked case study is a 404, exactly as an unpublished story is: the reader
 * filters `_status = published` with access control ON, so a draft recommendation never redirects.
 */

export const revalidate = 300

type Props = {
  params: Promise<{ slug: string }>
}

export default async function CustomerStoryRedirect({ params }: Props) {
  const { slug } = await params
  const { data: customer } = await getCustomerBySlug(slug)

  if (!customer || !customer.caseStudyPath) {
    notFound()
  }

  permanentRedirect(customer.caseStudyPath)
}
