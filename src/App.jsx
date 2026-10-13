import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import MobileNav from './components/MobileNav.jsx';
import OnboardingSlider from './components/OnboardingSlider.jsx';
import RideStage from './components/RideStage.jsx';
import PackageView from './components/PackageView.jsx';
import ActivityView from './components/ActivityView.jsx';
import AccountView from './components/AccountView.jsx';
import LoginModal from './components/LoginModal.jsx';
import { sound } from './utils/audio.js';

export default function App() {
  const [hasOnboarded, setHasOnboarded] = useState(() => {
    return localStorage.getItem('uber-onboarded') === 'true';
  });

  const [activeView, setActiveView] = useState(() => {
    return !hasOnboarded ? 'onboarding' : 'ride';
  });

  // Uber Midnight Dark Mode
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('uber-theme') || 'light';
  });

  // Sound Chime State
  const [soundEnabled, setSoundEnabled] = useState(() => sound.isEnabled);

  const [bookingState, setBookingState] = useState('where'); // 'where' | 'rides' | 'tracking'
  const [destination, setDestination] = useState('');
  const [pickup, setPickup] = useState('Current location');
  const [selectedCarId, setSelectedCarId] = useState('x');

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!localStorage.getItem('uber-user');
  });

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('uber-user');
    return saved ? JSON.parse(saved) : {
      name: 'Priya Sharma',
      phone: '+91 98201 54821',
      email: 'priya.sharma@example.com',
      rating: '4.92',
      initials: 'PS',
      wallet: 450
    };
  });

  const [order, setOrder] = useState(() => {
    const saved = localStorage.getItem('uber-order-demo');
    return saved ? JSON.parse(saved) : null;
  });

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [notice, setNotice] = useState('');

  // Persist theme to document & localStorage
  useEffect(() => {
    localStorage.setItem('uber-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Persist order
  useEffect(() => {
    if (order) {
      localStorage.setItem('uber-order-demo', JSON.stringify(order));
    } else {
      localStorage.removeItem('uber-order-demo');
    }
  }, [order]);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    sound.playChime('tap');
    showToast(next === 'dark' ? 'Uber Midnight Dark Mode enabled' : 'Light Mode enabled');
  };

  const toggleSound = () => {
    const next = sound.toggleSound();
    setSoundEnabled(next);
    showToast(next ? 'Sound chimes enabled' : 'Sound chimes muted');
  };

  const showToast = (msg) => {
    setNotice(msg);
    setTimeout(() => {
      setNotice(curr => (curr === msg ? '' : curr));
    }, 3200);
  };

  const handleFinishOnboarding = () => {
    localStorage.setItem('uber-onboarded', 'true');
    setHasOnboarded(true);
    setActiveView('ride');
    sound.playChime('confirm');
    if (!isLoggedIn) {
      setShowLoginModal(true);
    }
    showToast('Welcome to Uber!');
  };

  const handleLogin = (newUser) => {
    setUser(newUser);
    setIsLoggedIn(true);
    localStorage.setItem('uber-user', JSON.stringify(newUser));
    sound.playChime('confirm');
    showToast(`Signed in as ${newUser.name}`);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('uber-user');
    sound.playChime('tap');
    showToast('Logged out. You can sign in anytime.');
  };

  const handleAddFunds = () => {
    const updated = { ...user, wallet: (user.wallet || 450) + 200 };
    setUser(updated);
    localStorage.setItem('uber-user', JSON.stringify(updated));
    sound.playChime('confirm');
    showToast('₹200 added to your Uber Cash balance!');
  };

  const handleRebook = (trip) => {
    setDestination(trip.to);
    setPickup(trip.from);
    setSelectedCarId(trip.carId);
    setBookingState('rides');
    setActiveView('ride');
    sound.playChime('confirm');
    showToast(`Rebooking ${trip.carName} to ${trip.to}`);
  };

  const handleBookSavedPlace = (placeName) => {
    setDestination(placeName);
    setBookingState('rides');
    setActiveView('ride');
    sound.playChime('confirm');
    showToast(`Route set to ${placeName}`);
  };

  const handleReplayTour = () => {
    sound.playChime('tap');
    setActiveView('onboarding');
  };

  const handleTrackOrder = () => {
    sound.playChime('tap');
    setActiveView('ride');
    setBookingState('tracking');
  };

  if (activeView === 'onboarding') {
    return <OnboardingSlider onFinish={handleFinishOnboarding} />;
  }

  return (
    <div className="app-shell" data-theme={theme}>
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        user={user}
        isLoggedIn={isLoggedIn}
        onOpenLogin={() => setShowLoginModal(true)}
        onLogout={handleLogout}
        onReplayTour={handleReplayTour}
        theme={theme}
        onToggleTheme={toggleTheme}
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
      />

      <main className="main-viewport">
        {activeView === 'ride' && (
          <RideStage
            bookingState={bookingState}
            setBookingState={setBookingState}
            destination={destination}
            setDestination={setDestination}
            pickup={pickup}
            setPickup={setPickup}
            selectedCarId={selectedCarId}
            setSelectedCarId={setSelectedCarId}
            order={order}
            setOrder={setOrder}
            onShowNotice={showToast}
            theme={theme}
          />
        )}

        {activeView === 'package' && (
          <PackageView
            onShowNotice={showToast}
            theme={theme}
          />
        )}

        {activeView === 'activity' && (
          <ActivityView
            activeOrder={order}
            onRebook={handleRebook}
            onTrackOrder={handleTrackOrder}
          />
        )}

        {activeView === 'account' && (
          <AccountView
            user={user}
            onAddFunds={handleAddFunds}
            onBookSavedPlace={handleBookSavedPlace}
            onReplayTour={handleReplayTour}
            onLogout={handleLogout}
            onShowNotice={showToast}
          />
        )}

        {/* LOGIN MODAL */}
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onLogin={handleLogin}
        />

        {/* TOAST NOTIFICATION */}
        {notice && (
          <div className="toast" role="status">
            <img src="/src/assets/icons/check.png" alt="Success" className="icon-xs" />
            <span>{notice}</span>
          </div>
        )}
      </main>

      <MobileNav activeView={activeView} setActiveView={setActiveView} />
    </div>
  );
}
