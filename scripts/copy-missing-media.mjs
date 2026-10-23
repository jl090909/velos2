// Copies every media document the production CMS has but the local instance does not.
//
// The Knowledge Hub and whitepaper sections render their covers from the CMS, so a record that only
// exists in production is a hole that shows up as a broken/blank card locally. This walks the source
// /api/media list, uploads each missing file into the target's media collection (Payload regenerates
// the thumbnail/card/hero sizes with sharp) and reports what it did.
//
// Usage: node scripts/copy-missing-media.mjs [source] [target]
//   node scripts/copy-missing-media.mjs https://velos2.vercel.app http://localhost:3020

const SOURCE = (process.argv[2] || 'https://velos2.vercel.app').replace(/\/+$/, '')
const TARGET = (process.argv[3] || 'http://localhost:3020').replace(/\/+$/, '')

const login = async (base, email, password) => {
  const response = await fetch(`${base}/api/users/login/`, {
    body: JSON.stringify({ email, password }),
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
  })
  const body = await response.json().catch(() => null)
  if (!body?.token) {
    throw new Error(`login failed at ${base} (HTTP ${response.status})`)
  }
  return body.token
}

const mediaList = async (base, token) => {
  const headers = token ? { Authorization: `JWT ${token}` } : {}
  const response = await fetch(`${base}/api/media/?limit=500&depth=0`, { headers })
  if (!response.ok) {
    throw new Error(`GET ${base}/api/media/ -> HTTP ${response.status}`)
  }
  return (await response.json()).docs ?? []
}

const run = async () => {
  const token = await login(TARGET, process.env.SEED_ADMIN_EMAIL, process.env.SEED_ADMIN_PASSWORD)
  const sourceDocs = await mediaList(SOURCE)
  const targetDocs = await mediaList(TARGET, token)
  const have = new Set(targetDocs.map((doc) => doc.filename))
  const missing = sourceDocs.filter((doc) => !have.has(doc.filename))

  console.log(`source ${SOURCE}: ${sourceDocs.length} media docs`)
  console.log(`target ${TARGET}: ${targetDocs.length} media docs`)
  console.log(`missing at target: ${missing.length}`)

  let copied = 0
  for (const doc of missing) {
    const url = doc.url.startsWith('http') ? doc.url : SOURCE + doc.url
    const response = await fetch(url)
    if (!response.ok) {
      console.log(`  !! ${doc.filename}: download HTTP ${response.status}`)
      continue
    }
    const bytes = Buffer.from(await response.arrayBuffer())
    const form = new FormData()
    form.set('_payload', JSON.stringify({ alt: doc.alt || doc.filename, caption: doc.caption ?? undefined }))
    form.set('file', new Blob([bytes], { type: doc.mimeType }), doc.filename)
    const uploaded = await fetch(`${TARGET}/api/media/`, {
      body: form,
      headers: { Authorization: `JWT ${token}` },
      method: 'POST',
    })
    const body = await uploaded.json().catch(() => null)
    if (!uploaded.ok || !body?.doc?.id) {
      console.log(`  !! ${doc.filename}: upload HTTP ${uploaded.status} ${JSON.stringify(body).slice(0, 200)}`)
      continue
    }
    const sizes = Object.keys(body.doc.sizes ?? {}).length
    console.log(`  copied ${doc.filename} -> media ${body.doc.id} (${sizes} sizes)`)
    copied += 1
  }

  const after = await mediaList(TARGET, token)
  const stillMissing = sourceDocs.filter((doc) => !after.some((have) => have.filename === doc.filename))
  console.log(`copied ${copied}; target now ${after.length} docs; still missing: ${stillMissing.length}`)
  if (stillMissing.length > 0) {
    console.log('  ' + stillMissing.map((doc) => doc.filename).join(', '))
    process.exitCode = 1
  }
}

run().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
