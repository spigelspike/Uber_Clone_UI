import React, { useState, useEffect } from 'react';
import InteractiveMap from './InteractiveMap.jsx';
import RatingModal from './RatingModal.jsx';
import { sound } from '../utils/audio.js';

const cars = [
  { id: 'x', title: 'UberX', subtitle: 'Affordable, everyday rides', time: '3 min away', price: 246, people: 4, badge: 'Recommended', img: 'sedan.png' },
  { id: 'premier', title: 'Premier', subtitle: 'Spacious & stylish travel', time: '5 min away', price: 394, people: 6, badge: 'Comfort', img: 'van.png' },
  { id: 'auto', title: 'Uber Auto', subtitle: 'Quick and easy auto rides', time: '2 min away', price: 181, people: 3, badge: 'Fastest', img: 'auto.png' }
];

const places = [
  { name: 'Phoenix Marketcity, Kurla', distance: '2.4 km away', tag: 'Popular' },
  { name: 'Bandra West, Mumbai', distance: '5.8 km away', tag: 'Recent' },
  { name: 'Chhatrapati Shivaji Maharaj Airport (T2)', distance: '7.1 km away', tag: 'Airport' },
  { name: 'Jio World Drive, BKC', distance: '4.6 km away', tag: 'Popular' },
  { name: 'Lower Parel, Mumbai', distance: '6.5 km away', tag: 'Business' }
];

const paymentMethods = [
  { id: 'upi', name: 'UPI ••• 4821', description: 'Google Pay / PhonePe' },
  { id: 'cash', name: 'Cash', description: 'Pay driver after trip' },
  { id: 'card', name: 'Visa •••• 9042', description: 'Personal card' },
  { id: 'wallet', name: 'Uber Cash (₹450)', description: 'Preloaded balance' }
];

const pickupOptions = ['Current location', 'Home · 24th Main Road', 'Work · One BKC'];

