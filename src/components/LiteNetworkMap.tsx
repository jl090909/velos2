'use client';

import { useEffect, useRef, useState } from 'react';

const ZONES = [
  { id: 'Finance', color: '#10B981' },
  { id: 'Operations', color: '#F59E0B' },
  { id: 'Sales & Marketing', color: '#3B82F6' },
  { id: 'Delivery', color: '#8B5CF6' },
];

const NODES = [
  { id: 'n1', ip: '10.0.1.10', zone: 'Finance',  type: 'Server',       risk: 3, status: 'ok' },
  { id: 'n2', ip: '10.0.1.11', zone: 'Finance',  type: 'Endpoint',     risk: 1, status: 'ok' },
  { id: 'n3', ip: '10.0.1.12', zone: 'Finance',  type: 'Printer',      risk: 5, status: 'warn' },
  { id: 'n4', ip: '10.0.2.10', zone: 'Operations', type: 'PLC',        risk: 8, status: 'crit' },
  { id: 'n5', ip: '10.0.2.11', zone: 'Operations', type: 'HMI',        risk: 6, status: 'warn' },
  { id: 'n6', ip: '10.0.2.12', zone: 'Operations', type: 'SCADA',      risk: 4, status: 'ok' },
  { id: 'n7', ip: '10.0.2.13', zone: 'Operations', type: 'RTU',        risk: 2, status: 'ok' },
  { id: 'n8', ip: '10.0.3.10', zone: 'Sales & Marketing', type: 'Laptop', risk: 2, status: 'ok' },
  { id: 'n9', ip: '10.0.3.11', zone: 'Sales & Marketing', type: 'Phone',  risk: 1, status: 'ok' },
  { id: 'n10',ip: '10.0.3.12', zone: 'Sales & Marketing', type: 'NAS',    risk: 4, status: 'warn' },
  { id: 'n11',ip: '10.0.4.10', zone: 'Delivery', type: 'IoT Sensor',  risk: 3, status: 'ok' },
  { id: 'n12',ip: '10.0.4.11', zone: 'Delivery', type: 'Gateway',     risk: 7, status: 'crit' },
  { id: 'n13',ip: '10.0.4.12', zone: 'Delivery', type: 'Camera',      risk: 2, status: 'ok' },
];

const EDGES = [
  { from: 'n4', to: 'n5' }, { from: 'n5', to: 'n6' }, { from: 'n6', to: 'n7' },
  { from: 'n4', to: 'n1' }, { from: 'n8', to: 'n1' },
  { from: 'n11', to: 'n12' }, { from: 'n12', to: 'n10' },
  { from: 'n10', to: 'n3' }, { from: 'n12', to: 'n4' },
];

function forceLayoutWidth(W: number) {
  const cx = W / 2, cy = 240;
  const R = Math.min(W, 480) / 2 - 60;
  const zoneNodes: Record<string, {id: string; x: number; y: number}[]> = {};
  ZONES.forEach(z => zoneNodes[z.id] = []);
  NODES.forEach(n => zoneNodes[n.zone]?.push({id: n.id, x: 0, y: 0}));

  ZONES.forEach((z, zi) => {
    const angle = (zi / ZONES.length) * Math.PI * 2 - Math.PI / 2;
    const zx = cx + R * Math.cos(angle);
    const zy = cy + R * Math.sin(angle);
    const list = zoneNodes[z.id] || [];
    list.forEach((node, ni) => {
      const spread = Math.min(80, 30 * list.length);
      const na = (ni / list.length) * Math.PI * 2;
      node.x = zx + spread * Math.cos(na);
      node.y = zy + spread * Math.sin(na);
    });
  });

  const pos: Record<string, {x:number;y:number}> = {};
  Object.values(zoneNodes).flat().forEach(n => pos[n.id] = {x: n.x, y: n.y});
  return pos;
}

function riskColor(s: number) {
  if (s >= 7) return '#EF4444';
  if (s >= 4) return '#F59E0B';
  return '#10B981';
}

