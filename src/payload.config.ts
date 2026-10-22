import { postgresAdapter } from '@payloadcms/db-postgres'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { BlocksFeature, FixedToolbarFeature, lexicalEditor, UploadFeature } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { hasRoleReq } from './access'

import { Customers } from './collections/Customers'
import { Events } from './collections/Events'
import { Jobs } from './collections/Jobs'
import { KnowledgeHubArticles } from './collections/KnowledgeHubArticles'
import { Media } from './collections/Media'
import { NewsroomArticles } from './collections/NewsroomArticles'
import { PressMentions } from './collections/PressMentions'
import { Users } from './collections/Users'
import { Whitepapers } from './collections/Whitepapers'

import { videoEmbedBlock } from './lib/newsroom-video'
import { publishDueNewsroomTask } from './tasks/newsroom-publish-due'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const serverURL =
  process.env.PAYLOAD_PUBLIC_SERVER_URL ||
  process.env.NEXT_PUBLIC_SERVER_URL ||
  'http://localhost:3020'

/**
 * Every host that serves this app needs to be in the allowlist: Payload rejects admin reads and
 * writes whose Origin is not listed, so a site reachable at the apex, at www and at its
 * *.vercel.app alias must list all three or /admin silently 403s on two of them.
 */
const allowedOrigins = [
  serverURL,
  'https://www.velosshield.com',
  'https://veloshield-dreamhost.vercel.app',
]

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: ' - Velos Shield CMS',
    },
    /**
     * The Newsroom desk: /admin/newsroom/ lists every story (drafts included) with its category,
     * derived status, dates and the edit / preview / publish / unpublish actions. Registered as a
     * custom view so the URL the spec names is the URL the team uses.
     */
    components: {
      views: {
        newsroom: {
          Component: '/components/admin/NewsroomDashboard#NewsroomDashboard',
          exact: true,
          meta: { title: 'Newsroom' },
          path: '/newsroom',
        },
      },
    },
  },
  collections: [
    Users,
    Media,
    NewsroomArticles,
    Jobs,
    Whitepapers,
    KnowledgeHubArticles,
    Customers,
    Events,
    PressMentions,
  ],
  cors: allowedOrigins,
  csrf: allowedOrigins,
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  editor: lexicalEditor({
    /**
     * The newsroom body needs more than paragraphs: an editor must be able to drop in inline images
     * (uploaded to the same `media` collection, alt text included) and an embedded video without a
     * developer. Both are DATA - nothing is rendered as raw HTML (see src/lib/newsroom-video.ts).
     */
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
      FixedToolbarFeature(),
      UploadFeature({ enabledCollections: ['media'] }),
      BlocksFeature({ blocks: [videoEmbedBlock] }),
    ],
  }),
  /**
   * Scheduled publication (spec Phase 4.6) reuses Payload's job queue rather than adding a scheduler:
   * the task in src/tasks/newsroom-publish-due.ts runs on a one-minute cron and publishes any draft
   * whose `publishAt` has arrived. `autoRun` wakes the queue in-process (skipped during `next build`
   * by Payload itself); a serverless deployment ticks it from the platform instead - docs/NEWSROOM.md.
   */
  jobs: {
    /**
     * The queue endpoint is the tick a serverless platform calls, and that call carries no session.
     * Payload's default is "any logged-in user", which is too loose for an endpoint a cron hits:
     * accept a Bearer PAYLOAD_CRON_SECRET when one is configured, otherwise require an admin/tech
     * session. Nothing here widens access to article content - the publisher only publishes stories
     * that are already due and already marked for scheduling.
     */
    access: {
      run: ({ req }) => {
        const secret = process.env.PAYLOAD_CRON_SECRET
        const bearer = req.headers?.get?.('authorization')
        if (secret && bearer === `Bearer ${secret}`) {
          return true
        }
        return hasRoleReq(req, 'admin', 'tech')
      },
    },
    autoRun: [{ cron: '* * * * *', limit: 10, queue: 'default' }],
    tasks: [publishDueNewsroomTask],
  },
  secret: process.env.PAYLOAD_SECRET || '',
  serverURL,
  plugins: [
    /**
     * Object storage for uploads.
     *
     * Vercel's filesystem is ephemeral, so uploads must live in a blob store in production. The plugin
     * disables itself when the token is absent (its documented behaviour), which means local development
     * keeps writing to /media and needs no cloud credentials. `alwaysInsertFields` keeps the collection
     * schema identical in both environments so the database does not drift.
     *
     * `clientUploads` sends files straight from the browser to the blob store, bypassing the 4.5MB request
     * limit that applies to Vercel Functions - whitepaper PDFs are routinely larger than that.
     */
    vercelBlobStorage({
      // addRandomSuffix must stay false: with it on, the adapter renames the stored object but the
      // document's `url` is still generated from the original filename, so every uploaded file 404s
      // (the bytes are in the store under a different key). Verified by scripts/verify-uploads.mjs.
      addRandomSuffix: false,
      alwaysInsertFields: true,
      // How long the edge may serve a proxied upload. The plugin defaults to a year, which means a
      // replaced logo keeps being served from cache long after the document changed, and a deleted
      // file keeps resolving until the TTL expires. One hour is the safer default for CMS media.
      cacheControlMaxAge: Number(process.env.BLOB_CACHE_MAX_AGE_SECONDS ?? 3600),
      clientUploads: {
        access: ({ req }) => hasRoleReq(req, 'admin', 'hr', 'tech'),
      },
      collections: { media: true },
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
  ],
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
