import type { Metadata } from 'next'

import { SiteFooter } from '@/components/SiteFooter'
import { Eyebrow, Surface } from '@/components/site/editorial'
import { LineupGallery } from '@/components/site/LineupGallery'
import { LineupTile } from '@/components/site/LineupTile'
import { getWhitepapers } from '@/lib/cms'
import { pageMetadata } from '@/lib/seo'

/**
 * Resources - the library as a lineup.
 *
 * One sideways row of tiles. No featured hero and no per-kind bands: the page opens on the shelf
 * itself. The tiles are the fixed-band LineupTile; the row, the snapping and the paddles come from
 * LineupGallery, which leaves scrolling to the browser.
 */

export const revalidate = 300

export const metadata: Metadata = pageMetadata({
  path: '/resources/',
  description:
    'Point-of-view whitepapers, case studies, and brochures on OT cyber risk, operational context, and the future of OT monitoring.',
  title: 'Resources - Velos Shield POV Whitepaper Series',
})

export default async function ResourcesPage() {
  const { data: papers, error } = await getWhitepapers()

  // Newest first: the collection order is whatever the CMS returns, and a lineup implies curation.
  const ordered = [...papers].sort((a, b) => (a.publishedDate < b.publishedDate ? 1 : -1))

  return (
    <>
      <section className="pb-24 pt-16">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <Eyebrow>Resources</Eyebrow>
          <h1
            className="mx-auto mt-3 max-w-3xl text-3xl font-semibold tracking-[-.04em] text-[#003C64] md:text-5xl"
            id="library"
          >
            The Velos Shield library.
          </h1>
        </div>

        <div className="mx-auto mt-10 max-w-6xl px-6">
          {ordered.length === 0 ? (
            <Surface className="p-8 md:p-10">
              <p className="font-medium text-[#003C64]">Resources are being updated.</p>
              <p className="mt-2 text-sm text-muted-foreground">
                {error
                  ? 'The library feed is temporarily unavailable. Please try again shortly.'
                  : 'New papers and case studies are on the way.'}
              </p>
            </Surface>
          ) : (
            <LineupGallery labelId="library">
              {ordered.map((paper, index) => (
                <LineupTile index={index} key={paper.id} paper={paper} />
              ))}
            </LineupGallery>
          )}
        </div>
      </section>

      <SiteFooter />
    </>
  )
}
