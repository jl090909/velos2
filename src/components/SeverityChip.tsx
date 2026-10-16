import { SEVERITY_COLOR, type Severity } from '@/lib/sample-data';

export function SeverityChip({ level, className = '' }: { level: Severity; className?: string }) {
  const color = SEVERITY_COLOR[level];
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-[.08em] text-white ${className}`}
      style={{ backgroundColor: color }}
    >
      {level}
    </span>
  );
}
