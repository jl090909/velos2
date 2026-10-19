/**
 * Newsroom video embed: one Lexical block, plus the URL resolution used to render it.
 *
 * PURE module (no React, no Payload runtime imports except the Block TYPE) so the editor config and
 * the server renderer share ONE validator. Nothing is ever rendered as raw HTML: an unrecognised
 * URL degrades to a plain link, so an editor cannot inject arbitrary markup or an arbitrary iframe
 * origin into a published page.
 */

import type { Block } from 'payload'

export const VIDEO_EMBED_SLUG = 'videoEmbed'

export const videoEmbedBlock: Block = {
  slug: VIDEO_EMBED_SLUG,
  labels: { plural: 'Video embeds', singular: 'Video embed' },
  fields: [
    {
      name: 'url',
      type: 'text',
      required: true,
      admin: {
        description:
          'YouTube or Vimeo page URL, or a direct .mp4/.webm file. Anything else renders as a link.',
      },
    },
    {
      name: 'title',
      type: 'text',
      admin: { description: 'Describes the video for screen readers. Falls back to the caption.' },
    },
    {
      name: 'caption',
      type: 'text',
    },
  ],
}

export type VideoEmbed =
  | { kind: 'file'; src: string }
  | { kind: 'iframe'; src: string }
  | { kind: 'link'; src: string }

const YOUTUBE_HOSTS = ['youtube.com', 'www.youtube.com', 'm.youtube.com', 'youtube-nocookie.com', 'www.youtube-nocookie.com', 'youtu.be']
const VIMEO_HOSTS = ['vimeo.com', 'www.vimeo.com', 'player.vimeo.com']

const parse = (value: string): URL | null => {
  try {
    const url = new URL(value.trim())
    return url.protocol === 'https:' || url.protocol === 'http:' ? url : null
  } catch {
    return null
  }
}

/**
 * Resolve an editor-supplied URL into something safe to render.
 *
 * Only three shapes are produced: a privacy-preserving iframe on a known video host, a direct video
 * file, or a plain outbound link. There is no path that emits arbitrary HTML.
 */
export const resolveVideoEmbed = (value: string | null | undefined): VideoEmbed | null => {
  if (!value) {
    return null
  }
  const url = parse(value)
  if (!url) {
    return null
  }
  const host = url.hostname.toLowerCase()

  if (YOUTUBE_HOSTS.includes(host)) {
    const id = host === 'youtu.be' ? url.pathname.slice(1) : url.searchParams.get('v') ?? url.pathname.split('/').filter(Boolean).pop()
    const safeId = (id ?? '').replace(/[^A-Za-z0-9_-]/g, '')
    return safeId.length > 0
      ? { kind: 'iframe', src: `https://www.youtube-nocookie.com/embed/${safeId}` }
      : { kind: 'link', src: url.toString() }
  }

  if (VIMEO_HOSTS.includes(host)) {
    const id = (url.pathname.split('/').filter(Boolean).pop() ?? '').replace(/[^0-9]/g, '')
    return id.length > 0 ? { kind: 'iframe', src: `https://player.vimeo.com/video/${id}` } : { kind: 'link', src: url.toString() }
  }

  if (/\.(mp4|webm|ogv)$/i.test(url.pathname)) {
    return { kind: 'file', src: url.toString() }
  }

  return { kind: 'link', src: url.toString() }
}
