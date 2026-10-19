import config from '@payload-config'
import { headers } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import { revalidatePath } from 'next/cache'

import { hasRoleReq, isStaffRole, rolesOf } from '@/access'
import { STATUS_LABEL, newsroomStatus, type NewsroomStatus } from '@/lib/newsroom-meta'

/**
 * /admin/newsroom/ - the Newsroom desk.
 *
 * WHAT IT IS: the editorial dashboard. It lists every story (drafts included) with the columns the
 * spec names - title, category, derived status, created, updated, publication date - and offers the
 * four actions an editor needs: Edit, Preview, Publish, Unpublish.
 *
 * HOW IT AUTHORISES: the session is resolved server-side with `payload.auth` (the admin cookie), and
 * publish/unpublish are SERVER ACTIONS that re-resolve that session and re-check the role before the
 * write. Nothing is decided by the browser: hiding a button is presentation, and Payload applies the
 * collection's own access rules to the update as well (`overrideAccess: false`). There is no approval
 * queue and no second sign-off - an authorised editor publishes directly.
 *
 * Styling is inline on purpose: this renders inside the Payload admin document, which loads Payload's
 * stylesheets rather than the marketing site's Tailwind build.
 */

const COLLECTION = 'newsroom-articles'
const DESK = '/admin/newsroom'

const STATUS_TONE: Record<NewsroomStatus, { bg: string; fg: string }> = {
  draft: { bg: '#EDEFF2', fg: '#41474F' },
  published: { bg: '#DFF3E6', fg: '#1F6B43' },
  scheduled: { bg: '#FFF2D6', fg: '#8A6D1F' },
}

const cell: React.CSSProperties = {
  borderBottom: '1px solid #E6E8EB',
  fontSize: 13,
  padding: '10px 12px',
  textAlign: 'left',
  verticalAlign: 'top',
}

const head: React.CSSProperties = {
  ...cell,
  borderBottom: '2px solid #D9DDE2',
  color: '#41474F',
  fontSize: 11,
  letterSpacing: '.08em',
  textTransform: 'uppercase',
}

const button: React.CSSProperties = {
  background: '#F4F5F7',
  border: '1px solid #D9DDE2',
  borderRadius: 6,
  color: '#0B2233',
  cursor: 'pointer',
  fontSize: 12,
  fontFamily: 'inherit',
  padding: '5px 10px',
}

const primaryButton: React.CSSProperties = {
  ...button,
  background: '#0B2233',
  borderColor: '#0B2233',
  color: '#FFFFFF',
}

const dateOnly = (value: unknown): string => {
  if (typeof value !== 'string' || value.length === 0) {
    return '-'
  }
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '-' : date.toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })
}

type DashboardDoc = { [key: string]: unknown }

/** Publish / unpublish straight from the desk. Server-side, role-checked, no approval step. */
async function setStatus(formData: FormData): Promise<void> {
  'use server'

  const id = String(formData.get('id') ?? '')
  const next = String(formData.get('status') ?? '')
  if (!id || (next !== 'published' && next !== 'draft')) {
    return
  }

  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await headers() })

  if (!user) {
    redirect('/admin/login')
  }

  // The same rule the collection enforces: admin and tech may publish, nobody else may.
  const req = { user } as never
  if (!hasRoleReq(req, 'admin', 'tech')) {
    return
  }

  await payload.update({
    id,
    collection: COLLECTION,
    data: { _status: next },
    depth: 0,
    overrideAccess: false,
    user,
  })

  revalidatePath(DESK)
  revalidatePath('/company/media')
  revalidatePath('/sitemap.xml')
}