export default function LiteNetworkMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [positions, setPositions] = useState<Record<string,{x:number;y:number}>>({});

  useEffect(() => {
    const onResize = () => {
      const c = canvasRef.current;
      if (!c) return;
      const w = c.parentElement!.clientWidth;
      c.width = w * 2;
      c.height = 560 * 2;
      c.style.width = w + 'px';
      c.style.height = '560px';
      setPositions(forceLayoutWidth(w * 2));
    };
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c || Object.keys(positions).length === 0) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const W = c.width / dpr, H = c.height / dpr;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = '#0d0e1c';
    ctx.fillRect(0, 0, W, H);

    const byId = Object.fromEntries(NODES.map(n => [n.id, n]));

    // Edges
    EDGES.forEach(e => {
      const a = positions[e.from], b = positions[e.to];
      const na = byId[e.from], nb = byId[e.to];
      if (!a || !b) return;
      const isHov = hovered === e.from || hovered === e.to;
      const isThreat = (na?.risk ?? 0) >= 7 || (nb?.risk ?? 0) >= 7;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.strokeStyle = isThreat ? '#EF444466' : isHov ? '#4a81d3' : '#ffffff22';
      ctx.lineWidth = isHov ? 2 : 1;
      ctx.stroke();
    });

    // Zones
    const zoneNodes: Record<string, typeof NODES> = {};
    NODES.forEach(n => {
      if (!zoneNodes[n.zone]) zoneNodes[n.zone] = [];
      zoneNodes[n.zone].push(n);
    });
    ZONES.forEach(z => {
      const nodes = zoneNodes[z.id] || [];
      if (nodes.length === 0) return;
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      nodes.forEach(n => {
        const p = positions[n.id];
        if (!p) return;
        minX = Math.min(minX, p.x);
        minY = Math.min(minY, p.y);
        maxX = Math.max(maxX, p.x);
        maxY = Math.max(maxY, p.y);
      });
      const PAD = 40;
      minX -= PAD; minY -= PAD; maxX += PAD; maxY += PAD;
      ctx.save();
      ctx.beginPath();
      const rw = 16;
      ctx.roundRect(minX, minY, maxX - minX, maxY - minY, rw);
      ctx.fillStyle = z.color + '15';
      ctx.fill();
      ctx.strokeStyle = z.color + '44';
      ctx.lineWidth = 1.4;
      ctx.setLineDash([6, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.font = '600 11px Inter,system-ui,sans-serif';
      ctx.fillStyle = z.color;
      ctx.fillText(z.id.toUpperCase(), minX + 14, minY + 18);
      ctx.restore();
    });

    // Nodes
    NODES.forEach(n => {
      const p = positions[n.id];
      if (!p) return;
      const sel = hovered === n.id;
      const rc = riskColor(n.risk);
      ctx.save();
      if (sel) {
        ctx.shadowBlur = 16;
        ctx.shadowColor = rc;
      }
      // Node circle
      ctx.beginPath();
      ctx.arc(p.x, p.y, 20, 0, Math.PI * 2);
      ctx.fillStyle = '#1a1c38';
      ctx.fill();
      ctx.strokeStyle = rc;
      ctx.lineWidth = sel ? 2.5 : 1.5;
      ctx.stroke();
      ctx.shadowBlur = 0;
      // Status dot
      const sc = n.status === 'crit' ? '#EF4444' : n.status === 'warn' ? '#F59E0B' : '#10B981';
      ctx.beginPath();
      ctx.arc(p.x + 12, p.y - 12, 4, 0, Math.PI * 2);
      ctx.fillStyle = sc;
      ctx.fill();
      // IP label
      ctx.font = '400 10px monospace';
      ctx.fillStyle = '#ffffffcc';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(n.ip, p.x, p.y + 24);
      // Type label
      ctx.font = '400 8px Inter,system-ui,sans-serif';
      ctx.fillStyle = '#ffffff66';
      ctx.fillText(n.type, p.x, p.y + 37);
      ctx.restore();
    });
  }, [positions, hovered]);

  const handleMouse = (e: React.MouseEvent) => {
    const r = canvasRef.current!.getBoundingClientRect();
    const x = (e.clientX - r.left) * (window.devicePixelRatio || 1);
    const y = (e.clientY - r.top) * (window.devicePixelRatio || 1);
    const found = NODES.find(n => {
      const p = positions[n.id];
      return p && Math.hypot(p.x - x, p.y - y) < 24;
    });
    setHovered(found?.id ?? null);
  };

  return (
    <div className="rounded-[1.35rem] overflow-hidden shadow-[0_16px_40px_rgba(15,23,42,.08)] bg-[#0d0e1c]">
      <canvas
        ref={canvasRef}
        className="w-full cursor-pointer"
        onMouseMove={handleMouse}
        onMouseLeave={() => setHovered(null)}
      />
    </div>
  );
}