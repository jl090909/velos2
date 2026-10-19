import Link from 'next/link'
import type { ReactNode } from 'react'

/**
 * The site's editorial kit - ONE implementation of the look the Media page established, shared by
 * every list surface (Media, Resources, Knowledge Hub, Events).
 *
 * Server components only: no state, no client JavaScript. Each list page supplies its own data and
 * its own buttons; the typography, spacing, card shell, hero and section headers come from here, so
 * the four pages cannot drift apart.
 */

/* ------------------------------------------------------------------ small parts */

export function Eyebrow({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <p className={`text-[13px] font-semibold uppercase tracking-[.18em] text-[#FF612A]${className ? ` ${className}` : ''}`}>
      {children}
    </p>
  )
}

export function Chip({
  active,
  children,
  href,
}: {
  active: boolean
  children: ReactNode
  href: string
}) {
  return (
    <Link
      className={`inline-flex items-center rounded-full px-4 py-2 text-[13px] font-medium no-underline transition-all ${
        active
          ? 'bg-[linear-gradient(180deg,#003C64_0%,#002640_100%)] text-[#FF612A]'
          : 'border border-border/70 text-muted-foreground hover:border-[#003C64]/40 hover:text-[#003C64]'
      }`}
      href={href}
    >
      {children}
    </Link>
  )
}

export function Surface({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={`rounded-[1.35rem] border border-white/55 bg-[linear-gradient(180deg,rgba(255,255,255,.98)_0%,rgba(247,247,249,.95)_100%)] shadow-[0_1px_3px_rgba(15,23,42,.04)]${className ? ` ${className}` : ''}`}
    >
      {children}
    </div>
  )
}

export function SectionHeader({
  count,
  title,
  viewAllHref,
  viewAllLabel,
}: {
  count?: number
  title: string
  viewAllHref?: string
  viewAllLabel?: string
}) {
  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
      <h2 className="text-[24px] font-bold tracking-[-.04em] text-[#003C64] md:text-[30px]">{title}</h2>
      {viewAllHref ? (
        <Link className="text-sm font-medium text-[#003C64] no-underline transition-colors hover:text-[#FF612A]" href={viewAllHref}>
          {viewAllLabel ?? (typeof count === 'number' ? `View all ${count}` : 'View all')}
        </Link>
      ) : null}
    </div>
  )
}

export function Band({ children, title, viewAllHref, count }: { children: ReactNode; title: string; viewAllHref?: string; count?: number }) {
  return (
    <section className="border-t border-border/60 pt-12">
      <SectionHeader count={count} title={title} viewAllHref={viewAllHref} />
      {children}
    </section>
  )
}

/* ------------------------------------------------------------------ images */

function Cover({
  alt,
  className,
  height,
  placeholder,
  src,
  width,
}: {
  alt: string
  className: string
  height?: number
  placeholder: string
  src?: string | null
  width?: number
}) {
  if (!src) {
    return (
      <div className={`${className} flex items-center justify-center bg-[linear-gradient(135deg,#003C64_0%,#0f5c8f_55%,#FF612A_160%)]`}>
        <span className="text-[11px] font-semibold uppercase tracking-[.22em] text-white/75">{placeholder}</span>
      </div>
    )
  }
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img alt={alt} className={`${className} object-cover`} height={height} src={src} width={width} />
  )
}

/** Day + month block, for surfaces whose records have no imagery (events). */
export function DateBlock({ iso }: { iso: string }) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) {
    return null
  }
  return (
    <div className="flex h-full flex-col items-center justify-center rounded-[1.15rem] border border-white/55 bg-[linear-gradient(150deg,#002640_0%,#003C64_100%)] px-4 py-6">
      <span className="text-[11px] font-semibold uppercase tracking-[.2em] text-white/70">
        {date.toLocaleDateString('en-GB', { month: 'short' })}
      </span>
      <span className="text-[34px] font-bold leading-none tracking-[-.04em] text-white">{date.toLocaleDateString('en-GB', { day: '2-digit' })}</span>
      <span className="mt-1 text-[11px] text-white/60">{date.toLocaleDateString('en-GB', { year: 'numeric' })}</span>
    </div>
  )
}

/* ------------------------------------------------------------------ cards */

export type EditorialCardProps = {
  /** Optional badge row above the title (kind, event type, category...). */
  badges?: ReactNode
  /** Short kicker line above the title. */
  eyebrow?: string
  footer?: ReactNode
  href?: string
  image?: { alt: string; height?: number; src?: string | null; width?: number } | null
  /** Replaces the image slot entirely (e.g. a date block for an event). */
  media?: ReactNode
  /** Label used on the placeholder when there is no image. */
  placeholder?: string
  summary?: string
  title: string
  /** Right-hand side of the kicker line (date, reading time...). */
  meta?: string
}

