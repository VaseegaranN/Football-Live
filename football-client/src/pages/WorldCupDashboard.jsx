import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { Activity, Calendar, Trophy, ListOrdered, Share2, RefreshCw, AlertCircle } from 'lucide-react';
import { worldCupApi, matchesApi } from '../api/client';
import { TeamBadge } from '../components/TeamBadge';
import TournamentBracket from '../components/TournamentBracket';
import TeamHoverCard from '../components/TeamHoverCard';

export default function WorldCupDashboard() {
  const [activeTab, setActiveTab] = useState('bracket');
  const [matches, setMatches] = useState([]);
  const [standings, setStandings] = useState({});
  const [bracket, setBracket] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connection, setConnection] = useState(null);

  // 1. Fetch data on mount / tab change
  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'standings') {
        const standingsRes = await worldCupApi.getStandings(5); // World Cup LeagueId = 5
        setStandings(standingsRes.data);
      } else if (activeTab === 'bracket') {
        const bracketRes = await worldCupApi.getBracket(5);
        setBracket(bracketRes.data);
      } else {
        // Live / Fixtures tabs
        const matchesRes = await matchesApi.getAll();
        // Filter only World Cup league matches (LeagueId = 5)
        const worldCupMatches = matchesRes.data.filter((m) => m.league.id === 5);
        setMatches(worldCupMatches);
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching World Cup data:', err);
      setError('Could not load tournament data. Please make sure the server is online.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  // 2. Setup SignalR Real-Time Connection
  useEffect(() => {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
    const newConnection = new HubConnectionBuilder()
      .withUrl(`${apiBaseUrl}/matchHub`) // Connect to C# SignalR MatchHub
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);

    return () => {
      if (newConnection) {
        newConnection.stop();
      }
    };
  }, []);

  // 3. Register SignalR Listeners
  useEffect(() => {
    if (!connection) return;

    const handleMatchUpdate = (updatedMatch) => {
      // If updated match is not World Cup, skip
      if (updatedMatch.league.id !== 5) return;

      // Update Matches state (if in live or fixtures tab)
      setMatches((prevMatches) =>
        prevMatches.map((m) => (m.id === updatedMatch.id ? updatedMatch : m))
      );

      // Update Bracket state (if in bracket tab)
      setBracket((prevBracket) =>
        prevBracket.map((round) => ({
          ...round,
          matches: round.matches.map((m) => (m.id === updatedMatch.id ? updatedMatch : m)),
        }))
      );

      // If a live match updates standings, trigger re-fetch of standings in background
      if (activeTab === 'standings' && updatedMatch.status === 'Finished') {
        worldCupApi.getStandings(5).then((res) => setStandings(res.data)).catch(console.error);
      }
    };

    connection.on('ReceiveMatchUpdate', handleMatchUpdate);

    if (connection.state === 'Disconnected') {
      connection.start()
        .then(() => {
          console.log('Connected to SignalR MatchHub!');
        })
        .catch((err) => console.error('SignalR Connection Error: ', err));
    }

    return () => {
      connection.off('ReceiveMatchUpdate', handleMatchUpdate);
    };
  }, [connection, activeTab]);

  const liveMatches = matches.filter((m) => m.status.startsWith('Live'));
  const fixturesAndResults = matches.filter((m) => !m.status.startsWith('Live'));

  // Helper to group fixtures by date
  const groupMatchesByDate = (matchList) => {
    const groups = {};
    matchList.forEach((match) => {
      const date = new Date(match.matchDateTime);
      // Format: "Sunday 14 June 2026"
      const dateHeader = date.toLocaleDateString('en-US', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
      if (!groups[dateHeader]) {
        groups[dateHeader] = [];
      }
      groups[dateHeader].push(match);
    });
    return groups;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* ─── TOURNAMENT HERO HEADER ────────────────────────────────────────────── */}
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-emerald-500/5 pointer-events-none"></div>
        
        <div className="flex items-center space-x-4 text-center md:text-left flex-col md:flex-row">
          <div className="w-16 h-16 bg-gradient-to-tr from-amber-500 to-yellow-300 rounded-2xl flex items-center justify-center shadow-lg border border-amber-500/20 text-3xl select-none mb-3 md:mb-0">
            🏆
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)]">
              FIFA World Cup 2026
            </h1>
            <p className="text-xs text-[var(--text-muted)] font-medium mt-1">
              USA, Canada & Mexico &bull; Final Stages
            </p>
          </div>
        </div>

        {/* SignalR Connection Status Pill */}
        <div className="flex items-center space-x-2 text-xs font-semibold px-3 py-1.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-full text-[var(--text-secondary)]">
          <span className={`h-2 w-2 rounded-full ${
            connection?.state === 'Connected' ? 'bg-[var(--accent-green)] animate-pulse' : 'bg-amber-500'
          }`}></span>
          <span>{connection?.state === 'Connected' ? 'Real-Time Sync Active' : 'Connecting Sync...'}</span>
        </div>
      </div>

      {/* ─── TOURNAMENT TABS ────────────────────────────────────────────────────── */}
      <div className="flex border-b border-[var(--border-color)] bg-[var(--bg-secondary)] p-1.5 rounded-xl border overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('bracket')}
          className={`flex-1 py-2 px-4 text-center rounded-lg text-sm font-bold flex items-center justify-center gap-1.5 transition-all min-w-[130px] cursor-pointer ${
            activeTab === 'bracket'
              ? 'bg-[var(--accent-green)] text-slate-950 shadow-md'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)]'
          }`}
        >
          <Share2 className="h-4 w-4" /> Knockout Bracket
        </button>
        <button
          onClick={() => setActiveTab('standings')}
          className={`flex-1 py-2 px-4 text-center rounded-lg text-sm font-bold flex items-center justify-center gap-1.5 transition-all min-w-[135px] cursor-pointer ${
            activeTab === 'standings'
              ? 'bg-[var(--accent-green)] text-slate-950 shadow-md'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)]'
          }`}
        >
          <ListOrdered className="h-4 w-4" /> Group Standings
        </button>
        <button
          onClick={() => setActiveTab('live')}
          className={`flex-1 py-2 px-4 text-center rounded-lg text-sm font-bold flex items-center justify-center gap-1.5 transition-all min-w-[120px] cursor-pointer ${
            activeTab === 'live'
              ? 'bg-[var(--accent-green)] text-slate-950 shadow-md'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)]'
          }`}
        >
          <Activity className="h-4 w-4" /> Live Scores
          {liveMatches.length > 0 && (
            <span className="ml-1 px-1.5 py-0.5 bg-red-600 text-white rounded-full text-[9px] font-extrabold animate-pulse">
              {liveMatches.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('fixtures')}
          className={`flex-1 py-2 px-4 text-center rounded-lg text-sm font-bold flex items-center justify-center gap-1.5 transition-all min-w-[150px] cursor-pointer ${
            activeTab === 'fixtures'
              ? 'bg-[var(--accent-green)] text-slate-950 shadow-md'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)]'
          }`}
        >
          <Calendar className="h-4 w-4" /> Fixtures & Results
        </button>
      </div>

      {/* ─── TAB CONTENTS ───────────────────────────────────────────────────────── */}
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl shadow-xl p-6">
        
        {loading ? (
          <div className="space-y-6 py-6">
            <div className="h-8 w-44 skeleton"></div>
            <div className="h-48 w-full skeleton"></div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12 text-center text-[var(--text-secondary)] gap-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl">
            <AlertCircle className="h-10 w-10 text-[var(--accent-red)]" />
            <p className="font-semibold text-sm">{error}</p>
            <button
              onClick={fetchData}
              className="mt-2 px-4 py-2 bg-[var(--accent-green)] text-slate-950 font-bold text-xs rounded-lg transition-transform hover:scale-105"
            >
              Try Reconnect
            </button>
          </div>
        ) : (
          <div>
            
            {/* 1. BRACKET VIEW */}
            {activeTab === 'bracket' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-base sm:text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-amber-500" /> Knockout Stages Road to Final
                  </h2>
                </div>
                <TournamentBracket bracket={bracket} />
              </div>
            )}

            {/* 2. GROUP STANDINGS VIEW */}
            {activeTab === 'standings' && (
              <div className="space-y-8">
                {Object.entries(standings).map(([groupName, groupList]) => (
                  <div key={groupName} className="space-y-3">
                    <h3 className="text-sm font-extrabold text-[var(--text-secondary)] border-b border-[var(--border-color)] pb-2 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent-green)]"></span>
                      {groupName}
                    </h3>
                    
                    <div className="overflow-x-auto rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] shadow-md">
                      <table className="w-full text-left border-collapse min-w-[600px]">
                        <thead>
                          <tr className="bg-[var(--bg-primary)] border-b border-[var(--border-color)] text-[10px] text-[var(--text-muted)] uppercase font-bold">
                            <th className="px-4 py-3 w-12 text-center">Pos</th>
                            <th className="px-4 py-3">Team</th>
                            <th className="px-4 py-3 text-center">P</th>
                            <th className="px-4 py-3 text-center">W</th>
                            <th className="px-4 py-3 text-center">D</th>
                            <th className="px-4 py-3 text-center">L</th>
                            <th className="px-4 py-3 text-center">GF</th>
                            <th className="px-4 py-3 text-center">GA</th>
                            <th className="px-4 py-3 text-center">GD</th>
                            <th className="px-4 py-3 text-center">Pts</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-color)] text-xs text-[var(--text-primary)]">
                          {groupList.map((row, idx) => {
                            const isQualifying = idx < 2; // Top 2 advance
                            return (
                              <tr key={row.team.id} className="hover:bg-[var(--bg-card-hover)] transition-colors">
                                <td className={`px-4 py-3 text-center font-bold ${
                                  isQualifying ? 'text-[var(--accent-green)] bg-emerald-950/5' : 'text-[var(--text-muted)]'
                                }`}>
                                  {idx + 1}
                                </td>
                                <td className="px-4 py-3 font-semibold">
                                  <TeamHoverCard teamId={row.team.id}>
                                    <div className="flex items-center space-x-2.5">
                                      <TeamBadge shortName={row.team.shortName} logo={row.team.logo} size="sm" />
                                      <span>{row.team.name}</span>
                                    </div>
                                  </TeamHoverCard>
                                </td>
                                <td className="px-4 py-3 text-center">{row.played}</td>
                                <td className="px-4 py-3 text-center">{row.won}</td>
                                <td className="px-4 py-3 text-center">{row.drawn}</td>
                                <td className="px-4 py-3 text-center">{row.lost}</td>
                                <td className="px-4 py-3 text-center text-[var(--text-secondary)]">{row.goalsFor}</td>
                                <td className="px-4 py-3 text-center text-[var(--text-muted)]">{row.goalsAgainst}</td>
                                <td className={`px-4 py-3 text-center font-bold ${
                                  row.goalDifference > 0 ? 'text-[var(--accent-green)]' : row.goalDifference < 0 ? 'text-[var(--accent-red)]' : ''
                                }`}>
                                  {row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}
                                </td>
                                <td className="px-4 py-3 text-center font-black text-[var(--text-primary)]">{row.points}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 3. LIVE SCORES VIEW */}
            {activeTab === 'live' && (
              <div>
                {liveMatches.length === 0 ? (
                  <div className="text-center py-16 text-[var(--text-muted)]">
                    <Activity className="h-10 w-10 mx-auto opacity-50 mb-3 animate-pulse" />
                    <p className="font-semibold text-sm">No live World Cup matches right now</p>
                    <p className="text-xs mt-1">Live simulation will begin automatically as matches start in the background</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    {liveMatches.map((match) => (
                      <Link
                        key={match.id}
                        to={`/match/${match.id}`}
                        className="block bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[var(--accent-green)] hover:shadow-md rounded-2xl p-5 transition-all duration-200 group"
                      >
                        {/* Main Score Row */}
                        <div className="flex items-center justify-center gap-3 sm:gap-6">
                          {/* Home Team */}
                          <div className="flex items-center justify-end space-x-3 w-5/12 text-right">
                            <TeamHoverCard teamId={match.homeTeam.id}>
                              <div className="flex items-center space-x-3">
                                <span className="font-bold text-sm sm:text-base text-[var(--text-primary)] truncate">
                                  {match.homeTeam.name}
                                </span>
                                <TeamBadge shortName={match.homeTeam.shortName} logo={match.homeTeam.logo} size="sm" />
                              </div>
                            </TeamHoverCard>
                          </div>

                          {/* Center Score & Status */}
                          <div className="flex items-center justify-center w-2/12 flex-shrink-0">
                            <div className="flex items-center gap-1.5 sm:gap-2.5">
                              <span className="text-lg sm:text-xl font-black text-[var(--text-primary)] select-none">
                                {match.homeScoreExtraTime ?? match.homeScore}
                              </span>
                              <span className="px-2 py-0.5 bg-red-950/40 text-[var(--accent-red)] border border-red-500/20 font-bold rounded text-[9px] sm:text-[10px] uppercase select-none animate-pulse">
                                {match.status === 'LivePenalties'
                                  ? 'Pens'
                                  : match.status === 'LiveExtraTime' ? `AET ${match.minute}'` : `${match.minute}'`
                                }
                              </span>
                              <span className="text-lg sm:text-xl font-black text-[var(--text-primary)] select-none">
                                {match.awayScoreExtraTime ?? match.awayScore}
                              </span>
                            </div>
                          </div>

                          {/* Away Team */}
                          <div className="flex items-center justify-start space-x-3 w-5/12 text-left">
                            <TeamHoverCard teamId={match.awayTeam.id}>
                              <div className="flex items-center space-x-3">
                                <TeamBadge shortName={match.awayTeam.shortName} logo={match.awayTeam.logo} size="sm" />
                                <span className="font-bold text-sm sm:text-base text-[var(--text-primary)] truncate">
                                  {match.awayTeam.name}
                                </span>
                              </div>
                            </TeamHoverCard>
                          </div>
                        </div>

                        {/* Metadata row (Stage • Venue) */}
                        <div className="flex items-center justify-center mt-3.5 gap-2 text-[10px] sm:text-xs text-[var(--text-muted)] font-medium">
                          <span className="uppercase tracking-wider font-semibold">
                            {match.stage}
                          </span>
                          <span>&bull;</span>
                          <span className="truncate max-w-[150px] sm:max-w-xs">
                            {match.venue || 'Stadium'}
                          </span>
                          {match.homeScorePenalties !== null && match.awayScorePenalties !== null && (
                            <>
                              <span>&bull;</span>
                              <span className="text-[var(--accent-amber)] font-bold">
                                ({match.homeScorePenalties} - {match.awayScorePenalties} pens)
                              </span>
                            </>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 4. FIXTURES & RESULTS VIEW */}
            {activeTab === 'fixtures' && (
              <div className="space-y-8">
                {fixturesAndResults.length === 0 ? (
                  <div className="text-center py-16 text-[var(--text-muted)]">
                    <Calendar className="h-10 w-10 mx-auto opacity-50 mb-3" />
                    <p className="font-semibold text-sm">No fixtures scheduled</p>
                  </div>
                ) : (
                  Object.entries(groupMatchesByDate(fixturesAndResults)).map(([dateHeader, dateMatches]) => (
                    <div key={dateHeader} className="space-y-3">
                      <div className="flex justify-between items-center px-1">
                        <h3 className="text-sm sm:text-base font-extrabold text-[var(--text-primary)]">
                          {dateHeader}
                        </h3>
                        <button
                          onClick={() => setActiveTab('standings')}
                          className="text-xs text-[var(--accent-green)] hover:underline font-bold transition-all cursor-pointer"
                        >
                          View groups
                        </button>
                      </div>

                      <div className="grid grid-cols-1 gap-3">
                        {dateMatches.map((match) => (
                          <Link
                            key={match.id}
                            to={`/match/${match.id}`}
                            className="block bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[var(--accent-green)] hover:shadow-md rounded-2xl p-5 transition-all duration-200 group"
                          >
                            {/* Main Score Row */}
                            <div className="flex items-center justify-center gap-3 sm:gap-6">
                              {/* Home Team */}
                              <div className="flex items-center justify-end space-x-3 w-5/12 text-right">
                                <TeamHoverCard teamId={match.homeTeam.id}>
                                  <div className="flex items-center space-x-3">
                                    <span className="font-bold text-sm sm:text-base text-[var(--text-primary)] truncate">
                                      {match.homeTeam.name}
                                    </span>
                                    <TeamBadge shortName={match.homeTeam.shortName} logo={match.homeTeam.logo} size="sm" />
                                  </div>
                                </TeamHoverCard>
                              </div>

                              {/* Center Score & Status */}
                              <div className="flex items-center justify-center w-2/12 flex-shrink-0">
                                {match.status !== 'Upcoming' ? (
                                  <div className="flex items-center gap-1.5 sm:gap-2.5">
                                    <span className="text-lg sm:text-xl font-black text-[var(--text-primary)] select-none">
                                      {match.homeScoreExtraTime ?? match.homeScore}
                                    </span>
                                    <span className={`px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-bold uppercase select-none ${
                                      match.status.startsWith('Live')
                                        ? 'bg-red-950/40 text-[var(--accent-red)] border border-red-500/20 animate-pulse'
                                        : 'bg-slate-800 text-[var(--text-secondary)] border border-[var(--border-color)]'
                                    }`}>
                                      {match.status === 'Finished'
                                        ? (match.homeScorePenalties !== null ? 'Pens' : match.homeScoreExtraTime !== null ? 'AET' : 'FT')
                                        : match.status.startsWith('Live') ? `${match.minute}'` : match.status
                                      }
                                    </span>
                                    <span className="text-lg sm:text-xl font-black text-[var(--text-primary)] select-none">
                                      {match.awayScoreExtraTime ?? match.awayScore}
                                    </span>
                                  </div>
                                ) : (
                                  <div className="flex flex-col items-center">
                                    <span className="text-xs font-semibold px-2.5 py-1 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--text-muted)] uppercase tracking-wide select-none">
                                      {new Date(match.matchDateTime).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                      })}
                                    </span>
                                  </div>
                                )}
                              </div>

                              {/* Away Team */}
                              <div className="flex items-center justify-start space-x-3 w-5/12 text-left">
                                <TeamHoverCard teamId={match.awayTeam.id}>
                                  <div className="flex items-center space-x-3">
                                    <TeamBadge shortName={match.awayTeam.shortName} logo={match.awayTeam.logo} size="sm" />
                                    <span className="font-bold text-sm sm:text-base text-[var(--text-primary)] truncate">
                                      {match.awayTeam.name}
                                    </span>
                                  </div>
                                </TeamHoverCard>
                              </div>
                            </div>

                            {/* Metadata row (Stage • Venue) */}
                            <div className="flex items-center justify-center mt-3.5 gap-2 text-[10px] sm:text-xs text-[var(--text-muted)] font-medium">
                              <span className="uppercase tracking-wider font-semibold">
                                {match.stage}
                              </span>
                              <span>&bull;</span>
                              <span className="truncate max-w-[150px] sm:max-w-xs">
                                {match.venue || 'Stadium'}
                              </span>
                              {match.homeScorePenalties !== null && match.awayScorePenalties !== null && (
                                <>
                                  <span>&bull;</span>
                                  <span className="text-[var(--accent-amber)] font-bold">
                                    ({match.homeScorePenalties} - {match.awayScorePenalties} pens)
                                  </span>
                                </>
                              )}
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
