// Shared HTTP helpers for driving the Payload REST API.
//
// The seed and verification scripts talk to the CMS over HTTP on purpose: the Payload CLI loads
// its scripts through tsx, which trips a dual CJS/ESM resolution hazard inside undici@7
// ("Illegal constructor" from CacheStorage) in this environment. Plain node + fetch exercises the
// same surface the deployed site uses, and it keeps the checks end-to-end.

import 'dotenv/config'

export const BASE_URL = (process.env.CMS_URL || process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3020').replace(/\/+$/, '')

export class ApiError extends Error {
  constructor(method, path, status, body) {
    super(`${method} ${path} -> HTTP ${status} ${typeof body === 'string' ? body.slice(0, 300) : JSON.stringify(body).slice(0, 300)}`)
    this.status = status
  }
}

export const api = async (method, path, { body, expect, token } = {}) => {
  const headers = { 'Content-Type': 'application/json' }
  if (token) {
    headers.Authorization = `JWT ${token}`
  }
  const response = await fetch(BASE_URL + path, {
    body: body === undefined ? undefined : JSON.stringify(body),
    headers,
    method,
    redirect: 'manual',
  })
  const raw = await response.text()
  let parsed = null
  try {
    parsed = raw.length > 0 ? JSON.parse(raw) : null
  } catch {
    parsed = raw
  }
  if (expect !== undefined && response.status !== expect) {
    throw new ApiError(method, path, response.status, parsed)
  }
  if (response.status >= 500) {
    throw new ApiError(method, path, response.status, parsed)
  }
  return { body: parsed, status: response.status }
}

export const required = (name) => {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing ${name} in .env`)
  }
  return value
}

export const firstRegister = async (email, password, name) => {
  // Returns 200 + token when the collection was empty, 4xx once an account already exists.
  const { body, status } = await api('POST', '/api/users/first-register/', {
    body: { email, name, password, roles: ['admin'] },
  })
  return { message: body?.errors?.[0]?.message ?? body?.message ?? '', status, token: body?.token ?? null }
}

export const login = async (email, password) => {
  const { body, status } = await api('POST', '/api/users/login/', { body: { email, password } })
  if (!body?.token) {
    throw new Error(`login failed for ${email} (HTTP ${status})`)
  }
  return { roles: body.user?.roles ?? [], token: body.token, user: body.user }
}

export const findWhere = async (collection, where, token) => {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(where)) {
    params.set(key, String(value))
  }
  params.set('limit', '1')
  if (token) {
    params.set('draft', 'true')
  }
  const { body } = await api('GET', `/api/${collection}/?${params.toString()}`, { token })
  return body?.docs?.[0] ?? null
}

export const countWhere = async (collection, where, token) => {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(where ?? {})) {
    params.set(key, String(value))
  }
  const { body } = await api('GET', `/api/${collection}/?${params.toString()}`, { token })
  return { docs: body?.docs ?? [], total: body?.totalDocs ?? 0 }
}

// ------------------------------------------------------------------ lexical
export const text = (value) => ({ detail: 0, format: 0, mode: 'normal', style: '', text: value, type: 'text', version: 1 })
export const para = (value) => ({ children: [text(value)], direction: 'ltr', format: '', indent: 0, textFormat: 0, type: 'paragraph', version: 1 })
export const heading = (value, tag = 'h2') => ({ children: [text(value)], direction: 'ltr', format: '', indent: 0, tag, type: 'heading', version: 1 })
export const bullets = (items) => ({
  children: items.map((item, index) => ({ children: [text(item)], direction: 'ltr', format: '', indent: 0, type: 'listitem', value: index + 1, version: 1 })),
  direction: 'ltr',
  format: '',
  indent: 0,
  listType: 'bullet',
  start: 1,
  tag: 'ul',
  type: 'list',
  version: 1,
})
export const doc = (...children) => ({ root: { children, direction: 'ltr', format: '', indent: 0, type: 'root', version: 1 } })
