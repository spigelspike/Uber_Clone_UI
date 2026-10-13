do it const A = '/src/assets/';

const slides = [
  {
    img: 'onboarding1.png',
    tag: 'RIDE ANYWHERE',
    title: 'Anywhere, anytime',
    desc: 'Request a ride in seconds and get moving with top-rated drivers across your city.'
  },
  {
    img: 'onboarding2.png',
    tag: 'FLEXIBLE RIDES',
    title: 'A ride for every journey',
    desc: 'Choose from Uber Auto, sleek UberX, or spacious Premier vans with transparent, upfront pricing.'
  },
  {
    img: 'onboarding3.png',
    tag: 'SAFETY FIRST',
    title: 'Peace of mind on every trip',
    desc: 'Verified drivers, real-time trip sharing, emergency assistance, and 24/7 in-app support.'
  },
  {
    img: 'get-started.png',
    tag: 'WELCOME ABOARD',
    title: 'Ready to get moving?',
    desc: 'Set your destination, pick your ride, and let Uber take care of the rest.'
  }
];

const cars = [
  { id: 'x', title: 'UberX', subtitle: 'Affordable, everyday rides', time: '3 min away', price: 246, people: 4, badge: 'Recommended', img: 'sedan.png' },
  { id: 'premier', title: 'Premier', subtitle: 'Spacious & stylish travel', time: '5 min away', price: 394, people: 6, badge: 'Comfort', img: 'van.png' },
  { id: 'auto', title: 'Uber Auto', subtitle: 'Quick and easy auto rides', time: '2 min away', price: 181, people: 3, badge: 'Fastest', img: 'auto.png' }
];

const riders = [
  { id: 'me', name: 'You', detail: 'Personal profile', initials: 'PS', tone: 'ink' },
  { id: 'ananya', name: 'Ananya Kapoor', detail: 'Family', initials: 'AK', tone: 'peach' },
  { id: 'rahul', name: 'Rahul Mehta', detail: 'Family', initials: 'RM', tone: 'mint' }
];

const places = [
  { name: 'Phoenix Marketcity, Kurla', distance: '2.4 km away', tag: 'Popular' },
  { name: 'Bandra West, Mumbai', distance: '5.8 km away', tag: 'Recent' },
  { name: 'Chhatrapati Shivaji Maharaj Airport (T2)', distance: '7.1 km away', tag: 'Airport' },
  { name: 'Jio World Drive, BKC', distance: '4.6 km away', tag: 'Popular' },
  { name: 'Lower Parel, Mumbai', distance: '6.5 km away', tag: 'Business' }
];

const paymentMethods = [
  { id: 'upi', name: 'UPI ••• 4821', description: 'Instant & secure (Google Pay / PhonePe)' },
  { id: 'cash', name: 'Cash', description: 'Pay driver after your trip' },
  { id: 'card', name: 'Visa •••• 9042', description: 'Personal card' },
  { id: 'wallet', name: 'Uber Cash (₹450)', description: 'Preloaded balance' }
];

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
    rating: '4.9 ★',
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
    rating: '4.95 ★',
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
    rating: '4.85 ★',
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
    rating: '4.88 ★',
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
    rating: '4.8 ★',
    vehiclePlate: 'MH 04 ER 4210',
    status: 'Cancelled'
  }
];

const pickupOptions = ['Current location', 'Home · 24th Main Road', 'Work · One BKC'];

const savedOrder = JSON.parse(localStorage.getItem('uber-order-demo') || 'null');
const savedUser = JSON.parse(localStorage.getItem('uber-user') || 'null');
const hasOnboarded = localStorage.getItem('uber-onboarded') === 'true';

const state = {
  view: !hasOnboarded ? 'onboarding' : (savedOrder?.active ? 'tracking' : 'where'),
  onboardingIndex: 0,
  showLogin: false,
  isLoggedIn: savedUser ? true : false,
  user: savedUser || {
    name: 'Priya Sharma',
    phone: '+91 98201 54821',
    email: 'priya.sharma@example.com',
    rating: '4.92 ★',
    initials: 'PS',
    wallet: 450
  },
  destination: '',
  pickup: 'Current location',
  selected: 'x',
  riderId: 'me',
  payment: 'upi',
  sheet: true,
  menu: null,
  notice: '',
  arriving: savedOrder?.arriving || false,
  scheduled: null,
  promo: '',
  order: savedOrder?.order || null,
  activityFilter: 'all',
  selectedPastTrip: null,
  loginInput: '+91 98201 54821'
};

