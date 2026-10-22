'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'

import { OT_SLIDES, type OtSlideImage } from '@/lib/ot-carousel'

/**
 * The OT security carousel, as a real component instead of a standalone HTML artifact.
 *
 * What it keeps from the design: one slide at a time, artwork on one side and the two role
 * sentences on the other, sides alternating down the set, a numbered counter, numbered dots and a
 * slow auto-advance.
 *
 * What it drops, because it only existed for the artifact: the inline text editor, the copy-to-
 * clipboard button (a LinkedIn posting aid), the stacked white-paper view with print styles, the
 * side-rule and sentence-mode switches, and the embed-code modal.
 *
 * Behaviour rules that matter:
 *  - arrow keys work once the carousel has focus, and never steal page scrolling before that;
 *  - touch swipes left/right;
 *  - auto-advance pauses on hover, on focus, when the tab is hidden, under prefers-reduced-motion,
 *    and permanently via the Pause button (WCAG 2.2.2 - it moves on its own, so it needs a stop);
 *  - clicking any artwork opens it full size, Escape or a backdrop click closes it.
 */
const ADVANCE_MS = 10000

type ZoomState = { caption: string; image: OtSlideImage } | null

export function OtCarousel() {
  const total = OT_SLIDES.length
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [focused, setFocused] = useState(false)
  const [zoom, setZoom] = useState<ZoomState>(null)
  const touchStart = useRef<number | null>(null)
  const section = useRef<HTMLDivElement>(null)

  const slide = OT_SLIDES[index]
  const picLeft = slide.side === 'pic-left'

  const go = useCallback(
    (target: number) => {
      setIndex(((target % total) + total) % total)
    },
    [total],
  )

  // Auto-advance.
  useEffect(() => {
    if (paused || hovering || focused) return
    if (typeof window === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const id = window.setInterval(() => {
      if (document.hidden) return
      setIndex((current) => (current + 1) % total)
    }, ADVANCE_MS)

    return () => window.clearInterval(id)
  }, [paused, hovering, focused, total])

  // Arrow keys, only while the carousel itself has focus.
  useEffect(() => {
    const el = section.current
    if (!el) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        event.preventDefault()
        setIndex((current) => (current + 1) % total)
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        setIndex((current) => (current - 1 + total) % total)
      }
      if (event.key === 'Escape') setZoom(null)
    }
    el.addEventListener('keydown', onKey)
    return () => el.removeEventListener('keydown', onKey)
  }, [total])

  // Escape closes the zoom from anywhere, since the dialog holds focus.
  useEffect(() => {
    if (!zoom) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setZoom(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [zoom])

  const control =
    'inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-white/85 text-[#003C64] shadow-[0_1px_2px_rgba(15,23,42,.06)] transition-all hover:border-[#003C64]/40 hover:bg-white'

  const openZoom = (image: OtSlideImage) => setZoom({ caption: `Slide ${slide.num} — ${slide.topic}`, image })

  const artwork = (
    <div className="relative flex w-full items-center justify-center">
      {slide.media.kind === 'single' ? (
        <button
          className="group relative block w-full max-w-[430px] cursor-zoom-in overflow-hidden rounded-[18px] bg-[#f2f5f9] p-3 shadow-[0_18px_45px_rgba(15,23,42,.12)] transition-transform duration-500 hover:-translate-y-1"
          onClick={() => openZoom(slide.media.kind === 'single' ? slide.media.images[0] : slide.media.images[0])}
          type="button"
        >
          <Image
            alt={`${slide.topic} — slide ${slide.num} graphic`}
            className="h-auto w-full object-contain"
            height={slide.media.images[0].height}
            src={slide.media.images[0].src}
            width={slide.media.images[0].width}
          />
        </button>
      ) : slide.media.kind === 'dual' ? (
        <div className="grid w-full max-w-[430px] grid-cols-2 gap-3">
          {slide.media.images.map((image, i) => (
            <button
              className="cursor-zoom-in overflow-hidden rounded-[14px] bg-[#f2f5f9] p-2 shadow-[0_12px_30px_rgba(15,23,42,.10)] transition-transform duration-500 hover:-translate-y-1"
              key={image.src}
              onClick={() => openZoom(image)}
              type="button"
            >
              <Image
                alt={`${slide.topic} — slide ${slide.num} graphic ${i + 1}`}
                className="h-auto w-full object-contain"
                height={image.height}
                src={image.src}
                width={image.width}
              />
            </button>
          ))}
        </div>
      ) : (
        <div className="grid w-full max-w-[430px] grid-cols-2 gap-3">
          {slide.media.images.map((image, i) => (
            <button
              className="cursor-zoom-in overflow-hidden rounded-[14px] bg-[#f2f5f9] p-2 shadow-[0_12px_30px_rgba(15,23,42,.10)] transition-transform duration-500 hover:-translate-y-1"
              key={`${image.src}-${i}`}
              onClick={() => openZoom(image)}
              type="button"
            >
              <Image
                alt={`${slide.topic} — slide ${slide.num} graphic ${i + 1}`}
                className="h-auto w-full object-contain"
                height={image.height}
                src={image.src}
                width={image.width}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )

  return (
    <section aria-labelledby="ot-carousel-heading" className="mx-auto max-w-6xl px-6 pb-16 pt-2">
      <div
        aria-label="OT security carousel"
        aria-roledescription="carousel"
        onBlurCapture={() => setFocused(false)}
        onFocusCapture={() => setFocused(true)}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        ref={section}
        tabIndex={0}
      >
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11.4px] font-semibold tracking-[.18em] uppercase text-[#FF612A]">Ten moves, two buyers</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-.03em] text-[#003C64] md:text-3xl" id="ot-carousel-heading">
              One sentence for security. One for operations.
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[#003C64] px-3 py-1.5 text-[11.4px] font-bold tracking-[.08em] text-white">
              {slide.num} / {String(total).padStart(2, '0')}
            </span>
            <button
              aria-label={paused ? 'Resume automatic advance' : 'Pause automatic advance'}
              aria-pressed={paused}
              className="inline-flex h-10 items-center gap-2 rounded-full px-3 text-[13.3px] font-medium text-muted-foreground transition-colors hover:text-[#003C64]"
              onClick={() => setPaused((value) => !value)}
              type="button"
            >
              {paused ? (
                <svg aria-hidden="true" className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              ) : (
                <svg aria-hidden="true" className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 5h4v14H7zM13 5h4v14h-4z" />
                </svg>
              )}
              {paused ? 'Play' : 'Pause'}
            </button>
            <button aria-label="Previous slide" className={control} onClick={() => go(index - 1)} type="button">
              <svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button aria-label="Next slide" className={control} onClick={() => go(index + 1)} type="button">
              <svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        <div
          aria-label={`Slide ${index + 1} of ${total}`}
          aria-roledescription="slide"
          className="ot-slide mt-8 grid min-h-[380px] items-center gap-8 md:gap-10 lg:grid-cols-12 lg:gap-14"
          key={slide.num}
          onTouchEnd={(event) => {
            if (touchStart.current === null) return
            const delta = event.changedTouches[0].clientX - touchStart.current
            if (Math.abs(delta) > 40) go(delta < 0 ? index + 1 : index - 1)
            touchStart.current = null
          }}
          onTouchStart={(event) => {
            touchStart.current = event.changedTouches[0].clientX
          }}
          role="group"
        >
          <div className={picLeft ? 'lg:order-1 lg:col-span-6' : 'lg:order-2 lg:col-span-6'}>{artwork}</div>

          <div className={picLeft ? 'lg:order-2 lg:col-span-6' : 'lg:order-1 lg:col-span-6'}>
            <p className="flex items-center gap-2 text-[11.4px] font-semibold tracking-[.18em] uppercase text-muted-foreground">
              <span className="text-[#FF612A]">{slide.num}</span>
              <span aria-hidden="true">/</span>
              <span>{slide.topic}</span>
            </p>

            <p className="mt-5 text-[17px] font-medium leading-relaxed text-[#12314d] md:text-[19px]">
              {slide.ciso.text}{' '}
              <span className="ml-1 inline-block rounded-full bg-[#003C64]/8 px-3 py-0.5 align-baseline text-[12.5px] font-semibold text-[#003C64]">
                {slide.ciso.tag}
              </span>
            </p>

            <p className="mt-4 text-[17px] font-medium leading-relaxed text-[#12314d] md:text-[19px]">
              {slide.coo.text}{' '}
              <span className="ml-1 inline-block rounded-full bg-[#FF612A]/12 px-3 py-0.5 align-baseline text-[12.5px] font-semibold text-[#b8451d]">
                {slide.coo.tag}
              </span>
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-border/50 pt-5">
          <div className="flex flex-wrap items-center gap-2">
            {OT_SLIDES.map((entry, i) => (
              <button
                aria-label={`Go to slide ${entry.num}: ${entry.topic}`}
                aria-pressed={i === index}
                className={`inline-flex h-8 min-w-8 items-center justify-center rounded-lg px-2.5 text-[11.4px] font-semibold transition-all ${
                  i === index
                    ? 'bg-[#FF612A] text-white'
                    : 'bg-[#003C64]/6 text-[#003C64]/60 hover:bg-[#003C64]/10 hover:text-[#003C64]'
                }`}
                key={entry.num}
                onClick={() => go(i)}
                type="button"
              >
                {entry.num}
              </button>
            ))}
          </div>
          <p className="text-[11.4px] text-muted-foreground">Arrow keys or swipe. Click a slide to enlarge it.</p>
        </div>
      </div>

      {zoom ? (
        <div
          aria-label={zoom.caption}
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#04101f]/92 p-6 backdrop-blur-sm"
          onClick={() => setZoom(null)}
          role="dialog"
        >
          <div className="flex max-h-full max-w-4xl flex-col items-center gap-4" onClick={(event) => event.stopPropagation()}>
            <div className="flex w-full items-center justify-between gap-4">
              <p className="text-[11.4px] tracking-[.12em] uppercase text-white/70">{zoom.caption}</p>
              <button
                aria-label="Close enlarged slide"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                onClick={() => setZoom(null)}
                type="button"
              >
                <svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <Image
              alt={zoom.caption}
              className="max-h-[78vh] w-auto rounded-[14px] object-contain"
              height={zoom.image.height}
              src={zoom.image.src}
              width={zoom.image.width}
            />
          </div>
        </div>
      ) : null}
    </section>
  )
}
