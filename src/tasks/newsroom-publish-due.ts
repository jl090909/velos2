/**
 * Scheduled publication for Newsroom articles.
 *
 * The spec asks for a "reliable existing scheduling mechanism" and the CMS already owns one: Payload's
 * job queue. This task is registered on a one-minute cron, so the queue itself wakes it; nothing here
 * depends on a request arriving, and no second scheduler (cron daemon, queue service) is introduced.
 *
 * On every tick it publishes any DRAFT whose `publishAt` has arrived. It is idempotent:
 *
 *  - it only ever selects drafts, so an already-published story is never touched twice;
 *  - an unpublished story whose `publishAt` moved to the future is simply left alone;
 *  - the public readers apply the same `publishAt <= now` test, so a story that is due while the
 *    queue is between ticks is not shown early, and a story published by this task appears
 *    immediately (the collection's own revalidate hook rebuilds /company/media).
 *
 * Production note: a serverless host has no long-lived process for in-process cron, so the queue must
 * be ticked by the platform (Vercel Cron -> POST /api/payload-jobs/run, or `payload-jobs/run` on a
 * timer). See docs/NEWSROOM.md.
 */

import type { PayloadRequest, TaskConfig } from 'payload'

export const NEWSROOM_PUBLISH_TASK = 'newsroom-publish-due'

/** Upper bound per tick: the queue re-runs a minute later, so a big backlog drains without a spike. */
const BATCH = 50

export const publishDueNewsroomTask: TaskConfig<{
  input: Record<string, never>
  output: { failed: number; published: number; scanned: number }
}> = {
  slug: NEWSROOM_PUBLISH_TASK,
  label: 'Newsroom: publish due articles',
  schedule: [{ cron: '* * * * *', queue: 'default' }],
  inputSchema: [],
  outputSchema: [
    { name: 'published', type: 'number' },
    { name: 'scanned', type: 'number' },
    { name: 'failed', type: 'number' },
  ],
  handler: async ({ req }: { req: PayloadRequest }) => {
    const now = new Date()
    const nowIso = now.toISOString()

    // `draft: true` is what makes drafts visible to a query at all; overrideAccess is required
    // because this runs with no user (the queue is a system actor).
    const { docs } = await req.payload.find({
      collection: 'newsroom-articles',
      depth: 0,
      draft: true,
      limit: BATCH,
      overrideAccess: true,
      pagination: false,
      sort: 'publishAt',
      where: {
        and: [{ publishAt: { less_than_equal: nowIso } }, { schedulePublication: { equals: true } }],
      },
    })

    const due = docs.filter((doc) => (doc as { _status?: string })._status !== 'published')

    let published = 0
    let failed = 0
    for (const doc of due) {
      try {
        await req.payload.update({
          id: doc.id,
          collection: 'newsroom-articles',
          data: { _status: 'published' },
          depth: 0,
          overrideAccess: true,
        })
        published += 1
        req.payload.logger.info(`[newsroom] scheduled publish: ${String((doc as { slug?: string }).slug ?? doc.id)}`)
      } catch (error) {
        failed += 1
        req.payload.logger.error(
          `[newsroom] scheduled publish failed for ${String((doc as { slug?: string }).slug ?? doc.id)}: ` +
            (error instanceof Error ? error.message : String(error)),
        )
      }
    }

    return { output: { failed, published, scanned: docs.length } }
  },
}
