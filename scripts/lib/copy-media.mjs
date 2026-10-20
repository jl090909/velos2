// Shared plumbing for copying CMS content between two Payload instances (dev -> production).
//
// The hard part is never the text: it is the uploads. Bodies and cover fields hold MEDIA IDS, and ids
// differ between databases, so every image has to be uploaded to the target first and then the ids
// rewritten. This module does that once, for every collection that needs it.
//
// Serverless request bodies are capped at 4.5MB, so an image above MAX_UPLOAD_BYTES is resized with
// sharp before it is sent. Payload generates the display sizes itself; this only bounds the original.

import sharp from 'sharp'

export const MAX_UPLOAD_BYTES = 3.5 * 1024 * 1024
const MAX_EDGE = 2000

export const loginAt = async (base, email, password) => {
  const response = await fetch(`${base}/api/users/login/`, {
    body: JSON.stringify({ email, password }),
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
  })
  const body = await response.json()
  if (!body?.token) {
    throw new Error(`login failed at ${base} (HTTP ${response.status})`)
  }
  return body.token
}

export const getJson = async (base, path, token) => {
  const response = await fetch(base + path, { headers: { Authorization: `JWT ${token}` } })
  if (!response.ok) {
    throw new Error(`GET ${base}${path} -> HTTP ${response.status}`)
  }
  return response.json()
}

/** Every media id a document points at: the named upload fields plus any inline upload node. */
export const mediaIdsIn = (doc, uploadFields = [], richFields = []) => {
  const ids = new Set()
  for (const field of uploadFields) {
    const value = doc[field]
    const id = typeof value === 'object' && value !== null ? value.id : value
    if (id) {
      ids.add(String(id))
    }
  }
  const walk = (node) => {
    if (Array.isArray(node)) {
      node.forEach(walk)
      return
    }
    if (node && typeof node === 'object') {
      if (node.type === 'upload' && node.value) {
        ids.add(String(node.value))
      }
      Object.values(node).forEach(walk)
    }
  }
  for (const field of richFields) {
    walk(doc[field])
  }
  return [...ids]
}

/** Rewrites media ids inside a rich-text tree, leaving every other key untouched. */
export const remapRichText = (node, map) => {
  if (Array.isArray(node)) {
    return node.map((entry) => remapRichText(entry, map))
  }
  if (node && typeof node === 'object') {
    const out = {}
    for (const [key, value] of Object.entries(node)) {
      out[key] =
        key === 'value' && node.type === 'upload' ? map.get(String(value)) ?? value : remapRichText(value, map)
    }
    return out
  }
  return node
}

const prepareFile = async (source, media, token) => {
  const url = media.url.startsWith('http') ? media.url : source + media.url
  const response = await fetch(url, { headers: { Authorization: `JWT ${token}` } })
  if (!response.ok) {
    throw new Error(`download failed for ${media.filename} (HTTP ${response.status})`)
  }
  let bytes = Buffer.from(await response.arrayBuffer())
  let filename = media.filename
  let mimeType = media.mimeType
  if (bytes.length > MAX_UPLOAD_BYTES && mimeType.startsWith('image/')) {
    const image = sharp(bytes).rotate()
    const meta = await image.metadata()
    const resized = await image
      .resize({ width: Math.min(meta.width ?? MAX_EDGE, MAX_EDGE), withoutEnlargement: true })
      .jpeg({ quality: 84, mozjpeg: true })
      .toBuffer()
    console.log(`  > ${filename} ${(bytes.length / 1048576).toFixed(1)}MB exceeds the upload cap, sent as ${(resized.length / 1048576).toFixed(1)}MB jpeg`)
    bytes = resized
    filename = filename.replace(/\.[^.]+$/, '') + '.jpg'
    mimeType = 'image/jpeg'
  }
  return { bytes, filename, mimeType }
}

const uploadMedia = async (target, source, media, token, sourceToken) => {
  const { bytes, filename, mimeType } = await prepareFile(source, media, sourceToken)
  const form = new FormData()
  form.set('_payload', JSON.stringify({ alt: media.alt || filename, caption: media.caption ?? undefined }))
  form.set('file', new Blob([bytes], { type: mimeType }), filename)
  const response = await fetch(`${target}/api/media/`, {
    body: form,
    headers: { Authorization: `JWT ${token}` },
    method: 'POST',
  })
  const body = await response.json().catch(() => null)
  if (!response.ok || !body?.doc?.id) {
    throw new Error(`upload failed for ${filename} (HTTP ${response.status}) ${JSON.stringify(body).slice(0, 300)}`)
  }
  console.log(`  uploaded ${filename} -> media ${body.doc.id}`)
  return body.doc
}

/**
 * Builds source-media-id -> target-media-id for every upload a set of documents references.
 * Reuses a target file with the same name instead of uploading a duplicate.
 */
export const buildMediaMap = async ({ docs, source, target, sourceToken, targetToken, uploadFields = [], richFields = [] }) => {
  const targetMedia = await getJson(target, '/api/media/?limit=300&depth=0', targetToken)
  const byFilename = new Map((targetMedia.docs ?? []).map((doc) => [doc.filename, doc]))
  const map = new Map()
  const wanted = [...new Set(docs.flatMap((doc) => mediaIdsIn(doc, uploadFields, richFields)))]
  for (const id of wanted) {
    const media = await getJson(source, `/api/media/${id}`, sourceToken)
    const already = byFilename.get(media.filename)
    if (already) {
      console.log(`  reused   ${media.filename} -> media ${already.id}`)
      map.set(String(id), already.id)
      continue
    }
    const uploaded = await uploadMedia(target, source, media, targetToken, sourceToken)
    byFilename.set(uploaded.filename, uploaded)
    map.set(String(id), uploaded.id)
  }
  return map
}
