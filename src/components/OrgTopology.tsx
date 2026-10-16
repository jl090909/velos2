import { riskColor } from '@/lib/sample-data';

type SiteNode = { label: string; score: number };

const HUB = { x: 250, y: 16, w: 220, h: 64 };
const SITE = { w: 140, h: 56, y: 200 };

function hubCenter() {
  return { x: HUB.x + HUB.w / 2, y: HUB.y + HUB.h };
}

function Sensor({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={13} fill="#fff" stroke="#FF612A" strokeWidth={2} />
      <circle cx={x} cy={y} r={4} fill="#FF612A" />
    </g>
  );
}

export function OrgTopology({ sites }: { sites: SiteNode[] }) {
  const hub = hubCenter();
  const n = sites.length;
  const gap = 720 / n;
  const centers = sites.map((_, i) => gap * i + gap / 2);

  return (
    <div className="overflow-hidden rounded-[1.35rem] shadow-[0_16px_40px_rgba(15,23,42,.08)] bg-[linear-gradient(180deg,rgba(255,255,255,.98)_0%,rgba(246,249,255,.94)_100%)] ring-1 ring-white/60">
      <style>{`
        .vs-flow { stroke-dasharray: 6 6; animation: vs-dash 1s linear infinite; }
        @keyframes vs-dash { to { stroke-dashoffset: -12; } }
        @media (prefers-reduced-motion: reduce) { .vs-flow { animation: none; } }
      `}</style>
      <svg
        viewBox="0 0 720 400"
        role="img"
        aria-label="Velos Shield 1.5 at organisation level connecting to four Velos Shield 1.1 site appliances, each with two sensors"
        className="w-full h-auto"
      >
        {/* uplinks */}
        {centers.map((cx, i) => (
          <path
            key={`link-${i}`}
            className="vs-flow"
            d={`M${hub.x} ${hub.y} L${cx} ${SITE.y}`}
            stroke="#003C64"
            strokeWidth={1.6}
            fill="none"
            opacity={0.5}
          />
        ))}

        {/* hub */}
        <rect x={HUB.x} y={HUB.y} width={HUB.w} height={HUB.h} rx={12} fill="#003C64" />
        <text x={hub.x} y={HUB.y + 27} textAnchor="middle" fill="#fff" fontSize={15} fontWeight={700}>
          Velos Shield 1.5
        </text>
        <text x={hub.x} y={HUB.y + 46} textAnchor="middle" fill="#FF612A" fontSize={11} fontWeight={600}>
          Org-level · consolidated posture
        </text>

        {/* sites */}
        {sites.map((s, i) => {
          const cx = centers[i];
          const x = cx - SITE.w / 2;
          const color = riskColor(s.score);
          return (
            <g key={s.label}>
              <path d={`M${cx} ${SITE.y + SITE.h} L${cx - 26} ${330}`} stroke="#003C64" strokeWidth={1.4} opacity={0.4} fill="none" />
              <path d={`M${cx} ${SITE.y + SITE.h} L${cx + 26} ${330}`} stroke="#003C64" strokeWidth={1.4} opacity={0.4} fill="none" />
              <Sensor x={cx - 26} y={330} />
              <Sensor x={cx + 26} y={330} />
              <rect x={x} y={SITE.y} width={SITE.w} height={SITE.h} rx={10} fill="#fff" stroke="#003C64" strokeWidth={1.4} />
              <circle cx={x + SITE.w - 14} cy={SITE.y + 14} r={5} fill={color} />
              <text x={cx} y={SITE.y + 24} textAnchor="middle" fill="#003C64" fontSize={13} fontWeight={700}>
                Velos Shield 1.1
              </text>
              <text x={cx} y={SITE.y + 44} textAnchor="middle" fill="#5a6b7d" fontSize={11}>
                {s.label} · score {s.score}
              </text>
              <text x={cx} y={372} textAnchor="middle" fill="#8b97a5" fontSize={10}>
                Sensors
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
