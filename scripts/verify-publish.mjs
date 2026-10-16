// Proves the HR publishing loop end to end: create a job/article through the CMS API as a staff
// user and confirm it appears on the prerendered public page within the revalidation window,
// then remove it and confirm it disappears again.
// Usage: node scripts/verify-publish.mjs   (production build recommended, so ISR is in play)

import { api, doc, login, para, required } from './cms-http.mjs'

const results = []
const check = (name, pass, detail = '') => results.push({ detail, name, pass: Boolean(pass) })
const stamp = Date.now()
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const waitForText = async (url, needle, { attempts = 12, expect = true } = {}) => {
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const response = await fetch(url, { cache: 'no-store' })
    const html = await response.text()
    const present = html.includes(needle)
    if (present === expect) {
      return { attempts: attempt, ok: true }
    }
    await sleep(2500)
  }
  return { attempts, ok: false }
}

const main = async () => {
  const admin = await login(required('SEED_ADMIN_EMAIL'), required('SEED_ADMIN_PASSWORD'))
  const hr = await login(required('SEED_HR_EMAIL'), required('SEED_HR_PASSWORD'))
  const tech = await login(required('SEED_TECH_EMAIL'), required('SEED_TECH_PASSWORD'))

  const base = process.env.CMS_URL || process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3020'
  const jobTitle = `Publish probe engineer ${stamp}`
  const articleTitle = `Publish probe article ${stamp}`
  const body = doc(para('Temporary record created by scripts/verify-publish.mjs.'))

  const job = await api('POST', '/api/jobs/', {
    body: {
      _status: 'published',
      description: body,
      employmentType: 'Full-time',
      location: 'QA',
      postingStatus: 'open',
      slug: `publish-probe-job-${stamp}`,
      summary: 'Temporary record used to verify CMS publishing.',
      team: 'QA',
      title: jobTitle,
      workMode: 'Remote',
    },
    token: hr.token,
  })
  check('HR publishes a job opening through the CMS', job.status === 201, `HTTP ${job.status}`)

  const jobAppears = await waitForText(`${base}/company/careers/`, jobTitle)
  check('the new role appears on /company/careers without a redeploy', jobAppears.ok, `after ${jobAppears.attempts} fetch(es)`)

  const article = await api('POST', '/api/knowledge-hub-articles/', {
    body: {
      _status: 'published',
      authorName: 'QA',
      body,
      category: 'OT Security',
      excerpt: 'Temporary record used to verify CMS publishing.',
      publishedDate: new Date().toISOString(),
      readingTime: '1 min read',
      slug: `publish-probe-article-${stamp}`,
      title: articleTitle,
    },
    token: tech.token,
  })
  check('Tech publishes a Knowledge Hub article through the CMS', article.status === 201, `HTTP ${article.status}`)

  const articleAppears = await waitForText(`${base}/resources/knowledge-hub/`, articleTitle)
  check('the new article appears on /resources/knowledge-hub', articleAppears.ok, `after ${articleAppears.attempts} fetch(es)`)

  const pulled = await api('PATCH', `/api/jobs/${job.body?.doc?.id}/`, {
    body: { postingStatus: 'closed' },
    token: hr.token,
  })
  check('HR can close a role without deleting it', pulled.status === 200, `HTTP ${pulled.status}`)

  const jobGone = await waitForText(`${base}/company/careers/`, jobTitle, { expect: false })
  check('a closed role leaves the public careers page', jobGone.ok, `after ${jobGone.attempts} fetch(es)`)

  const removedJob = await api('DELETE', `/api/jobs/${job.body?.doc?.id}/`, { token: admin.token })
  const removedArticle = await api('DELETE', `/api/knowledge-hub-articles/${article.body?.doc?.id}/`, { token: admin.token })
  check('admin cleans up the probe records', removedJob.status === 200 && removedArticle.status === 200, `HTTP ${removedJob.status}/${removedArticle.status}`)

  // --------------------------------------------------------------- report
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
  console.error('verify-publish failed:', error)
  process.exit(1)
})
