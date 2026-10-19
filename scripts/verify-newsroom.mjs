// Velos Shield Newsroom - end-to-end verification (spec Phase 6).
//
// Drives the REAL CMS over HTTP the way the deployed site does, and re-reads the SITE, because the
// expensive failure mode here is not "the API call failed" but "the draft leaked" or "the published
// story never reached the page".
//
// What it proves:
//   1. authorisation: anonymous and hr cannot write newsroom content; admin/tech can
//   2. draft creation, persistence and RICH TEXT (headings, lists, links, quotations)
//   3. draft isolation: not on /company/media, not at its own URL, not in the sitemap, not via ?draft=true
//   4. preview accuracy: the preview renders the real article layout for staff only (anonymous -> 404)
//   5. immediate publication: publish -> visible on the index, the article page and search
//   6. category filtering and search
//   7. editing and unpublishing a published story
//   8. SCHEDULED publication: a future-dated draft is invisible, then publishes itself at its time
//   9. image upload + inline media + a video embed rendered from the editor block
//  10. the /admin/newsroom desk: refused to anonymous callers, lists the story for an admin
//  11. regression: the existing site pages still answer, the nav/footer survive, the layout is responsive
//
// Usage: node scripts/verify-newsroom.mjs        (CMS_URL=http://localhost:3020 by default)
//
// Everything it creates is deleted again, so it is safe to run against any environment.

import { readFileSync } from 'node:fs'

import { api, required, login } from './cms-http.mjs'

const base = (process.env.CMS_URL || process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3020').replace(/\/+$/, '')
const stamp = Date.now()
const results = []
const check = (name, pass, detail = '') => {
  results.push({ detail, name, pass: Boolean(pass) })
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? '  [' + detail + ']' : ''}`)
}
const section = (title) => console.log(`\n--- ${title} ---`)

const page = async (path) => {
  const response = await fetch(`${base}${path}${path.includes('?') ? '&' : '?'}cb=${stamp}${Math.random().toString(16).slice(2, 6)}`, {
    cache: 'no-store',
    headers: { 'Cache-Control': 'no-cache' },
  })
  return { html: await response.text(), status: response.status }
}

/**
 * Payload's single-document REST responses are the document itself; a few paths wrap it in `doc`.
 * Every read here goes through this so an assertion can never silently compare against undefined.
 */
const docOf = (body) => (body && typeof body === 'object' ? (body.doc ?? body) : null)

/**
 * Browser-shaped cookie headers.
 *
 * Payload's cookie auth carries a CSRF guard: with an Origin header the origin must be in
 * `config.csrf` (which is the serverURL), and with NO Origin it falls back to `Sec-Fetch-Site`. A
 * script that sends neither is refused - correctly - so a cookie session must be presented the way a
 * browser presents it. This is the difference between "the dashboard is broken" and "the harness
 * looked like a cross-site client".
 */
const browserHeaders = (cookie) => ({ Cookie: cookie, 'Sec-Fetch-Site': 'same-origin' })

const lexical = {
  bullets: (items) => ({
    children: items.map((item, index) => ({
      children: [lexical.text(item)],
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
  }),
  doc: (...children) => ({ root: { children, direction: 'ltr', format: '', indent: 0, type: 'root', version: 1 } }),
  heading: (value, tag = 'h2') => ({
    children: [lexical.text(value)],
    direction: 'ltr',
    format: '',
    indent: 0,
    tag,
    type: 'heading',
    version: 1,
  }),
  link: (label, url) => ({
    children: [{ ...lexical.text(label), format: 16 }],
    direction: 'ltr',
    fields: { linkType: 'custom', newTab: true, url },
    format: '',
    indent: 0,
    type: 'link',
    version: 3,
  }),
  para: (value) => ({
    children: Array.isArray(value) ? value : [lexical.text(value)],
    direction: 'ltr',
    format: '',
    indent: 0,
    textFormat: 0,
    type: 'paragraph',
    version: 1,
  }),
  quote: (value) => ({
    children: [lexical.text(value)],
    direction: 'ltr',
    format: '',
    indent: 0,
    type: 'quote',
    version: 1,
  }),
  text: (value) => ({ detail: 0, format: 0, mode: 'normal', style: '', text: value, type: 'text', version: 1 }),
  video: (url, caption) => ({
    fields: { blockName: '', blockType: 'videoEmbed', caption, title: 'QA embed', url },
    format: '',
    type: 'block',
    version: 2,
  }),
}

const body = (marker) =>
  lexical.doc(
    lexical.para(`Opening paragraph for the QA story ${marker}.`),
    lexical.heading('Why it matters', 'h2'),
    lexical.para([lexical.text('A paragraph with an '), lexical.link('outbound link', 'https://www.velosshield.com/')]),
    lexical.bullets(['First point', 'Second point']),
    lexical.quote('A quotation that must render as a blockquote.'),
    lexical.video('https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'QA embed caption'),
  )

const multipart = (filename, mime, bytes, fields) => {
  const boundary = '----newsroomqa' + Math.random().toString(16).slice(2)
  const head = Buffer.from(
    `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${filename}"\r\nContent-Type: ${mime}\r\n\r\n`,
  )
  const payload = Buffer.from(
    `\r\n--${boundary}\r\nContent-Disposition: form-data; name="_payload"\r\n\r\n${JSON.stringify(fields)}\r\n--${boundary}--\r\n`,
  )
  return { body: Buffer.concat([head, bytes, payload]), boundary }
}

