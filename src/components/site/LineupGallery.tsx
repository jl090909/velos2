'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'

/**
 * A sideways lineup: a snap-scrolling row of tiles with paddles and a slow auto-advance.
 *
 * The auto-advance exists so a visitor can SEE that the row continues: one tile every 5 seconds,
 * looping back to the start. It stops on hover, on focus, when the tab is hidden, and permanently
 * under prefers-reduced-motion - and it can be paused for good with the button next to the paddles
 * (WCAG 2.2.2: anything that moves on its own needs a pause control).
 *
 * The browser owns scrolling, snapping and momentum; this only reports the edges, scrolls by one
 * tile, and runs the timer. The row is a plain <ul>, so keyboard users get the tiles in DOM order
 * and arrow keys scroll the focused container - no roving focus.
 *
 * The reveal animation is pure CSS (see .lineup-row in globals.css), so the tiles are visible even
 * if this script never loads: it only adds the paddles and the timer.
 */
const ADVANCE_MS = 5000
const GAP_PX = 24

export function LineupGallery({ children, labelId }: { children: ReactNode; labelId: string }) {
  const scroller = useRef<HTMLUListElement>(null)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)
  const [paused, setPaused] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)

  const sync = useCallback(() => {
    const el = scroller.current
    if (!el) return
    // 2px of slack: sub-pixel scroll positions otherwise leave the paddles stuck as enabled.
    setAtStart(el.scrollLeft <= 2)
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 2)
  }, [])

  useEffect(() => {
    sync()
    const el = scroller.current
    if (!el) return
    el.addEventListener('scroll', sync, { passive: true })
    const observer = new ResizeObserver(sync)
    observer.observe(el)
    return () => {
      el.removeEventListener('scroll', sync)
      observer.disconnect()
    }
  }, [sync])

  /** One tile at a time, wrapping to the first tile once the last one is in view. */
  const step = useCallback((direction: 1 | -1) => {
    const el = scroller.current
    if (!el) return
    const first = el.querySelector('li')
    const width = first ? first.getBoundingClientRect().width + GAP_PX : el.clientWidth
    el.scrollBy({ behavior: 'smooth', left: width * direction })
  }, [])

  // The timer only runs when there is something to reveal and nobody is interacting.
  const running = !paused && !hovered && !focused

  useEffect(() => {
    if (!running) return
    if (typeof window === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const id = window.setInterval(() => {
      const el = scroller.current
      if (!el || document.hidden) return
      if (el.scrollWidth <= el.clientWidth + 4) return
      const atEndNow = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4
      if (atEndNow) {
        el.scrollTo({ behavior: 'smooth', left: 0 })
      } else {
        step(1)
      }
    }, ADVANCE_MS)

    return () => window.clearInterval(id)
  }, [running, step])

  const paddle =
    'inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-white/85 text-[#003C64] shadow-[0_1px_2px_rgba(15,23,42,.06)] transition-all hover:border-[#003C64]/40 hover:bg-white disabled:cursor-default disabled:opacity-30 disabled:hover:border-border/70'

  return (
    <div
      onBlurCapture={() => setFocused(false)}
      onFocusCapture={() => setFocused(true)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <ul
        aria-labelledby={labelId}
        className="lineup-row flex snap-x snap-mandatory items-stretch gap-6 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        ref={scroller}
        role="list"
        tabIndex={0}
      >
        {children}
      </ul>

      <div className="mt-7 hidden items-center justify-end gap-3 sm:flex">
        <button
          aria-label={paused ? 'Resume automatic scrolling' : 'Pause automatic scrolling'}
          aria-pressed={paused}
          className="mr-1 inline-flex h-10 items-center gap-2 rounded-full px-3 text-[13.3px] font-medium text-muted-foreground transition-colors hover:text-[#003C64]"
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

        <button aria-label="Previous resources" className={paddle} disabled={atStart} onClick={() => step(-1)} type="button">
          <svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button aria-label="More resources" className={paddle} disabled={atEnd} onClick={() => step(1)} type="button">
          <svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  )
}
