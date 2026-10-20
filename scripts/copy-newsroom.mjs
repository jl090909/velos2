// Copies Newsroom stories from one CMS to another - typically a dev database into production -
// including the images they reference, so the Media page is not blank on the deployed site.
//
//   SOURCE_CMS_URL=http://localhost:3020 CMS_URL=https://velos2.vercel.app node scripts/copy-newsroom.mjs
//
// Why a script and not a database copy: the bodies are Lexical JSON that point at media ids, and ids
// differ between databases. Every referenced image is uploaded to the target first, then the article
// is rewritten with the new ids. Cover images and inline body images both go through that mapping -
// the upload machinery lives in scripts/lib/copy-media.mjs and is shared with the events/press copy.
//
// Safe to re-run: a story whose slug already exists on the target is updated in place.

import 'dotenv/config'

import { api, required } from './cms-http.mjs'
import { buildMediaMap, getJson, loginAt, remapRichText } from './lib/copy-media.mjs'

const SOURCE = (process.env.SOURCE_CMS_URL || 'http://localhost:3020').replace(/\/+$/, '')
const TARGET = (process.env.CMS_URL || required('NEXT_PUBLIC_SERVER_URL')).replace(/\/+$/, '')
const EMAIL = required('SEED_ADMIN_EMAIL')
const PASSWORD = required('SEED_ADMIN_PASSWORD')

const main = async () => {
  console.log(`source ${SOURCE}\ntarget ${TARGET}\n`)
  const sourceToken = await loginAt(SOURCE, EMAIL, PASSWORD)
  const targetToken = await loginAt(TARGET, EMAIL, PASSWORD)

  const sourceArticles = await getJson(SOURCE, '/api/newsroom-articles/?limit=200&depth=0&draft=true', sourceToken)
  const stories = sourceArticles.docs ?? []

  console.log(`1. images (${stories.length} stories on the source)`)
  const map = await buildMediaMap({
    docs: stories,
    source: SOURCE,
    target: TARGET,
    sourceToken,
    targetToken,
    uploadFields: ['coverImage'],
    richFields: ['body'],
  })

  console.log(`\n2. stories`)
  const targetArticles = await getJson(TARGET, '/api/newsroom-articles/?limit=200&depth=0&draft=true', targetToken)
  const targetBySlug = new Map((targetArticles.docs ?? []).map((doc) => [doc.slug, doc]))
  const results = []

  for (const doc of stories) {
    const cover = doc.coverImage
    const coverId = typeof cover === 'object' && cover !== null ? cover.id : cover
    const payload = {
      _status: doc._status ?? 'published',
      authorName: doc.authorName,
      authorRole: doc.authorRole ?? undefined,
      body: remapRichText(doc.body, map),
      category: doc.category,
      coverImage: coverId ? map.get(String(coverId)) ?? null : null,
      coverImageCaption: doc.coverImageCaption ?? undefined,
      featured: doc.featured === true,
      publishAt: doc.publishAt,
      readingTime: doc.readingTime ?? undefined,
      schedulePublication: doc.schedulePublication === true,
      seoDescription: doc.seoDescription ?? undefined,
      seoTitle: doc.seoTitle ?? undefined,
      slug: doc.slug,
      summary: doc.summary,
      tags: (doc.tags ?? []).map((entry) => ({ tag: entry.tag })),
      title: doc.title,
    }
    const existing = targetBySlug.get(doc.slug)
    const response = await api(existing ? 'PATCH' : 'POST', existing ? `/api/newsroom-articles/${existing.id}/` : '/api/newsroom-articles/', {
      body: payload,
      token: targetToken,
    })
    const ok = response.status < 400
    results.push(ok)
    console.log(`  ${ok ? (existing ? 'updated ' : 'created ') : 'FAILED  '} ${doc.slug} [${doc.category}] HTTP ${response.status}`)
    if (!ok) {
      console.log('   ', JSON.stringify(response.body).slice(0, 300))
    }
  }

  const after = await getJson(TARGET, '/api/newsroom-articles/?limit=200&depth=0', targetToken)
  console.log(`\n3. result`)
  console.log(`  published stories on the target: ${after.totalDocs ?? 0}`)
  console.log(`  ${results.filter(Boolean).length}/${results.length} stories copied, ${map.size} images mapped`)
  if (results.some((ok) => !ok)) {
    process.exit(1)
  }
}

main().catch((error) => {
  console.error('copy-newsroom failed:', error.message)
  process.exit(1)
})
