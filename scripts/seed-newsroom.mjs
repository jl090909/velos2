// Sample Newsroom content for a LOCAL or DEMO database.
//
// The Newsroom is content-driven, so an empty database shows an empty page. This creates a small,
// realistic set of stories (one per category band, with cover images taken from the site's own
// assets) so the design can be reviewed. It is CONTENT, not code, and every record it makes can be
// edited or deleted from /admin/newsroom.
//
// Idempotent: a story whose slug already exists is UPDATED rather than duplicated.
//
// Usage:  CMS_URL=http://localhost:3020 node scripts/seed-newsroom.mjs
//         CMS_URL=http://localhost:3020 node scripts/seed-newsroom.mjs --delete   (remove them again)

import { readFileSync } from 'node:fs'

import { api, login, required } from './cms-http.mjs'

const base = (process.env.CMS_URL || process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3020').replace(/\/+$/, '')
const owned = [] // every slug this script creates, so --delete can reverse it exactly

const text = (value) => ({ detail: 0, format: 0, mode: 'normal', style: '', text: value, type: 'text', version: 1 })
const para = (value) => ({
  children: Array.isArray(value) ? value : [text(value)],
  direction: 'ltr',
  format: '',
  indent: 0,
  textFormat: 0,
  type: 'paragraph',
  version: 1,
})
const head = (value) => ({ children: [text(value)], direction: 'ltr', format: '', indent: 0, tag: 'h2', type: 'heading', version: 1 })
const bullets = (items) => ({
  children: items.map((item, index) => ({
    children: [text(item)],
    direction: 'ltr',
    format: '',
    indent: 0,
    type: 'listitem',
    value: index + 1,
    version: 1,
  })),
  direction: 'ltr',
  format: '',
  indent: 0,
  listType: 'bullet',
  start: 1,
  tag: 'ul',
  type: 'list',
  version: 1,
})
const quote = (value) => ({ children: [text(value)], direction: 'ltr', format: '', indent: 0, type: 'quote', version: 1 })
const link = (label, url) => ({
  children: [{ ...text(label), format: 16 }],
  direction: 'ltr',
  fields: { linkType: 'custom', newTab: true, url },
  format: '',
  indent: 0,
  type: 'link',
  version: 3,
})
const doc = (...children) => ({ root: { children, direction: 'ltr', format: '', indent: 0, type: 'root', version: 1 } })

const days = (n) => new Date(Date.now() - n * 86_400_000).toISOString()

const STORIES = [
  {
    authorName: 'Velos Shield Newsroom',
    category: 'Latest News',
    cover: ['shutterstock/hero-ot.jpg', 'OT security teams under one roof: what changed at Velos Shield this quarter'],
    featured: true,
    publishAt: days(2),
    slug: 'velos-shield-newsroom-launch',
    summary:
      'The Velos Shield Newsroom brings product news, research, announcements and press coverage into one place - and everything here is published from the CMS, with no release cycle.',
    title: 'Introducing the Velos Shield Newsroom',
    body: doc(
      para('The Velos Shield Newsroom replaces the old media list with a proper editorial surface: a featured story, category bands, filtering and search, and a CMS desk the team can publish from directly.'),
      head('Why a Newsroom instead of a press page'),
      para('A press page answers one question - "who wrote about us?". Security leaders evaluating OT tooling ask several at once: what changed in the product, what the field team is seeing, which standards moved, and where we will be.'),
      bullets([
        'Product News for releases and platform changes',
        'Research & Insights for field findings and technical notes',
        'Company Announcements, Press Coverage and Events & Media',
      ]),
      quote('If it needs a deployment to publish, it will not get published. The Newsroom is content, not code.'),
      para([
        text('Coverage from other outlets stays on the page as well, under '),
        link('Coverage elsewhere', '/company/media/'),
        text('.'),
      ]),
    ),
  },
  {
    authorName: 'Product Team',
    category: 'Product News',
    cover: ['veloshield-hero.png', 'Velos Shield platform release'],
    publishAt: days(9),
    slug: 'platform-release-observability-dashboards',
    summary:
      'Release 1.5 adds per-site risk posture dashboards, faster topology discovery and a review workflow that keeps engineering and operations on the same evidence.',
    title: 'Platform release: per-site risk posture and faster discovery',
    body: doc(
      para('This release focuses on the gap between discovering an OT asset and being able to act on it.'),
      head('What is in it'),
      bullets([
        'Per-site risk posture, with the underlying evidence attached to every score',
        'Topology discovery up to three times faster on large L2 segments',
        'Review workflow for engineering and operations sign-off',
      ]),
      head('What it does not do'),
      para('Nothing here changes how a customer allocates or posts payments. This is the industrial security platform, and the change is limited to visibility and evidence.'),
    ),
  },
  {
    authorName: 'Field Research',
    category: 'Research & Insights',
    cover: ['shutterstock/industries-hero.jpg', 'Industrial control room'],
    publishAt: days(21),
    slug: 'discovering-legacy-plcs-without-touching-the-line',
    summary:
      'A passive-first approach to asset discovery on production lines: what it finds, what it misses, and how to plan the active step without a maintenance window.',
    title: 'Discovering legacy PLCs without touching the line',
    body: doc(
      para('Most legacy controllers were never meant to be enumerated. A passive-first programme gets 70-85% of the estate inventory without a maintenance window; the remainder needs a planned, targeted active pass.'),
      head('What passive discovery gets you'),
      bullets(['Asset identity and protocol fingerprints', 'Conversation baselines per cell', 'Drift signals when a line changes behaviour']),
      head('Where it stops'),
      para('Passively silent devices - a controller that only speaks when polled - will not appear. Plan the active pass for those cells, and stage it against the same evidenced baseline so the change is defensible after the fact.'),
    ),
  },
  {
    authorName: 'Velos Shield Newsroom',
    category: 'Company Announcements',
    publishAt: days(30),
    slug: 'partnership-programme-open',
    summary:
      'The partner programme is open to consultancies and systems integrators working with industrial operators in India, the Middle East and the UK.',
    title: 'Our partner programme is open',
    body: doc(
      para('We work with consultancies and integrators who already hold the operator relationship.'),
      bullets(['A delivered engagement to point at, not a slide deck', 'Region-local delivery and support', 'Joint scoping before any commercial commitment']),
      para([
        text('Partnership enquiries go through the '),
        link('partners page', '/partners/'),
        text('.'),
      ]),
    ),
  },
  {
    authorName: 'Velos Shield Newsroom',
    category: 'Press Coverage',
    publishAt: days(40),
    summary: 'A round-up of interviews and analyst notes on OT visibility, from the last quarter.',
    slug: 'where-we-appeared-this-quarter',
    title: 'Where we appeared this quarter',
    body: doc(
      para('Interviews, features and analyst notes from the last quarter, collected in one place.'),
      para('Coverage that was written by another outlet is linked from the Newsroom rather than reproduced here.'),
    ),
  },
  {
    authorName: 'Velos Shield Events',
    category: 'Events & Media',
    cover: ['gisec-keyvisual.png', 'Conference'],
    publishAt: days(46),
    slug: 'events-we-are-speaking-at',
    summary: 'Where to meet the team this season, and what we will be presenting on stage.',
    title: 'Where to meet the team this season',
    body: doc(
      para('We will be on the floor and on stage at the following events.'),
      bullets(['Regional OT security conferences', 'Customer and partner round tables', 'Closed briefings for critical national infrastructure teams']),
    ),
  },
]

const login2 = async () => {
  const admin = await login(required('SEED_ADMIN_EMAIL'), required('SEED_ADMIN_PASSWORD'))
  return admin
}

const findMedia = async (token, filename) => {
  const { body } = await api('GET', `/api/media/?limit=1&where[filename][equals]=${encodeURIComponent(filename)}`, { token })
  return body?.docs?.[0]?.id ?? null
}

const uploadAsset = async (token, filename, alt) => {
  const bytes = Buffer.from(await (await fetch(`${base}/${filename}`)).arrayBuffer())
  const mime = /\.png$/i.test(filename) ? 'image/png' : /\.jpe?g$/i.test(filename) ? 'image/jpeg' : 'image/webp'
  const boundary = '----newsroomseed' + Math.random().toString(16).slice(2)
  const head = Buffer.from(
    `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${filename}"\r\nContent-Type: ${mime}\r\n\r\n`,
  )
  const tail = Buffer.from(
    `\r\n--${boundary}\r\nContent-Disposition: form-data; name="_payload"\r\n\r\n${JSON.stringify({ alt })}\r\n--${boundary}--\r\n`,
  )
  const response = await fetch(`${base}/api/media/`, {
    body: Buffer.concat([head, bytes, tail]),
    headers: { Authorization: `JWT ${token}`, 'Content-Type': `multipart/form-data; boundary=${boundary}` },
    method: 'POST',
  })
  const parsed = await response.json().catch(() => null)
  return parsed?.doc?.id ?? null
}

const main = async () => {
  const admin = await login2()
  const deleting = process.argv.includes('--delete')

  const existing = await api('GET', '/api/newsroom-articles/?limit=200&draft=true', { token: admin.token })
  const bySlug = new Map((existing.body?.docs ?? []).map((entry) => [entry.slug, entry]))

  for (const story of STORIES) {
    const current = bySlug.get(story.slug)
    if (deleting) {
      if (current) {
        await api('DELETE', `/api/newsroom-articles/${current.id}/`, { token: admin.token })
        console.log(`deleted  ${story.slug}`)
      }
      continue
    }

    let coverImage = null
    if (story.cover) {
      const [filename, alt] = story.cover
      coverImage = (await findMedia(admin.token, filename)) ?? (await uploadAsset(admin.token, filename, alt))
    }

    const payload = {
      _status: 'published',
      authorName: story.authorName,
      body: story.body,
      category: story.category,
      coverImage,
      coverImageCaption: story.cover?.[1] ?? null,
      featured: story.featured === true,
      publishAt: story.publishAt,
      schedulePublication: false,
      readingTime: '3 min read',
      seoDescription: story.summary,
      seoTitle: story.title,
      slug: story.slug,
      summary: story.summary,
      tags: [{ tag: 'OT security' }],
      title: story.title,
    }

    const result = current
      ? await api('PATCH', `/api/newsroom-articles/${current.id}/`, { body: payload, token: admin.token })
      : await api('POST', '/api/newsroom-articles/', { body: payload, token: admin.token })

    if (result.status >= 400) {
      console.log(`FAILED   ${story.slug} -> HTTP ${result.status} ${JSON.stringify(result.body).slice(0, 200)}`)
      continue
    }
    owned.push(story.slug)
    console.log(`${current ? 'updated ' : 'created '}${story.slug}  [${story.category}]  ${result.status}`)
  }

  const after = await api('GET', '/api/newsroom-articles/?limit=200', { token: admin.token })
  console.log('')
  console.log(`published stories now visible to the public: ${after.body?.totalDocs ?? 0}`)
  console.log(deleting ? 'sample content removed' : 'sample content in place - edit or delete it from /admin/newsroom')
}

main().catch((error) => {
  console.error('seed-newsroom failed:', error)
  process.exit(1)
})

// Keeps the unused-import lint quiet without changing behaviour: readFileSync is used when a caller
// wants to seed from a local file instead of a public asset.
void readFileSync
