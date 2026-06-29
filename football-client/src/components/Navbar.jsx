import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trophy, Sun, Moon, Search, Menu, X } from 'lucide-react';
import { playersApi } from '../api/client';
import PlayerHoverCard from './PlayerHoverCard';

export default function Navbar({ theme, toggleTheme }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search API call with debounce
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await playersApi.search(searchQuery);
        setSearchResults(response.data);
        setShowDropdown(true);
      } catch (error) {
        console.error('Error searching players:', error);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const handleSelectPlayer = (id) => {
    setSearchQuery('');
    setShowDropdown(false);
    navigate(`/player/${id}`);
  };

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-[var(--glass-bg)] border-b border-[var(--glass-border)] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex md:grid md:grid-cols-3 items-center justify-between h-16">
          
          {/* Column 1: Logo */}
          <div className="flex items-center justify-start">
            <Link to="/" className="flex items-center space-x-2 text-xl font-bold tracking-wider text-[var(--accent-green)]">
              <Trophy className="h-6 w-6 stroke-[2]" />
              <span className="text-[var(--text-primary)]">Score<span className="text-[var(--accent-green)]">Pulse</span></span>
            </Link>
          </div>

          {/* Column 2: Desktop Search (Centered) */}
          <div className="hidden md:flex items-center justify-center relative w-full" ref={dropdownRef}>
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Search players (e.g., Saka, Palmer)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.trim().length >= 2 && setShowDropdown(true)}
                className="w-full bg-[var(--bg-secondary)] text-[var(--text-primary)] pl-10 pr-4 py-1.5 rounded-full border border-[var(--border-color)] focus:outline-none focus:border-[var(--accent-green)] transition-all text-sm"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
              {isSearching && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 border-2 border-[var(--accent-green)] border-t-transparent rounded-full animate-spin"></div>
              )}
              
              {/* Autocomplete Dropdown */}
              {showDropdown && searchResults.length > 0 && (
                <div className="absolute top-12 left-0 right-0 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl shadow-2xl overflow-hidden z-50 max-h-60 overflow-y-auto">
                  {searchResults.map((player) => (
                    <button
                      key={player.id}
                      onClick={() => handleSelectPlayer(player.id)}
                      className="w-full text-left px-4 py-3 hover:bg-[var(--bg-card-hover)] flex justify-between items-center border-b border-[var(--border-color)] last:border-0 transition-colors"
                    >
                      <div>
                        <div className="font-semibold text-sm text-[var(--text-primary)]">
                          <PlayerHoverCard playerId={player.id}>
                            {player.name}
                          </PlayerHoverCard>
                        </div>
                        <div className="text-xs text-[var(--text-muted)]">{player.position}</div>
                      </div>
                      <div className="text-xs font-semibold px-2 py-0.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-full text-[var(--text-secondary)]">
                        #{player.number || 'N/A'}
                      </div>
                    </button>
                  ))}
                </div>
              )}
              {showDropdown && searchResults.length === 0 && searchQuery.trim().length >= 2 && !isSearching && (
                <div className="absolute top-12 left-0 right-0 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl shadow-2xl p-4 text-center text-sm text-[var(--text-muted)] z-50">
                  No players found
                </div>
              )}
            </div>
          </div>

          {/* Column 3: Desktop Right Buttons (Right-aligned) */}
          <div className="hidden md:flex items-center justify-end space-x-4">
            <Link to="/" className="text-sm font-medium hover:text-[var(--accent-green)] transition-colors">
              Dashboard
            </Link>
            <Link to="/worldcup" className="text-sm font-semibold px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-full hover:bg-amber-500/20 transition-all flex items-center gap-1">
              🏆 World Cup
            </Link>
            
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-[var(--bg-card-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>

          {/* Mobile Menu & Theme Toggle (Visible only on mobile) */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-[var(--bg-card-hover)] text-[var(--text-secondary)] transition-colors"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-full hover:bg-[var(--bg-card-hover)] text-[var(--text-secondary)] transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden border-t border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 pt-4 pb-6 space-y-4">
          {/* Mobile Search */}
          <div className="relative" ref={dropdownRef}>
            <input
              type="text"
              placeholder="Search players..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery.trim().length >= 2 && setShowDropdown(true)}
              className="w-full bg-[var(--bg-primary)] text-[var(--text-primary)] pl-10 pr-4 py-2 rounded-full border border-[var(--border-color)] focus:outline-none focus:border-[var(--accent-green)] text-sm"
            />
            <Search className="absolute left-3 top-3 h-4 w-4 text-[var(--text-muted)]" />
            
            {showDropdown && searchResults.length > 0 && (
              <div className="absolute top-12 left-0 right-0 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl shadow-2xl overflow-hidden z-50 max-h-60 overflow-y-auto">
                {searchResults.map((player) => (
                  <button
                    key={player.id}
                    onClick={() => {
                      handleSelectPlayer(player.id);
                      setIsOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-[var(--bg-card-hover)] flex justify-between items-center border-b border-[var(--border-color)] last:border-0"
                  >
                    <div>
                      <div className="font-semibold text-sm">
                        <PlayerHoverCard playerId={player.id}>
                          {player.name}
                        </PlayerHoverCard>
                      </div>
                      <div className="text-xs text-[var(--text-muted)]">{player.position}</div>
                    </div>
                    <div className="text-xs font-semibold px-2 py-0.5 bg-[var(--bg-secondary)] rounded-full text-[var(--text-secondary)]">
                      #{player.number || 'N/A'}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col space-y-2">
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-[var(--bg-card-hover)] transition-colors"
            >
              Dashboard
            </Link>
            <Link
              to="/worldcup"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-semibold text-amber-500 hover:bg-amber-500/10 transition-colors"
            >
              🏆 World Cup
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
