type Props = {
  networkLabel: string;
  deviceGroups: string[];
};

const BOX = { x: 270, y: 62, w: 180, h: 62 };
const DEVICE_Y = 215;
const LABEL_Y = 268;

function Sensor({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={13} fill="#fff" stroke="#FF612A" strokeWidth={2} />
      <circle cx={x} cy={y} r={4} fill="#FF612A" />
    </g>
  );
}

export function SiteTopology({ networkLabel, deviceGroups }: Props) {
  const cxBox = BOX.x + BOX.w / 2;
  const n = deviceGroups.length;
  const gap = 720 / n;
  const centers = deviceGroups.map((_, i) => gap * i + gap / 2);

  return (
    <div className="overflow-hidden rounded-[1.35rem] shadow-[0_16px_40px_rgba(15,23,42,.08)] bg-[linear-gradient(180deg,rgba(255,255,255,.98)_0%,rgba(246,249,255,.94)_100%)] ring-1 ring-white/60">
      <style>{`
        .vs-flow { stroke-dasharray: 6 6; animation: vs-dash 1s linear infinite; }
        @keyframes vs-dash { to { stroke-dashoffset: -12; } }
        @media (prefers-reduced-motion: reduce) { .vs-flow { animation: none; } }
      `}</style>
      <svg
        viewBox="0 0 720 320"
        role="img"
        aria-label="Velos Shield site appliance connected to sensors across a plant IT and OT network, with an optional uplink to the org instance"
        className="w-full h-auto"
      >
        {/* site boundary */}
        <rect x={10} y={10} width={700} height={300} rx={14} fill="none" stroke="#003C64" strokeWidth={1.2} strokeDasharray="6 5" opacity={0.35} />
        <text x={26} y={34} fill="#5a6b7d" fontSize={12}>
          Site: {networkLabel}
        </text>

        {/* optional uplink to the org instance */}
        <path d={`M${BOX.x + BOX.w} ${BOX.y + 31} L592 ${BOX.y + 31}`} stroke="#003C64" strokeWidth={1.4} opacity={0.45} fill="none" />
        <path d={`M592 ${BOX.y + 27} L598 ${BOX.y + 31} L592 ${BOX.y + 35} Z`} fill="#003C64" opacity={0.55} />
        <text x={600} y={BOX.y + 35} fill="#8b97a5" fontSize={10}>
          → Org instance
        </text>

        {/* device connections */}
        {centers.map((cx, i) => (
          <path
            key={`link-${i}`}
            className="vs-flow"
            d={`M${cxBox} ${BOX.y + BOX.h} L${cx} ${DEVICE_Y}`}
            stroke="#003C64"
            strokeWidth={1.5}
            fill="none"
            opacity={0.45}
          />
        ))}

        {/* appliance */}
        <rect x={BOX.x} y={BOX.y} width={BOX.w} height={BOX.h} rx={12} fill="#003C64" />
        <text x={cxBox} y={BOX.y + 27} textAnchor="middle" fill="#fff" fontSize={15} fontWeight={700}>
          Velos Shield
        </text>
        <text x={cxBox} y={BOX.y + 46} textAnchor="middle" fill="#FF612A" fontSize={11} fontWeight={600}>
          Site appliance
        </text>

        {/* devices + sensors */}
        {deviceGroups.map((g, i) => {
          const cx = centers[i];
          return (
            <g key={g}>
              <Sensor x={cx} y={DEVICE_Y} />
              <text x={cx} y={LABEL_Y} textAnchor="middle" fill="#5a6b7d" fontSize={11}>
                {g}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
