import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { playersApi } from '../api/client';

export default function PlayerHoverCard({ playerId, children }) {
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState(null);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);
  const navigate = useNavigate();

  const calculatePosition = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const popoverWidth = 256; // w-64 is 256px
    const popoverHeight = 110; // estimated height of the player card

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

    if (!player && !loading && playerId) {
      setLoading(true);
      playersApi.getById(playerId)
        .then((res) => {
          setPlayer(res.data);
        })
        .catch((err) => {
          console.error('Failed to load player details', err);
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

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (playerId) {
      navigate(`/player/${playerId}`);
    }
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

  const popoverContent = visible && playerId && (
    <div 
      className="fixed z-[9999] w-64 bg-slate-900/98 backdrop-blur-md border border-slate-700/80 rounded-2xl shadow-2xl p-4 text-left transition-all duration-200 animate-fade-in"
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
      onClick={handleClick}
    >
      {loading ? (
        <div className="flex items-center space-x-3 py-1">
          <div className="w-12 h-12 rounded-full skeleton" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-2/3 skeleton" />
            <div className="h-3 w-1/2 skeleton" />
          </div>
        </div>
      ) : player ? (
        <div className="space-y-3 select-none cursor-pointer">
          <div className="flex items-center space-x-3">
            <img 
              src={player.photo || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(player.name)}`} 
              alt={player.name} 
              className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700/65 object-cover flex-shrink-0"
            />
            <div>
              <h4 className="font-extrabold text-sm text-slate-100 leading-snug">{player.name}</h4>
              <p className="text-xs text-emerald-400 font-semibold mt-0.5">
                {player.position} {player.number ? `#${player.number}` : ''}
              </p>
            </div>
          </div>
          
          <div className="flex justify-between items-center text-[10px] text-slate-400 pt-2.5 border-t border-slate-800/80">
            <span>{player.nationality || 'International'}</span>
            <span className="text-[var(--accent-green)] font-bold uppercase tracking-wider hover:underline flex items-center">
              Stats Page →
            </span>
          </div>
        </div>
      ) : (
        <div className="text-xs text-slate-400 text-center py-1">Player details unavailable</div>
      )}
    </div>
  );

  return (
    <>
      <span 
        ref={triggerRef}
        className="inline-block cursor-pointer"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        <span className="hover:text-[var(--accent-green)] transition-colors underline decoration-dotted underline-offset-4 decoration-slate-500/50 hover:decoration-[var(--accent-green)]">
          {children}
        </span>
      </span>
      {visible && ReactDOM.createPortal(popoverContent, document.body)}
    </>
  );
}
