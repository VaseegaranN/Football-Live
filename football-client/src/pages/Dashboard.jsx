import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { Calendar, RefreshCw, AlertCircle, Play } from 'lucide-react';
import { matchesApi } from '../api/client';
import { TeamBadge, LeagueBadge } from '../components/TeamBadge';
import TeamHoverCard from '../components/TeamHoverCard';

// Helper to format dates
const getFormattedDate = (date) => {
  return date.toISOString().split('T')[0];
};

export default function Dashboard() {
  const [selectedDate, setSelectedDate] = useState(() => getFormattedDate(new Date()));
  const [matches, setMatches] = useState([]);
  const [liveMatches, setLiveMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('All');
  const [isPolling, setIsPolling] = useState(false);
  const [connection, setConnection] = useState(null);

  // Setup SignalR Real-Time Connection
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

  // Register SignalR Listeners
  useEffect(() => {
    if (!connection) return;

    const handleMatchUpdate = (updatedMatch) => {
      // Update Matches state
      setMatches((prevMatches) => {
        const exists = prevMatches.some((m) => m.id === updatedMatch.id);
        if (exists) {
          return prevMatches.map((m) => (m.id === updatedMatch.id ? updatedMatch : m));
        }
        return prevMatches;
      });

      // Update Live Matches state
      setLiveMatches((prevLive) => {
        const exists = prevLive.some((m) => m.id === updatedMatch.id);
        const isLiveStatus = updatedMatch.status === 'Live' || 
                             updatedMatch.status === 'LiveExtraTime' || 
                             updatedMatch.status === 'LivePenalties';
        if (isLiveStatus) {
          if (exists) {
            return prevLive.map((m) => (m.id === updatedMatch.id ? updatedMatch : m));
          } else {
            return [...prevLive, updatedMatch];
          }
        } else {
          return prevLive.filter((m) => m.id !== updatedMatch.id);
        }
      });
    };

    connection.on('ReceiveMatchUpdate', handleMatchUpdate);

    if (connection.state === 'Disconnected') {
      connection.start()
        .then(() => {
          console.log('Connected to SignalR MatchHub on Dashboard!');
        })
        .catch((err) => console.error('SignalR Connection Error: ', err));
    }

    return () => {
      connection.off('ReceiveMatchUpdate', handleMatchUpdate);
    };
  }, [connection]);

  // Generate a list of 11 dates: -3 days to +7 days for the schedule header
  const getSliderDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = -3; i <= 7; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);
      dates.push({
        dateStr: getFormattedDate(d),
        dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNum: d.getDate(),
        month: d.toLocaleDateString('en-US', { month: 'short' }),
        isToday: i === 0,
      });
    }
    return dates;
  };

  const sliderDates = getSliderDates();

  const fetchMatches = async (date, showSilence = false) => {
    if (!showSilence) setLoading(true);
    try {
      const [matchesRes, liveRes] = await Promise.all([
        matchesApi.getAll({ date }),
        matchesApi.getLive(),
      ]);
      setMatches(matchesRes.data);
      setLiveMatches(liveRes.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching matches:', err);
      setError('Failed to load matches. Please check database connection.');
    } finally {
      if (!showSilence) setLoading(false);
    }
  };

  // Poll live matches if there are live matches or if selected date is today
  useEffect(() => {
    fetchMatches(selectedDate);

    const interval = setInterval(() => {
      setIsPolling(true);
      fetchMatches(selectedDate, true).then(() => setIsPolling(false));
    }, 15000); // 15 seconds polling

    return () => clearInterval(interval);
  }, [selectedDate]);

  // Group matches by League for selected date matches
  const filteredMatches = matches.filter((m) => {
    if (filter === 'All') return true;
    return m.status === filter;
  });

  const matchesByLeague = {};
  filteredMatches.forEach((m) => {
    if (!matchesByLeague[m.league.name]) {
      matchesByLeague[m.league.name] = {
        leagueId: m.league.id,
        name: m.league.name,
        matches: [],
      };
    }
    matchesByLeague[m.league.name].matches.push(m);
  });

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* ─── LIVE BANNER SECTION ─────────────────────────────────────────────────── */}
      {liveMatches.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center space-x-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent-red)] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[var(--accent-red)]"></span>
            </span>
            <h2 className="text-xl font-bold tracking-tight">Live Matches Now</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {liveMatches.map((match) => (
              <Link
                key={match.id}
                to={`/match/${match.id}`}
                className="block bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[var(--accent-green)] rounded-2xl p-5 shadow-lg backdrop-blur-md transition-all duration-300 hover:shadow-emerald-950/20 group relative overflow-hidden"
              >
                {/* Glass sheen effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                
                <div className="flex justify-between items-center mb-4">
                  <LeagueBadge leagueId={match.league.id} name={match.league.name} />
                  <span className="text-xs font-semibold px-2 py-0.5 bg-red-950/50 text-[var(--accent-red)] border border-red-500/20 rounded-full flex items-center gap-1.5 animate-pulse">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-red)]"></span>
                    {match.minute}'
                  </span>
                </div>

                <div className="flex items-center justify-between py-2">
                  <div className="flex flex-col items-center space-y-2 w-5/12 text-center">
                    <TeamHoverCard teamId={match.homeTeam.id}>
                      <div className="flex flex-col items-center">
                        <TeamBadge shortName={match.homeTeam.shortName} logo={match.homeTeam.logo} size="md" />
                        <span className="font-bold text-sm truncate max-w-full text-[var(--text-primary)] mt-2">{match.homeTeam.name}</span>
                      </div>
                    </TeamHoverCard>
                  </div>

                  <div className="flex flex-col items-center w-2/12">
                    <span className="text-2xl font-black tracking-widest text-[var(--text-primary)]">
                      {match.homeScore} - {match.awayScore}
                    </span>
                    <span className="text-[10px] text-[var(--text-muted)] font-medium mt-1">VS</span>
                  </div>

                  <div className="flex flex-col items-center space-y-2 w-5/12 text-center">
                    <TeamHoverCard teamId={match.awayTeam.id}>
                      <div className="flex flex-col items-center">
                        <TeamBadge shortName={match.awayTeam.shortName} logo={match.awayTeam.logo} size="md" />
                        <span className="font-bold text-sm truncate max-w-full text-[var(--text-primary)] mt-2">{match.awayTeam.name}</span>
                      </div>
                    </TeamHoverCard>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ─── SCHEDULE SELECTOR & SLIDER ─────────────────────────────────────────── */}
      <section className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl shadow-xl overflow-hidden">
        
        {/* Date Selector Slider */}
        <div className="border-b border-[var(--border-color)] p-4 flex items-center justify-between gap-4">
          
          {/* Scrollable Slider */}
          <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar scroll-smooth flex-1 pb-1 min-w-0">
            {sliderDates.map((item) => (
              <button
                key={item.dateStr}
                onClick={() => setSelectedDate(item.dateStr)}
                className={`flex flex-col items-center px-4 py-2 rounded-xl text-center cursor-pointer min-w-[70px] transition-all ${
                  selectedDate === item.dateStr
                    ? 'bg-[var(--accent-green)] text-slate-950 font-bold scale-105 shadow-md shadow-emerald-500/20'
                    : 'hover:bg-[var(--bg-card-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <span className="text-[10px] uppercase font-semibold tracking-wider opacity-85">
                  {item.isToday ? 'Today' : item.month}
                </span>
                <span className="text-lg font-bold leading-none mt-1">{item.dayNum}</span>
                <span className="text-[9px] mt-0.5 opacity-70">{item.dayName}</span>
              </button>
            ))}
          </div>

          {/* Calendar Picker Button */}
          <div className="relative flex items-center pl-2 border-l border-[var(--border-color)]">
            <input
              type="date"
              id="calendar-input"
              value={selectedDate}
              onChange={(e) => e.target.value && setSelectedDate(e.target.value)}
              className="absolute inset-0 opacity-0 cursor-pointer w-full"
            />
            <button className="p-3 bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[var(--accent-green)] rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all">
              <Calendar className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Filter Controls & Polling Indicator */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-[var(--bg-card)] gap-4 border-b border-[var(--border-color)]">
          <div className="flex flex-wrap gap-2">
            {['All', 'Live', 'Upcoming', 'Finished'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  filter === tab
                    ? 'bg-[var(--accent-green)]/15 text-[var(--accent-green)] border-[var(--accent-green)]/35'
                    : 'bg-transparent text-[var(--text-secondary)] border-transparent hover:border-[var(--border-color)] hover:bg-[var(--bg-card-hover)]'
                }`}
              >
                {tab === 'Live' && liveMatches.length > 0 ? `Live (${liveMatches.length})` : tab}
              </button>
            ))}
          </div>

          {/* Manual Refresh / Polling feedback */}
          <div className="flex items-center space-x-2 text-xs text-[var(--text-muted)] w-full sm:w-auto justify-end">
            {isPolling && (
              <span className="h-2 w-2 rounded-full bg-[var(--accent-green)] animate-ping"></span>
            )}
            <span>Live updates active</span>
            <button
              onClick={() => fetchMatches(selectedDate)}
              className="p-1.5 hover:bg-[var(--bg-card-hover)] rounded-lg transition-colors ml-1"
              title="Refresh matches"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* ─── MATCH LISTINGS ────────────────────────────────────────────────────── */}
        <div className="p-6">
          {loading ? (
            // Shimmer skeletons
            <div className="space-y-6">
              {[1, 2].map((i) => (
                <div key={i} className="space-y-3">
                  <div className="h-5 w-32 skeleton"></div>
                  <div className="h-20 w-full skeleton"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-[var(--text-secondary)] gap-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl">
              <AlertCircle className="h-10 w-10 text-[var(--accent-red)]" />
              <p className="font-semibold text-sm">{error}</p>
              <button
                onClick={() => fetchMatches(selectedDate)}
                className="mt-2 px-4 py-2 bg-[var(--accent-green)] text-slate-950 font-bold text-xs rounded-lg transition-transform hover:scale-105"
              >
                Retry Connection
              </button>
            </div>
          ) : Object.keys(matchesByLeague).length === 0 ? (
            <div className="text-center py-16 text-[var(--text-muted)] bg-[var(--bg-secondary)] border border-[var(--border-color)] border-dashed rounded-xl">
              <Play className="h-8 w-8 mx-auto stroke-[1.5] rotate-90 text-[var(--text-muted)] opacity-60 mb-3" />
              <p className="font-medium text-sm">No matches scheduled for this date</p>
              <p className="text-xs mt-1">Try selecting a different date from the calendar</p>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(matchesByLeague).map(([leagueName, group]) => (
                <div key={leagueName} className="space-y-3">
                  <div className="flex items-center space-x-2 pl-1">
                    <LeagueBadge leagueId={group.leagueId} name={leagueName} />
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {group.matches.map((match) => (
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
                            {match.stage || 'Regular Season'}
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
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
