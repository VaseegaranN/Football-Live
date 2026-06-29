import React from 'react';
import KnockoutMatchCard from './KnockoutMatchCard';

export default function TournamentBracket({ bracket }) {
  if (bracket.length === 0) {
    return (
      <div className="text-center py-16 text-[var(--text-muted)] bg-[var(--bg-secondary)] border border-[var(--border-color)] border-dashed rounded-2xl">
        <p className="font-medium text-sm">No bracket data available yet</p>
        <p className="text-xs mt-1">Knockout matches will populate once group stages conclude</p>
      </div>
    );
  }

  // Get matches grouped by round
  const getRoundMatches = (roundName) => {
    const round = bracket.find((r) => r.roundName.toLowerCase() === roundName.toLowerCase());
    return round ? round.matches : [];
  };

  const quarterFinals = getRoundMatches('Quarter-Finals');
  const semiFinals = getRoundMatches('Semi-Finals');
  const finals = getRoundMatches('Final');

  return (
    <div className="overflow-x-auto pb-6 -mx-4 px-4 sm:mx-0 sm:px-0">
      <div className="flex justify-between items-stretch w-full max-w-5xl mx-auto min-w-[950px] gap-8 py-4">
        
        {/* QUARTER-FINALS COLUMN */}
        <div className="flex-1 flex flex-col justify-between gap-6 min-h-[500px]">
          <h3 className="text-center text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] border-b border-[var(--border-color)] pb-2 mb-2">
            Quarter-Finals
          </h3>
          <div className="flex-1 flex flex-col justify-around gap-4">
            {quarterFinals.length > 0 ? (
              quarterFinals.map((match) => (
                <KnockoutMatchCard key={match.id} match={match} />
              ))
            ) : (
              [1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-[var(--bg-secondary)]/50 border border-[var(--border-color)] border-dashed rounded-xl p-4 text-center text-xs text-[var(--text-muted)] w-full max-w-sm h-28 flex items-center justify-center">
                  QF Match {i}
                </div>
              ))
            )}
          </div>
        </div>

        {/* SEMI-FINALS COLUMN */}
        <div className="flex-1 flex flex-col justify-between gap-6 min-h-[500px]">
          <h3 className="text-center text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] border-b border-[var(--border-color)] pb-2 mb-2">
            Semi-Finals
          </h3>
          <div className="flex-1 flex flex-col justify-around gap-8">
            {semiFinals.length > 0 ? (
              semiFinals.map((match) => (
                <KnockoutMatchCard key={match.id} match={match} />
              ))
            ) : (
              [1, 2].map((i) => (
                <div key={i} className="bg-[var(--bg-secondary)]/50 border border-[var(--border-color)] border-dashed rounded-xl p-4 text-center text-xs text-[var(--text-muted)] w-full max-w-sm h-28 flex items-center justify-center">
                  Semi-Final {i}
                </div>
              ))
            )}
          </div>
        </div>

        {/* CHAMPIONSHIP / FINAL COLUMN */}
        <div className="flex-1 flex flex-col justify-between gap-6 min-h-[500px]">
          <h3 className="text-center text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] border-b border-[var(--border-color)] pb-2 mb-2">
            Championship Final
          </h3>
          <div className="flex-1 flex flex-col justify-center gap-4">
            <div className="space-y-8 flex flex-col items-center">
              {finals.length > 0 ? (
                finals.map((match) => (
                  <div key={match.id} className="w-full max-w-sm flex flex-col items-center">
                    <div className="w-full">
                      <KnockoutMatchCard match={match} />
                    </div>
                    {/* Champion Crown Placeholder */}
                    {match.status === 'Finished' && match.winnerId && (
                      <div className="mt-4 px-4 py-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-xl text-center shadow-lg font-bold text-xs flex items-center gap-1.5 animate-bounce">
                        👑 Champion: {match.winnerId === match.homeTeam?.id ? match.homeTeam?.name : match.awayTeam?.name}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="bg-[var(--bg-secondary)]/50 border border-[var(--border-color)] border-dashed rounded-xl p-4 text-center text-xs text-[var(--text-muted)] w-full max-w-sm h-28 flex items-center justify-center">
                  Grand Final
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