const safe = (v = '') => String(v).replace(/[&<>'"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[c]);
const money = v => `₹${v}`;
const chosen = () => cars.find(c => c.id === state.selected) || cars[0];
const rider = () => riders.find(r => r.id === state.riderId) || riders[0];
const payment = () => paymentMethods.find(p => p.id === state.payment) || paymentMethods[0];
const fare = () => Math.max(0, chosen().price - (state.promo === 'RIDE20' ? 20 : 0));

function persist(active = state.view === 'tracking') {
  localStorage.setItem('uber-order-demo', JSON.stringify({ active, arriving: state.arriving, order: state.order }));
}

function showNotice(msg) {
  state.notice = msg;
  app();
  setTimeout(() => {
    if (state.notice === msg) {
      state.notice = '';
      app();
    }
  }, 3200);
}

function avatar(p) {
  return `<span class="avatar ${p.tone || 'ink'}">${safe(p.initials || 'PS')}</span>`;
}

function app() {
  const root = document.querySelector('#root');
  if (state.view === 'onboarding') {
    root.innerHTML = onboardingView();
    bindOnboarding();
    return;
  }

  root.innerHTML = `
    <div class="app-shell">
      <header class="topbar">
        <button class="brand" data-action="home" aria-label="Uber home">Uber</button>
        <nav class="topnav">
          <button class="${['where', 'rides', 'tracking'].includes(state.view) ? 'nav-active' : ''}" data-action="view-ride">Ride</button>
          <button class="${state.view === 'activity' ? 'nav-active' : ''}" data-action="view-activity">Activity</button>
          <button class="${state.view === 'account' ? 'nav-active' : ''}" data-action="view-account">Account</button>
          <button data-action="show-onboarding">Tour</button>
        </nav>
        <div class="top-actions">
          ${state.isLoggedIn ? `
            <button class="user-chip" data-action="view-account">
              <span class="user-chip-avatar">${safe(state.user.initials)}</span>
              <span class="user-chip-name">${safe(state.user.name.split(' ')[0])}</span>
            </button>
            <button class="btn-ghost" data-action="logout">Log out</button>
          ` : `
            <button class="login" data-action="open-login">Log in</button>
            <button class="signup" data-action="open-login">Sign up</button>
          `}
        </div>
      </header>

      <main class="main-viewport ${state.view === 'activity' ? 'view-stage-activity' : state.view === 'account' ? 'view-stage-account' : ''}">
        ${state.view === 'activity' ? activityView() : state.view === 'account' ? accountView() : rideStageView()}
        ${state.selectedPastTrip ? receiptModal() : ''}
        ${state.showLogin ? loginModal() : ''}
        ${state.notice ? `<div class="toast" role="status"><span>✓</span><span>${safe(state.notice)}</span></div>` : ''}
      </main>

      <nav class="mobile-nav">
        <button class="${state.view === 'activity' ? 'active' : ''}" data-action="view-activity">
          <span class="nav-symbol">≡</span>
          <span>Activity</span>
        </button>
        <button class="${['where', 'rides', 'tracking'].includes(state.view) ? 'active' : ''}" data-action="view-ride">
          <span class="nav-symbol">⌖</span>
          <span>Ride</span>
        </button>
        <button class="${state.view === 'account' ? 'active' : ''}" data-action="view-account">
          <span class="nav-symbol">👤</span>
          <span>Account</span>
        </button>
      </nav>
    </div>
  `;
  bind();
}

function onboardingView() {
  const current = slides[state.onboardingIndex];
  const isLast = state.onboardingIndex === slides.length - 1;
  return `
    <div class="onboarding-screen">
      <header class="onboarding-top">
        <div class="onboarding-logo">Uber</div>
        <button class="onboarding-skip" data-action="skip-onboarding">Skip</button>
      </header>

      <div class="onboarding-body">
        <div class="onboarding-hero">
          <img src="${A}images/${current.img}" alt="${current.title}" class="onboarding-img"/>
        </div>

        <div class="onboarding-content">
          <span class="onboarding-tag">${current.tag}</span>
          <h1 class="onboarding-title">${current.title}</h1>
          <p class="onboarding-desc">${current.desc}</p>
        </div>

        <div class="onboarding-dots">
          ${slides.map((_, i) => `<button class="dot-btn ${i === state.onboardingIndex ? 'active' : ''}" data-slide="${i}" aria-label="Go to slide ${i + 1}"></button>`).join('')}
        </div>

        <div class="onboarding-actions">
          ${state.onboardingIndex > 0 ? `
            <button class="onboarding-prev" data-action="prev-slide" aria-label="Previous slide">‹</button>
          ` : '<span class="action-spacer"></span>'}
          <button class="onboarding-next ${isLast ? 'finish-btn' : ''}" data-action="next-slide">
            ${isLast ? 'Get started' : 'Next ›'}
          </button>
        </div>
      </div>
    </div>
  `;
}

function rideStageView() {
  return `
    <div class="map-stage ${state.view === 'tracking' ? 'trip-map' : ''}">
      ${map()}
      ${state.sheet ? bookingCard() : '<button class="open-booking" data-action="open">Where to?</button>'}
    </div>
  `;
}

function map() {
  return `
    <div class="map-grid"></div>
    <div class="neighbourhood n1"></div>
    <div class="neighbourhood n2"></div>
    <div class="map-road r1"></div>
    <div class="map-road r2"></div>
    <div class="map-road r3"></div>
    <div class="water water-a"></div>
    <div class="water water-b"></div>
    <span class="map-label label-a">Sion</span>
    <span class="map-label label-b">Kurla</span>
    <span class="map-label label-c">Bandra</span>
    <span class="map-label label-d">Chembur</span>
    <span class="map-label label-e">BKC</span>
    <div class="route route-one"></div>
    <div class="route route-two"></div>
    <div class="map-pin pickup-pin"><span></span></div>
    <div class="map-pin dest-pin"><span class="pin-symbol">📍</span></div>
    <div class="vehicle v1">🛺</div>
    <div class="vehicle v2">🚗</div>
    <div class="vehicle v3">🚐</div>
    <button class="recenter" data-action="recenter" aria-label="Recenter map">⌖</button>
    <div class="safety"><span class="safety-shield">🛡</span> Safe, reliable rides 24/7</div>
  `;
}

function bookingCard() {
  const body = state.view === 'where' ? wherePanel() : state.view === 'rides' ? ridePanel() : trackingPanel();
  return `
    <section class="booking-card ${state.view === 'tracking' ? 'tracking-card' : ''}">
      <div class="sheet-handle"></div>
      <div class="card-heading">
        <div>
          <p class="eyebrow">${state.view === 'tracking' ? 'TRIP IN PROGRESS' : state.view === 'rides' ? 'YOUR RIDE' : 'RIDE WITH UBER'}</p>
          <h1>${state.view === 'where' ? 'Where to?' : state.view === 'rides' ? 'Choose a ride' : state.arriving ? 'Driver has arrived' : 'Driver is on the way'}</h1>
        </div>
        <button class="close" data-action="close" aria-label="Close">✕</button>
      </div>
      ${body}
    </section>
  `;
}

function riderPicker() {
  const r = rider();
  return `
    <div class="rider-wrap">
      <button class="rider-chip" data-action="rider-menu">
        ${avatar(r)}
        <span><small>Riding with</small><strong>${safe(r.name)}</strong></span>
        <span class="chev">⌄</span>
      </button>
      ${state.menu === 'rider' ? `
        <div class="popover rider-popover">
          <p>Who is riding?</p>
          ${riders.map(x => `
            <button class="rider-option ${x.id === r.id ? 'current' : ''}" data-rider="${x.id}">
              ${avatar(x)}
              <span><strong>${safe(x.name)}</strong><small>${safe(x.detail)}</small></span>
              ${x.id === r.id ? '<b>✓</b>' : ''}
            </button>
          `).join('')}
          <button class="add-rider" data-action="add-rider">＋ Add a rider</button>
        </div>
      ` : ''}
    </div>
  `;
}

function wherePanel() {
  const filtered = places.filter(x => x.name.toLowerCase().includes(state.destination.toLowerCase())).slice(0, 4);
  return `
    ${riderPicker()}
    <div class="location-inputs">
      <div class="connector"></div>
      <button class="location-row pickup" data-action="pickup-menu">
        <span class="square-icon">⌖</span>
        <span><small>Pickup</small><strong>${safe(state.pickup)}</strong></span>
        <span class="mini-edit">Change</span>
      </button>
      ${state.menu === 'pickup' ? `
        <div class="pickup-menu">
          ${pickupOptions.map(p => `<button data-pickup="${safe(p)}"><span>${p === state.pickup ? '✓' : '○'}</span>${safe(p)}</button>`).join('')}
          <button data-action="locate">⌖ Use current location</button>
        </div>
      ` : ''}
      <div class="location-row input-row">
        <span class="circle-icon"></span>
        <input id="destination" value="${safe(state.destination)}" placeholder="Enter destination" autocomplete="off" aria-label="Enter destination"/>
        <span class="search-symbol">🔍</span>
      </div>
    </div>
    <div class="quick-actions">
      <button data-action="schedule">
        <span class="quick-icon">◷</span>
        <span><strong>${state.scheduled ? 'Reserved' : 'Reserve'}</strong><small>${state.scheduled || 'Ride later'}</small></span>
      </button>
      <button data-action="rider-menu">
        <span class="quick-icon">👤</span>
        <span><strong>For someone</strong><small>Choose rider</small></span>
      </button>
    </div>
    ${state.menu === 'schedule' ? schedulePanel() : ''}
    <div class="suggestion-head">
      <strong>${state.destination ? 'Matches' : 'Suggested places'}</strong>
      <button data-action="view-all">View all</button>
    </div>
    <div class="suggestions">
      ${filtered.length ? filtered.map((p, i) => `
        <button data-place="${safe(p.name)}">
          <span class="place-icon p${i % 3}">📍</span>
          <span><strong>${safe(p.name)}</strong><small>${safe(p.distance)} · ${safe(p.tag)}</small></span>
          <span class="place-arrow">›</span>
        </button>
      `).join('') : '<div class="empty-place">No destinations found. Try typing a landmark.</div>'}
    </div>
  `;
}

function schedulePanel() {
  return `
    <div class="schedule-panel">
      <p>When would you like to leave?</p>
      <div>
        <button class="schedule-choice ${!state.scheduled ? 'chosen' : ''}" data-schedule="">Now</button>
        <button class="schedule-choice ${state.scheduled === 'Today, 6:30 PM' ? 'chosen' : ''}" data-schedule="Today, 6:30 PM">Today, 6:30 PM</button>
        <button class="schedule-choice ${state.scheduled === 'Tomorrow, 9:00 AM' ? 'chosen' : ''}" data-schedule="Tomorrow, 9:00 AM">Tomorrow, 9:00 AM</button>
      </div>
    </div>
  `;
}

function rideArt(c) {
  return `<div class="car-art ${c.id}"><img src="${A}images/${c.img}" alt="${c.title} vehicle"/></div>`;
}

function ridePanel() {
  const c = chosen();
  return `
    ${riderPicker()}
    <button class="trip-summary" data-action="back">
      <span class="summary-dots"><i></i><b></b></span>
      <span><small>From</small>${safe(state.pickup)}<small>To</small>${safe(state.destination)}</span>
      <span class="trip-edit">Edit</span>
    </button>
    ${state.scheduled ? `<div class="reserve-note">◷ Reserved for ${safe(state.scheduled)}</div>` : ''}
    <div class="ride-list">
      ${cars.map(car => `
        <button class="ride-option ${car.id === c.id ? 'selected' : ''}" data-car="${car.id}">
          ${rideArt(car)}
          <div class="ride-info">
            <strong>${car.title} <span class="passengers">👤 ${car.people}</span></strong>
            <span>${car.time}</span>
            <small>${car.subtitle}</small>
            ${car.badge ? `<em>${car.badge}</em>` : ''}
          </div>
          <div class="fare">
            <b>${money(car.price - (state.promo === 'RIDE20' ? 20 : 0))}</b>
            <small>incl. taxes</small>
          </div>
          <span class="radio"></span>
        </button>
      `).join('')}
    </div>
    <button class="payment-row" data-action="payment-menu">
      <span class="payment-icon">💳</span>
      <span><small>Payment</small><strong>${safe(payment().name)}</strong></span>
      <span>⌄</span>
    </button>
    ${state.menu === 'payment' ? paymentPanel() : ''}
    <button class="promo-row" data-action="promo">
      <span>🏷 ${state.promo ? 'RIDE20 applied — ₹20 off' : 'Add promo code'}</span>
      <b>${state.promo ? '✓' : '›'}</b>
    </button>
    ${state.menu === 'promo' ? `
      <form class="promo-box" id="promo-form">
        <input id="promo-input" placeholder="Try RIDE20" value="${safe(state.promo)}"/>
        <button>Apply</button>
      </form>
    ` : ''}
    <button class="black-btn" data-action="request">
      ${state.scheduled ? 'Reserve' : 'Request'} ${c.title}
      <span>${money(fare())}</span>
    </button>
    <p class="fare-note">${state.scheduled ? 'We’ll notify you before your driver arrives.' : 'You will not be charged until the ride completes.'}</p>
  `;
}

function paymentPanel() {
  return `
    <div class="popover payment-popover">
      ${paymentMethods.map(p => `
        <button data-payment="${p.id}" class="${p.id === state.payment ? 'current' : ''}">
          <span><strong>${safe(p.name)}</strong><small>${safe(p.description)}</small></span>
          ${p.id === state.payment ? '<b>✓</b>' : ''}
        </button>
      `).join('')}
      <button class="add-payment" data-action="add-payment">＋ Add payment method</button>
    </div>
  `;
}

function trackingPanel() {
  const c = chosen(), r = rider(), orderTime = state.order?.id || 'UB-9432';
  return `
    <div class="tracking-hero">
      <img src="${A}images/${c.img}" alt="Vehicle approaching"/>
      <div class="vehicle-badge">${c.title} · ${money(fare())}</div>
      <span class="live-dot">LIVE</span>
    </div>
    <div class="eta-block">
      <div>
        <span class="eta-time">${state.arriving ? 'Arrived' : state.scheduled ? 'On time' : '3 min'}</span>
        <small>${state.arriving ? 'Meet at your pickup point' : state.scheduled ? `Pickup ${state.scheduled}` : 'Estimated arrival'}</small>
      </div>
      <div class="progress">
        <i class="complete"></i>
        <i class="complete"></i>
        <i class="${state.arriving ? 'complete' : ''}"></i>
      </div>
    </div>
    <div class="driver-row">
      <span class="driver-avatar">RK</span>
      <div>
        <strong>Ravi Kumar <span>4.9 ★</span></strong>
        <small>White Suzuki Dzire · MH 01 CR 2846</small>
      </div>
      <button class="contact" data-action="contact">💬 <span>Message</span></button>
    </div>
    <div class="trip-for">
      ${avatar(r)}
      <span><small>Ride booked for</small><strong>${safe(r.name)}</strong></span>
      <button data-action="rider-menu">Change</button>
    </div>
    ${state.menu === 'rider' ? `
      <div class="popover tracking-rider">
        ${riders.map(x => `<button data-rider="${x.id}">${safe(x.name)}${x.id === r.id ? ' ✓' : ''}</button>`).join('')}
      </div>
    ` : ''}
    <div class="trip-detail">
      <span>Order ${orderTime}</span>
      <span>${safe(payment().name)}</span>
    </div>
    <div class="tracking-actions">
      <button data-action="arrive">${state.arriving ? 'Start demo trip' : 'Simulate arrival'}</button>
      <button data-action="cancel">Cancel ride</button>
    </div>
  `;
}

function activityView() {
  const filteredTrips = pastTripsData.filter(t => {
    if (state.activityFilter === 'completed') return t.status === 'Completed';
    if (state.activityFilter === 'cancelled') return t.status === 'Cancelled';
    return true;
  });

  return `
    <div class="activity-stage">
      <div class="activity-container">
        <div class="activity-header">
          <div>
            <h1>Activity</h1>
            <p>Review past trips, rebook your favorites, or view receipts</p>
          </div>
          <div class="activity-tabs">
            <button class="act-tab ${state.activityFilter === 'all' ? 'active' : ''}" data-act-filter="all">All</button>
            <button class="act-tab ${state.activityFilter === 'completed' ? 'active' : ''}" data-act-filter="completed">Completed</button>
            <button class="act-tab ${state.activityFilter === 'cancelled' ? 'active' : ''}" data-act-filter="cancelled">Cancelled</button>
          </div>
        </div>

        ${state.order ? `
          <div class="active-trip-banner">
            <div class="active-trip-left">
              <span class="active-pulse">● LIVE TRIP</span>
              <strong>Trip to ${safe(state.order.destination)}</strong>
              <small>${state.arriving ? 'Driver arrived' : 'Driver on the way · ' + chosen().title}</small>
            </div>
            <button class="black-btn sm-btn" data-action="view-ride">Track ride</button>
          </div>
        ` : ''}

        <div class="trips-grid">
          ${filteredTrips.map(trip => `
            <article class="trip-card">
              <div class="trip-card-top">
                <div class="trip-car-thumb">
                  <img src="${A}images/${trip.img}" alt="${trip.carName}"/>
                </div>
                <div class="trip-main-info">
                  <div class="trip-car-header">
                    <strong>${safe(trip.carName)}</strong>
                    <span class="trip-fare">${money(trip.fare)}</span>
                  </div>
                  <span class="trip-time">${safe(trip.date)}</span>
                  <span class="trip-status-tag ${trip.status.toLowerCase()}">${trip.status}</span>
                </div>
              </div>

              <div class="trip-route-box">
                <div class="route-line-dots">
                  <i></i>
                  <b></b>
                </div>
                <div class="route-names">
                  <span>${safe(trip.from)}</span>
                  <span>${safe(trip.to)}</span>
                </div>
              </div>

              <div class="trip-card-footer">
                <button class="btn-ghost-sm" data-trip-detail="${trip.id}">View receipt</button>
                <button class="rebook-btn" data-rebook="${trip.id}">Rebook ↺</button>
              </div>
            </article>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

function receiptModal() {
  const trip = state.selectedPastTrip;
  if (!trip) return '';
  return `
    <div class="modal-backdrop" data-action="close-modal">
      <div class="receipt-card" onclick="event.stopPropagation()">
        <div class="receipt-header">
          <div>
            <span class="receipt-tag">${trip.status.toUpperCase()}</span>
            <h2>Trip Receipt</h2>
            <small>${trip.id} · ${trip.date}</small>
          </div>
          <button class="close-btn" data-action="close-modal">✕</button>
        </div>

        <div class="receipt-vehicle">
          <div class="car-art"><img src="${A}images/${trip.img}" alt="${trip.carName}"/></div>
          <div>
            <strong>${trip.carName}</strong>
            <small>Driver: ${trip.driver} (${trip.rating}) · ${trip.vehiclePlate}</small>
          </div>
        </div>

        <div class="receipt-route">
          <div><small>Pickup</small><strong>${trip.from}</strong></div>
          <div><small>Dropoff</small><strong>${trip.to}</strong></div>
        </div>

        <div class="receipt-breakdown">
          <div><span>Trip Fare</span><b>${money(trip.fare - 32)}</b></div>
          <div><span>Taxes & Fees</span><b>${money(32)}</b></div>
          <div><span>Distance & Time</span><b>${trip.distance} · ${trip.duration}</b></div>
          <div class="total-row"><span>Total Paid</span><b>${money(trip.fare)}</b></div>
          <small class="pay-method">Charged to: UPI ••• 4821</small>
        </div>

        <div class="receipt-actions">
          <button class="black-btn" data-rebook="${trip.id}">Book this ride again</button>
        </div>
      </div>
    </div>
  `;
}

function accountView() {
  const u = state.user;
  return `
    <div class="account-stage">
      <div class="account-container">
        <div class="account-hero">
          <div class="account-avatar">${safe(u.initials)}</div>
          <div class="account-details">
            <div class="account-name-row">
              <h1>${safe(u.name)}</h1>
              <span class="account-rating">★ 4.92</span>
            </div>
            <p>${safe(u.phone)} · ${safe(u.email)}</p>
            <span class="account-member">Uber One Member · Since 2021</span>
          </div>
          <button class="btn-ghost" data-action="edit-profile">Edit</button>
        </div>

        <div class="wallet-card">
          <div class="wallet-left">
            <span class="wallet-label">Uber Cash Balance</span>
            <div class="wallet-amount">${money(u.wallet || 450)}.00</div>
            <small>Auto-refill: Off · Ready to use</small>
          </div>
          <button class="wallet-add-btn" data-action="add-funds">＋ Add funds</button>
        </div>

        <div class="account-sections">
          <section class="acc-card">
            <h3>Saved Places</h3>
            <div class="acc-list">
              <div class="acc-item">
                <span class="acc-item-icon">🏠</span>
                <div><strong>Home</strong><small>24th Main Road, Bandra West, Mumbai</small></div>
                <button class="item-action" data-book-saved="Home · 24th Main Road">Ride</button>
              </div>
              <div class="acc-item">
                <span class="acc-item-icon">💼</span>
                <div><strong>Work</strong><small>One BKC, G Block, BKC, Mumbai</small></div>
                <button class="item-action" data-book-saved="Work · One BKC">Ride</button>
              </div>
            </div>
          </section>

          <section class="acc-card">
            <h3>Payment Methods</h3>
            <div class="acc-list">
              <div class="acc-item">
                <span class="acc-item-icon">📱</span>
                <div><strong>UPI AutoPay</strong><small>Google Pay · priya@oksbi (Default)</small></div>
                <span class="badge-pill">Default</span>
              </div>
              <div class="acc-item">
                <span class="acc-item-icon">💳</span>
                <div><strong>Visa Card</strong><small>Ending in 9042 · Personal</small></div>
              </div>
              <div class="acc-item">
                <span class="acc-item-icon">💵</span>
                <div><strong>Cash</strong><small>Pay directly to driver</small></div>
              </div>
            </div>
          </section>

          <section class="acc-card">
            <h3>Preferences & Safety</h3>
            <div class="acc-list">
              <div class="acc-item interactive" data-action="safety-checkup">
                <span class="acc-item-icon">🛡</span>
                <div><strong>Safety Checkup</strong><small>Trusted contacts, RideCheck, 4-digit PIN</small></div>
                <span class="chevron">›</span>
              </div>
              <div class="acc-item interactive" data-action="show-onboarding">
                <span class="acc-item-icon">🎬</span>
                <div><strong>Replay Onboarding Slideshow</strong><small>Walk through app features & vehicle options</small></div>
                <span class="chevron">›</span>
              </div>
              <div class="acc-item interactive" data-action="logout">
                <span class="acc-item-icon">🚪</span>
                <div><strong class="text-danger">${state.isLoggedIn ? 'Log out' : 'Switch demo account'}</strong><small>Reset demo credentials</small></div>
                <span class="chevron">›</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  `;
}

function loginModal() {
  return `
    <div class="modal-backdrop" data-action="close-modal">
      <div class="login-card" onclick="event.stopPropagation()">
        <button class="close-btn" data-action="close-modal">✕</button>
        <div class="login-header">
          <div class="brand">Uber</div>
          <h2>Welcome to Uber</h2>
          <p>Sign in to unlock upfront fares, live tracking, and saved trips.</p>
        </div>

        <form class="login-form" id="login-form">
          <div class="input-wrap">
            <span class="country-prefix">🇮🇳 +91</span>
            <input id="login-phone" type="tel" value="98201 54821" placeholder="Enter mobile number" required/>
          </div>
          <button type="submit" class="black-btn full-btn">Continue</button>
        </form>

        <div class="login-divider"><span>or try demo profile</span></div>

        <button class="demo-login-btn" data-action="quick-login">
          <span class="demo-avatar">PS</span>
          <div>
            <strong>Priya Sharma (Demo Profile)</strong>
            <small>+91 98201 54821 · 4.92 ★ rating</small>
          </div>
          <span class="arrow">›</span>
        </button>

        <p class="login-disclaimer">By continuing, you agree to receive SMS & demo notifications for your rides.</p>
      </div>
    </div>
  `;
}

function openRideChoices() {
  if (!state.destination.trim()) return showNotice('Choose a destination first');
  state.view = 'rides';
  state.menu = null;
  app();
}

function bindOnboarding() {
  const q = s => document.querySelector(s);
  q('[data-action="skip-onboarding"]')?.addEventListener('click', () => {
    localStorage.setItem('uber-onboarded', 'true');
    state.view = 'where';
    app();
    showNotice('Welcome to Uber!');
  });

  q('[data-action="next-slide"]')?.addEventListener('click', () => {
    if (state.onboardingIndex < slides.length - 1) {
      state.onboardingIndex++;
      app();
    } else {
      localStorage.setItem('uber-onboarded', 'true');
      state.view = 'where';
      if (!state.isLoggedIn) {
        state.showLogin = true;
      }
      app();
      showNotice('Welcome! Choose a destination to start.');
    }
  });

  q('[data-action="prev-slide"]')?.addEventListener('click', () => {
    if (state.onboardingIndex > 0) {
      state.onboardingIndex--;
      app();
    }
  });

  document.querySelectorAll('[data-slide]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.onboardingIndex = Number(btn.dataset.slide);
      app();
    });
  });
}

