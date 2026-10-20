// Proves that case studies are editable in "Whitepapers & case studies" and that the public pages
// follow an editor's change. Self-cleaning: everything it creates, it deletes.
//
//   node scripts/verify-case-studies.mjs    (server must be running)
//
// Checks:
//   1. the migrated stories answer at /resources/<slug>/ and their body renders
//   2. /customers/<slug>/ is a permanent redirect to the story, not a duplicate page
//   3. a record with no body has no page (404) - a card is not a page
//   4. a DRAFT with a body 404s for the public, and publishing it makes the page appear
//   5. an edit made through the API (what the admin sends) shows on the public page on the next
//      request, which is the revalidatePath hook doing its job

import 'dotenv/config'

import { api, BASE_URL, bullets, heading, login, para, required } from './cms-http.mjs'

const ADMIN_EMAIL = required('SEED_ADMIN_EMAIL')
const ADMIN_PASSWORD = required('SEED_ADMIN_PASSWORD')
const TECH_EMAIL = process.env.SEED_TECH_EMAIL
const TECH_PASSWORD = process.env.SEED_TECH_PASSWORD

const results = []
const check = (name, ok, detail = '') => {
  results.push({ detail, name, ok })
  console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ` - ${detail}` : ''}`)
}

const page = async (path) => {
  const response = await fetch(`${BASE_URL}${path}`, { cache: 'no-store', redirect: 'manual' })
  return { html: await response.text(), status: response.status }
}

const { token: adminToken } = await login(ADMIN_EMAIL, ADMIN_PASSWORD)

console.log('\n1. Migrated stories render from the library')
const heathrow = await page('/resources/heathrow-airport/')
check('/resources/heathrow-airport/ is 200', heathrow.status === 200, `HTTP ${heathrow.status}`)
check('the Heathrow body renders', heathrow.html.includes('Europe&#x27;s busiest hub airport') || heathrow.html.includes("Europe's busiest hub airport"))
check('the at-a-glance box renders', heathrow.html.includes('At a glance'))

const maersk = await page('/resources/maersk/')
check('/resources/maersk/ is 200', maersk.status === 200, `HTTP ${maersk.status}`)

const airport = await page('/resources/airport-bms-cybersecurity-case-study/')
check('/resources/airport-bms-cybersecurity-case-study/ is 200', airport.status === 200, `HTTP ${airport.status}`)
check('the Airport BMS body renders headings', airport.html.includes('turning telemetry into decisions'))

console.log('\n2. /customers/<slug>/ redirects instead of duplicating')
const redirect = await page('/customers/heathrow-airport/')
check(
  '/customers/heathrow-airport/ is a permanent redirect',
  redirect.status === 308 || redirect.status === 301,
  `HTTP ${redirect.status}`,
)
const target = await fetch(`${BASE_URL}/customers/heathrow-airport/`, { redirect: 'follow' })
check('the redirect lands on the story', target.url.endsWith('/resources/heathrow-airport/'), target.url)

console.log('\n3. A record without a body has no page')
const noBody = await page('/resources/brochure/')
check('/resources/brochure/ 404s (card only)', noBody.status === 404, `HTTP ${noBody.status}`)

console.log('\n4. Drafts stay private, publishing publishes')
const stamp = Date.now()
const slug = `case-study-verification-${stamp}`
const title = `Case study verification ${stamp}`
const body = {
  root: {
    children: [
      heading('A heading only an editor could write'),
      para(`Marker ${stamp} - this record was created by verify-case-studies.mjs.`),
      bullets(['first point', 'second point']),
    ],
    direction: 'ltr',
    format: '',
    indent: 0,
    type: 'root',
    version: 1,
  },
}
const create = await api('POST', '/api/whitepapers/', {
  body: {
    _status: 'draft',
    body,
    kind: 'Case Study',
    publishedDate: new Date().toISOString(),
    region: 'Test region',
    sector: 'Test sector',
    slug,
    summary: 'Verification record - safe to delete.',
    title,
  },
  token: adminToken,
})
const record = create.body?.doc ?? create.body
if (!record?.id) {
  check('create a draft case study', false, JSON.stringify(create.body).slice(0, 200))
  process.exit(1)
}
console.log(`  (draft id ${record.id})`)
check('the draft has no public page', (await page(`/resources/${slug}/`)).status === 404)

await api('PATCH', `/api/whitepapers/${record.id}/`, {
  body: { _status: 'published' },
  expect: 200,
  token: adminToken,
})
const published = await page(`/resources/${slug}/`)
check('the published story has a page', published.status === 200, `HTTP ${published.status}`)
check('the body renders on the page', published.html.includes(`Marker ${stamp}`))
check('the rich-text heading renders', published.html.includes('A heading only an editor could write'))

console.log('\n5. An editor change reaches the public page')
const editor = TECH_EMAIL && TECH_PASSWORD ? await login(TECH_EMAIL, TECH_PASSWORD) : { token: adminToken }
const editedTitle = `${title} (edited)`
await api('PATCH', `/api/whitepapers/${record.id}/`, {
  body: { title: editedTitle },
  expect: 200,
  token: editor.token,
})
const afterEdit = await page(`/resources/${slug}/`)
check('tech can edit a case study', afterEdit.html.includes(editedTitle), `HTTP ${afterEdit.status}`)

console.log('\n6. Clean up')
const removed = await api('DELETE', `/api/whitepapers/${record.id}/`, { token: adminToken })
check('the verification record is deleted', removed.status === 200 || removed.status === 204, `HTTP ${removed.status}`)
check('its page is gone again', (await page(`/resources/${slug}/`)).status === 404)

const failed = results.filter((result) => !result.ok)
console.log(`\n${results.length - failed.length}/${results.length} checks passed`)
if (failed.length > 0) {
  for (const result of failed) {
    console.log(`  FAILED: ${result.name} ${result.detail}`)
  }
  process.exit(1)
}
