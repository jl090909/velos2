import { riskColor, type SiteRisk } from '@/lib/sample-data';

export function SiteRiskBars({ sites }: { sites: SiteRisk[] }) {
  return (
    <div>
      {sites.map((s) => {
        const color = riskColor(s.score);
        return (
          <div key={s.name} className="mb-5 last:mb-0">
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-sm text-muted-foreground">{s.name}</span>
              <b className="text-lg font-semibold text-[#003C64]">{s.score}</b>
            </div>
            <div className="flex h-3 w-full overflow-hidden rounded-full bg-muted">
              <span style={{ width: `${s.score}%`, backgroundColor: color }} className="block rounded-full transition-[width] duration-700" />
            </div>
          </div>
        );
      })}
      <p className="mt-5 text-[13px] text-muted-foreground">Sample data for illustration only.</p>
    </div>
  );
}
