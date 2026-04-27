'use client';

type Segment = { label: string; share: number; color: string };

type Props = {
  data: Segment[];
  size?: number;
  thickness?: number;
  gap?: number;
  hoverIdx: number | null;
  setHoverIdx: (i: number | null) => void;
  center: React.ReactNode;
};

export default function DonutChart({ data, size = 150, thickness = 26, gap = 0.012, hoverIdx, setHoverIdx, center }: Props) {
  const r = size / 2;
  const ir = r - thickness;
  const total = data.reduce((s, d) => s + d.share, 0);
  let acc = 0;
  const arcs = data.map((d, i) => {
    const start = (acc / total) * Math.PI * 2 - Math.PI / 2 + gap;
    acc += d.share;
    const end   = (acc / total) * Math.PI * 2 - Math.PI / 2 - gap;
    const large = end - start > Math.PI ? 1 : 0;
    const x1 = r + r  * Math.cos(start), y1 = r + r  * Math.sin(start);
    const x2 = r + r  * Math.cos(end),   y2 = r + r  * Math.sin(end);
    const x3 = r + ir * Math.cos(end),   y3 = r + ir * Math.sin(end);
    const x4 = r + ir * Math.cos(start), y4 = r + ir * Math.sin(start);
    return { path: `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${x3} ${y3} A ${ir} ${ir} 0 ${large} 0 ${x4} ${y4} Z`, color: d.color, idx: i };
  });

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {arcs.map(a => (
          <path
            key={a.idx} d={a.path} fill={a.color}
            opacity={hoverIdx == null || hoverIdx === a.idx ? 1 : 0.35}
            onMouseEnter={() => setHoverIdx(a.idx)}
            onMouseLeave={() => setHoverIdx(null)}
            style={{ transition: 'opacity .2s', cursor: 'pointer' }}
          />
        ))}
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
        {center}
      </div>
    </div>
  );
}
