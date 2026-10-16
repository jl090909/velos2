// Proves the upload path end to end, in whichever storage mode the target is running:
//   - local development (no BLOB_READ_WRITE_TOKEN): files land on disk and are served from /api/media/file
//   - production (Vercel Blob): files land in the blob store and are served from *.public.blob.vercel-storage.com
// It also attaches an uploaded image to a customer logo, publishes it, and checks the page renders it.
//
// Usage: CMS_URL=https://velos2.vercel.app node scripts/verify-uploads.mjs
//
// Payload's REST upload endpoint expects every non-file field as JSON in a `_payload` part of the
// multipart body - plain sibling form fields are ignored and validation fails with "Alt is required".

import { api, required, login } from './cms-http.mjs'

const base = (process.env.CMS_URL || process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3020').replace(/\/+$/, '')
const stamp = Date.now()
const results = []
const check = (name, pass, detail = '') => results.push({ detail, name, pass: Boolean(pass) })

const multipart = (filename, mime, bytes, fields) => {
  const boundary = '----hermesqa' + Math.random().toString(16).slice(2)
  const head = Buffer.from(
    `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${filename}"\r\nContent-Type: ${mime}\r\n\r\n`,
  )
  const payload = Buffer.from(
    `\r\n--${boundary}\r\nContent-Disposition: form-data; name="_payload"\r\n\r\n${JSON.stringify(fields)}\r\n--${boundary}--\r\n`,
  )
  return { body: Buffer.concat([head, bytes, payload]), boundary }
}

const upload = async (token, filename, mime, bytes, fields) => {
  const { body, boundary } = multipart(filename, mime, bytes, fields)
  const response = await fetch(`${base}/api/media/`, {
    body,
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

const fetchStatus = async (url) => {
  const absolute = url.startsWith('http') ? url : base + url
  try {
    const response = await fetch(absolute, { method: 'GET' })
    return { contentType: response.headers.get('content-type'), status: response.status }
  } catch (error) {
    return { contentType: null, status: `error: ${error.message}` }
  }
}

const main = async () => {
  const admin = await login(required('SEED_ADMIN_EMAIL'), required('SEED_ADMIN_PASSWORD'))
  const tech = await login(required('SEED_TECH_EMAIL'), required('SEED_TECH_PASSWORD'))

  // a real PNG (the site logo) so the storage layer sees genuine image bytes
  const bytes = Buffer.from(await (await fetch(`${base}/NEWvsLOGO.png`)).arrayBuffer())
  const filename = `qa-upload-${stamp}.png`

  const uploaded = await upload(tech.token, filename, 'image/png', bytes, { alt: `QA upload ${stamp}` })
  const doc = uploaded.body?.doc ?? {}
  check('an image uploads through the REST API', uploaded.status === 201, `HTTP ${uploaded.status} ${uploaded.status !== 201 ? JSON.stringify(uploaded.body).slice(0, 300) : ''}`)

  if (!doc.id) {
    // Nothing was stored, so every later step would fail on undefined ids. Report and stop here so the
    // storage error itself is the headline.
    console.log('')
    for (const row of results) {
      console.log(`${row.pass ? 'PASS' : 'FAIL'}  ${row.name}${row.detail ? '  [' + row.detail + ']' : ''}`)
    }
    console.log('')
    console.log(`upload did not store a document on this target - body: ${JSON.stringify(uploaded.body).slice(0, 400)}`)
    process.exit(1)
  }

  const url = String(doc.url ?? '')
  // absolute URLs in both modes: Payload prefixes `serverURL` (so a local disk file reads
  // http://localhost:3020/api/media/file/<name> while a blob file reads https://<store>.public.blob.vercel-storage.com/<name>)
  const mode = url.includes('blob.vercel-storage.com')
    ? 'vercel-blob'
    : url.includes('/api/media/file')
      ? 'local-disk'
      : `unknown (${url.slice(0, 70)})`
  check('the stored URL reveals the storage mode', mode === 'vercel-blob' || mode === 'local-disk', mode)

  const served = await fetchStatus(url)
  check('the uploaded file can be fetched back', served.status === 200, `${served.status} ${served.contentType ?? ''}`)

  check('image sizes were generated', Object.keys(doc.sizes ?? {}).length >= 3, Object.keys(doc.sizes ?? {}).join(','))

  // attach it to a customer and prove it renders on the public page
  const customerSlug = `qa-upload-customer-${stamp}`
  const customer = await api('POST', '/api/customers/', {
    body: {
      _status: 'published',
      logo: doc.id,
      name: `QA upload customer ${stamp}`,
      sector: 'QA',
      slug: customerSlug,
      summary: 'Temporary record created by scripts/verify-uploads.mjs.',
    },
    token: tech.token,
  })
  check('the upload can be attached as a customer logo', customer.status === 201, `HTTP ${customer.status}`)

  const page = await fetch(`${base}/customers/?cachebust=${stamp}`, { cache: 'no-store' })
  const html = await page.text()
  const logoPath = url
  check(
    'the logo renders on the public customers page',
    html.includes(logoPath) || html.includes(String(doc.filename ?? '')),
    logoPath.length > 70 ? logoPath.slice(0, 70) + '...' : logoPath,
  )

  // cleanup: media delete is admin-only
  await api('DELETE', `/api/customers/${customer.body?.doc?.id}/`, { token: admin.token })
  const removed = await api('DELETE', `/api/media/${doc.id}/`, { token: admin.token }).catch((error) => ({ status: error.status ?? 'error' }))
  check('upload and record can be deleted again', removed.status === 200, `HTTP ${removed.status}`)

  const gone = await fetchStatus(url)
  check('the deleted file is no longer served', gone.status !== 200, `HTTP ${gone.status}`)

  const failed = results.filter((row) => !row.pass)
  console.log('')
  for (const row of results) {
    console.log(`${row.pass ? 'PASS' : 'FAIL'}  ${row.name}${row.detail ? '  [' + row.detail + ']' : ''}`)
  }
  console.log('')
  console.log(`${results.length - failed.length}/${results.length} checks passed`)
  if (failed.length > 0) {
    process.exit(1)
  }
}


main().catch((error) => {
  console.error('verify-uploads failed:', error)
  process.exit(1)
})
