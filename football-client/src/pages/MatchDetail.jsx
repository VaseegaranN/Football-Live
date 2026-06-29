import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { MapPin, Activity, Clock, Users, ArrowLeft, AlertCircle } from 'lucide-react';
import { matchesApi, teamsApi } from '../api/client';
import { TeamBadge, LeagueBadge } from '../components/TeamBadge';
import TeamHoverCard from '../components/TeamHoverCard';
import PlayerHoverCard from '../components/PlayerHoverCard';

// Reusable stat comparison bar component
function StatRow({ label, homeVal, awayVal, isPercent = false }) {
  const total = homeVal + awayVal;
  const homePercent = total === 0 ? 50 : (homeVal / total) * 100;
  const awayPercent = total === 0 ? 50 : (awayVal / total) * 100;

  const displayHome = isPercent ? `${homeVal.toFixed(0)}%` : homeVal;
  const displayAway = isPercent ? `${awayVal.toFixed(0)}%` : awayVal;

  return (
    <div className="space-y-1.5 py-3 border-b border-[var(--border-color)] last:border-0">
      <div className="flex justify-between text-sm font-semibold text-[var(--text-secondary)]">
        <span>{displayHome}</span>
        <span className="text-xs uppercase tracking-wider text-[var(--text-muted)] font-bold">{label}</span>
        <span>{displayAway}</span>
      </div>
      <div className="flex h-2 w-full rounded-full overflow-hidden bg-slate-800">
        <div
          className="bg-[var(--accent-green)] transition-all duration-500 rounded-l-full"
          style={{ width: `${isPercent ? homeVal : homePercent}%` }}
        />
        <div
          className="bg-[var(--accent-blue)] transition-all duration-500 rounded-r-full"
          style={{ width: `${isPercent ? awayVal : awayPercent}%` }}
        />
      </div>
    </div>
  );
}

