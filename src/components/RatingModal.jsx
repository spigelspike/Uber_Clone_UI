import React, { useState } from 'react';
import { sound } from '../utils/audio.js';

const COMPLIMENTS = [
  '✨ Clean vehicle',
  '🎵 Great vibes',
  '🛡️ Smooth driving',
  '🤝 Friendly driver',
  '⚡ Quick route',
  '💬 Good conversation'
];

export default function RatingModal({
  isOpen,
  driver = { name: 'Ravi Kumar', vehicle: 'White Suzuki Dzire', plate: 'MH 01 CR 2846' },
  fare = 246,
  onClose,
  onSubmitRating
}) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [tip, setTip] = useState(0);
  const [selectedCompliments, setSelectedCompliments] = useState(['✨ Clean vehicle']);
  const [feedback, setFeedback] = useState('');

  if (!isOpen) return null;

  const toggleCompliment = (comp) => {
    setSelectedCompliments(prev =>
      prev.includes(comp) ? prev.filter(c => c !== comp) : [...prev, comp]
    );
    sound.playChime('tap');
  };

  const handleSelectTip = (amount) => {
    setTip(amount);
    sound.playChime('tap');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sound.playChime('complete');
    onSubmitRating({
      rating,
      tip,
      compliments: selectedCompliments,
      feedback
    });
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card rating-modal" role="dialog" aria-modal="true">
        <div className="rating-header">
          <div className="driver-avatar-lg">RK</div>
          <h2>How was your trip with {driver.name}?</h2>
          <p className="rating-sub">{driver.vehicle} · {driver.plate}</p>
          <div className="trip-total-pill">Total: ₹{fare}</div>
        </div>

        {/* 5-STAR RATING SELECTOR */}
        <div className="stars-row" onMouseLeave={() => setHoverRating(0)}>
          {[1, 2, 3, 4, 5].map(star => {
            const active = (hoverRating || rating) >= star;
            return (
              <button
                key={star}
                type="button"
                className={`star-btn ${active ? 'active' : ''}`}
                onMouseEnter={() => setHoverRating(star)}
                onClick={() => {
                  setRating(star);
                  sound.playChime('tap');
                }}
                aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
              >
                ★
              </button>
            );
          })}
        </div>
        <p className="rating-verdict">
          {rating === 5 ? 'Excellent experience!' : rating === 4 ? 'Good ride' : rating === 3 ? 'It was okay' : 'Needs improvement'}
        </p>

        {/* DRIVER TIP SELECTOR */}
        <div className="tip-section">
          <label>Add a tip for {driver.name.split(' ')[0]}</label>
          <div className="tip-options">
            {[0, 20, 50, 100].map(amount => (
              <button
                key={amount}
                type="button"
                className={`tip-btn ${tip === amount ? 'selected' : ''}`}
                onClick={() => handleSelectTip(amount)}
              >
                {amount === 0 ? 'No tip' : `+₹${amount}`}
              </button>
            ))}
          </div>
        </div>

        {/* COMPLIMENT CHIPS */}
        <div className="compliments-section">
          <label>Give compliments</label>
          <div className="compliment-chips">
            {COMPLIMENTS.map(comp => (
              <button
                key={comp}
                type="button"
                className={`chip-btn ${selectedCompliments.includes(comp) ? 'selected' : ''}`}
                onClick={() => toggleCompliment(comp)}
              >
                {comp}
              </button>
            ))}
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="modal-actions">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Skip
          </button>
          <button type="button" className="black-btn full-w" onClick={handleSubmit}>
            Done {tip > 0 && `(Pay ₹${fare + tip})`}
          </button>
        </div>
      </div>
    </div>
  );
}
