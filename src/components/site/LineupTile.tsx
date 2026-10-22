import Link from 'next/link'

import type { WhitepaperCard } from '@/lib/cms'

/**
 * One tile in the resources lineup.
 *
 * The bands have fixed heights on purpose: eyebrow, two-line title, image, chips, two-line copy,
 * reading time, then the actions pushed to the bottom with mt-auto. That is what makes four tiles
 * of different copy lengths line up like a product shelf instead of four ragged cards - the same
 * trick the Apple lineup uses. Anything that changes here must keep the bands fixed.
 *
 * The image is a plain <img>: CMS media URLs are absolute (they point at the deployment that
 * uploaded them), and next/image only allows the local /api/media/file path, so optimising through
 * it would 400 on every tile. Width/height are set so the band has no layout shift.
 */
export function LineupTile({ index, paper }: { index: number; paper: WhitepaperCard }) {
  const cover = paper.coverImage
  const readHref = paper.readOnlinePath ?? undefined
  const pdfHref = paper.downloadUrl || undefined
  const primaryHref = readHref ?? pdfHref
  const primaryLabel = readHref ? 'Read' : 'View PDF'

  return (
    <li className="lineup-tile w-[calc(100vw-72px)] shrink-0 snap-start sm:w-[320px] lg:w-[336px]">
      <article className="flex h-full flex-col rounded-[20px] border border-white/70 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,.05),0_18px_40px_rgba(15,23,42,.06)]">
        <p className="text-[10.45px] font-semibold tracking-[.18em] uppercase text-[#FF612A]">{paper.kind}</p>

        <h3 className="mt-2 line-clamp-2 min-h-[2.55em] text-title-lg font-semibold leading-[1.27] tracking-[-.02em] text-[#003C64]">
          {primaryHref ? (
            <Link className="no-underline" href={primaryHref}>
              {paper.title}
            </Link>
          ) : (
            paper.title
          )}
        </h3>

        <div className="relative mt-4 aspect-[372/396] w-full overflow-hidden rounded-[14px] bg-[linear-gradient(180deg,#eef2f7_0%,#e2e8f0_100%)]">
          {cover ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              alt={cover.alt || paper.title}
              className="h-full w-full object-cover"
              decoding="async"
              height={cover.height || 792}
              loading={index === 0 ? 'eager' : 'lazy'}
              src={cover.url}
              width={cover.width || 744}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center px-6 text-center text-[13.3px] font-medium text-[#003C64]/50">
              {paper.kind}
            </div>
          )}
        </div>

        <div className="mt-4 flex min-h-[26px] flex-wrap gap-2 overflow-hidden">
          {paper.keyPoints.slice(0, 3).map((point) => (
            <span
              className="inline-flex items-center rounded-full border border-border/60 bg-[#f7f7f9] px-2.5 py-1 text-[11.4px] text-muted-foreground"
              key={point}
            >
              {point}
            </span>
          ))}
        </div>

        <p className="mt-3 line-clamp-2 min-h-[2.9em] text-sm leading-relaxed text-muted-foreground">{paper.subtitle}</p>

        <p className="mt-2 text-[13.3px] font-semibold text-[#003C64]">{paper.readTime || 'Free to read'}</p>

        <div className="mt-auto flex items-center gap-5 border-t border-border/50 pt-5">
          {primaryHref ? (
            <Link
              className="inline-flex h-10 items-center justify-center rounded-full bg-[linear-gradient(180deg,#0f5c8f_0%,#003C64_48%,#002640_100%)] px-6 text-[13.3px] font-semibold text-[#FF612A] no-underline transition-all hover:bg-[linear-gradient(180deg,#ff8a4d_0%,#FF612A_48%,#e04f0a_100%)] hover:text-[#002640]"
              href={primaryHref}
            >
              {primaryLabel}
            </Link>
          ) : null}
          {readHref && pdfHref ? (
            <a
              className="text-[13.3px] font-medium text-[#003C64] underline-offset-4 no-underline hover:underline"
              href={pdfHref}
              rel="noreferrer"
              target="_blank"
            >
              PDF
            </a>
          ) : null}
        </div>
      </article>
    </li>
  )
}
