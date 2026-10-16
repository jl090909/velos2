import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Normalise a pathname for comparison.
 *
 * `trailingSlash: true` makes `usePathname()` return `/product/` while link
 * hrefs are written `/product`, so a naive `===` never matches and active
 * states silently never render.
 */
export function normalizePath(pathname: string | null | undefined): string {
  const trimmed = (pathname ?? '').replace(/\/+$/, '')
  return trimmed === '' ? '/' : trimmed
}
