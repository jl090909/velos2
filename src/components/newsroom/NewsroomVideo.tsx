import { resolveVideoEmbed } from '@/lib/newsroom-video'

/**
 * One embedded video inside an article body.
 *
 * The URL is resolved through the shared validator (src/lib/newsroom-video.ts), which only ever
 * produces a known video host, a direct video file or a plain link - never arbitrary markup, so a
 * published page cannot be turned into an open iframe.
 */
export function NewsroomVideo({
  caption,
  title,
  url,
}: {
  caption?: string
  title?: string
  url: string
}) {
  const embed = resolveVideoEmbed(url)
  if (!embed) {
    return null
  }
  const label = title || caption || 'Embedded video'

  return (
    <figure className="my-9">
      <div className="relative aspect-video overflow-hidden rounded-[1.35rem] border border-border/70 bg-[#003C64]/5">
        {embed.kind === 'iframe' ? (
          <iframe
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            src={embed.src}
            title={label}
          />
        ) : embed.kind === 'file' ? (
          <video className="absolute inset-0 h-full w-full" controls preload="metadata" src={embed.src} />
        ) : (
          <a
            className="absolute inset-0 flex items-center justify-center text-sm font-medium text-[#003C64] no-underline hover:text-[#FF612A]"
            href={embed.src}
            rel="noreferrer"
            target="_blank"
          >
            Watch the video
          </a>
        )}
      </div>
      {caption ? <figcaption className="mt-2 text-sm text-muted-foreground">{caption}</figcaption> : null}
    </figure>
  )
}
