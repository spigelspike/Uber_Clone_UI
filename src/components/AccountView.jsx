import React from 'react';

export default function AccountView({
  user,
  onAddFunds,
  onBookSavedPlace,
  onReplayTour,
  onLogout,
  onShowNotice
}) {
  return (
    <div className="account-stage">
      <div className="account-container">
        {/* PROFILE HERO */}
        <div className="account-hero">
          <div className="account-avatar">
            <span className="avatar-initials">{user.initials}</span>
          </div>
          <div className="account-details">
            <div className="account-name-row">
              <h1>{user.name}</h1>
              <span className="account-rating">
                <img src="/src/assets/icons/star.png" alt="Star" className="icon-xxs" />
                <span>{user.rating}</span>
              </span>
            </div>
            <p>{user.phone} · {user.email}</p>
            <span className="account-member">Uber One VIP Member · Since 2021</span>
          </div>
          <button className="btn-ghost" onClick={() => onShowNotice('Profile is verified')}>
            Edit
          </button>
        </div>

        {/* UBER CASH WALLET */}
        <div className="wallet-card">
          <div className="wallet-left">
            <span className="wallet-label">
              <img src="/src/assets/icons/dollar.png" alt="Cash" className="icon-xs" />
              <span>Uber Cash Balance</span>
            </span>
            <div className="wallet-amount">₹{user.wallet || 450}.00</div>
            <small>Auto-refill: Off · Available for trips & orders</small>
          </div>
          <button className="wallet-add-btn" onClick={onAddFunds}>
            ＋ Add funds
          </button>
        </div>

        {/* SAVED PLACES */}
        <div className="account-sections">
          <section className="acc-card">
            <h3>Saved Places</h3>
            <div className="acc-list">
              <div className="acc-item">
                <div className="acc-item-icon">
                  <img src="/src/assets/icons/home.png" alt="Home" className="icon-sm" />
                </div>
                <div className="acc-item-content">
                  <strong>Home</strong>
                  <small>24th Main Road, Bandra West, Mumbai</small>
                </div>
                <button
                  className="item-action"
                  onClick={() => onBookSavedPlace('Home · 24th Main Road')}
                >
                  Ride
                </button>
              </div>

              <div className="acc-item">
                <div className="acc-item-icon">
                  <img src="/src/assets/icons/pin.png" alt="Work" className="icon-sm" />
                </div>
                <div className="acc-item-content">
                  <strong>Work</strong>
                  <small>One BKC, G Block, BKC, Mumbai</small>
                </div>
                <button
                  className="item-action"
                  onClick={() => onBookSavedPlace('Work · One BKC')}
                >
                  Ride
                </button>
              </div>
            </div>
          </section>

          {/* PAYMENT METHODS */}
          <section className="acc-card">
            <h3>Payment Methods</h3>
            <div className="acc-list">
              <div className="acc-item">
                <div className="acc-item-icon">
                  <img src="/src/assets/icons/google.png" alt="Google Pay" className="icon-sm" />
                </div>
                <div className="acc-item-content">
                  <strong>UPI AutoPay (Google Pay)</strong>
                  <small>priya@oksbi · Verified</small>
                </div>
                <span className="badge-pill">Default</span>
              </div>

              <div className="acc-item">
                <div className="acc-item-icon">
                  <img src="/src/assets/icons/dollar.png" alt="Card" className="icon-sm" />
                </div>
                <div className="acc-item-content">
                  <strong>Visa Card •••• 9042</strong>
                  <small>Expires 08/28 · Personal</small>
                </div>
              </div>

              <div className="acc-item">
                <div className="acc-item-icon">
                  <img src="/src/assets/icons/check.png" alt="Cash" className="icon-sm" />
                </div>
                <div className="acc-item-content">
                  <strong>Cash</strong>
                  <small>Pay directly to driver after trip</small>
                </div>
              </div>
            </div>
          </section>

          {/* PREFERENCES & ONBOARDING REPLAY */}
          <section className="acc-card">
            <h3>App Experience & Security</h3>
            <div className="acc-list">
              <div
                className="acc-item interactive"
                onClick={() => onShowNotice('Safety Checkup: 4-digit PIN enabled')}
              >
                <div className="acc-item-icon">
                  <img src="/src/assets/icons/check.png" alt="Safety" className="icon-sm" />
                </div>
                <div className="acc-item-content">
                  <strong>Safety Checkup</strong>
                  <small>Trusted contacts, RideCheck, 4-digit PIN verification</small>
                </div>
                <span className="chevron">›</span>
              </div>

              <div className="acc-item interactive" onClick={onReplayTour}>
                <div className="acc-item-icon">
                  <img src="/src/assets/icons/profile.png" alt="Tour" className="icon-sm" />
                </div>
                <div className="acc-item-content">
                  <strong>Replay Onboarding Tour</strong>
                  <small>Review visual app guide, vehicle options & features</small>
                </div>
                <span className="chevron">›</span>
              </div>

              <div className="acc-item interactive" onClick={onLogout}>
                <div className="acc-item-icon">
                  <img src="/src/assets/icons/out.png" alt="Logout" className="icon-sm" />
                </div>
                <div className="acc-item-content">
                  <strong className="text-danger">Log out / Switch Profile</strong>
                  <small>Clear local demo session</small>
                </div>
                <span className="chevron">›</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
