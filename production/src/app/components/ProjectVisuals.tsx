const MONO = "'JetBrains Mono', monospace";
export const ACCENT = '#0057FF';

export function getProjectVisualKind(category: string, index = 0) {
  if (category === 'Game UX') return index % 2 === 0 ? 'hud' : 'flow';
  if (category === 'Business Analysis') return index % 2 === 0 ? 'requirements' : 'system';
  return index % 2 === 0 ? 'wireframe' : 'dashboard';
}

export function ArtefactVisual({ kind = 'wireframe' }: { kind?: string }) {
  if (kind === 'hud') return <HUDArtefact />;
  if (kind === 'requirements') return <RequirementsArtefact />;
  if (kind === 'system') return <SystemMapArtefact />;
  if (kind === 'dashboard') return <DashboardArtefact />;
  if (kind === 'flow') return <FlowArtefact />;
  return <WireframeArtefact />;
}

export function HeroVisual({ title, domain, dark = false }: { title: string; domain: string; dark?: boolean }) {
  const bg = dark ? '#111' : '#F0F4FF';

  return (
    <svg width="100%" height="100%" viewBox="0 0 800 400" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
      <rect width="800" height="400" fill={bg} />
      <rect x="60" y="60" width="300" height="200" rx="3" fill="none" stroke={ACCENT} strokeWidth="1" opacity="0.2" />
      <rect x="80" y="82" width="260" height="14" rx="1" fill={ACCENT} opacity="0.12" />
      <rect x="80" y="104" width="200" height="8" rx="1" fill={ACCENT} opacity="0.07" />
      <rect x="80" y="118" width="220" height="8" rx="1" fill={ACCENT} opacity="0.07" />
      <rect x="80" y="140" width="260" height="80" rx="2" fill={ACCENT} opacity="0.05" />
      <rect x="420" y="60" width="300" height="92" rx="3" fill="none" stroke={ACCENT} strokeWidth="1" opacity="0.12" />
      <rect x="440" y="80" width="260" height="52" rx="2" fill={ACCENT} opacity="0.04" />
      <rect x="420" y="168" width="300" height="92" rx="3" fill="none" stroke={ACCENT} strokeWidth="1" opacity="0.12" />
      <rect x="440" y="186" width="180" height="10" rx="1" fill={dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'} />
      <rect x="440" y="202" width="240" height="10" rx="1" fill={dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'} />
      <line x1="60" y1="300" x2="740" y2="300" stroke={ACCENT} strokeWidth="0.5" opacity="0.1" />
      <text x="60" y="335" fontFamily={MONO} fontSize="10" fill={ACCENT} opacity="0.3" letterSpacing="0.08em">
        {domain.toUpperCase()} / {title.toUpperCase()}
      </text>
    </svg>
  );
}

export function ProcessVisual({ stepIndex, label }: { stepIndex: number; label: string }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
      <rect width="320" height="240" fill="#F0F0F3" />
      <rect x="20" y="20" width="280" height="12" rx="1" fill={ACCENT} opacity="0.1" />
      <rect x="20" y="40" width="200" height="8" rx="1" fill="rgba(0,0,0,0.06)" />
      <rect x="20" y="54" width="240" height="8" rx="1" fill="rgba(0,0,0,0.06)" />
      <rect x="20" y="74" width="280" height="120" rx="2" fill="rgba(0,0,0,0.03)" stroke="rgba(0,0,0,0.08)" strokeWidth="0.5" />
      {[0, 1, 2, 3].map((i) => (
        <line key={i} x1="20" y1={104 + i * 22} x2="300" y2={104 + i * 22} stroke="rgba(0,0,0,0.04)" strokeWidth="0.5" />
      ))}
      <rect x="30" y="84" width="260" height="8" rx="1" fill={ACCENT} opacity="0.08" />
      <rect x="30" y="100" width="180" height="6" rx="1" fill="rgba(0,0,0,0.05)" />
      <text x="20" y="224" fontFamily={MONO} fontSize="8" fill="rgba(0,0,0,0.22)" letterSpacing="0.06em">
        {String(stepIndex + 1).padStart(2, '0')} / {label.toUpperCase()}
      </text>
    </svg>
  );
}

export function FinalVisual({ domain }: { domain: string }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 760 332" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
      <rect width="760" height="332" fill="#F0F0F3" />
      <rect x="40" y="40" width="320" height="252" rx="3" fill="white" stroke="rgba(0,0,0,0.08)" strokeWidth="1" />
      <rect x="56" y="56" width="288" height="16" rx="1" fill={ACCENT} opacity="0.1" />
      <rect x="56" y="80" width="220" height="10" rx="1" fill="rgba(0,0,0,0.06)" />
      <rect x="56" y="96" width="260" height="10" rx="1" fill="rgba(0,0,0,0.06)" />
      <rect x="56" y="118" width="288" height="120" rx="2" fill="rgba(0,0,0,0.03)" stroke="rgba(0,0,0,0.07)" strokeWidth="0.5" />
      <rect x="400" y="40" width="320" height="120" rx="3" fill="white" stroke="rgba(0,0,0,0.08)" strokeWidth="1" />
      <rect x="416" y="56" width="288" height="88" rx="1" fill={ACCENT} opacity="0.05" />
      <rect x="400" y="172" width="320" height="120" rx="3" fill="white" stroke="rgba(0,0,0,0.08)" strokeWidth="1" />
      <rect x="416" y="188" width="180" height="10" rx="1" fill="rgba(0,0,0,0.07)" />
      <rect x="416" y="204" width="240" height="10" rx="1" fill="rgba(0,0,0,0.05)" />
      <text x="40" y="318" fontFamily={MONO} fontSize="8" fill="rgba(0,0,0,0.2)" letterSpacing="0.06em">
        FINAL SCREENS / {domain.toUpperCase()}
      </text>
    </svg>
  );
}

