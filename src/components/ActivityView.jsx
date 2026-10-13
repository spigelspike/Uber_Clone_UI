import React, { useState } from 'react';

const pastTripsData = [
  {
    id: 'TRIP-9421',
    date: 'Yesterday · 8:45 PM',
    from: 'Bandra West, Mumbai',
    to: 'Phoenix Marketcity, Kurla',
    carId: 'x',
    carName: 'UberX',
    img: 'sedan.png',
    fare: 246,
    distance: '7.8 km',
    duration: '22 mins',
    driver: 'Ravi Kumar',
    rating: '4.9',
    vehiclePlate: 'MH 01 CR 2846',
    status: 'Completed'
  },
  {
    id: 'TRIP-8910',
    date: '24 Sep · 10:15 AM',
    from: 'Jio World Drive, BKC',
    to: 'Chhatrapati Shivaji Maharaj Airport (T2)',
    carId: 'premier',
    carName: 'Premier',
    img: 'van.png',
    fare: 394,
    distance: '9.4 km',
    duration: '28 mins',
    driver: 'Suresh Patil',
    rating: '4.95',
    vehiclePlate: 'MH 02 BG 5512',
    status: 'Completed'
  },
  {
    id: 'TRIP-8142',
    date: '18 Sep · 2:30 PM',
    from: 'Chembur Station',
    to: 'Sion Circle, Mumbai',
    carId: 'auto',
    carName: 'Uber Auto',
    img: 'auto.png',
    fare: 181,
    distance: '4.6 km',
    duration: '16 mins',
    driver: 'Manoj Yadav',
    rating: '4.85',
    vehiclePlate: 'MH 03 DZ 1109',
    status: 'Completed'
  },
  {
    id: 'TRIP-7730',
    date: '12 Sep · 11:15 PM',
    from: 'Lower Parel, Mumbai',
    to: 'Bandra West, Mumbai',
    carId: 'x',
    carName: 'UberX',
    img: 'sedan.png',
    fare: 210,
    distance: '6.2 km',
    duration: '19 mins',
    driver: 'Amit Singh',
    rating: '4.88',
    vehiclePlate: 'MH 01 AA 7731',
    status: 'Completed'
  },
  {
    id: 'TRIP-7105',
    date: '05 Sep · 6:00 PM',
    from: 'Work · One BKC',
    to: 'Home · 24th Main Road',
    carId: 'auto',
    carName: 'Uber Auto',
    img: 'auto.png',
    fare: 165,
    distance: '5.1 km',
    duration: '18 mins',
    driver: 'Ramesh Verma',
    rating: '4.8',
    vehiclePlate: 'MH 04 ER 4210',
    status: 'Cancelled'
  }
];

