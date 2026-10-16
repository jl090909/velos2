// Sample data for the Velos Shield 1.5 (Org-level) page.
// All values are illustrative placeholders for design review — not real customer data.

export type Severity = 'Critical' | 'High' | 'Medium' | 'Low';

export type SeverityCounts = Record<Severity, number>;

export type Finding = {
  id: string;
  finding: string;
  site: string;
  asset: string;
  severity: Severity;
};

export type SiteRisk = {
  name: string;
  score: number;
};

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