function FlowArtefact() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="320" height="200" fill="#F4F4F6" />
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect x={16 + i * 76} y={72} width={56} height={28} rx={2} stroke="#C0C0CC" strokeWidth="1" fill="white" />
          <line x1={72 + i * 76} y1={86} x2={92 + i * 76} y2={86} stroke="#C0C0CC" strokeWidth="1" />
          {i < 3 && <polygon points={`${90 + i * 76},82 ${96 + i * 76},86 ${90 + i * 76},90`} fill="#C0C0CC" />}
        </g>
      ))}
      <rect x={16} y={126} width={56} height={20} rx={10} stroke="#C0C0CC" strokeWidth="1" fill="white" />
      <line x1={44} y1={100} x2={44} y2={126} stroke="#C0C0CC" strokeWidth="1" strokeDasharray="3 2" />
      <rect x={110} y={126} width={100} height={20} rx={2} stroke={ACCENT} strokeWidth="1" fill="white" opacity="0.6" />
      <text x={16} y={20} fontFamily={MONO} fontSize="7" fill="#888" letterSpacing="0.08em">AS-IS PROCESS FLOW</text>
    </svg>
  );
}

function WireframeArtefact() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="320" height="200" fill="#F4F4F6" />
      {[30, 144].map((x, i) => (
        <g key={x}>
          <rect x={x} y={24} width={90} height={150} rx={2} stroke="#C0C0CC" strokeWidth="1" fill="white" />
          <rect x={x + 4} y={28} width={82} height={34} rx={1} fill="#EAEAEE" />
          <rect x={x + 4} y={68} width={i ? 50 : 82} height={10} rx={1} fill="#EAEAEE" />
          <rect x={x + 4} y={82} width={i ? 82 : 60} height={8} rx={1} fill="#EAEAEE" />
          <rect x={x + 4} y={96} width={82} height={28} rx={1} stroke={i ? ACCENT : '#C0C0CC'} strokeWidth="1" fill="white" opacity={i ? 0.5 : 1} />
          <rect x={x + 4} y={136} width={36} height={16} rx={8} fill="#111" />
        </g>
      ))}
      <line x1={134} y1={100} x2={144} y2={100} stroke="#C0C0CC" strokeWidth="1" />
      <polygon points="142,97 146,100 142,103" fill="#C0C0CC" />
      <text x={30} y={188} fontFamily={MONO} fontSize="7" fill="#888" letterSpacing="0.06em">MOBILE FLOW / ONBOARDING</text>
    </svg>
  );
}