export default function MatchDetail() {
  const { id } = useParams();
  const [match, setMatch] = useState(null);
  const [homeTeam, setHomeTeam] = useState(null);
  const [awayTeam, setAwayTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingSquads, setLoadingSquads] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('stats');
  const [connection, setConnection] = useState(null);

  const fetchMatchDetails = async (silence = false) => {
    if (!id) return;
    if (!silence) setLoading(true);
    try {
      const matchRes = await matchesApi.getById(parseInt(id, 10));
      setMatch(matchRes.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching match details:', err);
      setError('Could not retrieve match details. Please ensure the backend is running.');
    } finally {
      if (!silence) setLoading(false);
    }
  };

  // 1. Setup SignalR Connection
  useEffect(() => {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
    const newConnection = new HubConnectionBuilder()
      .withUrl(`${apiBaseUrl}/matchHub`)
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);

    return () => {
      if (newConnection) {
        newConnection.stop();
      }
    };
  }, []);

  // 2. Join Group and Register Listeners
  useEffect(() => {
    if (!connection || !id) return;

    const handleDetailedMatchUpdate = (updatedMatch) => {
      if (updatedMatch.id !== parseInt(id, 10)) return;

      setMatch((prevMatch) => {
        if (!prevMatch) return null;
        return {
          ...prevMatch,
          homeScore: updatedMatch.homeScore,
          awayScore: updatedMatch.awayScore,
          status: updatedMatch.status,
          minute: updatedMatch.minute,
          homeScoreExtraTime: updatedMatch.homeScoreExtraTime,
          awayScoreExtraTime: updatedMatch.awayScoreExtraTime,
          homeScorePenalties: updatedMatch.homeScorePenalties,
          awayScorePenalties: updatedMatch.awayScorePenalties,
          winnerId: updatedMatch.winnerId,
        };
      });

      // Silently trigger background fetch to get latest stats/timeline events
      fetchMatchDetails(true);
    };

    const setupConnection = async () => {
      try {
        if (connection.state === 'Disconnected') {
          await connection.start();
          console.log(`Connected to MatchHub in MatchDetail. Joining group Match_${id}`);
        }
        
        if (connection.state === 'Connected') {
          await connection.invoke('JoinMatch', id);
        }
        
        connection.on('ReceiveDetailedMatchUpdate', handleDetailedMatchUpdate);
      } catch (err) {
        console.error('SignalR MatchDetail Connection Error: ', err);
      }
    };

    setupConnection();

    return () => {
      connection.off('ReceiveDetailedMatchUpdate', handleDetailedMatchUpdate);
      if (connection.state === 'Connected') {
        connection.invoke('LeaveMatch', id).catch(console.error);
      }
    };
  }, [connection, id]);

  // 3. Fallback Poll match details if live and SignalR is not connected
  useEffect(() => {
    fetchMatchDetails();

    const interval = setInterval(() => {
      const isLive = match?.status.startsWith('Live');
      const isSignalRConnected = connection?.state === 'Connected';
      if (isLive && !isSignalRConnected) {
        fetchMatchDetails(true);
      }
    }, 20000); // 20s fallback

    return () => clearInterval(interval);
  }, [id, match?.status, connection?.state]);

  // Load rosters when "lineups" tab is clicked
  useEffect(() => {
    if (activeTab === 'lineups' && match && !homeTeam && !awayTeam && !loadingSquads) {
      setLoadingSquads(true);
      Promise.all([
        teamsApi.getById(match.homeTeam.id),
        teamsApi.getById(match.awayTeam.id),
      ])
        .then(([homeRes, awayRes]) => {
          setHomeTeam(homeRes.data);
          setAwayTeam(awayRes.data);
        })
        .catch((err) => {
          console.error('Error loading team rosters:', err);
        })
        .finally(() => {
          setLoadingSquads(false);
        });
    }
  }, [activeTab, match, homeTeam, awayTeam]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-44 w-full skeleton"></div>
        <div className="h-10 w-full skeleton"></div>
        <div className="h-96 w-full skeleton"></div>
      </div>
    );
  }

  if (error || !match) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center text-[var(--text-secondary)] gap-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl max-w-2xl mx-auto">
        <AlertCircle className="h-12 w-12 text-[var(--accent-red)]" />
        <h3 className="text-lg font-bold">Error Loading Match</h3>
        <p className="text-sm px-6">{error || 'Match not found.'}</p>
        <Link
          to="/"
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent-green)] text-slate-950 font-bold text-sm rounded-lg hover:scale-105 transition-transform"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>
      </div>
    );
  }

  // Group squad players by position categories
  const groupRoster = (players) => {
    const categories = {
      Goalkeepers: players.filter((p) => p.position.toLowerCase().includes('goalkeeper')),
      Defenders: players.filter((p) => p.position.toLowerCase().includes('defender')),
      Midfielders: players.filter((p) => p.position.toLowerCase().includes('midfielder')),
      Forwards: players.filter((p) => p.position.toLowerCase().includes('forward') || p.position.toLowerCase().includes('striker')),
    };
    return categories;
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
      {/* Back Button */}
      <Link
        to="/"
        className="inline-flex items-center text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--accent-green)] transition-colors gap-1.5"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
      </Link>

      {/* ─── MATCH HEADER SCOREBOARD ────────────────────────────────────────────── */}
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl shadow-xl overflow-hidden relative">
        <div className="absolute top-4 left-4">
          <LeagueBadge leagueId={match.league.id} name={match.league.name} />
        </div>

        {/* Stadium venue */}
        {match.venue && (
          <div className="absolute top-4 right-4 hidden sm:flex items-center gap-1.5 text-xs text-[var(--text-muted)] font-medium">
            <MapPin className="h-3.5 w-3.5" />
            <span>{match.venue}</span>
          </div>
        )}

        <div className="px-6 py-12 flex items-center justify-between">
          {/* Home Team */}
          <div className="flex flex-col items-center text-center space-y-3 w-5/12">
            <TeamHoverCard teamId={match.homeTeam.id}>
              <div className="flex flex-col items-center">
                <TeamBadge shortName={match.homeTeam.shortName} logo={match.homeTeam.logo} size="lg" />
                <h1 className="text-base sm:text-xl font-extrabold text-[var(--text-primary)] mt-3">{match.homeTeam.name}</h1>
              </div>
            </TeamHoverCard>
            <span className="text-xs font-semibold px-2 py-0.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-full text-[var(--text-secondary)] uppercase">
              Home
            </span>
          </div>

          {/* Scores & Time details */}
          <div className="flex flex-col items-center justify-center w-2/12 select-none">
            {match.status !== 'Upcoming' ? (
              <div className="text-3xl sm:text-5xl font-black tracking-widest text-[var(--text-primary)]">
                {match.homeScore} - {match.awayScore}
              </div>
            ) : (
              <div className="px-4 py-2 bg-[var(--bg-primary)] rounded-xl border border-[var(--border-color)] text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                VS
              </div>
            )}

            <div className="mt-3 text-center">
              {match.status === 'Live' ? (
                <span className="px-2.5 py-1 bg-red-950/40 text-[var(--accent-red)] border border-red-500/20 font-bold rounded-full text-xs flex items-center gap-1.5 animate-pulse">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-red)]"></span>
                  {match.minute}'
                </span>
              ) : match.status === 'Finished' ? (
                <span className="px-2.5 py-1 bg-slate-800 text-[var(--text-secondary)] border border-[var(--border-color)] font-bold rounded-full text-xs">
                  Full Time
                </span>
              ) : (
                <div className="flex flex-col items-center text-[var(--text-secondary)] gap-0.5">
                  <span className="text-xs font-semibold">
                    {new Date(match.matchDateTime).toLocaleDateString([], {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                  <span className="text-xs font-bold text-[var(--text-primary)]">
                    {new Date(match.matchDateTime).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Away Team */}
          <div className="flex flex-col items-center text-center space-y-3 w-5/12">
            <TeamHoverCard teamId={match.awayTeam.id}>
              <div className="flex flex-col items-center">
                <TeamBadge shortName={match.awayTeam.shortName} logo={match.awayTeam.logo} size="lg" />
                <h1 className="text-base sm:text-xl font-extrabold text-[var(--text-primary)] mt-3">{match.awayTeam.name}</h1>
              </div>
            </TeamHoverCard>
            <span className="text-xs font-semibold px-2 py-0.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-full text-[var(--text-secondary)] uppercase">
              Away
            </span>
          </div>
        </div>
      </div>

      {/* ─── TAB BAR ────────────────────────────────────────────────────────────── */}
      <div className="flex border-b border-[var(--border-color)] bg-[var(--bg-secondary)] p-1.5 rounded-xl border">
        <button
          onClick={() => setActiveTab('stats')}
          className={`flex-1 py-2 text-center rounded-lg text-sm font-bold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'stats'
              ? 'bg-[var(--accent-green)] text-slate-950 shadow-md'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)]'
          }`}
        >
          <Activity className="h-4 w-4" /> Stats
        </button>
        <button
          onClick={() => setActiveTab('events')}
          className={`flex-1 py-2 text-center rounded-lg text-sm font-bold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'events'
              ? 'bg-[var(--accent-green)] text-slate-950 shadow-md'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)]'
          }`}
        >
          <Clock className="h-4 w-4" /> Timeline
        </button>
        <button
          onClick={() => setActiveTab('lineups')}
          className={`flex-1 py-2 text-center rounded-lg text-sm font-bold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'lineups'
              ? 'bg-[var(--accent-green)] text-slate-950 shadow-md'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)]'
          }`}
        >
          <Users className="h-4 w-4" /> Lineups
        </button>
      </div>

      {/* ─── TAB CONTENT ────────────────────────────────────────────────────────── */}
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl shadow-xl p-6">
        
        {/* STATS TAB */}
        {activeTab === 'stats' && (
          <div>
            {!match.homeStats || !match.awayStats ? (
              <div className="text-center py-16 text-[var(--text-muted)]">
                <Activity className="h-10 w-10 mx-auto opacity-50 mb-3" />
                <p className="font-semibold text-sm">No statistics available for this match</p>
                <p className="text-xs mt-1">Stats are captured when the match starts live</p>
              </div>
            ) : (
              <div className="space-y-2">
                <StatRow label="Possession" homeVal={match.homeStats.possession} awayVal={match.awayStats.possession} isPercent={true} />
                <StatRow label="Shots on Target" homeVal={match.homeStats.shotsOnTarget} awayVal={match.awayStats.shotsOnTarget} />
                <StatRow label="Shots off Target" homeVal={match.homeStats.shotsOffTarget} awayVal={match.awayStats.shotsOffTarget} />
                <StatRow label="Fouls" homeVal={match.homeStats.fouls} awayVal={match.awayStats.fouls} />
                <StatRow label="Corners" homeVal={match.homeStats.corners} awayVal={match.awayStats.corners} />
                <StatRow label="Yellow Cards" homeVal={match.homeStats.yellowCards} awayVal={match.awayStats.yellowCards} />
                <StatRow label="Red Cards" homeVal={match.homeStats.redCards} awayVal={match.awayStats.redCards} />
                <StatRow label="Total Passes" homeVal={match.homeStats.passes} awayVal={match.awayStats.passes} />
                <StatRow label="Pass Accuracy" homeVal={match.homeStats.passAccuracy} awayVal={match.awayStats.passAccuracy} isPercent={true} />
              </div>
            )}
          </div>
        )}

        {/* TIMELINE EVENTS TAB */}
        {activeTab === 'events' && (
          <div>
            {match.events.length === 0 ? (
              <div className="text-center py-16 text-[var(--text-muted)]">
                <Clock className="h-10 w-10 mx-auto opacity-50 mb-3" />
                <p className="font-semibold text-sm">No commentary events recorded yet</p>
              </div>
            ) : (
              <div className="relative py-4">
                {/* Center line of timeline */}
                <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-0.5 bg-[var(--border-color)] hidden md:block"></div>

                <div className="space-y-6">
                  {match.events.map((event) => {
                    const isHome = event.teamShortName?.toLowerCase() === match.homeTeam.shortName.toLowerCase();
                    const isAway = event.teamShortName?.toLowerCase() === match.awayTeam.shortName.toLowerCase();
                    const isCenter = !isHome && !isAway;

                    const getEventIcon = () => {
                      switch (event.eventType) {
                        case 'Goal':
                          return <span className="bg-emerald-950 border border-emerald-500/30 text-[var(--accent-green)] text-xs h-8 w-8 rounded-full flex items-center justify-center shadow">⚽</span>;
                        case 'YellowCard':
                          return <span className="bg-amber-950 border border-amber-500/30 text-[var(--accent-amber)] h-8 w-8 rounded-full flex items-center justify-center shadow font-bold text-sm">🟨</span>;
                        case 'RedCard':
                          return <span className="bg-red-950 border border-red-500/30 text-[var(--accent-red)] h-8 w-8 rounded-full flex items-center justify-center shadow font-bold text-sm">🟥</span>;
                        case 'Substitution':
                          return <span className="bg-blue-950 border border-blue-500/30 text-[var(--accent-blue)] text-xs h-8 w-8 rounded-full flex items-center justify-center shadow font-bold">🔄</span>;
                        case 'KickOff':
                        case 'HalfTime':
                          return <span className="bg-slate-900 border border-[var(--border-color)] text-[var(--text-primary)] text-[10px] h-8 w-8 rounded-full flex items-center justify-center shadow font-black uppercase">⏱️</span>;
                        default:
                          return <span className="bg-slate-800 border border-[var(--border-color)] text-[var(--text-secondary)] text-[10px] h-8 w-8 rounded-full flex items-center justify-center shadow font-bold">💬</span>;
                      }
                    };

                    return (
                      <div key={event.id} className="relative flex flex-col md:flex-row items-center md:justify-center">
                        {/* Event Icon on Timeline center */}
                        <div className="md:absolute md:left-1/2 md:transform md:-translate-x-1/2 z-10 mb-2 md:mb-0 select-none">
                          {getEventIcon()}
                        </div>

                        {/* Home aligned event detail */}
                        <div className={`w-full md:w-5/12 flex ${isHome ? 'justify-start md:justify-end md:text-right pr-0 md:pr-8' : 'hidden md:flex opacity-0 pointer-events-none'}`}>
                          {isHome && (
                            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-4 shadow-sm max-w-sm w-full">
                              <span className="font-extrabold text-[var(--accent-green)] text-xs">{event.minute}'</span>
                              <p className="text-sm font-semibold text-[var(--text-primary)] mt-1">{event.description}</p>
                              {event.playerName && (
                                <p className="text-xs text-[var(--accent-green)] font-medium mt-1.5">
                                  <PlayerHoverCard playerId={event.playerId}>
                                    {event.playerName}
                                  </PlayerHoverCard>
                                </p>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Center/Commentary text (like halftime details) */}
                        {isCenter && (
                          <div className="w-full md:w-8/12 bg-[var(--bg-primary)] border border-[var(--border-color)] text-center rounded-2xl p-4 shadow-sm z-10">
                            <span className="font-extrabold text-[var(--text-secondary)] text-xs uppercase tracking-wider">{event.minute}' - {event.eventType}</span>
                            <p className="text-sm font-semibold text-[var(--text-primary)] mt-1">{event.description}</p>
                          </div>
                        )}

                        {/* Away aligned event detail */}
                        <div className={`w-full md:w-5/12 flex ${isAway ? 'justify-start md:pl-8 text-left' : 'hidden md:flex opacity-0 pointer-events-none'}`}>
                          {isAway && (
                            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-4 shadow-sm max-w-sm w-full">
                              <span className="font-extrabold text-[var(--accent-blue)] text-xs">{event.minute}'</span>
                              <p className="text-sm font-semibold text-[var(--text-primary)] mt-1">{event.description}</p>
                              {event.playerName && (
                                <p className="text-xs text-[var(--accent-blue)] font-medium mt-1.5">
                                  <PlayerHoverCard playerId={event.playerId}>
                                    {event.playerName}
                                  </PlayerHoverCard>
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* LINEUPS TAB */}
        {activeTab === 'lineups' && (
          <div>
            {loadingSquads ? (
              <div className="space-y-6 py-6">
                <div className="h-6 w-32 skeleton"></div>
                <div className="grid grid-cols-2 gap-8">
                  <div className="h-48 skeleton"></div>
                  <div className="h-48 skeleton"></div>
                </div>
              </div>
            ) : !homeTeam || !awayTeam ? (
              <div className="text-center py-16 text-[var(--text-muted)]">
                <Users className="h-10 w-10 mx-auto opacity-50 mb-3" />
                <p className="font-semibold text-sm">Failed to retrieve team lineups</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Home Team Lineup */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-3 border-b border-[var(--border-color)] pb-3">
                    <TeamBadge shortName={match.homeTeam.shortName} logo={match.homeTeam.logo} size="sm" />
                    <h3 className="font-bold text-base text-[var(--text-primary)]">{homeTeam.name}</h3>
                  </div>

                  <div className="space-y-4">
                    {Object.entries(groupRoster(homeTeam.players)).map(([position, players]) => (
                      <div key={position} className="space-y-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] bg-[var(--bg-primary)] px-2 py-1 rounded">
                          {position}
                        </h4>
                        <div className="divide-y divide-[var(--border-color)] bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] overflow-hidden">
                          {players.length === 0 ? (
                            <div className="p-3 text-xs text-[var(--text-muted)] italic">No players listed</div>
                          ) : (
                            players.map((p) => (
                              <Link
                                key={p.id}
                                to={`/player/${p.id}`}
                                className="flex items-center justify-between p-3 hover:bg-[var(--bg-card-hover)] transition-colors text-sm"
                              >
                                <div className="flex items-center space-x-3">
                                  <span className="font-bold text-xs px-2 py-0.5 bg-[var(--bg-primary)] rounded text-[var(--text-secondary)] w-7 text-center">
                                    {p.number || '-'}
                                  </span>
                                  <span className="font-medium text-[var(--text-primary)] hover:text-[var(--accent-green)] transition-colors">
                                    <PlayerHoverCard playerId={p.id}>
                                      {p.name}
                                    </PlayerHoverCard>
                                  </span>
                                </div>
                                <span className="text-xs text-[var(--text-muted)]">{p.nationality}</span>
                              </Link>
                            ))
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Away Team Lineup */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-3 border-b border-[var(--border-color)] pb-3">
                    <TeamBadge shortName={match.awayTeam.shortName} logo={match.awayTeam.logo} size="sm" />
                    <h3 className="font-bold text-base text-[var(--text-primary)]">{awayTeam.name}</h3>
                  </div>

                  <div className="space-y-4">
                    {Object.entries(groupRoster(awayTeam.players)).map(([position, players]) => (
                      <div key={position} className="space-y-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] bg-[var(--bg-primary)] px-2 py-1 rounded">
                          {position}
                        </h4>
                        <div className="divide-y divide-[var(--border-color)] bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] overflow-hidden">
                          {players.length === 0 ? (
                            <div className="p-3 text-xs text-[var(--text-muted)] italic">No players listed</div>
                          ) : (
                            players.map((p) => (
                              <Link
                                key={p.id}
                                to={`/player/${p.id}`}
                                className="flex items-center justify-between p-3 hover:bg-[var(--bg-card-hover)] transition-colors text-sm"
                              >
                                <div className="flex items-center space-x-3">
                                  <span className="font-bold text-xs px-2 py-0.5 bg-[var(--bg-primary)] rounded text-[var(--text-secondary)] w-7 text-center">
                                    {p.number || '-'}
                                  </span>
                                  <span className="font-medium text-[var(--text-primary)] hover:text-[var(--accent-green)] transition-colors">
                                    <PlayerHoverCard playerId={p.id}>
                                      {p.name}
                                    </PlayerHoverCard>
                                  </span>
                                </div>
                                <span className="text-xs text-[var(--text-muted)]">{p.nationality}</span>
                              </Link>
                            ))
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
