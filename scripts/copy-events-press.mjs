// Copies Events and Press mentions from one CMS to another (dev -> production), with their images.
//
//   SOURCE_CMS_URL=http://localhost:3020 CMS_URL=https://velos2.vercel.app node scripts/copy-events-press.mjs
//
// The Media page was empty in production for the same reason these were: the rows only ever existed in
// the dev database. Events are matched by slug and press mentions by outlet + headline, so re-running
// updates rather than duplicates.

import 'dotenv/config'

import { api, required } from './cms-http.mjs'
import { buildMediaMap, getJson, loginAt, remapRichText } from './lib/copy-media.mjs'

const SOURCE = (process.env.SOURCE_CMS_URL || 'http://localhost:3020').replace(/\/+$/, '')
const TARGET = (process.env.CMS_URL || required('NEXT_PUBLIC_SERVER_URL')).replace(/\/+$/, '')
const EMAIL = required('SEED_ADMIN_EMAIL')
const PASSWORD = required('SEED_ADMIN_PASSWORD')

const uploadId = (map, value) => {
  const id = typeof value === 'object' && value !== null ? value.id : value
  return id ? map.get(String(id)) ?? null : null
}

const main = async () => {
  console.log(`source ${SOURCE}\ntarget ${TARGET}\n`)
  const sourceToken = await loginAt(SOURCE, EMAIL, PASSWORD)
  const targetToken = await loginAt(TARGET, EMAIL, PASSWORD)

  const [sourceEvents, sourcePress] = await Promise.all([
    getJson(SOURCE, '/api/events/?limit=200&depth=0&draft=true', sourceToken),
    getJson(SOURCE, '/api/press-mentions/?limit=200&depth=0&draft=true', sourceToken),
  ])
  const events = sourceEvents.docs ?? []
  const press = sourcePress.docs ?? []

  console.log(`1. images (${events.length} events, ${press.length} press mentions)`)
  const map = await buildMediaMap({
    docs: [...events, ...press],
    source: SOURCE,
    target: TARGET,
    sourceToken,
    targetToken,
    uploadFields: ['coverImage', 'logo'],
    richFields: ['description'],
  })

  console.log('\n2. events')
  const targetEvents = await getJson(TARGET, '/api/events/?limit=200&depth=0&draft=true', targetToken)
  const eventBySlug = new Map((targetEvents.docs ?? []).map((doc) => [doc.slug, doc]))
  const results = []
  for (const doc of events) {
    const payload = {
      _status: doc._status ?? 'published',
      booth: doc.booth ?? undefined,
      city: doc.city,
      country: doc.country,
      coverImage: uploadId(map, doc.coverImage),
      coverImageCaption: doc.coverImageCaption ?? undefined,
      description: remapRichText(doc.description, map),
      endDate: doc.endDate ?? undefined,
      eventType: doc.eventType,
      registrationUrl: doc.registrationUrl ?? undefined,
      slug: doc.slug,
      startDate: doc.startDate,
      summary: doc.summary,
      title: doc.title,
      venue: doc.venue,
      websiteUrl: doc.websiteUrl ?? undefined,
    }
    const existing = eventBySlug.get(doc.slug)
    const response = await api(existing ? 'PATCH' : 'POST', existing ? `/api/events/${existing.id}/` : '/api/events/', {
      body: payload,
      token: targetToken,
    })
    const ok = response.status < 400
    results.push(ok)
    console.log(`  ${ok ? (existing ? 'updated ' : 'created ') : 'FAILED  '} ${doc.slug} [${doc.eventType}] HTTP ${response.status}`)
    if (!ok) {
      console.log('   ', JSON.stringify(response.body).slice(0, 300))
    }
  }

  console.log('\n3. press mentions')
  const targetPress = await getJson(TARGET, '/api/press-mentions/?limit=200&depth=0&draft=true', targetToken)
  const key = (doc) => `${doc.outlet}||${doc.headline}`
  const pressByKey = new Map((targetPress.docs ?? []).map((doc) => [key(doc), doc]))
  for (const doc of press) {
    const payload = {
      _status: doc._status ?? 'published',
      coverImage: uploadId(map, doc.coverImage),
      coverImageCaption: doc.coverImageCaption ?? undefined,
      excerpt: doc.excerpt ?? undefined,
      headline: doc.headline,
      kind: doc.kind,
      logo: uploadId(map, doc.logo),
      outlet: doc.outlet,
      publishedDate: doc.publishedDate,
      url: doc.url,
    }
    const existing = pressByKey.get(key(doc))
    const response = await api(existing ? 'PATCH' : 'POST', existing ? `/api/press-mentions/${existing.id}/` : '/api/press-mentions/', {
      body: payload,
      token: targetToken,
    })
    const ok = response.status < 400
    results.push(ok)
    console.log(`  ${ok ? (existing ? 'updated ' : 'created ') : 'FAILED  '} ${doc.outlet}: ${doc.headline.slice(0, 50)} HTTP ${response.status}`)
    if (!ok) {
      console.log('   ', JSON.stringify(response.body).slice(0, 300))
    }
  }

  const afterEvents = await getJson(TARGET, '/api/events/?limit=200&depth=0', targetToken)
  const afterPress = await getJson(TARGET, '/api/press-mentions/?limit=200&depth=0', targetToken)
  console.log('\n4. result')
  console.log(`  events on the target:         ${afterEvents.totalDocs ?? 0}`)
  console.log(`  press mentions on the target: ${afterPress.totalDocs ?? 0}`)
  console.log(`  ${results.filter(Boolean).length}/${results.length} records copied, ${map.size} images mapped`)
  if (results.some((ok) => !ok)) {
    process.exit(1)
  }
}

main().catch((error) => {
  console.error('copy-events-press failed:', error.message)
  process.exit(1)
})