const uploadImage = async (token, filename, bytes, alt) => {
  const { body: form, boundary } = multipart(filename, 'image/png', bytes, { alt })
  const response = await fetch(`${base}/api/media/`, {
    body: form,
    headers: { Authorization: `JWT ${token}`, 'Content-Type': `multipart/form-data; boundary=${boundary}` },
    method: 'POST',
  })
  const raw = await response.text()
  let parsed = null
  try {
    parsed = JSON.parse(raw)
  } catch {
    parsed = raw
  }
  return { body: parsed, status: response.status }
}

/** Cookie session, which is what the admin UI uses (JWT headers do not authorise /admin pages). */
const cookieLogin = async (email, password) => {
  const response = await fetch(`${base}/api/users/login/`, {
    body: JSON.stringify({ email, password }),
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    redirect: 'manual',
  })
  const cookies = response.headers.getSetCookie ? response.headers.getSetCookie() : []
  const jar = cookies.map((entry) => entry.split(';')[0]).join('; ')
  return { cookie: jar, status: response.status }
}

const createArticle = async (token, overrides = {}) =>
  api('POST', '/api/newsroom-articles/', {
    body: {
      authorName: 'QA Harness',
      body: body(stamp),
      category: 'Product News',
      publishAt: new Date().toISOString(),
      summary: `QA summary ${stamp}`,
      title: `QA story ${stamp}`,
      ...overrides,
    },
    token,
  })

