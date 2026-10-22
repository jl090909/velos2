'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'

/**
 * A sideways lineup: a snap-scrolling row of tiles with paddle controls.
 *
 * Deliberately thin. The browser owns scrolling, snapping and momentum; this only reports whether
 * there is anything left to scroll so the paddles can disable themselves, and scrolls by one tile
 * per click. The row is a plain <ul>, so keyboard users get the tiles in DOM order and arrow keys
 * scroll the focused container - no roving focus, no aria-live chatter.
 *
 * The reveal animation is pure CSS (see .lineup-row in globals.css), so the tiles are visible even
 * if this script never loads: it only adds the paddles.
 */
export function LineupGallery({ children, labelId }: { children: ReactNode; labelId: string }) {
  const scroller = useRef<HTMLUListElement>(null)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)

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

  const jump = (direction: 1 | -1) => {
    const el = scroller.current
    if (!el) return
    const first = el.querySelector('li')
    const step = first ? first.getBoundingClientRect().width + 24 : el.clientWidth
    el.scrollBy({ behavior: 'smooth', left: step * direction })
  }

  const paddle =
    'inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-white/85 text-[#003C64] shadow-[0_1px_2px_rgba(15,23,42,.06)] transition-all hover:border-[#003C64]/40 hover:bg-white disabled:cursor-default disabled:opacity-30 disabled:hover:border-border/70'

  return (
    <div>
      <ul
        aria-labelledby={labelId}
        className="lineup-row flex snap-x snap-mandatory items-stretch gap-6 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        ref={scroller}
        role="list"
        tabIndex={0}
      >
        {children}
      </ul>

      <div className="mt-7 hidden justify-end gap-3 sm:flex">
        <button aria-label="Previous resources" className={paddle} disabled={atStart} onClick={() => jump(-1)} type="button">
          <svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button aria-label="More resources" className={paddle} disabled={atEnd} onClick={() => jump(1)} type="button">
          <svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  )
}
