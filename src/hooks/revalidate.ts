import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

type Options = {
  paths: string[]
  slugPrefixes?: string[]
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

/**
 * Publishes a CMS edit to the static site immediately.
 *
 * Loaded through a dynamic import so collection configs stay importable outside the Next runtime,
 * and wrapped in try/catch because revalidation is best-effort: every page also carries a
 * time-based revalidate window, so a failure here only delays the update.
 */
export const revalidateOnChange = ({
  paths,
  slugPrefixes = [],
}: Options): {
  afterChange: CollectionAfterChangeHook[]
  afterDelete: CollectionAfterDeleteHook[]
} => {
  const run = async (doc: unknown): Promise<void> => {
    try {
      const { revalidatePath } = await import('next/cache')
      for (const path of paths) {
        revalidatePath(path)
      }
      const slug = isRecord(doc) && typeof doc.slug === 'string' ? doc.slug : null
      if (slug) {
        for (const prefix of slugPrefixes) {
          revalidatePath(`${prefix}${slug}`)
        }
      }
    } catch (error) {
      console.warn('[cms] revalidatePath skipped:', error instanceof Error ? error.message : error)
    }
  }

  const afterChange: CollectionAfterChangeHook = async ({ doc }) => {
    await run(doc)
    return doc
  }

  const afterDelete: CollectionAfterDeleteHook = async ({ doc }) => {
    await run(doc)
  }

  return { afterChange: [afterChange], afterDelete: [afterDelete] }
}