export function EditorialCard({
  badges,
  eyebrow,
  footer,
  href,
  image,
  media,
  meta,
  placeholder = 'Velos Shield',
  summary,
  title,
}: EditorialCardProps) {
  const heading = href ? (
    <Link className="no-underline" href={href}>
      {title}
    </Link>
  ) : (
    title
  )
  return (
    <article className="group flex h-full flex-col">
      {media ? (
        <div className="aspect-[16/10] w-full overflow-hidden rounded-[1.15rem]">{media}</div>
      ) : image ? (
        href ? (
          <Link className="block no-underline" href={href}>
            <Cover
              alt={image.alt}
              className="aspect-[16/10] w-full overflow-hidden rounded-[1.15rem] border border-white/55 transition-transform duration-300 group-hover:scale-[1.015]"
              height={image.height}
              placeholder={placeholder}
              src={image.src}
              width={image.width}
            />
          </Link>
        ) : (
          <Cover
            alt={image.alt}
            className="aspect-[16/10] w-full overflow-hidden rounded-[1.15rem] border border-white/55"
            height={image.height}
            placeholder={placeholder}
            src={image.src}
            width={image.width}
          />
        )
      ) : null}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {badges}
        {eyebrow ? <span className="text-[11px] font-semibold uppercase tracking-[.16em] text-[#FF612A]">{eyebrow}</span> : null}
        {meta ? <span className="text-[11px] text-muted-foreground">{meta}</span> : null}
      </div>

      <h3 className="mt-2 text-[19px] font-semibold leading-[1.25] tracking-[-.03em] text-[#003C64] transition-colors group-hover:text-[#FF612A]">
        {heading}
      </h3>
      {summary ? <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{summary}</p> : null}
      {footer ? <div className="mt-auto pt-5">{footer}</div> : null}
    </article>
  )
}

/** The compact list row: used where a band reads better as a list than as a grid. */
export function EditorialRow({
  eyebrow,
  href,
  meta,
  summary,
  title,
}: {
  eyebrow?: string
  href?: string
  meta?: string
  summary?: string
  title: string
}) {
  const heading = href ? (
    <Link className="no-underline" href={href}>
      {title}
    </Link>
  ) : (
    title
  )
  return (
    <article className="group border-t border-border/60 py-6 first:border-t-0 first:pt-0">
      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[.16em] text-[#FF612A]">
        {eyebrow ? <span>{eyebrow}</span> : null}
        {meta ? <span className="font-normal normal-case tracking-normal text-muted-foreground">{meta}</span> : null}
      </div>
      <h3 className="mt-2 text-[21px] font-semibold leading-[1.22] tracking-[-.03em] text-[#003C64] transition-colors group-hover:text-[#FF612A]">
        {heading}
      </h3>
      {summary ? <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{summary}</p> : null}
    </article>
  )
}

/* ------------------------------------------------------------------ hero */

export function EditorialHero({
  aside,
  badge,
  cta,
  eyebrow,
  image,
  meta,
  summary,
  title,
}: {
  /** Replaces the image column entirely (e.g. a date block for an event). */
  aside?: ReactNode
  badge?: string
  cta?: { href: string; label: string }
  eyebrow?: string
  image?: { alt: string; height?: number; src?: string | null; width?: number } | null
  meta?: ReactNode
  summary?: string
  title: ReactNode
}) {
  return (
    <article className="relative overflow-hidden rounded-[1.6rem] border border-white/55 bg-[linear-gradient(150deg,#002640_0%,#003C64_58%,#0f5c8f_100%)] shadow-[0_18px_60px_rgba(0,38,64,.18)]">
      <div className="grid items-stretch gap-0 lg:grid-cols-[1.05fr_1fr]">
        <div className="order-2 flex flex-col justify-center p-8 md:p-12 lg:order-1">
          <div className="flex flex-wrap items-center gap-3">
            {badge ? (
              <span className="inline-flex items-center rounded-full bg-[#FF612A] px-3 py-1 text-[10px] font-bold uppercase tracking-[.2em] text-white">
                {badge}
              </span>
            ) : null}
            {eyebrow ? <span className="text-[11px] font-semibold uppercase tracking-[.2em] text-white/80">{eyebrow}</span> : null}
          </div>
          <h2 className="mt-5 text-[28px] font-bold leading-[1.08] tracking-[-.04em] text-white md:text-[42px]">{title}</h2>
          {summary ? <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-white/75 md:text-base">{summary}</p> : null}
          {meta ? <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] text-white/60">{meta}</div> : null}
          {cta ? (
            <Link
              className="mt-8 inline-flex w-max items-center justify-center rounded-full bg-[linear-gradient(180deg,#ff8a4d_0%,#FF612A_48%,#e04f0a_100%)] px-7 py-3 text-sm font-semibold text-[#002640] no-underline transition-all hover:bg-[linear-gradient(180deg,#ffffff_0%,#f1f5f9_100%)]"
              href={cta.href}
            >
              {cta.label}
            </Link>
          ) : null}
        </div>

        <div className="order-1 min-h-[220px] lg:order-2 lg:min-h-[420px]">
          {aside ? (
            <div className="flex h-full w-full items-center justify-center p-8 md:p-12">{aside}</div>
          ) : image?.src ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              alt={image.alt}
              className="h-full w-full object-cover"
              height={image.height}
              src={image.src}
              width={image.width}
            />
          ) : (
            <div className="flex h-full w-full items-end justify-end bg-[linear-gradient(135deg,rgba(255,97,42,.35)_0%,rgba(0,60,100,0)_60%)] p-8">
              <span className="text-[11px] font-semibold uppercase tracking-[.22em] text-white/50">{image?.alt ?? 'Velos Shield'}</span>
            </div>
          )}
        </div>
      </div>
    </article>
  )
}

/* ------------------------------------------------------------------ buttons */

export const buttonPrimary =
  'inline-flex h-11 items-center justify-center rounded-full bg-[linear-gradient(180deg,#0f5c8f_0%,#003C64_48%,#002640_100%)] px-6 text-sm font-semibold text-[#FF612A] no-underline transition-all hover:bg-[linear-gradient(180deg,#ff8a4d_0%,#FF612A_48%,#e04f0a_100%)] hover:text-[#002640]'

export const buttonSecondary =
  'inline-flex h-11 items-center justify-center rounded-full border border-border/70 px-6 text-sm font-medium text-muted-foreground no-underline transition-colors hover:border-[#003C64]/40 hover:text-[#003C64]'

export const cardGrid = 'grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3'
