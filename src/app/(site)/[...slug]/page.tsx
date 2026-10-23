import { notFound } from 'next/navigation'

/**
 * Catch-all so unknown URLs render the branded 404 inside the site chrome.
 *
 * A not-found.tsx inside a route group only covers paths that group owns, so an unmatched
 * top-level URL was falling through to Next's bare default page. Every more specific route -
 * static or dynamic - still wins over this catch-all; only genuine misses land here.
 */
export default function CatchAll(): never {
  notFound()
}