function RequirementsArtefact() {
  const rows = ['FR-001', 'FR-002', 'FR-003', 'FR-004', 'FR-005'];
  return (
    <svg width="100%" height="100%" viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="320" height="200" fill="#F4F4F6" />
      <rect x={16} y={30} width={288} height={14} fill="#111" rx={1} />
      <text x={20} y={40} fontFamily={MONO} fontSize="7" fill="white" letterSpacing="0.06em">ID / REQUIREMENT / PRIORITY / STATUS</text>
      {rows.map((id, i) => (
        <g key={id}>
          <rect x={16} y={46 + i * 24} width={288} height={22} fill={i % 2 === 0 ? 'white' : '#F8F8FA'} />
          <text x={20} y={61 + i * 24} fontFamily={MONO} fontSize="7.5" fill={ACCENT}>{id}</text>
          <rect x={72} y={51 + i * 24} width={160} height={8} rx={1} fill="#E0E0E4" />
          <text x={256} y={61 + i * 24} fontFamily={MONO} fontSize="7" fill="#888">{i === 3 ? 'MED' : 'HIGH'}</text>
        </g>
      ))}
    </svg>
  );
}

function HUDArtefact() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="320" height="200" fill="#111" />
      <rect x={16} y={20} width={80} height={14} rx={1} fill="none" stroke="#333" strokeWidth="1" />
      <rect x={16} y={20} width={52} height={14} rx={1} fill="#333" />
      <text x={20} y={31} fontFamily={MONO} fontSize="7" fill="#888">HP 65%</text>
      <circle cx={282} cy={50} r={28} stroke="#333" strokeWidth="1" fill="none" />
      <circle cx={282} cy={50} r={3} fill={ACCENT} opacity="0.8" />
      <rect x={100} y={150} width={120} height={30} rx={2} fill="none" stroke="#333" strokeWidth="1" />
      <text x={112} y={169} fontFamily={MONO} fontSize="8" fill="#555">ABILITY / ITEM / MAP</text>
      <line x1={16} y1={100} x2={304} y2={100} stroke="#222" strokeWidth="0.5" strokeDasharray="4 3" />
      <rect x={16} y={110} width={50} height={24} rx={1} stroke="#333" strokeWidth="1" fill="none" />
      <text x={20} y={126} fontFamily={MONO} fontSize="7" fill={ACCENT} opacity="0.7">QUEST</text>
    </svg>
  );
}

function SystemMapArtefact() {
  const nodes = [
    { x: 70, y: 100, label: 'User' },
    { x: 170, y: 50, label: 'Portal' },
    { x: 170, y: 150, label: 'CRM' },
    { x: 270, y: 100, label: 'Core' },
  ];

  return (
    <svg width="100%" height="100%" viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="320" height="200" fill="#F4F4F6" />
      {([[0, 1], [0, 2], [1, 3], [2, 3]] as [number, number][]).map(([a, b], i) => (
        <line key={i} x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y} stroke="#C0C0CC" strokeWidth="1" />
      ))}
      {nodes.map((n, i) => (
        <g key={n.label}>
          <rect x={n.x - 30} y={n.y - 16} width={60} height={32} rx={2} fill="white" stroke={i === 3 ? ACCENT : '#C0C0CC'} strokeWidth={i === 3 ? 1.5 : 1} />
          <text x={n.x} y={n.y + 5} textAnchor="middle" fontFamily={MONO} fontSize="8" fill={i === 3 ? ACCENT : '#555'}>{n.label}</text>
        </g>
      ))}
    </svg>
  );
}

function DashboardArtefact() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="320" height="200" fill="#F4F4F6" />
      {['ACTIVE', 'CONVERSION', 'TREND'].map((label, i) => (
        <g key={label}>
          <rect x={16 + i * 94} y={16} width={i === 2 ? 100 : 86} height={62} rx={2} fill="white" stroke="#E0E0E4" strokeWidth="1" />
          <text x={22 + i * 94} y={32} fontFamily={MONO} fontSize="7" fill="#888">{label}</text>
        </g>
      ))}
      <text x={22} y={60} fontFamily={MONO} fontSize="22" fill="#111">1,284</text>
      <text x={116} y={60} fontFamily={MONO} fontSize="22" fill={ACCENT}>68%</text>
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <rect key={i} x={212 + i * 12} y={78 - [20, 28, 18, 34, 24, 38, 30][i]} width={8} height={[20, 28, 18, 34, 24, 38, 30][i]} rx={1} fill={i === 6 ? ACCENT : '#E0E0E4'} />
      ))}
      <rect x={16} y={92} width={288} height={76} rx={2} fill="white" stroke="#E0E0E4" strokeWidth="1" />
    </svg>
  );
}
