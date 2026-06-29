import React from 'react';
import { Link } from 'react-router-dom';
import { TeamBadge } from './TeamBadge';
import TeamHoverCard from './TeamHoverCard';

export default function KnockoutMatchCard({ match }) {
  const isFinished = match.status === 'Finished';
  const isLive = match.status.startsWith('Live');
  const isHomeWinner = match.winnerId === match.homeTeam?.id;
  const isAwayWinner = match.winnerId === match.awayTeam?.id;

  // Format main scores
  const hasExtraTime = match.homeScoreExtraTime !== null && match.awayScoreExtraTime !== null;
  const hasPenalties = match.homeScorePenalties !== null && match.awayScorePenalties !== null;

  const displayHomeScore = hasExtraTime ? match.homeScoreExtraTime : match.homeScore;
  const displayAwayScore = hasExtraTime ? match.awayScoreExtraTime : match.awayScore;

  return (
    <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-[var(--accent-green)]/40 rounded-xl p-4 shadow-md transition-all duration-200 w-full max-w-sm flex flex-col justify-between relative overflow-hidden group">
      
      {/* Card Header (Stage / Status) */}
      <div className="flex justify-between items-center mb-3 text-[10px] uppercase font-bold tracking-wider text-[var(--text-muted)]">
        <span>{match.stage}</span>
        {isLive ? (
          <span className="text-[var(--accent-red)] flex items-center gap-1.5 animate-pulse">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-red)]"></span>
            {match.status === 'LivePenalties' ? 'Penalties' : match.status === 'LiveExtraTime' ? `AET ${match.minute}'` : `Live ${match.minute}'`}
          </span>
        ) : isFinished ? (
          <span className="text-[var(--text-secondary)]">
            {hasPenalties ? 'FT (Pens)' : hasExtraTime ? 'FT (AET)' : 'FT'}
          </span>
        ) : (
          <span className="text-[var(--accent-blue)]">
            {new Date(match.matchDateTime).toLocaleDateString([], { month: 'short', day: 'numeric' })}
          </span>
        )}
      </div>

      {/* Teams & Scores Row */}
      <div className="space-y-3 py-1">
        {/* Home Team */}
        <div className="flex items-center justify-between">
          <TeamHoverCard teamId={match.homeTeam?.id}>
            <div className="flex items-center space-x-2.5 overflow-hidden">
              <TeamBadge shortName={match.homeTeam?.shortName || 'TBD'} logo={match.homeTeam?.logo} size="sm" />
              <span className={`text-sm font-semibold truncate ${
                isFinished && !isHomeWinner ? 'text-[var(--text-muted)]' : 'text-[var(--text-primary)]'
              }`}>
                {match.homeTeam?.name || 'To Be Decided'}
              </span>
            </div>
          </TeamHoverCard>

          <div className="flex items-center space-x-2 flex-shrink-0">
            {hasPenalties && (
              <span className="text-xs font-bold text-[var(--accent-amber)]" title="Penalty Score">
                ({match.homeScorePenalties})
              </span>
            )}
            {match.status !== 'Upcoming' && (
              <span className={`text-base font-black px-2 py-0.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded ${
                isFinished && isHomeWinner ? 'text-[var(--accent-green)] font-extrabold border-[var(--accent-green)]/35 bg-[var(--accent-green)]/5' : ''
              }`}>
                {displayHomeScore}
              </span>
            )}
          </div>
        </div>

        {/* Away Team */}
        <div className="flex items-center justify-between">
          <TeamHoverCard teamId={match.awayTeam?.id}>
            <div className="flex items-center space-x-2.5 overflow-hidden">
              <TeamBadge shortName={match.awayTeam?.shortName || 'TBD'} logo={match.awayTeam?.logo} size="sm" />
              <span className={`text-sm font-semibold truncate ${
                isFinished && !isAwayWinner ? 'text-[var(--text-muted)]' : 'text-[var(--text-primary)]'
              }`}>
                {match.awayTeam?.name || 'To Be Decided'}
              </span>
            </div>
          </TeamHoverCard>

          <div className="flex items-center space-x-2 flex-shrink-0">
            {hasPenalties && (
              <span className="text-xs font-bold text-[var(--accent-amber)]" title="Penalty Score">
                ({match.awayScorePenalties})
              </span>
            )}
            {match.status !== 'Upcoming' && (
              <span className={`text-base font-black px-2 py-0.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded ${
                isFinished && isAwayWinner ? 'text-[var(--accent-green)] font-extrabold border-[var(--accent-green)]/35 bg-[var(--accent-green)]/5' : ''
              }`}>
                {displayAwayScore}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Card Footer (Venue / Details Link) */}
      <div className="mt-3 pt-2.5 border-t border-[var(--border-color)]/60 flex items-center justify-between text-[11px] text-[var(--text-muted)]">
        <span className="truncate max-w-[180px]">{match.venue || 'Stadium'}</span>
        {match.status !== 'Upcoming' ? (
          <Link
            to={`/match/${match.id}`}
            className="text-[var(--accent-green)] font-bold hover:underline cursor-pointer flex items-center gap-0.5"
          >
            Stats &rarr;
          </Link>
        ) : (
          <span>
            {new Date(match.matchDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </div>
    </div>
  );
}