const main = async () => {
  const admin = await login(required('SEED_ADMIN_EMAIL'), required('SEED_ADMIN_PASSWORD'))
  const tech = await login(required('SEED_TECH_EMAIL'), required('SEED_TECH_PASSWORD'))
  const hr = await login(required('SEED_HR_EMAIL'), required('SEED_HR_PASSWORD'))

  const created = []
  const uploaded = []
  const slug = `qa-newsroom-${stamp}`
  const marker = `QAMARK${stamp}`

  // ---------------------------------------------------------------- 1. authorisation
  section('1. authorisation on newsroom writes')
  const anon = await api('POST', '/api/newsroom-articles/', {
    body: { authorName: 'anon', body: body(stamp), summary: 'x', title: `anon ${stamp}` },
  })
  check('anonymous cannot create a newsroom article', anon.status === 401 || anon.status === 403, `HTTP ${anon.status}`)

  const hrCreate = await createArticle(hr.token, { title: `HR story ${stamp}` })
  check('hr (Careers owner) cannot create a newsroom article', hrCreate.status === 403 || hrCreate.status === 401, `HTTP ${hrCreate.status}`)

  // ---------------------------------------------------------------- 2. draft + rich text
  section('2. draft creation, persistence and rich text')
  const draft = await createArticle(tech.token, { _status: 'draft', slug, title: `QA draft ${stamp}` })
  const draftId = draft.body?.doc?.id
  created.push(draftId)
  check('tech can save a DRAFT', draft.status === 201 && draft.body?.doc?._status === 'draft', `HTTP ${draft.status} status=${draft.body?.doc?._status}`)

  const reread = await api('GET', `/api/newsroom-articles/${draftId}/?draft=true&depth=1`, { token: tech.token })
  const rereadDoc = docOf(reread.body) ?? {}
  check('the draft persists and can be read back by staff', reread.status === 200 && rereadDoc.title === `QA draft ${stamp}`, `HTTP ${reread.status} title=${rereadDoc.title}`)
  const bodyTypes = (rereadDoc.body?.root?.children ?? []).map((node) => node.type)
  check('the rich-text body stored headings, lists, links, quotations and the video block', ['paragraph', 'heading', 'list', 'quote', 'block'].every((type) => bodyTypes.includes(type)), bodyTypes.join(','))

  // ---------------------------------------------------------------- 3. draft isolation
  section('3. draft isolation')
  const indexDraft = await page('/company/media/')
  check('the draft is NOT on the public Newsroom index', !indexDraft.html.includes(`QA draft ${stamp}`), `HTTP ${indexDraft.status}`)

  const draftUrl = await page(`/company/media/${slug}/`)
  check('the draft URL answers 404 for the public', draftUrl.status === 404, `HTTP ${draftUrl.status}`)

  const sitemapDraft = await page('/sitemap.xml')
  check('the draft is NOT in the sitemap', !sitemapDraft.html.includes(slug), `HTTP ${sitemapDraft.status}`)

  const anonDraftRead = await api('GET', `/api/newsroom-articles/?where[slug][equals]=${slug}&draft=true`)
  check('an anonymous ?draft=true read returns no documents', (anonDraftRead.body?.totalDocs ?? 0) === 0, `totalDocs=${anonDraftRead.body?.totalDocs}`)

  // ---------------------------------------------------------------- 4. preview
  section('4. preview accuracy, staff only')
  const anonPreview = await page(`/newsroom-preview/${draftId}/`)
  check('the preview route refuses an anonymous caller (404)', anonPreview.status === 404, `HTTP ${anonPreview.status}`)

  const { cookie } = await cookieLogin(required('SEED_ADMIN_EMAIL'), required('SEED_ADMIN_PASSWORD'))
  const staffPreview = await fetch(`${base}/newsroom-preview/${draftId}/?cb=${stamp}`, {
    cache: 'no-store',
    headers: browserHeaders(cookie),
  })
  const previewHtml = await staffPreview.text()
  check('a signed-in editor sees the draft in the real article layout', staffPreview.status === 200 && previewHtml.includes(`QA draft ${stamp}`), `HTTP ${staffPreview.status}`)
  check('the preview shows the article furniture (headline, body, byline)', previewHtml.includes('Why it matters') && previewHtml.includes('QA Harness'), '')
  check('the preview is marked noindex', /noindex/i.test(previewHtml), '')

  const bareCookie = await fetch(`${base}/newsroom-preview/${draftId}/?cb=${stamp}2`, {
    cache: 'no-store',
    headers: { Cookie: cookie },
  })
  check(
    'a cookie session without browser CSRF shape is refused (Payload guard, not a leak)',
    bareCookie.status === 404,
    `HTTP ${bareCookie.status}`,
  )

  // ---------------------------------------------------------------- 5. publish
  section('5. immediate publication')
  const published = await api('PATCH', `/api/newsroom-articles/${draftId}/?depth=0`, {
    body: { _status: 'published' },
    token: tech.token,
  })
  check('an authorised editor publishes directly (no approval queue)', published.status === 200 && published.body?.doc?._status === 'published', `HTTP ${published.status}`)

  const indexPublished = await page('/company/media/')
  check('the story appears on the Newsroom index immediately', indexPublished.html.includes(`QA draft ${stamp}`), `HTTP ${indexPublished.status}`)

  const articleUrl = await page(`/company/media/${slug}/`)
  check('the article page renders at its clean URL', articleUrl.status === 200 && articleUrl.html.includes(`QA draft ${stamp}`), `HTTP ${articleUrl.status}`)
  check('the rendered body carries the heading, list, link and quotation', ['Why it matters', 'First point', 'outbound link', 'blockquote'].every((token) => articleUrl.html.includes(token)), '')
  check('the video embed renders through a privacy-preserving host', articleUrl.html.includes('youtube-nocookie.com/embed/dQw4w9WgXcQ'), '')
  // The sitemap is ISR-cached with a 5 minute window plus on-demand revalidation, so a freshly
  // published story can take a moment to appear: retry briefly instead of racing the cache.
  let sitemapLists = false
  for (let attempt = 0; attempt < 6 && !sitemapLists; attempt += 1) {
    sitemapLists = (await page('/sitemap.xml')).html.includes(slug)
    if (!sitemapLists) {
      await new Promise((resolve) => setTimeout(resolve, 3_000))
    }
  }
  check('the sitemap now lists the published story', sitemapLists, '')

  // ---------------------------------------------------------------- 6. filtering and search
  section('6. category filtering and search')
  const inCategory = await page('/company/media/?category=product-news')
  check('the category filter lists the story', inCategory.html.includes(`QA draft ${stamp}`), '')
  const otherCategory = await page('/company/media/?category=research-and-insights')
  check('another category excludes it', !otherCategory.html.includes(`QA draft ${stamp}`), '')

  // Search scope is title / standfirst / author / tags - the fields a reader would search by. It does
  // NOT scan the article body, and that boundary is pinned here rather than left to assumption.
  const search = await page(`/company/media/?q=${stamp}`)
  check('the search finds the story (title/standfirst/author/tags)', search.html.includes(`QA draft ${stamp}`), '')
  const bodyOnly = await page(`/company/media/?q=${marker}`)
  check('body text alone is not a search field (documented scope)', !bodyOnly.html.includes(`QA draft ${stamp}`), `marker=${marker}`)
  const searchMiss = await page('/company/media/?q=zzz-nothing-matches-this')
  check('a search with no match shows the empty result state', /No stories match that filter/.test(searchMiss.html), '')

  // ---------------------------------------------------------------- 7. edit + unpublish
  section('7. edit and unpublish a published story')
  const edited = await api('PATCH', `/api/newsroom-articles/${draftId}/?depth=0`, {
    body: { summary: `QA summary edited ${stamp}`, title: `QA draft edited ${stamp}` },
    token: tech.token,
  })
  check('a published story can be edited', edited.status === 200, `HTTP ${edited.status}`)
  check('the edit is visible on the public article page', (await page(`/company/media/${slug}/`)).html.includes(`QA draft edited ${stamp}`), '')

  const unpublished = await api('PATCH', `/api/newsroom-articles/${draftId}/?depth=0`, {
    body: { _status: 'draft' },
    token: tech.token,
  })
  check('a published story can be unpublished', unpublished.status === 200 && unpublished.body?.doc?._status === 'draft', `HTTP ${unpublished.status} status=${unpublished.body?.doc?._status}`)
  check('the unpublished story leaves the index', !(await page('/company/media/')).html.includes(`QA draft edited ${stamp}`), '')
  const afterUnpublish = await page(`/company/media/${slug}/`)
  check('the unpublished story URL answers 404 again', afterUnpublish.status === 404, `HTTP ${afterUnpublish.status}`)

  // ---------------------------------------------------------------- 8. scheduling
  section('8. scheduled publication')
  const scheduleSlug = `qa-scheduled-${stamp}`
  const due = new Date(Date.now() + 75_000).toISOString()

  // The decoy pins the foot-gun this suite caught once: an ordinary DRAFT that happens to carry a
  // publication date in the past must NOT be swept up by the publisher. Only an editor who switched
  // 'publish automatically' on is scheduled.
  const decoy = await createArticle(tech.token, {
    _status: 'draft',
    publishAt: new Date(Date.now() - 3_600_000).toISOString(),
    slug: `qa-decoy-${stamp}`,
    title: `QA decoy draft ${stamp}`,
  })
  const decoyId = decoy.body?.doc?.id
  created.push(decoyId)

  const scheduled = await createArticle(tech.token, {
    _status: 'draft',
    publishAt: due,
    schedulePublication: true,
    slug: scheduleSlug,
    title: `QA scheduled ${stamp}`,
  })
  const scheduledId = scheduled.body?.doc?.id
  created.push(scheduledId)
  check('a future-dated draft is saved as a draft', scheduled.status === 201, `HTTP ${scheduled.status}`)
  check('a scheduled story is NOT public before its time', !(await page('/company/media/')).html.includes(`QA scheduled ${stamp}`), `due ${due}`)

  // The queue runs on a one-minute cron in this deployment; a manual tick makes the check
  // deterministic when the endpoint is reachable, and otherwise the loop waits for the cron.
  const tick = await api('GET', '/api/payload-jobs/run/?limit=10', { token: admin.token }).catch(() => ({ status: 'error' }))
  console.log(`      queue tick: HTTP ${tick.status}`)

  let publishedByQueue = false
  for (let attempt = 0; attempt < 24 && !publishedByQueue; attempt += 1) {
    const state = await api('GET', `/api/newsroom-articles/${scheduledId}/?draft=true&depth=0`, { token: admin.token })
    publishedByQueue = docOf(state.body)?._status === 'published'
    if (!publishedByQueue) {
      await new Promise((resolve) => setTimeout(resolve, 10_000))
    }
  }
  check('the scheduler publishes the story at its designated time', publishedByQueue, `due ${due}`)
  check('the scheduled story is public after publication', publishedByQueue ? (await page('/company/media/')).html.includes(`QA scheduled ${stamp}`) : false, '')

  const decoyState = await api('GET', `/api/newsroom-articles/${decoyId}/?draft=true&depth=0`, { token: admin.token })
  check(
    'a plain draft with a past publication date is NEVER auto-published',
    docOf(decoyState.body)?._status === 'draft',
    `status=${docOf(decoyState.body)?._status}`,
  )
  check('the untouched draft is still absent from the public index', !(await page('/company/media/')).html.includes(`QA decoy draft ${stamp}`), '')

  // ---------------------------------------------------------------- 9. uploads + media
  section('9. cover image upload and inline media')
  const png = Buffer.from(await (await fetch(`${base}/veloshield-hero.png`)).arrayBuffer())
  const image = await uploadImage(tech.token, `qa-newsroom-${stamp}.png`, png, `QA newsroom cover ${stamp}`)
  const imageId = image.body?.doc?.id
  if (imageId) {
    uploaded.push(imageId)
  }
  check('an image uploads into the existing media collection', image.status === 201 && Boolean(imageId), `HTTP ${image.status}`)

  const withMedia = await createArticle(tech.token, {
    _status: 'published',
    coverImage: imageId,
    slug: `qa-media-${stamp}`,
    title: `QA media story ${stamp}`,
  })
  const withMediaId = withMedia.body?.doc?.id
  created.push(withMediaId)
  check('an article can be published with a cover image', withMedia.status === 201, `HTTP ${withMedia.status}`)
  const mediaHtml = (await page(`/company/media/qa-media-${stamp}/`)).html
  check('the cover image renders on the article page', mediaHtml.includes(`qa-newsroom-${stamp}`) && mediaHtml.includes(`QA newsroom cover ${stamp}`), '')

  // ---------------------------------------------------------------- 10. the admin desk
  section('10. the /admin/newsroom desk')
  const anonDesk = await fetch(`${base}/admin/newsroom/`, { redirect: 'manual' })
  const anonDeskHtml = await anonDesk.text()
  check(
    'the desk never renders newsroom controls to an anonymous caller',
    !anonDeskHtml.includes('Create article') && !anonDeskHtml.includes(`QA media story ${stamp}`),
    `HTTP ${anonDesk.status}`,
  )

  const desk = await fetch(`${base}/admin/newsroom/`, { headers: browserHeaders(cookie), redirect: 'manual' })
  const deskHtml = await desk.text()
  check('a signed-in admin gets the desk (HTTP 200)', desk.status === 200, `HTTP ${desk.status}`)
  check('the desk is not a login redirect for an admin', !deskHtml.includes('NEXT_REDIRECT;/admin/login'), '')
  check(
    'the desk lists the story with its category and derived status',
    deskHtml.includes(`QA media story ${stamp}`) && deskHtml.includes('Product News') && /Published/.test(deskHtml),
    '',
  )
  check(
    'the desk offers the edit, preview, publish and unpublish actions',
    /Create article/.test(deskHtml) && /Unpublish|Publish/.test(deskHtml) && /Edit/.test(deskHtml) && /Preview/.test(deskHtml),
    '',
  )

  // ---------------------------------------------------------------- 11. regression
  section('11. existing site behaviour')
  for (const path of ['/', '/company/media/', '/company/careers/', '/company/events/', '/company/about/', '/resources/', '/customers/', '/industries/']) {
    const result = await page(path)
    check(`regression: ${path} answers 200`, result.status === 200, `HTTP ${result.status}`)
  }
  const newsroom = await page('/company/media/')
  check(
    'the Newsroom keeps the site navigation and footer',
    newsroom.html.includes('Partners') && newsroom.html.includes('Velos Shield') && newsroom.html.includes('Noida 201305'),
    '',
  )
  check('the Newsroom declares responsive breakpoints', newsroom.html.includes('sm:grid-cols-2') && newsroom.html.includes('lg:grid-cols-3'), '')
  check(
    'the Newsroom exposes every category filter and a working search form',
    ['latest-news', 'product-news', 'research-and-insights', 'company-announcements', 'press-coverage', 'events-and-media'].every(
      (filter) => newsroom.html.includes(`/company/media/?category=${filter}`),
    ) && /<form[^>]+action="\/company\/media\/"/.test(newsroom.html),
    '',
  )

  // ---------------------------------------------------------------- cleanup
  section('cleanup')
  for (const id of created.filter(Boolean)) {
    await api('DELETE', `/api/newsroom-articles/${id}/`, { token: admin.token }).catch(() => null)
  }
  for (const id of uploaded.filter(Boolean)) {
    await api('DELETE', `/api/media/${id}/`, { token: admin.token }).catch(() => null)
  }
  const leftover = await api('GET', '/api/newsroom-articles/?limit=1&where[title][like]=QA%20')
  check('every record created by this run was deleted again', (leftover.body?.totalDocs ?? 0) === 0, `remaining=${leftover.body?.totalDocs}`)

  const failed = results.filter((row) => !row.pass)
  console.log('')
  console.log(`${results.length - failed.length}/${results.length} checks passed`)
  if (failed.length > 0) {
    console.log('failed: ' + failed.map((row) => row.name).join(' | '))
    process.exit(1)
  }
}

main().catch((error) => {
  console.error('verify-newsroom failed:', error)
  process.exit(1)
})
