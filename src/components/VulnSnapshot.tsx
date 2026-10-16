import { SEVERITY_COLOR, SEVERITY_ORDER, type Finding, type SeverityCounts } from '@/lib/sample-data';
import { SeverityChip } from '@/components/SeverityChip';

export function VulnSnapshot({
  counts,
  rows,
  showSite = true,
}: {
  counts: SeverityCounts;
  rows: Finding[];
  /** Org-level findings carry a site column; site-level findings do not. */
  showSite?: boolean;
}) {
  const total = SEVERITY_ORDER.reduce((a, k) => a + counts[k], 0);

  return (
    <div>
      <div className="flex flex-wrap gap-x-10 gap-y-5 mb-6">
        {SEVERITY_ORDER.map((k) => (
          <div key={k}>
            <b className="block text-3xl font-bold leading-none" style={{ color: SEVERITY_COLOR[k] }}>
              {counts[k]}
            </b>
            <span className="text-xs text-muted-foreground uppercase tracking-[.12em]">{k}</span>
          </div>
        ))}
      </div>

      <div className="flex h-3 w-full overflow-hidden rounded-full bg-muted mb-7">
        {SEVERITY_ORDER.map((k) => (
          <span key={k} style={{ width: `${(counts[k] / total) * 100}%`, backgroundColor: SEVERITY_COLOR[k] }} className="block" />
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className={`w-full ${showSite ? 'min-w-[560px]' : 'min-w-[480px]'} border-collapse text-sm`}>
          <thead>
            <tr className="text-left text-muted-foreground">
              <th className="font-semibold pb-3 pr-4">ID</th>
              <th className="font-semibold pb-3 pr-4">Finding</th>
              {showSite && <th className="font-semibold pb-3 pr-4">Site</th>}
              <th className="font-semibold pb-3 pr-4">Asset</th>
              <th className="font-semibold pb-3">Severity</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-border/60">
                <td className="py-3 pr-4 font-mono text-xs text-muted-foreground">{r.id}</td>
                <td className="py-3 pr-4 text-[#003C64]">{r.finding}</td>
                {showSite && <td className="py-3 pr-4 text-muted-foreground">{r.site}</td>}
                <td className="py-3 pr-4 font-mono text-xs text-muted-foreground">{r.asset}</td>
                <td className="py-3">
                  <SeverityChip level={r.severity} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-[13px] text-muted-foreground">Sample data for illustration only.</p>
    </div>
  );
}
