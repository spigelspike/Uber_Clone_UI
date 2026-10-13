import React from 'react';
import { sound } from '../utils/audio.js';

export default function MobileNav({ activeView, setActiveView }) {
  const handleNav = (view) => {
    setActiveView(view);
    sound.playChime('tap');
  };

  return (
    <nav className="mobile-nav">
      <button
        className={activeView === 'ride' ? 'active' : ''}
        onClick={() => handleNav('ride')}
      >
        <img src="/src/assets/icons/map.png" alt="Ride" className="icon-sm" />
        <span>Ride</span>
      </button>

      <button
        className={activeView === 'package' ? 'active' : ''}
        onClick={() => handleNav('package')}
      >
        <img src="/src/assets/icons/point.png" alt="Package" className="icon-sm" />
        <span>Package</span>
      </button>

      <button
        className={activeView === 'activity' ? 'active' : ''}
        onClick={() => handleNav('activity')}
      >
        <img src="/src/assets/icons/list.png" alt="Activity" className="icon-sm" />
        <span>Activity</span>
      </button>

      <button
        className={activeView === 'account' ? 'active' : ''}
        onClick={() => handleNav('account')}
      >
        <img src="/src/assets/icons/profile.png" alt="Account" className="icon-sm" />
        <span>Account</span>
      </button>
    </nav>
  );
}
