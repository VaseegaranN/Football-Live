import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { teamsApi } from '../api/client';

export default function TeamHoverCard({ teamId, children }) {
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState(null);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);

  const calculatePosition = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const popoverWidth = 320;
    const popoverHeight = 320; // estimated max height for squad card (max-h-300 + padding)

    const spaceAbove = rect.top;
    const spaceBelow = window.innerHeight - rect.bottom;

    // Flip below if there's not enough space above and more space below
    const showBelow = spaceAbove < popoverHeight && spaceBelow > spaceAbove;

    let left = rect.left + rect.width / 2 - popoverWidth / 2;
    let top = showBelow 
      ? rect.bottom + 8 
      : rect.top - 8 - popoverHeight;

    // Clamping vertical position to be inside viewport bounds
    if (top < 10) top = 10;
    if (top + popoverHeight > window.innerHeight - 10) {
      top = window.innerHeight - popoverHeight - 10;
    }

    // Keep popover inside viewport bounds horizontally
    if (left < 10) left = 10;
    if (left + popoverWidth > window.innerWidth - 10) {
      left = window.innerWidth - popoverWidth - 10;
    }

    setCoords({ top, left });
  };

  const handleMouseEnter = () => {
    if (hoverTimeout) clearTimeout(hoverTimeout);
    calculatePosition();
    setVisible(true);

    if (!team && !loading && teamId) {
      setLoading(true);
      teamsApi.getById(teamId)
        .then((res) => {
          setTeam(res.data);
        })
        .catch((err) => {
          console.error('Failed to load team squad', err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setVisible(false);
    }, 150);
    setHoverTimeout(timeout);
  };

  useEffect(() => {
    if (visible) {
      window.addEventListener('scroll', calculatePosition, { passive: true });
      window.addEventListener('resize', calculatePosition, { passive: true });
      // Run once immediately to compute initial position
      calculatePosition();
    }
    return () => {
      window.removeEventListener('scroll', calculatePosition);
      window.removeEventListener('resize', calculatePosition);
      if (hoverTimeout) clearTimeout(hoverTimeout);
    };
  }, [visible, hoverTimeout]);

  // Starting XI and substitutes grouping
  const players = team?.players || [];
  const startingXI = players.slice(0, 11);
  const substitutes = players.slice(11);

  const popoverContent = visible && teamId && (
    <div 
      className="fixed z-[9999] w-80 bg-slate-900/98 backdrop-blur-md border border-slate-700/80 rounded-2xl shadow-2xl p-4 text-left select-none animate-fade-in"
      style={{
        top: `${coords.top}px`,
        left: `${coords.left}px`,
        transform: 'none',
      }}
      onMouseEnter={() => {
        if (hoverTimeout) clearTimeout(hoverTimeout);
        setVisible(true);
      }}
      onMouseLeave={handleMouseLeave}
    >
      {loading ? (
        <div className="space-y-4 py-2">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full skeleton" />
            <div className="h-4 w-32 skeleton" />
          </div>
          <div className="space-y-2">
            <div className="h-3 w-full skeleton" />
            <div className="h-3 w-5/6 skeleton" />
            <div className="h-3 w-4/5 skeleton" />
          </div>
        </div>
      ) : team ? (
        <div className="space-y-3.5 max-h-[220px] overflow-y-auto pr-1">
          {/* Header */}
          <div className="flex items-center space-x-2.5 pb-2.5 border-b border-slate-800">
            {team.logo ? (
              <img src={team.logo} alt={team.name} className="w-7 h-7 rounded-full object-cover border border-slate-700/50" />
            ) : (
              <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center font-bold text-[10px] text-white">
                {team.shortName}
              </div>
            )}
            <div>
              <h4 className="font-extrabold text-sm text-slate-100 leading-tight">{team.name}</h4>
              <span className="text-[10px] text-slate-400 font-medium">{team.stadium}</span>
            </div>
          </div>

          {/* Starting XI */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Starting XI</span>
              <span className="text-[9px] text-slate-500 font-semibold">{startingXI.length} Players</span>
            </div>
            <div className="space-y-1 bg-slate-950/40 rounded-lg p-2 border border-slate-800/40">
              {startingXI.length === 0 ? (
                <div className="text-[11px] text-slate-500 italic">No squad listed</div>
              ) : (
                startingXI.map((p) => (
                  <div key={p.id} className="flex justify-between items-center text-[11px] py-0.5 border-b border-slate-900/30 last:border-b-0">
                    <span className="font-semibold text-slate-200">
                      <span className="text-slate-500 mr-1.5 font-bold">#{p.number || '-'}</span>
                      {p.name}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">{p.position}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Substitutes */}
          {substitutes.length > 0 && (
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">Substitutes</span>
                <span className="text-[9px] text-slate-500 font-semibold">{substitutes.length} Players</span>
              </div>
              <div className="space-y-1 bg-slate-950/40 rounded-lg p-2 border border-slate-800/40">
                {substitutes.map((p) => (
                  <div key={p.id} className="flex justify-between items-center text-[11px] py-0.5 border-b border-slate-900/30 last:border-b-0">
                    <span className="font-medium text-slate-300">
                      <span className="text-slate-500 mr-1.5 font-semibold">#{p.number || '-'}</span>
                      {p.name}
                    </span>
                    <span className="text-[10px] text-slate-500">{p.position}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-xs text-slate-400 text-center py-2">Squad details unavailable</div>
      )}
    </div>
  );

  return (
    <>
      <span 
        ref={triggerRef}
        className="inline-flex items-center"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </span>
      {visible && ReactDOM.createPortal(popoverContent, document.body)}
    </>
  );
}
