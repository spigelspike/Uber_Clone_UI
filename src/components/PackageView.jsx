import React, { useState } from 'react';
import InteractiveMap from './InteractiveMap.jsx';
import { sound } from '../utils/audio.js';

const PACKAGE_SIZES = [
  {
    id: 'small',
    title: 'Small item',
    desc: 'Fits in a backpack (Keys, documents, medicine)',
    weight: 'Up to 5 kg',
    price: 85,
    eta: '25 min',
    vehicle: 'auto'
  },
  {
    id: 'medium',
    title: 'Medium package',
    desc: 'Fits on a car seat (Shoebox, cake, apparel)',
    weight: 'Up to 15 kg',
    price: 160,
    eta: '30 min',
    vehicle: 'x'
  },
  {
    id: 'large',
    title: 'Large box',
    desc: 'Fits in a trunk (Bulk packages, electronics)',
    weight: 'Up to 30 kg',
    price: 280,
    eta: '35 min',
    vehicle: 'premier'
  }
];

export default function PackageView({ onShowNotice, theme = 'light' }) {
  const [mode, setMode] = useState('send'); // 'send' | 'receive'
  const [pickup, setPickup] = useState('Bandra West, Mumbai');
  const [destination, setDestination] = useState('Bandra Kurla Complex (BKC)');
  const [sizeId, setSizeId] = useState('small');
  const [recipientName, setRecipientName] = useState('Aakash Patel');
  const [recipientPhone, setRecipientPhone] = useState('+91 98334 11209');
  const [deliveryNote, setDeliveryNote] = useState('');
  const [trackingOrder, setTrackingOrder] = useState(null);
  const [sheetOpen, setSheetOpen] = useState(true);

  const selectedSize = PACKAGE_SIZES.find(s => s.id === sizeId) || PACKAGE_SIZES[0];

  const handleRequestDelivery = () => {
    sound.playChime('confirm');
    const newDelivery = {
      id: `PKG-${Math.floor(1000 + Math.random() * 8999)}`,
      pickup,
      destination,
      size: selectedSize,
      recipient: recipientName,
      status: 'Courier on the way to pickup'
    };
    setTrackingOrder(newDelivery);
    onShowNotice(`Courier assigned! Delivery to ${recipientName} confirmed.`);
  };

  const handleCancelDelivery = () => {
    setTrackingOrder(null);
    onShowNotice('Package delivery cancelled.');
  };

  return (
    <div className="map-stage">
      <InteractiveMap
        bookingState={trackingOrder ? 'tracking' : 'rides'}
        pickup={pickup}
        destination={destination}
        selectedCarId={selectedSize.vehicle}
        arrived={false}
        theme={theme}
      />

      {sheetOpen ? (
        <section className="booking-card package-card">
          <div className="sheet-handle" onClick={() => setSheetOpen(false)}></div>

          <div className="card-heading">
            <div>
              <p className="eyebrow">UBER CONNECT · PACKAGE COURIER</p>
              <h1>{trackingOrder ? 'Package in transit' : 'Send or receive items'}</h1>
            </div>
            <button className="close" onClick={() => setSheetOpen(false)} aria-label="Minimize card">
              <img src="/src/assets/icons/close.png" alt="Close" className="icon-xs" />
            </button>
          </div>

          {!trackingOrder ? (
            <div className="booking-body">
              {/* SEND VS RECEIVE TOGGLE */}
              <div className="package-toggle-row">
                <button
                  className={`pkg-toggle-btn ${mode === 'send' ? 'active' : ''}`}
                  onClick={() => {
                    setMode('send');
                    sound.playChime('tap');
                  }}
                >
                  Send a package
                </button>
                <button
                  className={`pkg-toggle-btn ${mode === 'receive' ? 'active' : ''}`}
                  onClick={() => {
                    setMode('receive');
                    sound.playChime('tap');
                  }}
                >
                  Receive a package
                </button>
              </div>

              {/* LOCATIONS */}
              <div className="location-inputs">
                <div className="connector"></div>
                <div className="location-row">
                  <span className="square-icon">
                    <img src="/src/assets/icons/target.png" alt="Pickup" className="icon-xs" />
                  </span>
                  <input
                    value={pickup}
                    onChange={e => setPickup(e.target.value)}
                    placeholder="Pickup address"
                  />
                </div>
                <div className="location-row input-row">
                  <span className="circle-icon"></span>
                  <input
                    value={destination}
                    onChange={e => setDestination(e.target.value)}
                    placeholder="Recipient dropoff location"
                  />
                </div>
              </div>

              {/* PACKAGE SIZES */}
              <div className="package-size-list">
                <label className="section-label">Select package size</label>
                {PACKAGE_SIZES.map(pkg => (
                  <button
                    key={pkg.id}
                    className={`pkg-size-card ${sizeId === pkg.id ? 'selected' : ''}`}
                    onClick={() => {
                      setSizeId(pkg.id);
                      sound.playChime('tap');
                    }}
                  >
                    <div className="pkg-info">
                      <strong>{pkg.title}</strong>
                      <small>{pkg.desc}</small>
                      <span className="weight-badge">{pkg.weight}</span>
                    </div>
                    <div className="pkg-fare">
                      <b>₹{pkg.price}</b>
                      <small>{pkg.eta}</small>
                    </div>
                  </button>
                ))}
              </div>

              {/* RECIPIENT DETAILS */}
              <div className="recipient-form">
                <label className="section-label">Recipient contact</label>
                <div className="input-group-row">
                  <input
                    type="text"
                    value={recipientName}
                    onChange={e => setRecipientName(e.target.value)}
                    placeholder="Recipient name"
                  />
                  <input
                    type="tel"
                    value={recipientPhone}
                    onChange={e => setRecipientPhone(e.target.value)}
                    placeholder="Phone number"
                  />
                </div>
                <input
                  type="text"
                  value={deliveryNote}
                  onChange={e => setDeliveryNote(e.target.value)}
                  placeholder="Delivery note (e.g. Leave with security)"
                  className="full-input"
                />
              </div>

              <button className="black-btn full-w" onClick={handleRequestDelivery}>
                Request Courier · ₹{selectedSize.price}
              </button>
            </div>
          ) : (
            <div className="booking-body">
              {/* TRACKING VIEW */}
              <div className="package-tracking-header">
                <div className="pkg-badge-lg">📦</div>
                <div>
                  <strong>Order {trackingOrder.id}</strong>
                  <p>{trackingOrder.size.title} · {trackingOrder.status}</p>
                </div>
              </div>

              <div className="courier-card">
                <div className="driver-avatar">AM</div>
                <div>
                  <strong>Amit More <span className="star-tag">★ 4.95</span></strong>
                  <small>Delivery Courier · Honda Activa</small>
                </div>
                <button
                  className="contact"
                  onClick={() => onShowNotice('Message sent to courier!')}
                >
                  <img src="/src/assets/icons/chat.png" alt="Chat" className="icon-xs" />
                  <span>Call</span>
                </button>
              </div>

              <div className="pkg-details-summary">
                <div className="detail-line">
                  <span>Recipient:</span>
                  <strong>{trackingOrder.recipient}</strong>
                </div>
                <div className="detail-line">
                  <span>To:</span>
                  <strong>{trackingOrder.destination}</strong>
                </div>
                <div className="detail-line">
                  <span>Est. Delivery:</span>
                  <strong>{selectedSize.eta}</strong>
                </div>
              </div>

              <div className="tracking-actions">
                <button
                  onClick={() => {
                    sound.playChime('complete');
                    onShowNotice('Package delivered safely!');
                    setTrackingOrder(null);
                  }}
                >
                  Simulate Delivery Complete
                </button>
                <button onClick={handleCancelDelivery}>Cancel Delivery</button>
              </div>
            </div>
          )}
        </section>
      ) : (
        <button className="open-booking" onClick={() => setSheetOpen(true)}>
          📦 View Package Details
        </button>
      )}
    </div>
  );
}
