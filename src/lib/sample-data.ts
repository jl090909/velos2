// Sample data for the Velos Shield product pages (1.5 org-level, 1.1 site-level).
// All values are illustrative placeholders for design review — not real customer data.

export type Severity = 'Critical' | 'High' | 'Medium' | 'Low';

export type SeverityCounts = Record<Severity, number>;

export type Finding = {
  id: string;
  finding: string;
  /** Present for org-level findings (which roll up across sites). */
  site?: string;
  asset: string;
  severity: Severity;
};

export type SiteRisk = {
  name: string;
  score: number;
};

export const SEVERITY_ORDER: Severity[] = ['Critical', 'High', 'Medium', 'Low'];

// Brand-aligned severity colours (reuses the site's navy/orange language).
export const SEVERITY_COLOR: Record<Severity, string> = {
  Critical: '#D92D20',
  High: '#FF612A',
  Medium: '#E8A33D',
  Low: '#0F8A5F',
};

export function riskColor(score: number): string {
  if (score >= 65) return SEVERITY_COLOR.Critical;
  if (score >= 45) return SEVERITY_COLOR.High;
  return SEVERITY_COLOR.Low;
}

/* ---------- Velos Shield 1.5 — organisation level ---------- */

export const ORG_SEVERITY_COUNTS: SeverityCounts = {
  Critical: 7,
  High: 23,
  Medium: 58,
  Low: 112,
};

export const ORG_FINDINGS: Finding[] = [
  { id: 'VS-001', finding: 'Unpatched firmware on PLC gateway', site: 'Delhi', asset: 'PLC-GW-04', severity: 'Critical' },
  { id: 'VS-002', finding: 'Default credentials on HMI', site: 'Pune', asset: 'HMI-12', severity: 'Critical' },
  { id: 'VS-003', finding: 'Outdated TLS on historian', site: 'Chennai', asset: 'HIST-01', severity: 'High' },
  { id: 'VS-004', finding: 'Open SMB share on engineering PC', site: 'Mumbai', asset: 'ENG-PC-07', severity: 'High' },
  { id: 'VS-005', finding: 'Missing OS patches', site: 'Delhi', asset: 'SRV-22', severity: 'Medium' },
];

export const SITE_RISK: SiteRisk[] = [
  { name: 'Site A · Delhi', score: 72 },
  { name: 'Site B · Pune', score: 55 },
  { name: 'Site C · Chennai', score: 38 },
  { name: 'Site D · Mumbai', score: 64 },
];

/* ---------- Velos Shield 1.1 — site level ---------- */

export const SITE_SCOPE_LABEL = 'Plant 1 · 214 assets';

export const SITE_NETWORK_LABEL = 'Plant 1 – IT / OT network';

export const SITE_SEVERITY_COUNTS: SeverityCounts = {
  Critical: 2,
  High: 6,
  Medium: 15,
  Low: 31,
};

export const SITE_FINDINGS: Finding[] = [
  { id: 'VS-101', finding: 'Unpatched firmware on PLC gateway', asset: 'PLC-GW-04', severity: 'Critical' },
  { id: 'VS-102', finding: 'Default credentials on HMI', asset: 'HMI-12', severity: 'Critical' },
  { id: 'VS-103', finding: 'Outdated TLS on historian', asset: 'HIST-01', severity: 'High' },
  { id: 'VS-104', finding: 'Open SMB share', asset: 'ENG-PC-07', severity: 'High' },
  { id: 'VS-105', finding: 'Unsupported OS version', asset: 'SRV-22', severity: 'Medium' },
];

/** Device categories the site appliance talks to, per the site topology diagram. */
export const SITE_DEVICE_GROUPS = ['PLC / ICS', 'Switch / Router', 'Servers / IT', 'IoT / Cameras'];