export default function ActivityView({ activeOrder, onRebook, onTrackOrder }) {
  const [filter, setFilter] = useState('all');
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  const filteredTrips = pastTripsData.filter(trip => {
    if (filter === 'completed') return trip.status === 'Completed';
    if (filter === 'cancelled') return trip.status === 'Cancelled';
    return true;
  });

  return (
    <div className="activity-stage">
      <div className="activity-container">
        {/* HEADER */}
        <div className="activity-header">
          <div className="activity-title-group">
            <img src="/src/assets/icons/list.png" alt="Activity" className="icon-md" />
            <div>
              <h1>Activity</h1>
              <p>Past rides, receipts, and 1-tap rebooking</p>
            </div>
          </div>

          <div className="activity-tabs">
            <button
              className={`act-tab ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              className={`act-tab ${filter === 'completed' ? 'active' : ''}`}
              onClick={() => setFilter('completed')}
            >
              Completed
            </button>
            <button
              className={`act-tab ${filter === 'cancelled' ? 'active' : ''}`}
              onClick={() => setFilter('cancelled')}
            >
              Cancelled
            </button>
          </div>
        </div>

        {/* ACTIVE LIVE TRIP BANNER */}
        {activeOrder && (
          <div className="active-trip-banner">
            <div className="active-trip-left">
              <span className="active-pulse">● LIVE TRIP</span>
              <strong>Trip to {activeOrder.destination}</strong>
              <small>Driver on the way · {activeOrder.car.title}</small>
            </div>
            <button className="black-btn sm-btn" onClick={onTrackOrder}>
              Track ride
            </button>
          </div>
        )}

        {/* PAST TRIPS CARDS */}
        <div className="trips-grid">
          {filteredTrips.map(trip => (
            <article key={trip.id} className="trip-card">
              <div className="trip-card-top">
                {/* VEHICLE THUMB: NO BACKGROUND, NO FRAME */}
                <div className="trip-car-thumb">
                  <img src={`/src/assets/images/${trip.img}`} alt={trip.carName} />
                </div>

                <div className="trip-main-info">
                  <div className="trip-car-header">
                    <strong>{trip.carName}</strong>
                    <span className="trip-fare">₹{trip.fare}</span>
                  </div>
                  <span className="trip-time">{trip.date}</span>
                  <span className={`trip-status-tag ${trip.status.toLowerCase()}`}>
                    {trip.status === 'Completed' && (
                      <img src="/src/assets/icons/check.png" alt="Done" className="icon-xxs" />
                    )}
                    <span>{trip.status}</span>
                  </span>
                </div>
              </div>

              {/* ROUTE */}
              <div className="trip-route-box">
                <div className="route-line-dots">
                  <i></i>
                  <b></b>
                </div>
                <div className="route-names">
                  <span>{trip.from}</span>
                  <span>{trip.to}</span>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="trip-card-footer">
                <button
                  className="btn-ghost-sm"
                  onClick={() => setSelectedReceipt(trip)}
                >
                  View receipt
                </button>
                <button
                  className="rebook-btn"
                  onClick={() => onRebook(trip)}
                >
                  Rebook ↺
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* RECEIPT MODAL */}
      {selectedReceipt && (
        <div className="modal-backdrop" onClick={() => setSelectedReceipt(null)}>
          <div className="receipt-card" onClick={e => e.stopPropagation()}>
            <div className="receipt-header">
              <div>
                <span className="receipt-tag">{selectedReceipt.status.toUpperCase()}</span>
                <h2>Trip Receipt</h2>
                <small>{selectedReceipt.id} · {selectedReceipt.date}</small>
              </div>
              <button className="close-btn" onClick={() => setSelectedReceipt(null)}>
                <img src="/src/assets/icons/close.png" alt="Close" className="icon-xs" />
              </button>
            </div>

            <div className="receipt-vehicle">
              <div className="car-art">
                <img src={`/src/assets/images/${selectedReceipt.img}`} alt={selectedReceipt.carName} />
              </div>
              <div>
                <strong>{selectedReceipt.carName}</strong>
                <small>Driver: {selectedReceipt.driver} (★ {selectedReceipt.rating}) · {selectedReceipt.vehiclePlate}</small>
              </div>
            </div>

            <div className="receipt-route">
              <div><small>Pickup</small><strong>{selectedReceipt.from}</strong></div>
              <div><small>Dropoff</small><strong>{selectedReceipt.to}</strong></div>
            </div>

            <div className="receipt-breakdown">
              <div><span>Base fare & distance</span><b>₹{selectedReceipt.fare - 32}</b></div>
              <div><span>Government taxes & tolls</span><b>₹32</b></div>
              <div><span>Total distance</span><b>{selectedReceipt.distance} ({selectedReceipt.duration})</b></div>
              <div className="total-row"><span>Total Charged</span><b>₹{selectedReceipt.fare}</b></div>
              <small className="pay-method">Paid with: UPI ••• 4821</small>
            </div>

            <div className="receipt-actions">
              <button
                className="black-btn full-btn"
                onClick={() => {
                  const t = selectedReceipt;
                  setSelectedReceipt(null);
                  onRebook(t);
                }}
              >
                Rebook this ride
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
