import React, { useState } from 'react';

const slides = [
  {
    img: '/src/assets/images/onboarding1.png',
    tag: 'RIDE ANYWHERE',
    title: 'Anywhere, anytime',
    desc: 'Request a ride in minutes. Top-rated drivers, upfront fares, and comfortable vehicles are ready whenever you are.'
  },
  {
    img: '/src/assets/images/onboarding2.png',
    tag: 'CONNECT TOGETHER',
    title: 'A ride for every journey',
    desc: 'Whether it is a solo commute in an Uber Auto, daily comfort in an UberX, or group travel in a spacious Premier van.'
  },
  {
    img: '/src/assets/images/onboarding3.png',
    tag: 'SAFETY & INNOVATION',
    title: 'Modern travel, zero hassle',
    desc: 'Experience quiet electric rides, live route tracking, 24/7 emergency support, and verified safety on every trip.'
  }
];

export default function OnboardingSlider({ onFinish }) {
  const [index, setIndex] = useState(0);

  const current = slides[index];
  const isLast = index === slides.length - 1;

  const next = () => {
    if (isLast) {
      onFinish();
    } else {
      setIndex(prev => prev + 1);
    }
  };

  const prev = () => {
    if (index > 0) setIndex(prev => prev - 1);
  };

  return (
    <div className="onboarding-screen">
      <header className="onboarding-top">
        <div className="onboarding-logo">Uber</div>
        <button className="onboarding-skip" onClick={onFinish}>
          Skip
        </button>
      </header>

      <div className="onboarding-body">
        {/* Centered Image Card with soft backdrop aura */}
        <div className="onboarding-hero-wrapper">
          <div className="onboarding-glow-aura"></div>
          <div className="onboarding-hero-centered">
            <img 
              key={current.img}
              src={current.img} 
              alt={current.title} 
              className="onboarding-img-centered"
            />
          </div>
        </div>

        <div className="onboarding-content">
          <span className="onboarding-tag">{current.tag}</span>
          <h1 className="onboarding-title">{current.title}</h1>
          <p className="onboarding-desc">{current.desc}</p>
        </div>

        <div className="onboarding-dots">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`dot-btn ${i === index ? 'active' : ''}`}
              onClick={() => setIndex(i)}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>

        {/* ALIGNED ACTIONS */}
        <div className="onboarding-actions">
          {index > 0 && (
            <button className="onboarding-prev" onClick={prev} aria-label="Previous slide">
              <img src="/src/assets/icons/back-arrow.png" alt="Back" className="icon-xs" />
            </button>
          )}

          <button
            className={`onboarding-next ${index === 0 ? 'full-width' : ''} ${isLast ? 'finish-btn' : ''}`}
            onClick={next}
          >
            <span>{isLast ? 'Get started' : 'Continue'}</span>
            <span className="btn-arrow">›</span>
          </button>
        </div>
      </div>
    </div>
  );
}
