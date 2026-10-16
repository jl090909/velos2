// End-to-end access-control checks against the running CMS (HTTP level).
// Usage: node scripts/verify-cms.mjs
//
// Covers: authentication, role separation (HR vs Tech vs Admin), anonymous publication rules,
// draft leakage, and user-account privacy. Exits non-zero if any check fails.

import { api, countWhere, doc, findWhere, login, para, required } from './cms-http.mjs'

const results = []
const stamp = Date.now()

const check = (name, pass, detail = '') => {
  results.push({ detail, name, pass: Boolean(pass) })
}

const statusOf = async (method, path, options) => {
  try {
    const { status } = await api(method, path, options)
    return status
  } catch (error) {
    if (typeof error.status === 'number') {
      return error.status
    }
    throw error
  }
}

const main = async () => {
  const admin = await login(required('SEED_ADMIN_EMAIL'), required('SEED_ADMIN_PASSWORD'))
  const hr = await login(required('SEED_HR_EMAIL'), required('SEED_HR_PASSWORD'))
  const tech = await login(required('SEED_TECH_EMAIL'), required('SEED_TECH_PASSWORD'))

  check('admin account authenticates', Boolean(admin.token), `roles=${admin.roles.join(',')}`)
  check('hr account authenticates with the hr role', hr.roles.includes('hr'), `roles=${hr.roles.join(',')}`)
  check('tech account authenticates with the tech role', tech.roles.includes('tech'), `roles=${tech.roles.join(',')}`)

  // ------------------------------------------------------------- anon reads
  const anonJobs = await countWhere('jobs', { 'where[postingStatus][equals]': 'open' })
  check('anonymous visitor can read published job openings', anonJobs.total >= 4, `total=${anonJobs.total}`)

  const anonPapers = await countWhere('whitepapers')
  check('anonymous visitor can read published whitepapers', anonPapers.total >= 4, `total=${anonPapers.total}`)

  const anonArticles = await countWhere('knowledge-hub-articles')
  check('anonymous visitor can read published knowledge hub articles', anonArticles.total >= 2, `total=${anonArticles.total}`)

  const anonUsers = await countWhere('users')
  check('user accounts are never readable anonymously', anonUsers.total === 0, `total=${anonUsers.total}`)

  // --------------------------------------------------------- role separation
  const unauthCreate = await statusOf('POST', '/api/jobs/', {
    body: { location: 'x', summary: 'x', team: 'x', title: 'unauth' },
  })
  check('unauthenticated visitors cannot create a job opening', unauthCreate === 401 || unauthCreate === 403, `HTTP ${unauthCreate}`)

  const qaBody = doc(para('QA fixture created by scripts/verify-cms.mjs. Safe to delete.'))

  const hrJob = await api('POST', '/api/jobs/', {
    body: {
      _status: 'published',
      description: qaBody,
      employmentType: 'Full-time',
      location: 'QA',
      postingStatus: 'open',
      slug: `qa-hr-job-${stamp}`,
      summary: 'Created by scripts/verify-cms.mjs to prove HR access.',
      team: 'QA',
      title: `QA HR job ${stamp}`,
      workMode: 'Remote',
    },
    token: hr.token,
  })
  check(
    'hr can create a job opening',
    hrJob.status === 201 && Boolean(hrJob.body?.doc?.id),
    hrJob.status === 201 ? `HTTP ${hrJob.status}` : `HTTP ${hrJob.status} ${JSON.stringify(hrJob.body?.errors ?? hrJob.body).slice(0, 220)}`,
  )

  const techJobStatus = await statusOf('POST', '/api/jobs/', {
    body: { _status: 'published', description: qaBody, location: 'QA', postingStatus: 'open', slug: `qa-tech-job-${stamp}`, summary: 'should never exist', team: 'QA', title: 'nope', workMode: 'Remote' },
    token: tech.token,
  })
  check('tech is refused when creating a job opening', techJobStatus === 403 || techJobStatus === 401, `HTTP ${techJobStatus}`)

  const techArticle = await api('POST', '/api/knowledge-hub-articles/', {
    body: {
      _status: 'published',
      authorName: 'QA',
      body: qaBody,
      category: 'OT Security',
      excerpt: 'Created by scripts/verify-cms.mjs to prove Tech access.',
      slug: `qa-tech-article-${stamp}`,
      title: `QA article ${stamp}`,
    },
    token: tech.token,
  })
  check(
    'tech can create a Knowledge Hub article',
    techArticle.status === 201 && Boolean(techArticle.body?.doc?.id),
    techArticle.status === 201 ? `HTTP ${techArticle.status}` : `HTTP ${techArticle.status} ${JSON.stringify(techArticle.body?.errors ?? techArticle.body).slice(0, 220)}`,
  )

  const hrArticleStatus = await statusOf('POST', '/api/knowledge-hub-articles/', {
    body: { _status: 'published', authorName: 'QA', body: qaBody, category: 'OT Security', excerpt: 'should never exist', slug: `qa-hr-article-${stamp}`, title: 'nope' },
    token: hr.token,
  })
  check('hr is refused when creating a Knowledge Hub article', hrArticleStatus === 403 || hrArticleStatus === 401, `HTTP ${hrArticleStatus}`)

  const hrDeleteStatus = await statusOf('DELETE', `/api/jobs/${hrJob.body?.doc?.id}/`, { token: hr.token })
  check('hr cannot delete a job opening (admin only)', hrDeleteStatus === 403, `HTTP ${hrDeleteStatus}`)

  const hrUserCreate = await statusOf('POST', '/api/users/', {
    body: { email: `qa-${stamp}@velosshield.test`, password: 'not-a-real-account-1', roles: ['admin'] },
    token: hr.token,
  })
  check('hr cannot create staff accounts', hrUserCreate === 401 || hrUserCreate === 403, `HTTP ${hrUserCreate}`)

  // ------------------------------------------------------------- draft rules
  const draftJob = await api('POST', '/api/jobs/', {
    body: {
      _status: 'draft',
      description: qaBody,
      employmentType: 'Full-time',
      location: 'QA',
      postingStatus: 'open',
      slug: `qa-draft-job-${stamp}`,
      summary: 'Draft that must never reach the public site.',
      team: 'QA',
      title: `QA draft job ${stamp}`,
      workMode: 'Remote',
    },
    token: hr.token,
  })
  check('hr can save a draft job opening', draftJob.status === 201, `HTTP ${draftJob.status}`)

  const anonDraft = await countWhere('jobs', { 'where[slug][equals]': `qa-draft-job-${stamp}` })
  check('draft job opening is invisible to anonymous visitors', anonDraft.total === 0, `total=${anonDraft.total}`)

  const anonDraftFlag = await countWhere('jobs', { draft: 'true' })
  check('?draft=true does not leak drafts to anonymous visitors', !anonDraftFlag.docs.some((entry) => entry.slug === `qa-draft-job-${stamp}`), `returned=${anonDraftFlag.total}`)

  const staffSeesDraft = await findWhere('jobs', { 'where[slug][equals]': `qa-draft-job-${stamp}` }, hr.token)
  check('staff can see their own draft in the CMS', Boolean(staffSeesDraft), staffSeesDraft ? '_status=' + staffSeesDraft._status : '')

  // ------------------------------------- customers / events / press (tech owns)
  const techCustomer = await api('POST', '/api/customers/', {
    body: {
      _status: 'published',
      name: `QA customer ${stamp}`,
      sector: 'QA',
      slug: `qa-customer-${stamp}`,
      summary: 'Created by scripts/verify-cms.mjs.',
    },
    token: tech.token,
  })
  check(
    'tech can add a customer',
    techCustomer.status === 201 && Boolean(techCustomer.body?.doc?.id),
    techCustomer.status === 201 ? `HTTP ${techCustomer.status}` : `HTTP ${techCustomer.status} ${JSON.stringify(techCustomer.body?.errors ?? techCustomer.body).slice(0, 200)}`,
  )

  const hrCustomerStatus = await statusOf('POST', '/api/customers/', {
    body: { _status: 'published', name: 'nope', sector: 'QA', slug: `qa-hr-customer-${stamp}`, summary: 'should never exist' },
    token: hr.token,
  })
  check('hr is refused when adding a customer', hrCustomerStatus === 403 || hrCustomerStatus === 401, `HTTP ${hrCustomerStatus}`)

  const techEvent = await api('POST', '/api/events/', {
    body: {
      _status: 'published',
      city: 'QA',
      eventType: 'Webinar',
      slug: `qa-event-${stamp}`,
      startDate: new Date().toISOString(),
      summary: 'Created by scripts/verify-cms.mjs.',
      title: `QA event ${stamp}`,
    },
    token: tech.token,
  })
  check(
    'tech can add an event',
    techEvent.status === 201 && Boolean(techEvent.body?.doc?.id),
    techEvent.status === 201 ? `HTTP ${techEvent.status}` : `HTTP ${techEvent.status} ${JSON.stringify(techEvent.body?.errors ?? techEvent.body).slice(0, 200)}`,
  )

  const hrEventStatus = await statusOf('POST', '/api/events/', {
    body: { _status: 'published', city: 'QA', eventType: 'Webinar', slug: `qa-hr-event-${stamp}`, startDate: new Date().toISOString(), summary: 'should never exist', title: 'nope' },
    token: hr.token,
  })
  check('hr is refused when adding an event', hrEventStatus === 403 || hrEventStatus === 401, `HTTP ${hrEventStatus}`)

  const techMention = await api('POST', '/api/press-mentions/', {
    body: {
      _status: 'published',
      headline: `QA mention ${stamp}`,
      kind: 'News',
      outlet: 'QA outlet',
      publishedDate: new Date().toISOString(),
      url: 'https://example.com/qa',
    },
    token: tech.token,
  })
  check(
    'tech can add a press mention',
    techMention.status === 201 && Boolean(techMention.body?.doc?.id),
    techMention.status === 201 ? `HTTP ${techMention.status}` : `HTTP ${techMention.status} ${JSON.stringify(techMention.body?.errors ?? techMention.body).slice(0, 200)}`,
  )

  const anonCustomers = await countWhere('customers', { 'where[slug][equals]': `qa-customer-${stamp}` })
  check('a published customer is visible to anonymous visitors', anonCustomers.total === 1, `total=${anonCustomers.total}`)

  const anonEvents = await countWhere('events', { 'where[slug][equals]': `qa-event-${stamp}` })
  check('a published event is visible to anonymous visitors', anonEvents.total === 1, `total=${anonEvents.total}`)

  const draftCustomer = await api('POST', '/api/customers/', {
    body: { _status: 'draft', name: `QA draft customer ${stamp}`, sector: 'QA', slug: `qa-draft-customer-${stamp}`, summary: 'must stay private' },
    token: tech.token,
  })
  const anonDraftCustomer = await countWhere('customers', { 'where[slug][equals]': `qa-draft-customer-${stamp}` })
  check('a draft customer stays invisible to anonymous visitors', draftCustomer.status === 201 && anonDraftCustomer.total === 0, `HTTP ${draftCustomer.status} total=${anonDraftCustomer.total}`)

  // -------------------------------------------------------------- cleanup
  const deleted = []
  for (const [collection, id] of [
    ['jobs', hrJob.body?.doc?.id],
    ['jobs', draftJob.body?.doc?.id],
    ['knowledge-hub-articles', techArticle.body?.doc?.id],
    ['customers', techCustomer.body?.doc?.id],
    ['customers', draftCustomer.body?.doc?.id],
    ['events', techEvent.body?.doc?.id],
    ['press-mentions', techMention.body?.doc?.id],
  ]) {
    const res = await api('DELETE', `/api/${collection}/${id}/`, { token: admin.token })
    deleted.push(res.status)
  }
  check(
    'admin can delete the throwaway QA records',
    deleted.every((status) => status === 200),
    `HTTP ${deleted.join('/')}`,
  )

  const remaining = await countWhere('jobs', { 'where[slug][equals]': `qa-hr-job-${stamp}` })
  check('deleted QA job opening is gone', remaining.total === 0, `total=${remaining.total}`)

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
  console.error('verify-cms failed:', error)
  process.exit(1)
})
