// Seeds the Velos Shield CMS with launch content. Idempotent: existing slugs/emails are skipped.
// Usage: node scripts/seed.mjs   (server must be running on $NEXT_PUBLIC_SERVER_URL or $CMS_URL)

import { api, bullets, doc, findWhere, firstRegister, heading, login, para, required } from './cms-http.mjs'
import { AIRPORT_BODY } from './data/airport-bms-body.mjs'

const published = { _status: 'published' }

const log = (line) => console.log('  ' + line)

const main = async () => {
  const created = []
  const skipped = []

  // ---------------------------------------------------------------- admin
  const adminEmail = required('SEED_ADMIN_EMAIL')
  const adminPassword = required('SEED_ADMIN_PASSWORD')
  let adminToken
  const bootstrap = await firstRegister(adminEmail, adminPassword, 'Velos Admin')
  if (bootstrap.token && bootstrap.status < 300) {
    adminToken = bootstrap.token
    created.push(`user ${adminEmail} (first admin account, role=admin)`)
  } else {
    adminToken = (await login(adminEmail, adminPassword)).token
    skipped.push(`user ${adminEmail} (already present, authenticated)`)
  }

  // ---------------------------------------------------------- staff accounts
  const staff = [
    { email: required('SEED_HR_EMAIL'), jobTitle: 'People Operations', name: 'HR Team', password: required('SEED_HR_PASSWORD'), roles: ['hr'] },
    { email: required('SEED_TECH_EMAIL'), jobTitle: 'OT Security Engineering', name: 'Tech Team', password: required('SEED_TECH_PASSWORD'), roles: ['tech'] },
  ]
  for (const person of staff) {
    const existing = await findWhere('users', { 'where[email][equals]': person.email }, adminToken)
    if (existing) {
      skipped.push(`user ${person.email}`)
      continue
    }
    await api('POST', '/api/users/', { body: person, expect: 201, token: adminToken })
    created.push(`user ${person.email} (role=${person.roles.join(',')})`)
  }

  // -------------------------------------------------------------------- jobs
  const jobs = [
    {
      description: doc(
        para('You will build the embedded sensing and protocol-parsing layer that lets Velos Sensor interpret industrial traffic without disturbing the process it observes.'),
        heading('What you will do'),
        bullets([
          'Develop the passive capture pipeline that runs on constrained industrial hardware.',
          'Implement and extend protocol dissectors for Modbus, DNP3, IEC 60870-5-104, S7comm and BACnet.',
          'Work with the research team to turn findings into shipped detections.',
          'Own firmware release quality: tests, telemetry and rollback safety.',
        ]),
        heading('What we look for'),
        bullets([
          'Strong C and C++ with Linux systems fundamentals.',
          'Experience shipping software onto hardware you cannot reboot on a whim.',
          'Industrial protocol familiarity, or a demonstrated ability to learn a protocol family quickly.',
        ]),
      ),
      employmentType: 'Full-time',
      experience: '4-8 years',
      location: 'Delhi',
      requirements: [{ item: 'C/C++ on Linux, including cross-compilation' }, { item: 'Packet capture and protocol parsing' }, { item: 'Comfort operating in industrial or OT environments' }],
      responsibilities: [{ item: 'Own the passive capture pipeline' }, { item: 'Extend protocol dissectors' }, { item: 'Harden firmware releases' }],
      postingStatus: 'open',
      slug: 'embedded-software-engineer',
      summary: 'Build the passive sensing layer behind Velos Sensor: protocol-aware capture that never touches the process.',
      team: 'Engineering',
      title: 'Embedded Software Engineer',
      workMode: 'On-site',
    },
    {
      description: doc(
        para('Our published research is the reason plant teams take these calls. You will keep that standard: every claim traceable to evidence, every detection explained in operational terms.'),
        heading('What you will do'),
        bullets([
          'Reverse engineer industrial protocols and adversary tooling.',
          'Develop and validate detections against captures from real sites.',
          'Publish field notes and point-of-view papers alongside the marketing team.',
          'Support customer escalations that need genuine technical depth.',
        ]),
        heading('What we look for'),
        bullets([
          'An evidence-first instinct: you cite the capture, not the blog post.',
          'Ability to explain cyber-physical consequence to a plant manager and an engineer in the same conversation.',
          'Self-directed research habits.',
        ]),
      ),
      employmentType: 'Full-time',
      experience: '3-10 years',
      location: 'Remote',
      requirements: [{ item: 'Protocol and binary analysis experience' }, { item: 'Detection engineering or threat research background' }, { item: 'Clear technical writing' }],
      responsibilities: [{ item: 'Reverse engineer protocols and tooling' }, { item: 'Validate detections on real captures' }, { item: 'Publish research' }],
      postingStatus: 'open',
      slug: 'security-researcher',
      summary: 'Hunt in industrial networks, validate detections against real captures and publish work that stands up to scrutiny.',
      team: 'Research',
      title: 'Security Researcher',
      workMode: 'Remote',
    },
    {
      description: doc(
        para('You will translate a plant walk-through into an architecture a CISO can fund and an engineer can trust: no rip-and-replace, no traffic injection, no surprise outages.'),
        heading('What you will do'),
        bullets([
          'Run discovery workshops with plant, security and executive stakeholders.',
          'Design sensor placement, segmentation and SOC integration for brownfield environments.',
          'Own technical validation from pilot through to production.',
          'Feed field reality back into the product roadmap.',
        ]),
        heading('What we look for'),
        bullets([
          'Experience designing monitoring or security architecture inside OT networks.',
          'Credibility with both control engineers and security leadership.',
          'Willingness to travel to sites, including airports and process plants.',
        ]),
      ),
      employmentType: 'Full-time',
      experience: '5-12 years',
      location: 'India',
      requirements: [{ item: 'OT/ICS network architecture experience' }, { item: 'Stakeholder-facing discovery and scoping' }, { item: 'Purdue model and IEC 62443 working knowledge' }],
      responsibilities: [{ item: 'Run discovery workshops' }, { item: 'Design sensor placement and integration' }, { item: 'Own pilots through to production' }],
      postingStatus: 'open',
      slug: 'solutions-architect',
      summary: 'Design OT monitoring architecture for airports, ports and plants, then prove it works in a live pilot.',
      team: 'Sales Eng.',
      title: 'Solutions Architect',
      workMode: 'Hybrid',
    },
    {
      description: doc(
        para('Site walks and asset inventories are where the platform meets reality. You will capture device truth from the floor and turn it into a register operations will actually use.'),
        heading('What you will do'),
        bullets([
          'Perform passive asset discovery visits across industrial sites.',
          'Produce and maintain verified asset inventories and risk-scored registers.',
          'Document findings so they survive the engagement.',
        ]),
        heading('What we look for'),
        bullets([
          'Comfortable in operational areas with strict safety and change rules.',
          'Methodical documentation discipline.',
        ]),
      ),
      employmentType: 'Contract',
      experience: '2-6 years',
      location: 'Mumbai',
      requirements: [{ item: 'Networking fundamentals' }, { item: 'Site survey or commissioning experience' }, { item: 'Safety-first mindset on live plants' }],
      responsibilities: [{ item: 'Run passive discovery at customer sites' }, { item: 'Maintain the verified asset register' }],
      postingStatus: 'open',
      slug: 'ot-field-engineer',
      summary: 'Walk the plant, capture asset truth and turn it into a register operations trusts.',
      team: 'Field Services',
      title: 'OT Field Engineer',
      workMode: 'On-site',
    },
  ]

  for (const job of jobs) {
    const existing = await findWhere('jobs', { 'where[slug][equals]': job.slug }, adminToken)
    if (existing) {
      skipped.push(`job ${job.slug}`)
      continue
    }
    await api('POST', '/api/jobs/', { body: { ...job, ...published }, expect: 201, token: adminToken })
    created.push(`job ${job.slug}`)
  }

  // --------------------------------------------------------------- resources
  const papers = [
    {
      body: AIRPORT_BODY,
      keyPoints: [{ point: 'Verified asset inventory' }, { point: 'Risk-scored register' }, { point: 'SOC-integrated NIDS' }],
      kind: 'Case Study',
      pdfPath: '/resources/airport-bms-cybersecurity-case-study.pdf',
      publishedDate: '2026-08-20T09:00:00.000Z',
      readTime: '~18 min read',
      region: 'United Kingdom',
      sector: 'Airport Operations - Building Management Systems',
      series: 'Airport Operations - Building Management Systems',
      slug: 'airport-bms-cybersecurity-case-study',
      subtitle: 'Continuous visibility without touching a single controller',
      summary: 'How an airport gained a verified BMS inventory, a prioritised vulnerability register, and protocol-aware threat detection, with Gramax assessment plus Velos Shield continuous monitoring.',
      title: 'Strengthening Cybersecurity of Airport Building Management Systems',
    },
    {
      keyPoints: [{ point: 'Operational Context Stack' }, { point: '5 incident case studies' }, { point: 'Operational Materiality model' }],
      kind: 'Whitepaper',
      pdfPath: '/resources/rethinking-ot-cyber-risk-beyond-cvss.pdf',
      publishedDate: '2026-08-12T09:00:00.000Z',
      readOnlinePath: '/resources/rethinking-ot-cyber-risk-beyond-cvss',
      readTime: '~28 min read',
      series: 'POV Whitepaper Series - August 2026',
      slug: 'rethinking-ot-cyber-risk-beyond-cvss',
      subtitle: 'The Operational Context Gap',
      summary: 'Why severity is not consequence. How the six-layer Operational Context Stack closes the gap between what security tools describe and what operations needs to decide, illustrated through five documented incidents.',
      title: 'Rethinking OT Cyber Risk Beyond CVSS',
    },
    {
      keyPoints: [{ point: '6-part framework' }, { point: 'Event-centric monitoring' }, { point: 'Evidence-grounded AI' }],
      kind: 'Whitepaper',
      pdfPath: '/resources/from-packets-to-plant-impact.pdf',
      publishedDate: '2026-08-05T09:00:00.000Z',
      readOnlinePath: '/resources/from-packets-to-plant-impact',
      readTime: '~24 min read',
      series: 'POV Whitepaper Series - August 2026',
      slug: 'from-packets-to-plant-impact',
      subtitle: 'Why the next evolution of OT monitoring is not about seeing more',
      summary: 'Six beliefs, one direction: See, Preserve, Interpret, Prepare, Remember, Understand. From passive visibility to evidence-grounded AI to a plant that can explain itself.',
      title: 'From Packets to Plant Impact',
    },
    {
      featured: true,
      keyPoints: [{ point: '2-page overview' }, { point: 'Industries covered' }, { point: 'Platform pillars' }],
      kind: 'Brochure',
      pdfPath: '/velosshield-brochure.pdf',
      publishedDate: '2026-07-28T09:00:00.000Z',
      readTime: '2 pages - PDF',
      series: 'Velos Shield - Platform Brochure',
      slug: 'brochure',
      subtitle: 'OT/ICS Security Platform at a glance',
      summary: 'The attack surface every industrial facility runs on, and how Velos Shield turns visibility into insight across manufacturing, energy, airports, maritime and smart cities.',
      title: 'Velos Shield Platform Brochure',
    },
  ]

  for (const paper of papers) {
    const existing = await findWhere('whitepapers', { 'where[slug][equals]': paper.slug }, adminToken)
    if (existing) {
      skipped.push(`whitepaper ${paper.slug}`)
      continue
    }
    await api('POST', '/api/whitepapers/', { body: { ...paper, ...published }, expect: 201, token: adminToken })
    created.push(`whitepaper ${paper.slug}`)
  }

  // ------------------------------------------------------------ knowledge hub
  const articles = [
    {
      authorName: 'Research Team',
      authorRole: 'Velos Shield OT Security Research',
      body: doc(
        para('CVSS answers a narrow question: how bad can this vulnerability be in the worst case. Operations asks a different one: what happens to the process if it is exercised today, on this asset, during this batch.'),
        heading('Severity is not consequence'),
        bullets([
          'A 9.8 on an engineering workstation reachable only from a jump host is not the same risk as a 6.5 on the interlocked controller running the line.',
          'Process state decides impact: the same flaw is a nuisance at idle and a safety event mid-batch.',
          'Compensating controls that exist on paper are not compensating controls that are in place.',
        ]),
        heading('What we score instead'),
        para('We keep the scanner data and layer operational context over it: asset role, network reachability, process dependency, existing compensating controls, and the window in which the asset is actually live. The output is a register ordered by what operations would have to suspend if it were exercised, not by what a scanner would like fixed first.'),
        heading('Field note'),
        para('At one site the highest CVSS score in the estate sat on a reporting server nobody depended on. The item that mattered was a medium-severity flaw on the historian interface every operator screen queried. Ordering by severity would have fixed the wrong thing first.'),
      ),
      category: 'OT Security',
      excerpt: 'Scanner severity ranks vulnerabilities in the abstract. Operations needs ranking against consequence. How we layer process context over CVSS without discarding the scanner data.',
      publishedDate: '2026-09-18T09:00:00.000Z',
      readingTime: '6 min read',
      slug: 'ranking-ot-vulnerabilities-by-consequence',
      tags: [{ tag: 'Vulnerability management' }, { tag: 'Operational context' }, { tag: 'Risk scoring' }],
      title: 'Ranking OT vulnerabilities by consequence, not by score',
    },
    {
      authorName: 'Research Team',
      authorRole: 'Velos Shield OT Security Research',
      body: doc(
        para('A passive sensor that is allowed to be wrong is a liability. Before any model touches the network, the capture path has to be provably non-intrusive: the observation path must be able to fail without touching the process.'),
        heading('The three properties we test for'),
        bullets([
          'Read-only by construction: TAP or SPAN, never inline, never ARP-spoofed.',
          'Fail-open: losing the sensor must never degrade the monitored segment.',
          'Proven absence of transmitted frames: verified on the wire, not by configuration review.',
        ]),
        heading('How we verify it'),
        para('Every pilot starts with a capture-based verification step: mirror the observation port, induce sensor faults, and confirm the industrial segment sees nothing new. That evidence is handed to the customer alongside the findings, because "we checked the config" is not an answer an OT change board accepts.'),
        heading('Why this matters commercially'),
        para('The blocker for OT monitoring is rarely technology, it is the change window. Evidence that the sensor cannot affect the plant is what converts a security project into a scheduled, low-risk activity, and that is what gets it funded.'),
      ),
      category: 'Architecture',
      excerpt: 'Evidence that the sensor cannot affect the plant is what converts an OT security project from an argument into a change-window booking.',
      publishedDate: '2026-09-04T09:00:00.000Z',
      readingTime: '5 min read',
      slug: 'proving-a-passive-sensor-cannot-touch-the-plant',
      tags: [{ tag: 'Passive monitoring' }, { tag: 'Deployment' }, { tag: 'Change management' }],
      title: 'Proving a passive sensor cannot touch the plant',
    },
  ]

  for (const article of articles) {
    const existing = await findWhere('knowledge-hub-articles', { 'where[slug][equals]': article.slug }, adminToken)
    if (existing) {
      skipped.push(`article ${article.slug}`)
      continue
    }
    await api('POST', '/api/knowledge-hub-articles/', { body: { ...article, ...published }, expect: 201, token: adminToken })
    created.push(`article ${article.slug}`)
  }

  // ------------------------------------------- customers / events / press (drafts)
  // Seeded as DRAFTS on purpose: these are review stubs, not approved public claims. They show up in
  // the CMS for the tech team to edit and publish, and stay invisible to anonymous visitors until then.
  const draft = { _status: 'draft' }

  const customers = [
    {
      displayOrder: 10,
      featured: true,
      name: 'Sample: international airport operator',
      region: 'Middle East',
      sector: 'Airports',
      slug: 'sample-airport-operator',
      summary:
        'Draft placeholder. Replace with the approved reference: what was monitored, what became visible, and the operational outcome.',
    },
    {
      displayOrder: 20,
      name: 'Sample: process manufacturer',
      region: 'India',
      sector: 'Manufacturing',
      slug: 'sample-process-manufacturer',
      summary: 'Draft placeholder. Approved reference wording to be supplied by Velos Shield.',
    },
    {
      displayOrder: 30,
      name: 'Sample: energy utility',
      region: 'UK',
      sector: 'Energy',
      slug: 'sample-energy-utility',
      summary: 'Draft placeholder. Approved reference wording to be supplied by Velos Shield.',
    },
  ]
  for (const customer of customers) {
    const existing = await findWhere('customers', { 'where[slug][equals]': customer.slug }, adminToken)
    if (existing) {
      skipped.push(`customer ${customer.slug}`)
      continue
    }
    await api('POST', '/api/customers/', { body: { ...customer, ...draft }, expect: 201, token: adminToken })
    created.push(`customer ${customer.slug} (draft)`)
  }

  const events = [
    {
      city: 'Dubai',
      country: 'United Arab Emirates',
      eventType: 'Exhibition',
      booth: 'Stand to be confirmed',
      description: doc(
        para('Draft placeholder for the event briefing: what the team is showing, the session times, and who to ask for at the stand.'),
      ),
      endDate: '2026-12-11T09:00:00.000Z',
      registrationUrl: 'https://example.com/register',
      slug: 'sample-exhibition-dubai',
      startDate: '2026-12-09T09:00:00.000Z',
      summary: 'Draft placeholder event. Replace with the confirmed event, dates and stand number.',
      title: 'Sample: industrial security exhibition, Dubai',
      venue: 'Exhibition centre',
    },
    {
      city: 'Online',
      country: '',
      eventType: 'Webinar',
      description: doc(
        para('Draft placeholder for the webinar abstract and speaker list.'),
        heading('Agenda'),
        bullets(['Operational context vs scanner severity', 'Q&A']),
      ),
      slug: 'sample-technical-webinar',
      startDate: '2026-11-04T14:00:00.000Z',
      summary: 'Draft placeholder webinar. Replace with the real title, abstract and registration link.',
      title: 'Sample: technical briefing webinar',
      venue: 'Online',
    },
    {
      city: 'Mumbai',
      country: 'India',
      eventType: 'Conference',
      slug: 'sample-past-conference',
      startDate: '2026-06-18T09:00:00.000Z',
      summary: 'Draft placeholder for a past event, to exercise the archive table on /company/events.',
      title: 'Sample: past OT security conference',
      venue: 'Convention centre',
    },
  ]
  for (const event of events) {
    const existing = await findWhere('events', { 'where[slug][equals]': event.slug }, adminToken)
    if (existing) {
      skipped.push(`event ${event.slug}`)
      continue
    }
    await api('POST', '/api/events/', { body: { ...event, ...draft }, expect: 201, token: adminToken })
    created.push(`event ${event.slug} (draft)`)
  }

  const mentions = [
    {
      excerpt: 'Draft placeholder for the pull quote or summary from the piece.',
      headline: 'Sample: coverage of OT risk prioritisation',
      kind: 'Feature',
      outlet: 'Sample outlet',
      publishedDate: '2026-09-22T09:00:00.000Z',
      url: 'https://example.com/sample-coverage',
    },
    {
      headline: 'Sample: interview on passive OT monitoring',
      kind: 'Interview',
      outlet: 'Sample publication',
      publishedDate: '2026-08-14T09:00:00.000Z',
      url: 'https://example.com/sample-interview',
    },
  ]
  for (const mention of mentions) {
    const existing = await findWhere('press-mentions', { 'where[headline][equals]': mention.headline }, adminToken)
    if (existing) {
      skipped.push(`press mention ${mention.headline}`)
      continue
    }
    await api('POST', '/api/press-mentions/', { body: { ...mention, ...draft }, expect: 201, token: adminToken })
    created.push(`press mention (draft)`)
  }

  console.log('created:')
  for (const line of created) {
    log(line)
  }
  if (skipped.length > 0) {
    console.log('already present (skipped):')
    for (const line of skipped) {
      log(line)
    }
  }
  console.log(`done: ${created.length} created, ${skipped.length} skipped`)
}

main().catch((error) => {
  console.error('seed failed:', error)
  process.exit(1)
})
