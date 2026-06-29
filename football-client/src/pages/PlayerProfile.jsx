import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, User, Award, Zap, AlertCircle } from 'lucide-react';
import { playersApi } from '../api/client';
import { TeamBadge } from '../components/TeamBadge';

// Helper to calculate age from DateOfBirth
const calculateAge = (dobString) => {
  if (!dobString) return 'N/A';
  const dob = new Date(dobString);
  const diffMs = Date.now() - dob.getTime();
  const ageDate = new Date(diffMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

// Helper to get position color for avatar background
const getPositionColor = (position) => {
  const pos = position.toLowerCase();
  if (pos.includes('goalkeeper')) return 'from-emerald-600 to-teal-800 text-emerald-100';
  if (pos.includes('defender')) return 'from-blue-600 to-indigo-800 text-blue-100';
  if (pos.includes('midfielder')) return 'from-purple-600 to-pink-800 text-purple-100';
  return 'from-rose-600 to-red-800 text-rose-100'; // Forwards/Strikers
};

export default function PlayerProfile() {
  const { id } = useParams();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    playersApi.getById(parseInt(id, 10))
      .then((res) => {
        setPlayer(res.data);
        setError(null);
      })
      .catch((err) => {
        console.error('Error fetching player profile:', err);
        setError('Failed to retrieve player profile. Make sure the API server is online.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-56 w-full skeleton"></div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-24 skeleton"></div>
          ))}
        </div>
        <div className="h-64 w-full skeleton"></div>
      </div>
    );
  }

  if (error || !player) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center text-[var(--text-secondary)] gap-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl max-w-2xl mx-auto">
        <AlertCircle className="h-12 w-12 text-[var(--accent-red)]" />
        <h3 className="text-lg font-bold">Error Loading Player</h3>
        <p className="text-sm px-6">{error || 'Player not found.'}</p>
        <Link
          to="/"
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent-green)] text-slate-950 font-bold text-sm rounded-lg hover:scale-105 transition-transform"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>
      </div>
    );
  }

  // Get active/most recent season stat
  const activeStat = player.seasonStats[0]; // Seed data provides one season, but we take first

  const ratingColorClass = (rating) => {
    if (rating >= 8.0) return 'text-[var(--accent-green)] border-[var(--accent-green)]';
    if (rating >= 7.2) return 'text-[var(--accent-blue)] border-[var(--accent-blue)]';
    if (rating >= 6.5) return 'text-[var(--accent-amber)] border-[var(--accent-amber)]';
    return 'text-[var(--accent-red)] border-[var(--accent-red)]';
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Back Button */}
      <Link
        to="/"
        className="inline-flex items-center text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--accent-green)] transition-colors gap-1.5"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
      </Link>

      {/* ─── PLAYER HERO BANNER ─────────────────────────────────────────────────── */}
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl shadow-xl overflow-hidden relative">
        {/* Decorative background stripes */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/20 via-transparent to-slate-950/20 pointer-events-none"></div>

        <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 z-10 relative">
          
          {/* Custom Avatar / Jersey Display */}
          <div className={`w-28 h-28 sm:w-36 sm:h-36 rounded-2xl bg-gradient-to-b ${getPositionColor(player.position)} flex flex-col items-center justify-center shadow-lg relative border border-slate-700/30 overflow-hidden flex-shrink-0 select-none`}>
            {player.photo ? (
              <img src={player.photo} alt={player.name} className="w-full h-full object-cover" />
            ) : (
              <>
                <User className="w-14 h-14 opacity-40 mb-1" />
                <span className="text-[10px] uppercase font-bold tracking-widest opacity-80">{player.position}</span>
              </>
            )}
            {player.number && (
              <span className="absolute bottom-2 right-2 text-2xl font-black opacity-80 tracking-tighter">
                #{player.number}
              </span>
            )}
          </div>

          {/* Details Column */}
          <div className="flex-1 flex flex-col justify-between h-full text-center sm:text-left space-y-4">
            <div>
              <div className="flex flex-col sm:flex-row items-center gap-2.5 justify-center sm:justify-start">
                <h1 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] tracking-tight">
                  {player.name}
                </h1>
                {player.number && (
                  <span className="px-2 py-0.5 bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs font-bold text-[var(--text-secondary)] rounded-full hidden sm:inline">
                    No. {player.number}
                  </span>
                )}
              </div>
              <p className="text-[var(--accent-green)] font-bold text-sm tracking-wide mt-1 uppercase">
                {player.position}
              </p>
            </div>

            {/* Meta statistics Grid */}
            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto sm:mx-0">
              <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl p-3 flex flex-col">
                <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider">Nationality</span>
                <span className="font-semibold text-sm mt-0.5 text-[var(--text-primary)]">{player.nationality}</span>
              </div>
              <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl p-3 flex flex-col">
                <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider">Age</span>
                <span className="font-semibold text-sm mt-0.5 text-[var(--text-primary)]">
                  {calculateAge(player.dateOfBirth)}
                  {player.dateOfBirth && (
                    <span className="text-xs text-[var(--text-muted)] font-normal ml-1">
                      ({new Date(player.dateOfBirth).toLocaleDateString([], { year: 'numeric' })})
                    </span>
                  )}
                </span>
              </div>
            </div>

            {/* Team Affiliation Row */}
            <div className="flex items-center justify-center sm:justify-start gap-3 pt-2 border-t border-[var(--border-color)]/60">
              <TeamBadge shortName={player.team.shortName} size="sm" />
              <div>
                <span className="text-xs text-[var(--text-muted)] font-medium block">Current Club</span>
                <span className="text-sm font-bold text-[var(--text-primary)]">{player.team.name}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── SEASON QUICK STATS DASHBOARD ───────────────────────────────────────── */}
      {activeStat && (
        <section className="space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Zap className="h-5 w-5 text-[var(--accent-green)]" />
            Season Summary ({activeStat.season})
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            
            {/* GOALS CARD */}
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-5 flex flex-col items-center justify-center shadow-lg text-center gap-1.5 transition-all hover:-translate-y-1">
              <span className="text-2xl">⚽</span>
              <span className="text-2xl font-black text-[var(--text-primary)]">{activeStat.goals}</span>
              <span className="text-xs text-[var(--text-muted)] font-bold uppercase tracking-wider">Goals</span>
            </div>

            {/* ASSISTS CARD */}
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-5 flex flex-col items-center justify-center shadow-lg text-center gap-1.5 transition-all hover:-translate-y-1">
              <span className="text-2xl">🎯</span>
              <span className="text-2xl font-black text-[var(--text-primary)]">{activeStat.assists}</span>
              <span className="text-xs text-[var(--text-muted)] font-bold uppercase tracking-wider">Assists</span>
            </div>

            {/* MATCHES PLAYED CARD */}
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-5 flex flex-col items-center justify-center shadow-lg text-center gap-1.5 transition-all hover:-translate-y-1">
              <span className="text-2xl">🏟️</span>
              <span className="text-2xl font-black text-[var(--text-primary)]">{activeStat.matchesPlayed}</span>
              <span className="text-xs text-[var(--text-muted)] font-bold uppercase tracking-wider">Appearances</span>
            </div>

            {/* MINUTES CARD */}
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-5 flex flex-col items-center justify-center shadow-lg text-center gap-1.5 transition-all hover:-translate-y-1">
              <span className="text-2xl">⏱️</span>
              <span className="text-2xl font-black text-[var(--text-primary)]">
                {activeStat.minutesPlayed.toLocaleString()}
              </span>
              <span className="text-xs text-[var(--text-muted)] font-bold uppercase tracking-wider">Minutes</span>
            </div>

            {/* RATING CARD */}
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-5 flex flex-col items-center justify-center shadow-lg text-center gap-2 col-span-2 sm:col-span-1 transition-all hover:-translate-y-1">
              <div className={`w-12 h-12 rounded-full border-4 flex items-center justify-center font-extrabold text-sm ${ratingColorClass(activeStat.rating)}`}>
                {activeStat.rating.toFixed(1)}
              </div>
              <span className="text-xs text-[var(--text-muted)] font-bold uppercase tracking-wider">Match Rating</span>
            </div>
          </div>
        </section>
      )}

      {/* ─── CAREER STATS TABLE ─────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Award className="h-5 w-5 text-[var(--accent-green)]" />
          Career Statistics
        </h2>

        <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[var(--bg-primary)] border-b border-[var(--border-color)] text-xs text-[var(--text-muted)] uppercase font-bold">
                  <th className="px-6 py-4">Season</th>
                  <th className="px-6 py-4">Club</th>
                  <th className="px-6 py-4 text-center">Matches</th>
                  <th className="px-6 py-4 text-center">Goals</th>
                  <th className="px-6 py-4 text-center">Assists</th>
                  <th className="px-6 py-4 text-center">Mins Played</th>
                  <th className="px-6 py-4 text-center">🟨</th>
                  <th className="px-6 py-4 text-center">🟥</th>
                  <th className="px-6 py-4 text-right">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)] text-sm text-[var(--text-primary)]">
                {player.seasonStats.map((stat, index) => (
                  <tr key={index} className="hover:bg-[var(--bg-card-hover)] transition-colors">
                    <td className="px-6 py-4 font-bold">{stat.season}</td>
                    <td className="px-6 py-4 font-semibold">{player.team.name}</td>
                    <td className="px-6 py-4 text-center">{stat.matchesPlayed}</td>
                    <td className="px-6 py-4 text-center font-bold">{stat.goals}</td>
                    <td className="px-6 py-4 text-center font-bold">{stat.assists}</td>
                    <td className="px-6 py-4 text-center text-[var(--text-secondary)]">
                      {stat.minutesPlayed.toLocaleString()}'
                    </td>
                    <td className="px-6 py-4 text-center text-[var(--accent-amber)] font-bold">
                      {stat.yellowCards}
                    </td>
                    <td className="px-6 py-4 text-center text-[var(--accent-red)] font-bold">
                      {stat.redCards}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`inline-block px-2.5 py-1 text-xs font-bold rounded-md border ${
                        stat.rating >= 8.0
                          ? 'bg-emerald-950/30 text-[var(--accent-green)] border-emerald-500/20'
                          : stat.rating >= 7.2
                          ? 'bg-blue-950/30 text-[var(--accent-blue)] border-blue-500/20'
                          : 'bg-amber-950/30 text-[var(--accent-amber)] border-amber-500/20'
                      }`}>
                        {stat.rating.toFixed(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
