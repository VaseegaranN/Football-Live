import React from 'react';

// Configuration of team colors for high-quality SVG/CSS emblems
const TEAM_CONFIGS = {
  'ARS': { bg: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)', text: '#ffffff', name: 'Arsenal' },
  'CHE': { bg: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', text: '#ffffff', name: 'Chelsea' },
  'MCI': { bg: 'linear-gradient(135deg, #7dd3fc 0%, #0284c7 100%)', text: '#0f172a', name: 'Manchester City' },
  'LIV': { bg: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)', text: '#ffffff', name: 'Liverpool' },
  'RMA': { bg: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)', text: '#1e3a8a', name: 'Real Madrid' },
  'BAR': { bg: 'linear-gradient(135deg, #1e3a8a 0%, #b91c1c 100%)', text: '#f59e0b', name: 'Barcelona' },
  'MIL': { bg: 'linear-gradient(135deg, #000000 0%, #dc2626 100%)', text: '#ffffff', name: 'AC Milan' },
  'JUV': { bg: 'linear-gradient(135deg, #1e293b 0%, #000000 100%)', text: '#ffffff', name: 'Juventus' },
  'BAY': { bg: 'linear-gradient(135deg, #dc2626 0%, #1d4ed8 100%)', text: '#ffffff', name: 'Bayern Munich' },
  'BVB': { bg: 'linear-gradient(135deg, #facc15 0%, #ca8a04 100%)', text: '#000000', name: 'Borussia Dortmund' },
};

const LEAGUE_CONFIGS = {
  1: { bg: 'bg-purple-900/40', text: 'text-purple-300', border: 'border-purple-500/30' }, // PL
  2: { bg: 'bg-emerald-900/40', text: 'text-emerald-300', border: 'border-emerald-500/30' }, // La Liga
  3: { bg: 'bg-blue-900/40', text: 'text-blue-300', border: 'border-blue-500/30' }, // Serie A
  4: { bg: 'bg-red-900/40', text: 'text-red-300', border: 'border-red-500/30' }, // Bundesliga
};

export function TeamBadge({ shortName, logo, size = 'md' }) {
  const sizeClasses = {
    sm: 'w-6 h-6 text-[9px]',
    md: 'w-10 h-10 text-[11px]',
    lg: 'w-16 h-16 text-[15px] font-bold border-2',
    xl: 'w-24 h-24 text-[20px] font-extrabold border-4',
  };

  const imgSizeClasses = {
    sm: 'w-6 h-6 border',
    md: 'w-10 h-10 border',
    lg: 'w-16 h-16 border-2',
    xl: 'w-24 h-24 border-4',
  };

  if (logo && (logo.startsWith('http') || logo.includes('.') || logo.includes('/'))) {
    return (
      <img
        src={logo}
        alt={shortName}
        className={`${imgSizeClasses[size]} rounded-full object-cover border-slate-700/20 shadow-lg flex-shrink-0 select-none transition-transform hover:scale-105`}
      />
    );
  }

  const config = TEAM_CONFIGS[shortName.toUpperCase()] || {
    bg: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
    text: '#ffffff',
    name: shortName,
  };

  return (
    <div
      className={`rounded-full flex items-center justify-center font-bold tracking-wider shadow-lg border border-slate-700/20 select-none flex-shrink-0 transition-transform hover:scale-105`}
      style={{
        background: config.bg,
        color: config.text,
      }}
    >
      <span className={sizeClasses[size] + ' flex items-center justify-center rounded-full uppercase'}>
        {shortName.substring(0, 3)}
      </span>
    </div>
  );
}

export function LeagueBadge({ leagueId, name, className = '' }) {
  const config = LEAGUE_CONFIGS[leagueId] || {
    bg: 'bg-slate-900/40',
    text: 'text-slate-300',
    border: 'border-slate-500/30',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${config.bg} ${config.text} ${config.border} ${className}`}
    >
      {name}
    </span>
  );
}
