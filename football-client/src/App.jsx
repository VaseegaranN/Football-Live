import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import MatchDetail from './pages/MatchDetail';
import PlayerProfile from './pages/PlayerProfile';
import WorldCupDashboard from './pages/WorldCupDashboard';

function App() {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <Router>
      <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300 flex flex-col items-center w-full">
        <Navbar theme={theme} toggleTheme={toggleTheme} />
        
        {/* FIFA Live News Ticker */}
        <div className="w-full bg-[var(--bg-secondary)] border-b border-[var(--border-color)] py-2.5 overflow-hidden select-none">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-3">
            <span className="bg-[var(--accent-red)] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-wider flex-shrink-0 animate-pulse">
              FIFA News
            </span>
            <div className="relative flex-1 overflow-hidden w-full h-5 flex items-center">
              <div className="animate-marquee flex gap-12 whitespace-nowrap text-xs font-semibold text-[var(--text-secondary)]">
                <span>⚽ FIFA World Cup 2026: Official schedule announced! Tournament kicks off at Estadio Azteca, Final at MetLife Stadium.</span>
                <span>🔥 Group Stage results: France defeats Norway 4-1 with a Mbappé masterclass! Senegal crushes Iraq 5-0!</span>
                <span>⭐ Belgium dominates New Zealand 5-1; Egypt and Iran share the points in a tight 1-1 draw.</span>
                <span>📅 Tomorrow's Fixtures: England vs Panama and Croatia vs Ghana in Group L. Portugal meets Colombia in Group K!</span>
                <span>⚡ Real-Time scores active. SignalR synchronization streaming match details live.</span>
                
                {/* Duplicate the items for seamless loop */}
                <span>⚽ FIFA World Cup 2026: Official schedule announced! Tournament kicks off at Estadio Azteca, Final at MetLife Stadium.</span>
                <span>🔥 Group Stage results: France defeats Norway 4-1 with a Mbappé masterclass! Senegal crushes Iraq 5-0!</span>
                <span>⭐ Belgium dominates New Zealand 5-1; Egypt and Iran share the points in a tight 1-1 draw.</span>
                <span>📅 Tomorrow's Fixtures: England vs Panama and Croatia vs Ghana in Group L. Portugal meets Colombia in Group K!</span>
                <span>⚡ Real-Time scores active. SignalR synchronization streaming match details live.</span>
              </div>
            </div>
          </div>
        </div>

        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/match/:id" element={<MatchDetail />} />
            <Route path="/player/:id" element={<PlayerProfile />} />
            <Route path="/worldcup" element={<WorldCupDashboard />} />
          </Routes>
        </main>
        <footer className="w-full border-t border-[var(--border-color)] bg-[var(--bg-secondary)] py-6 text-center text-sm text-[var(--text-muted)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p>&copy; {new Date().getFullYear()} Football Live Scores. All rights reserved.</p>
            <p className="mt-1 text-xs">Powered by .NET 10 & React.js</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
