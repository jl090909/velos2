import Link from 'next/link'

import { NEWSROOM_CATEGORIES, categorySlug } from '@/lib/newsroom-meta'

/**
 * Category filtering + article search.
 *
 * Both are plain links and one GET form, so the Newsroom index stays a server-rendered page: the
 * filtered view is a URL (/company/media/?category=product-news&q=uptime), it is shareable, and it
 * needs no client JavaScript. Drafts can never appear in either result set - the reader filters them.
 */

const listHref = (category: string | null, query: string): string => {
  const params = new URLSearchParams()
  if (category) {
    params.set('category', categorySlug(category))
  }
  if (query.trim().length > 0) {
    params.set('q', query.trim())
  }
  const search = params.toString()
  return search.length > 0 ? `/company/media/?${search}` : '/company/media/'
}

export function NewsroomFilters({
  activeCategory,
  activeQuery,
  resultCount,
}: {
  activeCategory: string | null
  activeQuery: string
  resultCount?: number
}) {
  const filtered = Boolean(activeCategory) || activeQuery.trim().length > 0

  return (
    <div className="rounded-[1.35rem] border border-white/55 bg-[linear-gradient(180deg,rgba(255,255,255,.98)_0%,rgba(247,247,249,.95)_100%)] p-5 shadow-[0_1px_3px_rgba(15,23,42,.04)]">
      <div className="flex flex-wrap items-center gap-2">
        <Link
          className={`inline-flex items-center rounded-full px-4 py-2 text-[13px] font-medium no-underline transition-all ${
            activeCategory
              ? 'border border-border/70 text-muted-foreground hover:border-[#003C64]/40 hover:text-[#003C64]'
              : 'bg-[linear-gradient(180deg,#003C64_0%,#002640_100%)] text-[#FF612A]'
          }`}
          href={listHref(null, activeQuery)}
        >
          All
        </Link>
        {NEWSROOM_CATEGORIES.map((category) => {
          const active = activeCategory === category
          return (
            <Link
              key={category}
              className={`inline-flex items-center rounded-full px-4 py-2 text-[13px] font-medium no-underline transition-all ${
                active
                  ? 'bg-[linear-gradient(180deg,#003C64_0%,#002640_100%)] text-[#FF612A]'
                  : 'border border-border/70 text-muted-foreground hover:border-[#003C64]/40 hover:text-[#003C64]'
              }`}
              href={listHref(category, activeQuery)}
            >
              {category}
            </Link>
          )
        })}
      </div>

      <form action="/company/media/" className="mt-4 flex flex-wrap items-center gap-3" method="get" role="search">
        {activeCategory ? <input name="category" type="hidden" value={categorySlug(activeCategory)} /> : null}
        <label className="sr-only" htmlFor="newsroom-search">
          Search the Newsroom
        </label>
        <input
          className="h-11 min-w-[220px] flex-1 rounded-full border border-border/70 bg-white px-5 text-sm text-[#003C64] outline-none transition-colors placeholder:text-muted-foreground focus:border-[#003C64]/50"
          defaultValue={activeQuery}
          id="newsroom-search"
          name="q"
          placeholder="Search stories, topics, authors"
          type="search"
        />
        <button
          className="inline-flex h-11 items-center justify-center rounded-full bg-[linear-gradient(180deg,#0f5c8f_0%,#003C64_48%,#002640_100%)] px-6 text-sm font-semibold text-[#FF612A] transition-all hover:bg-[linear-gradient(180deg,#ff8a4d_0%,#FF612A_48%,#e04f0a_100%)] hover:text-[#002640]"
          type="submit"
        >
          Search
        </button>
        {filtered ? (
          <Link className="text-sm text-muted-foreground no-underline hover:text-[#003C64]" href="/company/media/">
            Clear
          </Link>
        ) : null}
        {filtered && typeof resultCount === 'number' ? (
          <span className="text-sm text-muted-foreground">
            {resultCount} {resultCount === 1 ? 'story' : 'stories'}
          </span>
        ) : null}
      </form>
    </div>
  )
}
