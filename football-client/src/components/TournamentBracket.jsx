import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Trophy } from 'lucide-react';
import KnockoutMatchCard from './KnockoutMatchCard';

export default function TournamentBracket({ bracket }) {
  const [viewIndex, setViewIndex] = useState(0); // 0: R32, R16, QF. 1: QF, SF, Final.

  if (!bracket || bracket.length === 0) {
    return (
      <div className="text-center py-16 text-[var(--text-muted)] bg-[var(--bg-secondary)] border border-[var(--border-color)] border-dashed rounded-2xl">
        <p className="font-medium text-sm">No bracket data available yet</p>
        <p className="text-xs mt-1">Knockout matches will populate once group stages conclude</p>
      </div>
    );
  }

  // Helper to filter matches for a specific stage name (supports case-insensitive & hyphen variations)
  const getStageMatches = (stageName) => {
    // Normalise stage names (e.g. "Quarter-Finals" -> "quarterfinals")
    const normalise = (name) => name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const target = normalise(stageName);

    // Look inside bracket array. The backend returns a grouped list: [{ roundName: "...", matches: [...] }]
    // But if bracket is a flat list of matches, we can also handle it. Let's support both structures!
    let flatMatches = [];
    if (Array.isArray(bracket)) {
      if (bracket[0]?.roundName !== undefined) {
        // Grouped by roundName from backend
        const round = bracket.find((r) => normalise(r.roundName) === target);
        return round ? round.matches : [];
      } else {
        // Flat array of matches
        flatMatches = bracket;
      }
    }

    return flatMatches.filter((m) => m.stage && normalise(m.stage) === target);
  };

  const rounds = [
    { key: 'Round of 32', label: 'Round of 32', matches: getStageMatches('Round of 32'), placeholderCount: 16 },
    { key: 'Round of 16', label: 'Round of 16', matches: getStageMatches('Round of 16'), placeholderCount: 8 },
    { key: 'Quarter-Finals', label: 'Quarter-Finals', matches: getStageMatches('Quarter-Finals'), placeholderCount: 4 },
    { key: 'Semi-Finals', label: 'Semi-Finals', matches: getStageMatches('Semi-Finals'), placeholderCount: 2 },
    { key: 'Final', label: 'Final', matches: getStageMatches('Final'), placeholderCount: 1 },
  ];

  // Google style sliding view: 3 columns visible at a time
  // View 0: Round of 32, Round of 16, Quarter-Finals
  // View 1: Quarter-Finals, Semi-Finals, Final
  const activeRounds = viewIndex === 0 
    ? [rounds[0], rounds[1], rounds[2]]
    : [rounds[2], rounds[3], rounds[4]];

  const handlePrev = () => {
    if (viewIndex > 0) setViewIndex(viewIndex - 1);
  };

  const handleNext = () => {
    if (viewIndex < 1) setViewIndex(viewIndex + 1);
  };

  return (
    <div className="space-y-4">
      {/* HEADER CONTROLS (Google Sports Style) */}
      <div className="flex justify-between items-center bg-[var(--bg-secondary)] border border-[var(--border-color)] px-5 py-3 rounded-2xl shadow-md">
        <div className="flex items-center gap-2">
          <Trophy className="h-4.5 w-4.5 text-[var(--accent-amber)] animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
            Knockout Stages
          </span>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center gap-1.5 select-none">
          <button
            onClick={handlePrev}
            disabled={viewIndex === 0}
            className="p-1.5 bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[var(--accent-green)]/40 disabled:opacity-20 disabled:pointer-events-none rounded-lg text-[var(--text-primary)] transition-all cursor-pointer"
            title="Previous Rounds"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider px-2">
            {viewIndex === 0 ? 'R32 • R16 • QF' : 'QF • SF • Final'}
          </span>
          <button
            onClick={handleNext}
            disabled={viewIndex === 1}
            className="p-1.5 bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[var(--accent-green)]/40 disabled:opacity-20 disabled:pointer-events-none rounded-lg text-[var(--text-primary)] transition-all cursor-pointer"
            title="Next Rounds"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* THREE COLUMN SLIDER GRID */}
      <div className="overflow-x-auto pb-6 -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex justify-between items-stretch w-full max-w-5xl mx-auto min-w-[950px] gap-6 py-4">
          {activeRounds.map((round) => (
            <div key={round.key} className="flex-1 flex flex-col justify-between gap-4 min-h-[640px]">
              {/* Round Title Header */}
              <h3 className="text-center text-xs font-black uppercase tracking-wider text-[var(--text-secondary)] border-b border-[var(--border-color)] pb-2.5 mb-2 select-none">
                {round.label}
              </h3>

              {/* Match Items list */}
              <div className="flex-1 flex flex-col justify-around gap-4">
                {round.matches.length > 0 ? (
                  round.matches.map((match) => (
                    <div key={match.id} className="w-full max-w-sm flex flex-col items-center">
                      <KnockoutMatchCard match={match} />
                      {/* Champion Crown (If Grand Final and has a winner) */}
                      {round.key === 'Final' && match.status === 'Finished' && match.winnerId && (
                        <div className="mt-4 px-4 py-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-xl text-center shadow-lg font-bold text-xs flex items-center gap-1.5 animate-bounce">
                          👑 Champion: {match.winnerId === match.homeTeam?.id ? match.homeTeam?.name : match.awayTeam?.name}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  // Placeholder empty matches styled beautifully to line up
                  Array.from({ length: round.placeholderCount }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-[var(--bg-secondary)]/40 border border-[var(--border-color)] border-dashed rounded-xl p-4 text-center text-xs text-[var(--text-muted)] w-full max-w-sm h-28 flex flex-col justify-center items-center gap-2 select-none"
                    >
                      <div className="flex items-center gap-1.5 opacity-60">
                        <span className="h-3 w-4 bg-slate-800 rounded"></span>
                        <span className="h-3 w-16 bg-slate-800 rounded"></span>
                      </div>
                      <div className="flex items-center gap-1.5 opacity-60">
                        <span className="h-3 w-4 bg-slate-800 rounded"></span>
                        <span className="h-3 w-16 bg-slate-800 rounded"></span>
                      </div>
                      <span className="text-[9px] font-semibold uppercase tracking-wide opacity-40 mt-1">
                        TBD (Match {i + 1})
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
