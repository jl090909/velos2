import { postgresAdapter } from '@payloadcms/db-postgres'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
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
import { PressMentions } from './collections/PressMentions'
import { Users } from './collections/Users'
import { Whitepapers } from './collections/Whitepapers'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const serverURL =
  process.env.PAYLOAD_PUBLIC_SERVER_URL ||
  process.env.NEXT_PUBLIC_SERVER_URL ||
  'http://localhost:3020'

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: ' - Velos Shield CMS',
    },
  },
  collections: [
    Users,
    Media,
    Jobs,
    Whitepapers,
    KnowledgeHubArticles,
    Customers,
    Events,
    PressMentions,
  ],
  cors: [serverURL],
  csrf: [serverURL],
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  editor: lexicalEditor(),
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