function bind() {
  const q = s => document.querySelector(s);

  // Navigation
  q('[data-action="view-ride"]')?.addEventListener('click', () => {
    state.view = state.order ? 'tracking' : 'where';
    state.sheet = true;
    state.menu = null;
    app();
  });
  q('[data-action="view-activity"]')?.addEventListener('click', () => {
    state.view = 'activity';
    state.menu = null;
    app();
  });
  q('[data-action="view-account"]')?.addEventListener('click', () => {
    state.view = 'account';
    state.menu = null;
    app();
  });
  q('[data-action="home"]')?.addEventListener('click', () => {
    state.view = 'where';
    state.sheet = true;
    state.menu = null;
    app();
  });
  q('[data-action="show-onboarding"]')?.addEventListener('click', () => {
    state.view = 'onboarding';
    state.onboardingIndex = 0;
    app();
  });

  // Login & auth
  q('[data-action="open-login"]')?.addEventListener('click', () => {
    state.showLogin = true;
    app();
  });
  q('[data-action="quick-login"]')?.addEventListener('click', () => {
    state.isLoggedIn = true;
    state.showLogin = false;
    localStorage.setItem('uber-user', JSON.stringify(state.user));
    showNotice('Signed in as Priya Sharma');
  });
  q('[data-action="logout"]')?.addEventListener('click', () => {
    state.isLoggedIn = false;
    localStorage.removeItem('uber-user');
    showNotice('Logged out. You can sign in anytime.');
  });
  q('#login-form')?.addEventListener('submit', e => {
    e.preventDefault();
    state.isLoggedIn = true;
    state.showLogin = false;
    localStorage.setItem('uber-user', JSON.stringify(state.user));
    showNotice('Signed in successfully');
  });

  // Modals
  q('[data-action="close-modal"]')?.addEventListener('click', () => {
    state.showLogin = false;
    state.selectedPastTrip = null;
    app();
  });

  // Booking Card controls
  q('[data-action="close"]')?.addEventListener('click', () => { state.sheet = false; app(); });
  q('[data-action="open"]')?.addEventListener('click', () => { state.sheet = true; app(); });
  q('[data-action="back"]')?.addEventListener('click', () => { state.view = 'where'; state.menu = null; app(); });

  // Popover menus
  q('[data-action="rider-menu"]')?.addEventListener('click', () => { state.menu = state.menu === 'rider' ? null : 'rider'; app(); });
  q('[data-action="pickup-menu"]')?.addEventListener('click', () => { state.menu = state.menu === 'pickup' ? null : 'pickup'; app(); });
  q('[data-action="payment-menu"]')?.addEventListener('click', () => { state.menu = state.menu === 'payment' ? null : 'payment'; app(); });
  q('[data-action="schedule"]')?.addEventListener('click', () => { state.menu = state.menu === 'schedule' ? null : 'schedule'; app(); });
  q('[data-action="promo"]')?.addEventListener('click', () => { state.menu = state.menu === 'promo' ? null : 'promo'; app(); });

  // Quick actions
  q('[data-action="locate"]')?.addEventListener('click', () => {
    state.pickup = 'Current location';
    state.menu = null;
    showNotice('Pickup set to current location');
  });
  q('[data-action="recenter"]')?.addEventListener('click', () => showNotice('Map centered on your location'));
  q('[data-action="view-all"]')?.addEventListener('click', () => showNotice('Showing popular pickup points'));
  q('[data-action="add-rider"]')?.addEventListener('click', () => showNotice('Family profile added'));
  q('[data-action="add-payment"]')?.addEventListener('click', () => showNotice('Payment gateway ready'));
  q('[data-action="add-funds"]')?.addEventListener('click', () => {
    state.user.wallet = (state.user.wallet || 450) + 200;
    localStorage.setItem('uber-user', JSON.stringify(state.user));
    showNotice('₹200 added to your Uber Cash balance');
  });
  q('[data-action="safety-checkup"]')?.addEventListener('click', () => showNotice('Safety checkup: All systems verified'));
  q('[data-action="edit-profile"]')?.addEventListener('click', () => showNotice('Profile is up to date'));

  // Trip requests
  q('[data-action="request"]')?.addEventListener('click', () => {
    state.order = { id: `UB-${Math.floor(1000 + Math.random() * 8999)}`, destination: state.destination, createdAt: Date.now() };
    state.view = 'tracking';
    state.arriving = false;
    state.menu = null;
    persist(true);
    showNotice(`${state.scheduled ? 'Ride reserved' : chosen().title + ' confirmed'} for ${rider().name}`);
  });
  q('[data-action="arrive"]')?.addEventListener('click', () => {
    state.arriving = !state.arriving;
    persist(true);
    showNotice(state.arriving ? 'Driver has arrived at your pickup point' : 'Trip started — have a pleasant ride!');
  });
  q('[data-action="cancel"]')?.addEventListener('click', () => {
    state.view = 'where';
    state.destination = '';
    state.arriving = false;
    state.scheduled = null;
    state.menu = null;
    state.order = null;
    persist(false);
    showNotice('Ride cancelled without fees.');
  });
  q('[data-action="contact"]')?.addEventListener('click', () => showNotice('Sent message to driver: "I\'m on my way"'));

  // Lists & selections
  document.querySelectorAll('[data-rider]').forEach(b => b.addEventListener('click', () => { state.riderId = b.dataset.rider; state.menu = null; app(); }));
  document.querySelectorAll('[data-car]').forEach(b => b.addEventListener('click', () => { state.selected = b.dataset.car; app(); }));
  document.querySelectorAll('[data-place]').forEach(b => b.addEventListener('click', () => { state.destination = b.dataset.place; openRideChoices(); }));
  document.querySelectorAll('[data-pickup]').forEach(b => b.addEventListener('click', () => { state.pickup = b.dataset.pickup; state.menu = null; app(); }));
  document.querySelectorAll('[data-payment]').forEach(b => b.addEventListener('click', () => { state.payment = b.dataset.payment; state.menu = null; app(); }));
  document.querySelectorAll('[data-schedule]').forEach(b => b.addEventListener('click', () => { state.scheduled = b.dataset.schedule || null; state.menu = null; app(); }));

  // Activity filters & rebook
  document.querySelectorAll('[data-act-filter]').forEach(b => b.addEventListener('click', () => {
    state.activityFilter = b.dataset.actFilter;
    app();
  }));

  document.querySelectorAll('[data-trip-detail]').forEach(b => b.addEventListener('click', () => {
    state.selectedPastTrip = pastTripsData.find(t => t.id === b.dataset.tripDetail);
    app();
  }));

  document.querySelectorAll('[data-rebook]').forEach(b => b.addEventListener('click', () => {
    const t = pastTripsData.find(x => x.id === b.dataset.rebook);
    if (t) {
      state.selectedPastTrip = null;
      state.destination = t.to;
      state.pickup = t.from;
      state.selected = t.carId;
      state.view = 'rides';
      state.sheet = true;
      app();
      showNotice(`Rebooking ${t.carName} to ${t.to}`);
    }
  }));

  document.querySelectorAll('[data-book-saved]').forEach(b => b.addEventListener('click', () => {
    state.destination = b.dataset.bookSaved;
    openRideChoices();
  }));

  // Promo form
  q('#promo-form')?.addEventListener('submit', event => {
    event.preventDefault();
    const code = q('#promo-input').value.trim().toUpperCase();
    if (code === 'RIDE20') {
      state.promo = code;
      state.menu = null;
      showNotice('RIDE20 applied — saved ₹20!');
    } else {
      showNotice('Invalid promo code. Try RIDE20');
    }
  });

  // Destination search
  const input = q('#destination');
  if (input) {
    input.addEventListener('input', event => {
      state.destination = event.target.value;
      const pos = event.target.selectionStart;
      app();
      const next = q('#destination');
      next.focus();
      next.setSelectionRange(pos, pos);
    });
    input.addEventListener('keydown', event => {
      if (event.key === 'Enter') openRideChoices();
    });
  }
}

app();
