import React from 'react';

export default function Navbar({
  activeView,
  setActiveView,
  user,
  isLoggedIn,
  onOpenLogin,
  onLogout,
  onReplayTour,
  theme = 'light',
  onToggleTheme,
  soundEnabled = true,
  onToggleSound
}) {
  return (
    <header className="topbar">
      <button className="brand" onClick={() => setActiveView('ride')} aria-label="Uber home">
        Uber
      </button>

      <nav className="topnav">
        <button
          className={activeView === 'ride' ? 'nav-active' : ''}
          onClick={() => setActiveView('ride')}
        >
          Ride
        </button>
        <button
          className={activeView === 'package' ? 'nav-active' : ''}
          onClick={() => setActiveView('package')}
        >
          Package
        </button>
        <button
          className={activeView === 'activity' ? 'nav-active' : ''}
          onClick={() => setActiveView('activity')}
        >
          Activity
        </button>
        <button
          className={activeView === 'account' ? 'nav-active' : ''}
          onClick={() => setActiveView('account')}
        >
          Account
        </button>
      </nav>

      <div className="top-actions">
        {/* AUDIO CHIME TOGGLE */}
        <button
          className={`icon-circle-btn ${soundEnabled ? 'active' : ''}`}
          onClick={onToggleSound}
          title={soundEnabled ? 'Mute audio chimes' : 'Enable audio chimes'}
          aria-label="Toggle audio"
        >
          {soundEnabled ? (
            <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
            </svg>
          ) : (
            <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
            </svg>
          )}
        </button>

        {/* UBER MIDNIGHT DARK MODE TOGGLE */}
        <button
          className="icon-circle-btn theme-toggle"
          onClick={onToggleTheme}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Midnight Dark Mode'}
          aria-label="Toggle dark mode"
        >
          {theme === 'dark' ? (
            <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06c.39-.39.39-1.03 0-1.41s-1.02-.39-1.41 0z"/>
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.3 2a10 10 0 0 0-.19 20 10.04 10.04 0 0 0 9.9-7.66 1 1 0 0 0-1.22-1.22 8 8 0 1 1-8.5-11.31 1 1 0 0 0 .01-1.81z"/>
            </svg>
          )}
        </button>

        {/* TOUR BUTTON */}
        <button className="tour-badge-btn" onClick={onReplayTour} aria-label="View onboarding tour">
          <span>Tour</span>
        </button>

        {isLoggedIn ? (
          <>
            <button className="user-chip" onClick={() => setActiveView('account')}>
              <span className="user-chip-avatar">{user.initials}</span>
              <span className="user-chip-name">{user.name.split(' ')[0]}</span>
            </button>
            <button className="btn-ghost" onClick={onLogout}>
              <img src="/src/assets/icons/out.png" alt="Log out" className="icon-xs" />
              <span>Log out</span>
            </button>
          </>
        ) : (
          <>
            <button className="login" onClick={onOpenLogin}>
              Log in
            </button>
            <button className="signup" onClick={onOpenLogin}>
              Sign up
            </button>
          </>
        )}
      </div>
    </header>
  );
}