export async function NewsroomDashboard() {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await headers() })

  if (!user) {
    redirect('/admin/login')
  }

  const roles = rolesOf({ user } as never)
  const canWrite = roles.some((role) => role === 'admin' || role === 'tech')
  const canPreview = roles.some((role) => isStaffRole(role))

  const { docs } = await payload.find({
    collection: COLLECTION,
    depth: 0,
    draft: true,
    limit: 200,
    overrideAccess: false,
    sort: '-updatedAt',
    user,
  })

  const articles = docs as unknown as DashboardDoc[]
  const counts = articles.reduce<Record<NewsroomStatus, number>>(
    (acc, doc) => {
      const status = newsroomStatus({
        _status: doc._status as string,
        publishAt: doc.publishAt as string,
        schedulePublication: doc.schedulePublication === true,
      })
      acc[status] += 1
      return acc
    },
    { draft: 0, published: 0, scheduled: 0 },
  )

  return (
    <div style={{ padding: '40px 0' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between', marginBottom: 8 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-.02em', margin: 0 }}>Newsroom</h1>
          <p style={{ color: '#5A6472', fontSize: 14, margin: '6px 0 0' }}>
            Every story on /company/media. Create, edit, preview, publish or unpublish - publishing is immediate, with
            no approval step.
          </p>
        </div>
        <Link
          href={`/admin/collections/${COLLECTION}/create`}
          style={{ ...primaryButton, alignSelf: 'flex-start', padding: '9px 16px', textDecoration: 'none' }}
        >
          Create article
        </Link>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, margin: '18px 0 22px' }}>
        {(Object.keys(STATUS_LABEL) as NewsroomStatus[]).map((status) => (
          <div key={status} style={{ border: '1px solid #E6E8EB', borderRadius: 8, padding: '10px 16px' }}>
            <div style={{ color: '#5A6472', fontSize: 11, letterSpacing: '.08em', textTransform: 'uppercase' }}>
              {STATUS_LABEL[status]}
            </div>
            <div style={{ fontSize: 20, fontWeight: 600 }}>{counts[status]}</div>
          </div>
        ))}
      </div>

      {articles.length === 0 ? (
        <div style={{ border: '1px solid #E6E8EB', borderRadius: 8, padding: 24 }}>
          <p style={{ fontWeight: 600, margin: 0 }}>No articles yet.</p>
          <p style={{ color: '#5A6472', fontSize: 13, margin: '6px 0 0' }}>
            Create the first one - it appears in the Newsroom the moment it is published.
          </p>
        </div>
      ) : (
        <div style={{ border: '1px solid #E6E8EB', borderRadius: 8, overflow: 'hidden' }}>
          <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr>
                <th style={head}>Article title</th>
                <th style={head}>Category</th>
                <th style={head}>Status</th>
                <th style={head}>Created</th>
                <th style={head}>Updated</th>
                <th style={head}>Publication date</th>
                <th style={head}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((doc) => {
                const id = String(doc.id)
                const status = newsroomStatus({
                  _status: doc._status as string,
                  publishAt: doc.publishAt as string,
                  schedulePublication: doc.schedulePublication === true,
                })
                const tone = STATUS_TONE[status]
                return (
                  <tr key={id}>
                    <td style={cell}>
                      <Link
                        href={`/admin/collections/${COLLECTION}/${id}`}
                        style={{ color: '#0B2233', fontWeight: 600, textDecoration: 'none' }}
                      >
                        {String(doc.title ?? '(untitled)')}
                      </Link>
                      {doc.featured === true ? (
                        <span style={{ color: '#8A6D1F', fontSize: 11, marginLeft: 8, textTransform: 'uppercase' }}>
                          Featured
                        </span>
                      ) : null}
                      <div style={{ color: '#8A929E', fontSize: 11 }}>/{String(doc.slug ?? '')}</div>
                    </td>
                    <td style={cell}>{String(doc.category ?? '-')}</td>
                    <td style={cell}>
                      <span
                        style={{
                          background: tone.bg,
                          borderRadius: 999,
                          color: tone.fg,
                          fontSize: 11,
                          fontWeight: 600,
                          padding: '3px 10px',
                        }}
                      >
                        {STATUS_LABEL[status]}
                      </span>
                    </td>
                    <td style={cell}>{dateOnly(doc.createdAt)}</td>
                    <td style={cell}>{dateOnly(doc.updatedAt)}</td>
                    <td style={cell}>{dateOnly(doc.publishAt)}</td>
                    <td style={cell}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        <Link
                          href={`/admin/collections/${COLLECTION}/${id}`}
                          style={{ ...button, textDecoration: 'none' }}
                        >
                          Edit
                        </Link>
                        {canPreview ? (
                          <a
                            href={`/newsroom-preview/${id}/`}
                            rel="noreferrer"
                            style={{ ...button, textDecoration: 'none' }}
                            target="_blank"
                          >
                            Preview
                          </a>
                        ) : null}
                        {canWrite ? (
                          <form action={setStatus} style={{ display: 'inline' }}>
                            <input name="id" type="hidden" value={id} />
                            <input name="status" type="hidden" value={status === 'published' ? 'draft' : 'published'} />
                            <button style={status === 'published' ? button : primaryButton} type="submit">
                              {status === 'published' ? 'Unpublish' : 'Publish'}
                            </button>
                          </form>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <p style={{ color: '#8A929E', fontSize: 12, marginTop: 18 }}>
        Status is derived from the draft flag and the publication date: a draft dated in the future is Scheduled and
        publishes itself at that time. Signed in as {String((user as { email?: string }).email ?? 'staff')}
        {canWrite ? '' : ' (read-only for Newsroom content)'}.
      </p>
    </div>
  )
}
