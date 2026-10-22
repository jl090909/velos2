/**
 * The OT security carousel, ported from the standalone design artifact
 * (velos_shield_ot_security_carousel_clean.html).
 *
 * Deliberate differences from the artifact:
 *  - the eight slide graphics are vendored into /public/ot-carousel as WebP (~340 KB total) instead
 *    of hotlinking LinkedIn CDN URLs, which are signed and expire;
 *  - content lives here as typed data, not in a mutable `slides` array with contenteditable fields;
 *  - one sentence per role, which is how the artifact presented it by default ("dual" mode).
 *
 * Every slide carries one sentence for the security buyer and one for the operations buyer, each
 * with its role tag - that pairing is the point of the design, so it is modelled, not optional.
 */

export type OtSlideImage = { height: number; src: string; width: number }

export type OtSlide = {
  /** Two-digit slide number, shown in the counter, the dots and the kicker. */
  num: string
  topic: string
  /** Which side the artwork sits on at lg and up. Alternates down the set. */
  side: 'pic-left' | 'pic-right'
  media:
    | { kind: 'single'; images: [OtSlideImage] }
    | { kind: 'dual'; images: [OtSlideImage, OtSlideImage] }
    | { kind: 'quad'; images: [OtSlideImage, OtSlideImage, OtSlideImage, OtSlideImage] }
  ciso: { tag: string; text: string }
  coo: { tag: string; text: string }
}

const IMG = (n: number, width: number, height: number): OtSlideImage => ({
  height,
  src: `/ot-carousel/slide-0${n}.webp`,
  width,
})

const i1 = IMG(1, 800, 800)
const i2 = IMG(2, 640, 800)
const i3 = IMG(3, 800, 800)
const i4 = IMG(4, 640, 800)
const i5 = IMG(5, 800, 800)
const i6 = IMG(6, 640, 800)
const i7 = IMG(7, 800, 800)
const i8 = IMG(8, 640, 800)

export const OT_SLIDES: OtSlide[] = [
  {
    num: '01',
    topic: 'Passive OT asset discovery',
    side: 'pic-left',
    media: { kind: 'single', images: [i1] },
    ciso: {
      tag: '... for CISO/SOC',
      text: 'Passively discovers every PLC, RTU, HMI and shadow OT asset across Purdue Levels 0-3 to eliminate industrial blind spots',
    },
    coo: {
      tag: '... for COO/Ops',
      text: 'Inventories the entire plant floor over a passive TAP or SPAN port, with zero active polling and zero risk of tripping legacy controllers',
    },
  },
  {
    num: '02',
    topic: 'Zero-downtime edge sensor',
    side: 'pic-right',
    media: { kind: 'single', images: [i2] },
    ciso: {
      tag: '... for CISO/SOC',
      text: 'Streams deep industrial protocol telemetry into your security operations centre in minutes, without inline network cutovers',
    },
    coo: {
      tag: '... for COO/Ops',
      text: 'Deploys with no maintenance window and no line stop, so 24/7 plant throughput and safety systems stay untouched',
    },
  },
  {
    num: '03',
    topic: 'Network and conduit topology',
    side: 'pic-left',
    media: { kind: 'single', images: [i3] },
    ciso: {
      tag: '... for CISO/SOC',
      text: 'Maps every east-west and north-south communication flow to expose unauthorised IT/OT bridges and flat-network paths',
    },
    coo: {
      tag: '... for COO/Ops',
      text: 'Shows exact production cell dependencies so plant engineers can segment control zones without breaking upstream lines',
    },
  },
  {
    num: '04',
    topic: 'Real-time OT threat detection',
    side: 'pic-right',
    media: { kind: 'single', images: [i4] },
    ciso: {
      tag: '... for CISO/SOC',
      text: 'Detects unauthorised firmware changes, rogue PLC commands and lateral movement in real time using industrial behavioural analytics',
    },
    coo: {
      tag: '... for COO/Ops',
      text: 'Surfaces early warnings of abnormal controller logic so operators intervene before an anomaly becomes physical equipment damage',
    },
  },
  {
    num: '05',
    topic: 'AI risk prioritisation',
    side: 'pic-left',
    media: { kind: 'single', images: [i5] },
    ciso: {
      tag: '... for CISO/SOC',
      text: 'Cuts through thousands of raw CVEs by ranking vulnerabilities on live exploitability and network reachability',
    },
    coo: {
      tag: '... for COO/Ops',
      text: 'Focuses scarce maintenance hours on the exposures that genuinely threaten line uptime and plant safety',
    },
  },
  {
    num: '06',
    topic: 'Remote OEM vendor oversight',
    side: 'pic-right',
    media: { kind: 'single', images: [i6] },
    ciso: {
      tag: '... for CISO/SOC',
      text: 'Audits every third-party OEM remote session down to the exact industrial protocol command inside critical control zones',
    },
    coo: {
      tag: '... for COO/Ops',
      text: 'Lets equipment vendors troubleshoot quickly while verifying that no unauthorised process change happened',
    },
  },
  {
    num: '07',
    topic: 'Packets to physical impact',
    side: 'pic-left',
    media: { kind: 'single', images: [i7] },
    ciso: {
      tag: '... for CISO/SOC',
      text: 'Translates raw industrial packet anomalies into MITRE ATT&CK for ICS timelines with full forensic root-cause context',
    },
    coo: {
      tag: '... for COO/Ops',
      text: 'Names the turbine, line or subsystem at risk in plain operational language, so the floor can act quickly',
    },
  },
  {
    num: '08',
    topic: 'Continuous OT compliance',
    side: 'pic-right',
    media: { kind: 'single', images: [i8] },
    ciso: {
      tag: '... for CISO/SOC',
      text: 'Automates audit-ready evidence mapped to IEC 62443, NIST CSF, NIS2 and NERC CIP',
    },
    coo: {
      tag: '... for COO/Ops',
      text: 'Removes manual plant-floor walkthroughs and the regulatory and cyber-insurance delays that follow them',
    },
  },
  {
    num: '09',
    topic: 'Unified IT / OT convergence',
    side: 'pic-left',
    media: { kind: 'dual', images: [i6, i2] },
    ciso: {
      tag: '... for CISO/SOC',
      text: 'Unifies enterprise SOC workflows and plant-floor OT telemetry into one shared operational security view',
    },
    coo: {
      tag: '... for COO/Ops',
      text: 'Aligns security analysts and plant engineers on one response plan that protects production continuity',
    },
  },
  {
    num: '10',
    topic: 'End-to-end OT resilience',
    side: 'pic-right',
    media: { kind: 'quad', images: [i1, i3, i4, i8] },
    ciso: {
      tag: '... for CISO/SOC',
      text: 'Consolidates OT asset discovery, threat detection, risk scoring and compliance into one platform',
    },
    coo: {
      tag: '... for COO/Ops',
      text: 'Protects continuous industrial revenue, physical equipment and worker safety with zero production downtime',
    },
  },
]