export default function RideStage({
  bookingState,
  setBookingState,
  destination,
  setDestination,
  pickup,
  setPickup,
  selectedCarId,
  setSelectedCarId,
  order,
  setOrder,
  onShowNotice,
  theme = 'light'
}) {
  const [sheetOpen, setSheetOpen] = useState(true);
  const [menu, setMenu] = useState(null); // 'rider' | 'pickup' | 'payment' | 'schedule' | 'promo'
  const [scheduled, setScheduled] = useState(null);
  const [promo, setPromo] = useState('');
  const [promoInput, setPromoInput] = useState('');

  // Trip tracking lifecycle states: 'approaching' | 'arrived' | 'in_progress' | 'completed'
  const [tripStatus, setTripStatus] = useState('approaching');
  const [arrived, setArrived] = useState(false);
  const [etaMinutes, setEtaMinutes] = useState(3);
  const [showRatingModal, setShowRatingModal] = useState(false);

  const selectedCar = cars.find(c => c.id === selectedCarId) || cars[0];
  const selectedPayment = paymentMethods[0];
  const currentFare = Math.max(0, selectedCar.price - (promo === 'RIDE20' ? 20 : 0));

  // Dynamic countdown timer during driver approach
  useEffect(() => {
    let timer;
    if (bookingState === 'tracking' && tripStatus === 'approaching' && !arrived) {
      timer = setInterval(() => {
        setEtaMinutes(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 1;
          }
          return prev - 1;
        });
      }, 9000); // changes every 9s for smooth progression
    }
    return () => clearInterval(timer);
  }, [bookingState, tripStatus, arrived]);

  const filteredPlaces = places.filter(p =>
    p.name.toLowerCase().includes(destination.toLowerCase())
  ).slice(0, 4);

  const handleSelectPlace = (placeName) => {
    setDestination(placeName);
    setBookingState('rides');
    setMenu(null);
    sound.playChime('tap');
  };

  const handleRequestRide = () => {
    sound.playChime('confirm');
    const newOrder = {
      id: `UB-${Math.floor(1000 + Math.random() * 8999)}`,
      destination,
      pickup,
      car: selectedCar,
      fare: currentFare,
      createdAt: Date.now()
    };
    setOrder(newOrder);
    setBookingState('tracking');
    setTripStatus('approaching');
    setArrived(false);
    setEtaMinutes(3);
    onShowNotice(`${selectedCar.title} confirmed! Driver Ravi is 3 min away.`);
  };

  const handleDriverArrived = () => {
    setArrived(true);
    setTripStatus('arrived');
    setEtaMinutes(0);
    onShowNotice('Ravi has arrived at your pickup! PIN: 4821');
  };

  const handleStartTrip = () => {
    sound.playChime('confirm');
    setTripStatus('in_progress');
    onShowNotice(`Trip started! Heading towards ${destination || 'destination'}.`);
  };

  const handleCompleteTrip = () => {
    sound.playChime('complete');
    setTripStatus('completed');
    setShowRatingModal(true);
  };

  const handleSubmitRating = (ratingData) => {
    setShowRatingModal(false);
    onShowNotice(`Thank you! Rated Ravi ${ratingData.rating}★ · Trip completed.`);
    setOrder(null);
    setBookingState('where');
    setDestination('');
    setTripStatus('approaching');
    setArrived(false);
  };

  const handleCancelRide = () => {
    sound.playChime('tap');
    setOrder(null);
    setBookingState('where');
    setDestination('');
    setArrived(false);
    setTripStatus('approaching');
    onShowNotice('Ride cancelled without fees.');
  };

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoInput.trim().toUpperCase() === 'RIDE20') {
      sound.playChime('confirm');
      setPromo('RIDE20');
      setMenu(null);
      onShowNotice('RIDE20 applied — saved ₹20!');
    } else {
      sound.playChime('tap');
      onShowNotice('Invalid code. Try RIDE20');
    }
  };

  return (
    <div className={`map-stage ${bookingState === 'tracking' ? 'trip-map' : ''}`}>
      {/* REAL WORKING INTERACTIVE MAP WITH SIMULATION & DARK MODE */}
      <InteractiveMap
        bookingState={bookingState}
        pickup={pickup}
        destination={destination}
        selectedCarId={selectedCarId}
        arrived={arrived}
        tripStatus={tripStatus}
        onDriverArrived={handleDriverArrived}
        theme={theme}
      />

      {/* FLOATING BOOKING CARD */}
      {sheetOpen ? (
        <section className={`booking-card ${bookingState === 'tracking' ? 'tracking-card' : ''}`}>
          <div
            className="sheet-handle"
            onClick={() => setSheetOpen(false)}
            title="Click or drag to minimize"
          ></div>

          <div className="card-heading">
            <div>
              <p className="eyebrow">
                {bookingState === 'tracking'
                  ? tripStatus === 'in_progress'
                    ? 'TRIP IN PROGRESS'
                    : arrived
                    ? 'DRIVER ARRIVED'
                    : 'DRIVER APPROACHING'
                  : bookingState === 'rides'
                  ? 'CHOOSE YOUR RIDE'
                  : 'RIDE WITH UBER'}
              </p>
              <h1>
                {bookingState === 'where'
                  ? 'Where to?'
                  : bookingState === 'rides'
                  ? 'Choose a ride'
                  : tripStatus === 'in_progress'
                  ? `Heading to ${destination ? destination.split(',')[0] : 'Destination'}`
                  : arrived
                  ? 'Driver has arrived'
                  : `Driver is ${etaMinutes} min away`}
              </h1>
            </div>
            <button className="close" onClick={() => setSheetOpen(false)} aria-label="Minimize card">
              <img src="/src/assets/icons/close.png" alt="Minimize" className="icon-xs" />
            </button>
          </div>

          {/* STEP 1: WHERE TO */}
          {bookingState === 'where' && (
            <div className="booking-body">
              {/* RIDER SELECTOR */}
              <div className="rider-wrap">
                <button
                  className="rider-chip"
                  onClick={() => {
                    setMenu(menu === 'rider' ? null : 'rider');
                    sound.playChime('tap');
                  }}
                >
                  <span className="avatar ink">PS</span>
                  <span>
                    <small>Riding with</small>
                    <strong>Priya Sharma</strong>
                  </span>
                  <img src="/src/assets/icons/arrow-down.png" alt="Select" className="icon-xxs" />
                </button>
                {menu === 'rider' && (
                  <div className="popover rider-popover">
                    <p>Who is riding?</p>
                    <button className="rider-option current">
                      <span className="avatar ink">PS</span>
                      <span><strong>Priya Sharma</strong><small>Personal account</small></span>
                      <img src="/src/assets/icons/check.png" alt="Selected" className="icon-xs" />
                    </button>
                    <button className="rider-option" onClick={() => onShowNotice('Family rider switched')}>
                      <span className="avatar peach">AK</span>
                      <span><strong>Ananya Kapoor</strong><small>Family profile</small></span>
                    </button>
                  </div>
                )}
              </div>

              {/* LOCATION INPUTS */}
              <div className="location-inputs">
                <div className="connector"></div>
                <button
                  className="location-row pickup"
                  onClick={() => {
                    setMenu(menu === 'pickup' ? null : 'pickup');
                    sound.playChime('tap');
                  }}
                >
                  <span className="square-icon">
                    <img src="/src/assets/icons/target.png" alt="Pickup" className="icon-xs" />
                  </span>
                  <span>
                    <small>Pickup</small>
                    <strong>{pickup}</strong>
                  </span>
                  <span className="mini-edit">Change</span>
                </button>

                {menu === 'pickup' && (
                  <div className="pickup-menu">
                    {pickupOptions.map(p => (
                      <button
                        key={p}
                        onClick={() => {
                          setPickup(p);
                          setMenu(null);
                          sound.playChime('tap');
                        }}
                      >
                        <img src="/src/assets/icons/point.png" alt="Point" className="icon-xs" />
                        <span>{p}</span>
                      </button>
                    ))}
                    <button
                      onClick={() => {
                        setPickup('Current location');
                        setMenu(null);
                        sound.playChime('tap');
                        onShowNotice('Pickup updated to GPS');
                      }}
                    >
                      <img src="/src/assets/icons/target.png" alt="Location" className="icon-xs" />
                      <span>Use current GPS location</span>
                    </button>
                  </div>
                )}

                <div className="location-row input-row">
                  <span className="circle-icon"></span>
                  <input
                    id="destination"
                    value={destination}
                    onChange={e => setDestination(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && destination && setBookingState('rides')}
                    placeholder="Enter destination"
                    autoComplete="off"
                  />
                  <img src="/src/assets/icons/search.png" alt="Search" className="icon-xs icon-muted" />
                </div>
              </div>

              {/* QUICK ACTIONS */}
              <div className="quick-actions">
                <button
                  onClick={() => {
                    setMenu(menu === 'schedule' ? null : 'schedule');
                    sound.playChime('tap');
                  }}
                >
                  <span className="quick-icon">◷</span>
                  <span>
                    <strong>{scheduled ? 'Reserved' : 'Reserve'}</strong>
                    <small>{scheduled || 'Ride later'}</small>
                  </span>
                </button>
                <button
                  onClick={() => {
                    setMenu(menu === 'rider' ? null : 'rider');
                    sound.playChime('tap');
                  }}
                >
                  <span className="quick-icon">
                    <img src="/src/assets/icons/profile.png" alt="Rider" className="icon-xs" />
                  </span>
                  <span>
                    <strong>For someone</strong>
                    <small>Choose rider</small>
                  </span>
                </button>
              </div>

              {menu === 'schedule' && (
                <div className="schedule-panel">
                  <p>When would you like to leave?</p>
                  <div>
                    <button className={`schedule-choice ${!scheduled ? 'chosen' : ''}`} onClick={() => setScheduled(null)}>Now</button>
                    <button className={`schedule-choice ${scheduled === 'Today, 6:30 PM' ? 'chosen' : ''}`} onClick={() => setScheduled('Today, 6:30 PM')}>Today, 6:30 PM</button>
                    <button className={`schedule-choice ${scheduled === 'Tomorrow, 9:00 AM' ? 'chosen' : ''}`} onClick={() => setScheduled('Tomorrow, 9:00 AM')}>Tomorrow, 9:00 AM</button>
                  </div>
                </div>
              )}

              {/* SUGGESTED PLACES */}
              <div className="suggestion-head">
                <strong>{destination ? 'Matches' : 'Suggested places'}</strong>
                <button onClick={() => onShowNotice('Showing all popular places')}>View all</button>
              </div>

              <div className="suggestions">
                {filteredPlaces.map(p => (
                  <button key={p.name} onClick={() => handleSelectPlace(p.name)}>
                    <span className="place-icon p0">
                      <img src="/src/assets/icons/pin.png" alt="Pin" className="icon-xs" />
                    </span>
                    <span>
                      <strong>{p.name}</strong>
                      <small>{p.distance} · {p.tag}</small>
                    </span>
                    <span className="place-arrow">›</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: CHOOSE A RIDE */}
          {bookingState === 'rides' && (
            <div className="booking-body">
              <button
                className="trip-summary"
                onClick={() => {
                  setBookingState('where');
                  sound.playChime('tap');
                }}
              >
                <span className="summary-dots"><i></i><b></b></span>
                <span>
                  <small>From</small>{pickup}
                  <small>To</small>{destination || 'Selected destination'}
                </span>
                <span className="trip-edit">
                  <img src="/src/assets/icons/back-arrow.png" alt="Edit" className="icon-xs" />
                </span>
              </button>

              {scheduled && (
                <div className="reserve-note">◷ Reserved for {scheduled}</div>
              )}

              {/* CAR SELECTION LIST */}
              <div className="ride-list">
                {cars.map(car => (
                  <button
                    key={car.id}
                    className={`ride-option ${car.id === selectedCarId ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedCarId(car.id);
                      sound.playChime('tap');
                    }}
                  >
                    <div className="car-art">
                      <img src={`/src/assets/images/${car.img}`} alt={car.title} />
                    </div>

                    <div className="ride-info">
                      <strong>
                        {car.title} <span className="passengers">👤 {car.people}</span>
                      </strong>
                      <span>{car.time}</span>
                      <small>{car.subtitle}</small>
                      {car.badge && <em>{car.badge}</em>}
                    </div>

                    <div className="fare">
                      <b>₹{Math.max(0, car.price - (promo === 'RIDE20' ? 20 : 0))}</b>
                      <small>incl. taxes</small>
                    </div>

                    <span className="radio"></span>
                  </button>
                ))}
              </div>

              {/* PAYMENT & PROMO */}
              <button
                className="payment-row"
                onClick={() => {
                  setMenu(menu === 'payment' ? null : 'payment');
                  sound.playChime('tap');
                }}
              >
                <img src="/src/assets/icons/dollar.png" alt="Payment" className="icon-sm" />
                <span>
                  <small>Payment method</small>
                  <strong>{selectedPayment.name}</strong>
                </span>
                <img src="/src/assets/icons/arrow-down.png" alt="Expand" className="icon-xxs" />
              </button>

              {menu === 'payment' && (
                <div className="popover payment-popover">
                  {paymentMethods.map(p => (
                    <button key={p.id} className={p.id === 'upi' ? 'current' : ''} onClick={() => setMenu(null)}>
                      <span><strong>{p.name}</strong><small>{p.description}</small></span>
                      {p.id === 'upi' && <img src="/src/assets/icons/check.png" alt="Checked" className="icon-xs" />}
                    </button>
                  ))}
                </div>
              )}

              <button
                className="promo-row"
                onClick={() => {
                  setMenu(menu === 'promo' ? null : 'promo');
                  sound.playChime('tap');
                }}
              >
                <span>🏷 {promo ? 'RIDE20 applied — ₹20 off' : 'Add promo code'}</span>
                <b>{promo ? '✓' : '›'}</b>
              </button>

              {menu === 'promo' && (
                <form className="promo-box" onSubmit={handleApplyPromo}>
                  <input
                    value={promoInput}
                    onChange={e => setPromoInput(e.target.value)}
                    placeholder="Try RIDE20"
                  />
                  <button type="submit">Apply</button>
                </form>
              )}

              <button className="black-btn" onClick={handleRequestRide}>
                {scheduled ? 'Reserve' : 'Request'} {selectedCar.title}
                <span>₹{currentFare}</span>
              </button>
              <p className="fare-note">
                {scheduled ? 'We will notify your driver ahead of time.' : 'No charges until your trip completes.'}
              </p>
            </div>
          )}

          {/* STEP 3: TRACKING PANEL */}
          {bookingState === 'tracking' && (
            <div className="booking-body">
              {/* VEHICLE BANNER */}
              <div className="tracking-hero">
                <img src={`/src/assets/images/${selectedCar.img}`} alt={selectedCar.title} />
                <div className="vehicle-badge">{selectedCar.title} · ₹{currentFare}</div>
                <span className="live-dot">LIVE</span>
              </div>

              {/* 4-DIGIT SAFETY PIN WHEN DRIVER ARRIVES */}
              {arrived && tripStatus !== 'in_progress' && (
                <div className="safety-pin-banner">
                  <div className="pin-badge">SAFETY PIN</div>
                  <div className="pin-digits">4 8 2 1</div>
                  <small>Share this PIN with driver Ravi to start trip</small>
                </div>
              )}

              <div className="eta-block">
                <div>
                  <span className="eta-time">
                    {tripStatus === 'in_progress'
                      ? 'In transit'
                      : arrived
                      ? 'Arrived'
                      : `${etaMinutes} min`}
                  </span>
                  <small>
                    {tripStatus === 'in_progress'
                      ? `En route to ${destination || 'destination'}`
                      : arrived
                      ? 'Meet Ravi at pickup pin'
                      : 'Driver is approaching on map'}
                  </small>
                </div>
                <div className="progress">
                  <i className="complete"></i>
                  <i className={arrived || tripStatus === 'in_progress' ? 'complete' : ''}></i>
                  <i className={tripStatus === 'in_progress' ? 'complete' : ''}></i>
                </div>
              </div>

              <div className="driver-row">
                <span className="driver-avatar">RK</span>
                <div>
                  <strong>
                    Ravi Kumar{' '}
                    <span>
                      <img src="/src/assets/icons/star.png" alt="Star" className="icon-xxs" /> 4.9
                    </span>
                  </strong>
                  <small>White Suzuki Dzire · MH 01 CR 2846</small>
                </div>
                <button
                  className="contact"
                  onClick={() => {
                    sound.playChime('tap');
                    onShowNotice('Message sent to Ravi: "I\'ll be right there."');
                  }}
                >
                  <img src="/src/assets/icons/chat.png" alt="Chat" className="icon-xs" />
                  <span>Message</span>
                </button>
              </div>

              <div className="trip-for">
                <span className="avatar ink">PS</span>
                <span>
                  <small>Ride booked for</small>
                  <strong>Priya Sharma</strong>
                </span>
              </div>

              <div className="trip-detail">
                <span>Order {order?.id || 'UB-9432'}</span>
                <span>UPI ••• 4821</span>
              </div>

              {/* ACTION BUTTONS */}
              <div className="tracking-actions">
                {!arrived && tripStatus === 'approaching' && (
                  <button
                    className="btn-accent"
                    onClick={() => {
                      handleDriverArrived();
                      sound.playChime('arrived');
                    }}
                  >
                    Simulate arrival now ⚡
                  </button>
                )}

                {arrived && tripStatus !== 'in_progress' && (
                  <button className="btn-accent primary-action" onClick={handleStartTrip}>
                    Start trip 🚗
                  </button>
                )}

                {tripStatus === 'in_progress' && (
                  <button className="btn-accent primary-action complete-action" onClick={handleCompleteTrip}>
                    Complete trip & rate ⭐
                  </button>
                )}

                <button onClick={handleCancelRide}>Cancel ride</button>
              </div>
            </div>
          )}
        </section>
      ) : (
        /* MINIMIZED FLOATING PEEK BAR (Allows viewing full live map) */
        <div className="booking-peek-pill" onClick={() => setSheetOpen(true)}>
          <span className="peek-live-dot"></span>
          <div className="peek-content">
            <strong>
              {bookingState === 'tracking'
                ? arrived
                  ? 'Driver arrived · Meet at pin'
                  : `Driver approaching · ${etaMinutes} min`
                : destination || 'Where to?'}
            </strong>
            <small>{pickup}</small>
          </div>
          <button className="peek-btn" aria-label="Expand sheet">
            Open ▴
          </button>
        </div>
      )}

      {/* RATING & TIP MODAL UPON TRIP COMPLETION */}
      <RatingModal
        isOpen={showRatingModal}
        driver={{ name: 'Ravi Kumar', vehicle: 'White Suzuki Dzire', plate: 'MH 01 CR 2846' }}
        fare={currentFare}
        onClose={() => handleSubmitRating({ rating: 5, tip: 0, compliments: [] })}
        onSubmitRating={handleSubmitRating}
      />
    </div>
  );
}
