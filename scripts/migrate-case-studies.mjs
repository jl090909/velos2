// Moves the two customer case studies and the hand-built Airport BMS case study page into the
// "Whitepapers & case studies" collection, so every long-form story is edited in one place.
//
//   node scripts/migrate-case-studies.mjs          # idempotent: only fills what is empty
//   node scripts/migrate-case-studies.mjs --force  # rewrite the bodies from source
//
// What it does, per step:
//   1. Customers with a legacy `caseStudy` rich-text body get a matching `whitepapers` record
//      (kind = Case Study, same slug, body copied verbatim) and are linked through `caseStudyDoc`.
//   2. The Airport BMS case study, previously a hand-written React page, gets its body as CMS
//      rich text on the record that already existed (kind = Case Study).
//   3. Prints the public URL of each migrated story and fails if one does not answer 200.
//
// Nothing is deleted: the legacy `customers.caseStudy` field keeps its data (hidden in the admin).

import 'dotenv/config'

import { api, login, required } from './cms-http.mjs'
import { AIRPORT_BODY } from './data/airport-bms-body.mjs'


const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || required('SEED_ADMIN_EMAIL')
const ADMIN_PASSWORD = required('SEED_ADMIN_PASSWORD')
const FORCE = process.argv.includes('--force')

// ------------------------------------------------------------------ helpers
const FIND = async (collection, slug, token) => {
  const { body } = await api('GET', `/api/${collection}/?where[slug][equals]=${encodeURIComponent(slug)}&limit=1&depth=0`, { token })
  return body?.docs?.[0] ?? null
}

const upsert = async (slug, data, token, label) => {
  const existing = await FIND('whitepapers', slug, token)
  if (existing) {
    const patch = { ...data }
    if (!FORCE) {
      // keep an editor's work: only fill fields that are still empty, and never re-date a record
      // (publishedDate drives the library order, so a re-run must not push a story back to the top)
      for (const key of ['body', 'sector', 'region', 'quote', 'quoteAuthor', 'quoteRole', 'publishedDate']) {
        if (key === 'publishedDate' || (existing[key] !== undefined && existing[key] !== null && existing[key] !== '')) {
          delete patch[key]
        }
      }
    }
    const { body } = await api('PATCH', `/api/whitepapers/${existing.id}/`, { body: patch, expect: 200, token })
    console.log(`  updated  ${label} (id ${existing.id})`)
    return body?.doc ?? body ?? existing
  }
  const { body } = await api('POST', '/api/whitepapers/', { body: { ...data, _status: 'published' }, token })
  if (!body?.doc && !body?.id) {
    throw new Error(`create failed for ${slug}: ${JSON.stringify(body).slice(0, 400)}`)
  }
  console.log(`  created  ${label} (id ${(body.doc ?? body).id})`)
  return body.doc ?? body
}

const assertPublic = async (path, needle) => {
  const response = await fetch(`${process.env.CMS_URL || process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3020'}${path}`, {
    cache: 'no-store',
    redirect: 'follow',
  })
  const html = await response.text()
  const ok = response.status === 200 && html.includes(needle)
  console.log(`  ${ok ? 'OK  ' : 'FAIL'} ${path} (HTTP ${response.status}, contains "${needle}": ${html.includes(needle)})`)
  return ok
}

// ------------------------------------------------------------------ run
const { token } = await login(ADMIN_EMAIL, ADMIN_PASSWORD)

console.log('\n1. Customer case studies -> Whitepapers & case studies')
const { body: customerBody } = await api('GET', '/api/customers/?limit=100&depth=0', { token })
const customers = customerBody?.docs ?? []
let moved = 0

for (const customer of customers) {
  if (!customer.caseStudy) {
    continue
  }
  const record = await upsert(
    customer.slug,
    {
      title: customer.name,
      slug: customer.slug,
      kind: 'Case Study',
      summary: customer.summary,
      body: customer.caseStudy,
      sector: customer.sector || undefined,
      region: customer.region || undefined,
      quote: customer.quote || undefined,
      quoteAuthor: customer.quoteAuthor || undefined,
      quoteRole: customer.quoteRole || undefined,
      readOnlinePath: `/resources/${customer.slug}`,
      publishedDate: customer.updatedAt || new Date().toISOString(),
    },
    token,
    `case study "${customer.name}"`,
  )

  if (String(customer.caseStudyDoc ?? '') !== String(record.id)) {
    await api('PATCH', `/api/customers/${customer.id}/`, {
      body: { caseStudyDoc: record.id },
      expect: 200,
      token,
    })
    console.log(`  linked   customer ${customer.slug} -> whitepaper ${record.id}`)
  } else {
    console.log(`  linked   customer ${customer.slug} already points at ${record.id}`)
  }
  moved += 1
}

console.log(`\n2. Airport BMS case study body (${FORCE ? 'force' : 'fill empty only'})`)
const airport = await FIND('whitepapers', 'airport-bms-cybersecurity-case-study', token)
if (!airport) {
  throw new Error('the airport-bms-cybersecurity-case-study record is missing; run `npm run seed` first')
}
await upsert(
  'airport-bms-cybersecurity-case-study',
  {
    body: AIRPORT_BODY,
    sector: 'Airport Operations - Building Management Systems',
    region: 'United Kingdom',
    readOnlinePath: '/resources/airport-bms-cybersecurity-case-study',
    kind: 'Case Study',
  },
  token,
  'Airport BMS case study',
)

console.log(`\n3. Public pages`)
const checks = [
  ['/resources/heathrow-airport/', 'Heathrow'],
  ['/resources/maersk/', 'Maersk'],
  ['/resources/airport-bms-cybersecurity-case-study/', 'Building Management Systems'],
  ['/customers/heathrow-airport/', 'Heathrow'],
]
const results = []
for (const [path, needle] of checks) {
  results.push(await assertPublic(path, needle))
}

console.log(`\n${moved} customer case studies migrated. ${results.every(Boolean) ? 'All pages verified.' : 'SOME PAGES FAILED.'}`)
process.exit(results.every(Boolean) ? 0 : 1)
