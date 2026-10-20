'use client'

import { useEffect, useRef } from 'react'

/**
 * The site's ambient backdrop.
 *
 * Apple's pages never sit on flat white: content floats over a very faint, fixed layer of colour that
 * stays put while the page scrolls (their tiles are #fbfbfd / #f5f5f7 plates over it, and the header is
 * frosted glass). This reproduces that idea with the Velos palette - navy, steel and a hint of ember -
 * at low alpha, plus a hairline grid and a fine grain so large empty areas read as material instead of
 * blank paper.
 *
 * Rules it keeps:
 * - fixed and aria-hidden, so it never affects layout, contrast of body copy (it is < 6% colour) or
 *   screen readers
 * - one rAF-throttled scroll listener that writes a single CSS variable; all motion is transform-only,
 *   so it stays on the compositor
 * - prefers-reduced-motion: no listener, no drift, the blobs simply sit still
 */

export function AmbientBackground() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) {
      return
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    let frame = 0
    const update = () => {
      frame = 0
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      const progress = scrollable > 0 ? Math.min(1, window.scrollY / scrollable) : 0
      node.style.setProperty('--ambient-progress', progress.toFixed(4))
    }
    const onScroll = () => {
      if (!frame) {
        frame = requestAnimationFrame(update)
      }
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) {
        cancelAnimationFrame(frame)
      }
    }
  }, [])

  return (
    <div aria-hidden className="ambient" ref={ref}>
      <div className="ambient__grid" />
      <div className="ambient__blob ambient__blob--navy" />
      <div className="ambient__blob ambient__blob--steel" />
      <div className="ambient__blob ambient__blob--ember" />
      <div className="ambient__grain" />
    </div>
  )
}
