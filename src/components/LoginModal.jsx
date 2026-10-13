import React, { useState } from 'react';

export default function LoginModal({ isOpen, onClose, onLogin }) {
  const [phone, setPhone] = useState('98201 54821');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin({
      name: 'Priya Sharma',
      phone: `+91 ${phone}`,
      email: 'priya.sharma@example.com',
      rating: '4.92 ★',
      initials: 'PS',
      wallet: 450
    });
    onClose();
  };

  const handleDemoLogin = () => {
    onLogin({
      name: 'Priya Sharma',
      phone: '+91 98201 54821',
      email: 'priya.sharma@example.com',
      rating: '4.92 ★',
      initials: 'PS',
      wallet: 450
    });
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="login-card" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose} aria-label="Close">
          <img src="/src/assets/icons/close.png" alt="Close" className="icon-xs" />
        </button>

        <div className="login-header">
          <div className="brand">Uber</div>
          <h2>Welcome to Uber</h2>
          <p>Sign in to unlock upfront fares, live trip tracking, and saved destinations.</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-wrap">
            <span className="country-prefix">🇮🇳 +91</span>
            <input 
              type="tel" 
              value={phone} 
              onChange={e => setPhone(e.target.value)} 
              placeholder="Enter mobile number" 
              required
            />
          </div>
          <button type="submit" className="black-btn full-btn">
            Continue
          </button>
        </form>

        <div className="login-divider">
          <span>or one-click demo</span>
        </div>

        <button type="button" className="demo-login-btn" onClick={handleDemoLogin}>
          <span className="demo-avatar">PS</span>
          <div>
            <strong>Priya Sharma (Demo Rider)</strong>
            <small>+91 98201 54821 · 4.92 ★ rating</small>
          </div>
          <span className="arrow">›</span>
        </button>

        <button type="button" className="google-login-btn" onClick={handleDemoLogin}>
          <img src="/src/assets/icons/google.png" alt="Google" className="icon-sm" />
          <span>Continue with Google</span>
        </button>

        <p className="login-disclaimer">
          By signing in, you agree to receive ride updates and demo notifications.
        </p>
      </div>
    </div>
  );
}
