import { RichText } from '@payloadcms/richtext-lexical/react'
import type { JSXConvertersFunction } from '@payloadcms/richtext-lexical/react'

import type { RichTextData } from '@/lib/cms'

import { NewsroomVideo } from '@/components/newsroom/NewsroomVideo'

/**
 * Long-form body, shared by every surface that renders CMS rich text.
 *
 * Headings, paragraphs, lists, links, quotations, inline images and uploads come from Payload's own
 * default converters. The one addition is the `videoEmbed` block, which is rendered through the
 * shared URL validator - an editor can embed YouTube/Vimeo/a video file and nothing else.
 *
 * Named for what it renders rather than where it started: a newsroom article and a customer case
 * study are both just a body, and two copies of this would drift.
 */

type VideoEmbedFields = { caption?: string; title?: string; url?: string }

const converters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  blocks: {
    videoEmbed: ({ node }: { node?: { fields?: VideoEmbedFields } }) => {
      const fields = node?.fields ?? {}
      return <NewsroomVideo caption={fields.caption} title={fields.title} url={fields.url ?? ''} />
    },
  },
})

const BODY_CLASS = [
  'text-[15.2px] leading-[1.75] text-muted-foreground',
  '[&_a]:text-[#003C64] [&_a]:underline',
  '[&_blockquote]:my-7 [&_blockquote]:border-l-2 [&_blockquote]:border-[#FF612A]/50 [&_blockquote]:pl-5 [&_blockquote]:text-[17.1px] [&_blockquote]:italic [&_blockquote]:text-[#003C64]',
  '[&_figure]:my-8',
  '[&_h2]:mt-11 [&_h2]:mb-3 [&_h2]:text-[22.1px] [&_h2]:font-semibold [&_h2]:tracking-[-.035em] [&_h2]:text-[#003C64]',
  '[&_h3]:mt-9 [&_h3]:mb-2 [&_h3]:text-[17.85px] [&_h3]:font-semibold [&_h3]:text-[#003C64]',
  '[&_h4]:mt-8 [&_h4]:mb-2 [&_h4]:text-[17.1px] [&_h4]:font-semibold [&_h4]:text-[#003C64]',
  '[&_hr]:my-10 [&_hr]:border-border/70',
  '[&_img]:my-2 [&_img]:rounded-[1.15rem] [&_li]:mb-1.5 [&_ol]:mb-6 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-5',
  '[&_strong]:font-semibold [&_strong]:text-[#003C64] [&_ul]:mb-6 [&_ul]:list-disc [&_ul]:pl-5',
].join(' ')

export function RichBody({ body, className }: { body: RichTextData | null; className?: string }) {
  if (!body) {
    return null
  }
  return <RichText className={`${BODY_CLASS}${className ? ` ${className}` : ''}`} converters={converters} data={body} />
}
