// The Airport BMS case study body, as Payload rich text.
//
// Transcribed from the hand-written React page that used to live at
// src/app/(site)/resources/airport-bms-cybersecurity-case-study/page.tsx. Shared by seed.mjs (a fresh
// database) and migrate-case-studies.mjs (an existing one), so the two cannot drift.
import { bullets, heading, para } from '../cms-http.mjs'

const strong = (value) => ({ detail: 0, format: 1, mode: 'normal', style: '', text: value, type: 'text', version: 1 })
const plain = (value) => ({ detail: 0, format: 0, mode: 'normal', style: '', text: value, type: 'text', version: 1 })

/** A paragraph made of runs, so a bold lead-in ("Asset discovery:") survives the move. */
const richPara = (...children) => ({ children, direction: 'ltr', format: '', indent: 0, textFormat: 0, type: 'paragraph', version: 1 })
const lead = (label, body) => richPara(strong(label), plain(` ${body}`))
const quote = (body) => ({ children: [plain(body)], direction: 'ltr', format: '', indent: 0, type: 'quote', version: 1 })

const root = (...children) => ({ root: { children, direction: 'ltr', format: '', indent: 0, type: 'root', version: 1 } })

// ------------------------------------------------------------------ Airport BMS body
// Transcribed from src/app/(site)/resources/airport-bms-cybersecurity-case-study/page.tsx before that
// page was removed. The before/after table became a bulleted list, because a Payload rich-text body
// does not carry tables by default and an editor should not be handed a layout they cannot change.
const AIRPORT_BODY = root(
  heading('The context'),
  para(
    'OT security should not stop at asset visibility or alert generation. In a cyber-physical environment such as airport BMS, the real value is connecting passive discovery, vulnerability intelligence, abnormal behaviour detection, and business-impact prioritisation into one continuous operating view.',
  ),
  para(
    'Behind every terminal is a large interconnected BMS - HVAC, chilled-water plants, electrical distribution, lighting, elevators, access control, fire and life-safety monitoring - increasingly linked over the same IP network, connected outward to corporate IT, airport operations, contractors, remote maintenance and cloud services. A single weak link does not just risk an HVAC outage: it can ripple into passenger comfort, equipment availability, operational continuity, and physical security.',
  ),

  heading('The challenge: familiar building systems, an unfamiliar attack surface'),
  para('Six gaps shaped the programme:'),
  bullets([
    'Unclear asset ownership - controllers and devices added over the years without a complete, current inventory of what existed or how critical each one was.',
    'Flat, under-segmented networks - building systems shared network space with limited separation, making it easier for an issue in one area to reach another.',
    'Loose credentials and access - shared or default logins and broad vendor privileges made it hard to know exactly who could reach which systems.',
    'Ageing, unpatched systems - some servers and workstations ran outdated software with no formal, ongoing process for keeping them current.',
    'Always-on remote access - vendor and maintenance connections stayed open long after the work was done, with little record of what happened during the session.',
    'No eyes on the network itself - no tool-based way to see what normal BMS traffic looked like, let alone notice the moment something drifted from it.',
  ]),

  heading('Why it matters'),
  para(
    'An intruder does not need to touch any flight-critical system. A realistic path runs from the internet or a compromised IT account, into the general network, across to the BMS, through an engineering workstation, and finally to a controller managing a real physical process.',
  ),
  para(
    'From there: adjusting HVAC setpoints or stopping equipment, triggering false alarms or silencing real ones, changing schedules, or quietly disabling the very monitoring meant to catch it - using the same protocols and access paths engineers rely on every day.',
  ),

  heading('Assessment: tool-based, grounded in evidence'),
  lead(
    'Asset discovery:',
    'Velos Shield connected via SPAN ports - no agents, no active probing - and built a verified inventory of engineering workstations, BMS servers, controllers, sensors, actuators and their protocols, revealing communication relationships, unmanaged devices, forgotten remote-access endpoints and shadow connections.',
  ),
  lead(
    'Vulnerability management:',
    'each asset fingerprinted and correlated against known exposure data, then layered with operational context - what it controls, how exposed it is, what a credible attack path looks like - separating theoretical exposure from risk that could genuinely affect airport operations.',
  ),
  lead(
    'Outcome:',
    'a verified BMS asset inventory, a prioritised vulnerability register, and a continuously monitored behavioural baseline - each tied to business impact.',
  ),

  heading('Approach: establish the baseline, then watch it continuously'),
  lead(
    'Phase 1 - Baseline:',
    'a structured Gramax review of assets, network architecture, configurations and working processes - a point-in-time picture against recognised OT security practices.',
  ),
  lead(
    'Phase 2 - Watch continuously:',
    'Velos Shield NIDS passively listens via mirrored ports, building a living picture of every asset and conversation: who talks to whom, over which protocol, how often, and why.',
  ),
  quote(
    'A BMS server reading data from an air-handling unit controller is ordinary. An engineering workstation suddenly writing to multiple controllers, or an unfamiliar device querying equipment across the building, looks very different once that baseline exists.',
  ),
  para('What continuous monitoring looks for:'),
  bullets([
    'Asset and network awareness - new devices, unexpected addresses and layout changes surfaced as they appear.',
    'Protocol-level detection - unauthorised commands and unusual frequency stand out against the everyday rhythm.',
    'Cyber-attack indicators - reconnaissance, lateral movement and repeated logins recognised as patterns.',
    'BMS-specific anomalies - unexpected setpoint changes, abnormal restarts and unusual access to critical equipment.',
  ]),

  heading('Mitigation: turning telemetry into decisions'),
  lead(
    'Identifying risk:',
    'consolidated inventory and findings into a single risk register scored by likelihood and operational consequence; mapped realistic attack paths; reviewed remote-connectivity patterns to find unmanaged vendor exposure.',
  ),
  lead(
    'Mitigating risk:',
    'remediation roadmap ordered by business impact; segmentation plan separating BMS from enterprise IT and lower-trust zones; time-bound, reviewed, logged vendor access replacing always-on shared credentials; NIDS policies tuned to the baseline and wired into the airport SOC and incident response.',
  ),
  para('Velos Shield gave the airport the eyes on the network. Gramax gave it the judgment to act on what those eyes saw.'),

  heading('Architecture: layered around how the building actually operates'),
  bullets([
    'Enterprise IT - the corporate network and its users.',
    'Airport SOC - central monitoring and response.',
    'OT monitoring - Velos Shield NIDS, watching continuously.',
    'OT DMZ - jump server and remote-access gateway.',
    'BMS zone - BMS servers and engineering workstations.',
    'Field zone - controllers, sensors and actuators.',
  ]),

  heading('What changed'),
  bullets([
    'Asset visibility - before: incomplete records of what controllers existed. After: critical BMS assets identified and classified by business impact.',
    'Vulnerability data - before: no structured, tool-based vulnerability view. After: correlated, risk-scored register tied to real assets.',
    'Network design - before: flat segments, little separation. After: documented architecture with a segmentation roadmap.',
    'Access control - before: shared credentials, loose vendor access. After: vendor access controlled, time-bound and reviewed.',
    'Monitoring - before: no protocol-level insight into BMS traffic. After: continuous, protocol-aware monitoring in place.',
    'Detection and response - before: limited anomaly detection. After: prioritised vulnerabilities with SOC-integrated detection.',
  ]),

  heading('Impact: what continuous visibility means beyond the network diagram'),
  bullets([
    'Reduced operational risk - fewer opportunities for unauthorised manipulation of building systems.',
    'Improved resilience - a clearer monitoring and response path for critical facility services during a cyber incident.',
    'Faster detection - from investigating after something goes wrong to spotting unusual behaviour as it happens.',
    'Stronger vendor governance - full visibility into third-party remote access and contractor activity.',
    'Clearer executive visibility - findings translated into business-impact language for facilities, engineering, SOC and leadership alike.',
  ]),

  heading('Conclusion: infrastructure now, not just facilities'),
  para(
    'An airport BMS has quietly become a cyber-physical layer of critical infrastructure. Pairing a Gramax-led, tool-based assessment with Velos Shield continuous NIDS monitoring gave the airport something more durable than a snapshot: a verified inventory, a prioritised risk register, and an ongoing shared understanding of what is on the network, how it normally behaves, and what deserves a closer look.',
  ),
  lead(
    'Gramax Cybertech:',
    'specialised cybersecurity for critical infrastructure and cyber-physical environments across aviation, energy, maritime, manufacturing and urban infrastructure.',
  ),
  lead(
    'Velos Shield:',
    'OT security and intelligence platform delivering continuous, passive visibility - asset intelligence, risk prioritisation, threat detection and decision-ready insights, built for zero-downtime operations.',
  ),
)


export { AIRPORT_BODY }
