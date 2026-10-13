import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { sound } from '../utils/audio.js';

// Known coordinates in Mumbai
const KNOWN_LOCATIONS = {
  'current location': [19.0596, 72.8295], // Bandra West
  'bandra': [19.0596, 72.8295],
  'bandra kurla complex (bkc)': [19.0657, 72.8687],
  'bkc': [19.0657, 72.8687],
  'chhatrapati shivaji maharaj international airport': [19.0896, 72.8656],
  'airport': [19.0896, 72.8656],
  'phoenix palladium mall, lower parel': [18.9953, 72.8242],
  'lower parel': [18.9953, 72.8242],
  'gateway of india, colaba': [18.9220, 72.8347],
  'colaba': [18.9220, 72.8347],
  'powai hiranandani gardens': [19.1176, 72.9060],
  'powai': [19.1176, 72.9060],
  'home': [19.0596, 72.8295],
  'work': [19.0657, 72.8687],
  'sion': [19.0435, 72.8631],
  'kurla': [19.0688, 72.8797],
  'dadar': [19.0178, 72.8478]
};

function resolveCoords(query, fallbackOffset = 0) {
  if (!query) return [19.0896, 72.8656];
  const q = query.toLowerCase().trim();
  for (const [key, coords] of Object.entries(KNOWN_LOCATIONS)) {
    if (q.includes(key) || key.includes(q)) {
      return coords;
    }
  }
  let hash = 0;
  for (let i = 0; i < q.length; i++) hash = (hash << 5) - hash + q.charCodeAt(i);
  const latOffset = ((Math.abs(hash) % 40) - 20) / 1000 + fallbackOffset;
  const lngOffset = (((Math.abs(hash >> 3)) % 40) - 20) / 1000 + fallbackOffset;
  return [19.0596 + latOffset, 72.8295 + lngOffset];
}

function generateRoutePoints(start, end) {
  const [lat1, lng1] = start;
  const [lat2, lng2] = end;

  const midLat = lat1 + (lat2 - lat1) * 0.45;
  const midLng = lng1 + (lng2 - lng1) * 0.55;

  return [
    [lat1, lng1],
    [lat1 + (midLat - lat1) * 0.5, lng1 + 0.003],
    [midLat, midLng],
    [lat2 - (lat2 - midLat) * 0.4, midLng - 0.002],
    [lat2, lng2]
  ];
}

// Generate realistic turn-by-turn approach path from driver spawn to pickup
function generateApproachWaypoints(driverSpawn, pickupCoords) {
  const [lat1, lng1] = driverSpawn;
  const [lat2, lng2] = pickupCoords;
  const waypoints = [];
  const count = 12;

  for (let i = 0; i <= count; i++) {
    const t = i / count;
    // Add realistic subtle road turns
    const wave = Math.sin(t * Math.PI) * 0.0016;
    const wave2 = Math.cos(t * Math.PI * 1.5) * 0.0007;
    const lat = lat1 + (lat2 - lat1) * t + wave;
    const lng = lng1 + (lng2 - lng1) * t + wave2;
    waypoints.push([lat, lng]);
  }
  // Ensure last point is exactly pickup
  waypoints[count] = pickupCoords;
  return waypoints;
}

// Calculate angle in degrees from p1 to p2
function calculateHeading(p1, p2) {
  const dLat = p2[0] - p1[0];
  const dLng = p2[1] - p1[1];
  // In screen space (y down), latitude increases upward, so dy is -dLat
  // Base top-view images have vehicle headlights on the RIGHT (0 deg)
  const angleRad = Math.atan2(-dLat, dLng);
  let angleDeg = (angleRad * 180) / Math.PI;
  return angleDeg;
}

export default function InteractiveMap({
  bookingState,
  pickup,
  destination,
  selectedCarId,
  arrived,
  tripStatus, // 'approaching' | 'arrived' | 'in_progress' | 'completed'
  onDriverArrived,
  onTripCompleted,
  theme = 'light'
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const routeLayerRef = useRef(null);
  const approachLayerRef = useRef(null);
  const surgeLayersRef = useRef([]);
  const pickupMarkerRef = useRef(null);
  const destMarkerRef = useRef(null);
  const trackingCarMarkerRef = useRef(null);

  // Idle vehicle markers and simulation data
  const idleCarsRef = useRef([]);
  const idleVehiclesDataRef = useRef([]);
  const idleTimerRef = useRef(null);

  // Driver approach animation refs
  const approachWaypointsRef = useRef([]);
  const driverStepRef = useRef(0);
  const approachTimerRef = useRef(null);

  // Surge toggle state
  const [showSurge, setShowSurge] = useState(false);

  // Vehicle top-view images
  const upperImages = {
    x: '/src/assets/images/upper_view_sedan.png',
    premier: '/src/assets/images/upper_view_van.png',
    auto: '/src/assets/images/upper_view_auto.png'
  };

  const vehicleSizes = {
    x: [52, 26],
    premier: [56, 28],
    auto: [44, 26]
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const initialPickup = resolveCoords(pickup || 'Bandra West');

    const map = L.map(mapContainerRef.current, {
      center: initialPickup,
      zoom: 14,
      zoomControl: false,
      attributionControl: false
    });

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: ''
    }).addTo(map);

    L.control.zoom({ position: 'topright' }).addTo(map);

    mapInstanceRef.current = map;

    const handleResize = () => {
      map.invalidateSize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (idleTimerRef.current) clearInterval(idleTimerRef.current);
      if (approachTimerRef.current) clearInterval(approachTimerRef.current);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Surge Pricing Layer Toggle
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Remove existing surge layers
    surgeLayersRef.current.forEach(layer => map.removeLayer(layer));
    surgeLayersRef.current = [];

    if (showSurge) {
      const surgeZones = [
        {
          center: [19.0657, 72.8687], // BKC
          radius: 900,
          mult: '1.3x',
          name: 'Bandra Kurla Complex',
          color: '#e24438'
        },
        {
          center: [19.0896, 72.8656], // Airport
          radius: 1200,
          mult: '1.5x',
          name: 'Mumbai Airport (T2)',
          color: '#d32f2f'
        },
        {
          center: [18.9953, 72.8242], // Lower Parel
          radius: 800,
          mult: '1.2x',
          name: 'Lower Parel Business Hub',
          color: '#f59e0b'
        }
      ];

      surgeZones.forEach(zone => {
        const circle = L.circle(zone.center, {
          radius: zone.radius,
          color: zone.color,
          weight: 2,
          opacity: 0.8,
          fillColor: zone.color,
          fillOpacity: 0.16,
          dashArray: '6, 6'
        }).addTo(map);

        const badgeIcon = L.divIcon({
          className: 'surge-badge-wrapper',
          html: `
            <div class="surge-badge" style="border-left: 3px solid ${zone.color};">
              <span class="surge-mult">🔥 ${zone.mult}</span>
              <span class="surge-name">${zone.name}</span>
            </div>
          `,
          iconSize: [140, 36],
          iconAnchor: [70, 18]
        });

        const badgeMarker = L.marker(zone.center, { icon: badgeIcon }).addTo(map);
        surgeLayersRef.current.push(circle, badgeMarker);
      });
    }
  }, [showSurge]);

  // Main Map Render Effect (Markers, Polylines, Vehicles)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const pickupCoords = resolveCoords(pickup || 'Bandra West');
    const hasDest = !!destination && destination.trim().length > 0;
    const destCoords = hasDest ? resolveCoords(destination, 0.015) : null;

    // 1. Pickup Marker
    if (!pickupMarkerRef.current) {
      const pickupIcon = L.divIcon({
        className: 'leaflet-pickup-wrapper',
        html: `
          <div class="uber-pin-pickup">
            <span class="pulse-ring"></span>
            <span class="pickup-dot"></span>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });
      pickupMarkerRef.current = L.marker(pickupCoords, { icon: pickupIcon }).addTo(map);
    } else {
      pickupMarkerRef.current.setLatLng(pickupCoords);
    }

    // 2. Destination Marker & Route
    if (routeLayerRef.current) {
      map.removeLayer(routeLayerRef.current);
      routeLayerRef.current = null;
    }

    if (destMarkerRef.current) {
      map.removeLayer(destMarkerRef.current);
      destMarkerRef.current = null;
    }

    if (hasDest && destCoords) {
      const destIcon = L.divIcon({
        className: 'leaflet-dest-wrapper',
        html: `
          <div class="uber-pin-dest">
            <img src="/src/assets/icons/marker.png" alt="Destination" />
          </div>
        `,
        iconSize: [30, 36],
        iconAnchor: [15, 34]
      });
      destMarkerRef.current = L.marker(destCoords, { icon: destIcon }).addTo(map);

      const points = generateRoutePoints(pickupCoords, destCoords);

      const glowLine = L.polyline(points, {
        color: '#276ef1',
        weight: 8,
        opacity: 0.22,
        lineCap: 'round',
        lineJoin: 'round'
      });

      const mainLine = L.polyline(points, {
        color: '#276ef1',
        weight: 4.5,
        opacity: 0.95,
        lineCap: 'round',
        lineJoin: 'round'
      });

      routeLayerRef.current = L.featureGroup([glowLine, mainLine]).addTo(map);

      const bounds = L.latLngBounds([pickupCoords, destCoords]);
      map.flyToBounds(bounds, {
        paddingTopLeft: [60, 60],
        paddingBottomRight: [60, 240],
        maxZoom: 15,
        animate: true,
        duration: 0.8
      });
    } else if (bookingState !== 'tracking') {
      map.flyTo(pickupCoords, 14, { animate: true, duration: 0.6 });
    }

    // 3. Clear existing timers
    if (idleTimerRef.current) clearInterval(idleTimerRef.current);
    if (approachTimerRef.current) clearInterval(approachTimerRef.current);

    if (approachLayerRef.current) {
      map.removeLayer(approachLayerRef.current);
      approachLayerRef.current = null;
    }

    // Remove tracking car if exists
    if (trackingCarMarkerRef.current) {
      map.removeLayer(trackingCarMarkerRef.current);
      trackingCarMarkerRef.current = null;
    }

    // 4. Mode Branching: Tracking vs Browsing
    const carImg = upperImages[selectedCarId] || upperImages.x;
    const [carW, carH] = vehicleSizes[selectedCarId] || vehicleSizes.x;

    if (bookingState === 'tracking') {
      // Clear idle vehicles in tracking mode for focus
      idleCarsRef.current.forEach(m => map.removeLayer(m));
      idleCarsRef.current = [];

      // Driver spawn coordinate (~600m northeast of pickup)
      const driverSpawn = [pickupCoords[0] + 0.0058, pickupCoords[1] + 0.0062];
      const waypoints = generateApproachWaypoints(driverSpawn, pickupCoords);
      approachWaypointsRef.current = waypoints;

      // Draw driver approach path (dashed blue line)
      if (!arrived && tripStatus !== 'in_progress' && tripStatus !== 'completed') {
        const approachPolyline = L.polyline(waypoints, {
          color: '#276ef1',
          weight: 4,
          opacity: 0.85,
          dashArray: '8, 8',
          lineCap: 'round'
        });
        approachLayerRef.current = approachPolyline.addTo(map);
      }

      // Initial position
      const initialPos = arrived ? pickupCoords : waypoints[0];
      const initialHeading = waypoints.length > 1
        ? calculateHeading(waypoints[0], waypoints[1])
        : 0;

      const trackingCarIcon = L.divIcon({
        className: 'leaflet-car-wrapper',
        html: `
          <div class="uber-car-topview driver-animated ${arrived ? 'arrived-glow' : ''}" style="transform: rotate(${initialHeading}deg); width: ${carW}px; height: ${carH}px;">
            <img src="${carImg}" alt="Driver Vehicle" style="width: 100%; height: 100%; object-fit: contain;" />
            <div class="headlight-beam"></div>
          </div>
        `,
        iconSize: [carW, carH],
        iconAnchor: [carW / 2, carH / 2]
      });

      const driverMarker = L.marker(initialPos, { icon: trackingCarIcon }).addTo(map);
      trackingCarMarkerRef.current = driverMarker;

      // If not arrived yet, start the turn-by-turn driving simulation!
      if (!arrived && tripStatus !== 'in_progress' && tripStatus !== 'completed') {
        driverStepRef.current = 0;

        approachTimerRef.current = setInterval(() => {
          driverStepRef.current += 1;
          const step = driverStepRef.current;
          const total = waypoints.length - 1;

          if (step <= total) {
            const currentPoint = waypoints[step];
            const nextPoint = step < total ? waypoints[step + 1] : pickupCoords;
            const heading = calculateHeading(currentPoint, nextPoint);

            driverMarker.setLatLng(currentPoint);

            const el = driverMarker.getElement();
            if (el) {
              const carEl = el.querySelector('.uber-car-topview');
              if (carEl) {
                carEl.style.transform = `rotate(${heading}deg)`;
              }
            }

            // Update approach line to shrink as driver progresses
            if (approachLayerRef.current) {
              const remainingWaypoints = waypoints.slice(step);
              approachLayerRef.current.setLatLngs(remainingWaypoints);
            }

            // When reaching final step -> ARRIVAL EVENT!
            if (step >= total) {
              clearInterval(approachTimerRef.current);
              if (approachLayerRef.current) {
                map.removeLayer(approachLayerRef.current);
                approachLayerRef.current = null;
              }
              const el = driverMarker.getElement();
              if (el) {
                const carEl = el.querySelector('.uber-car-topview');
                if (carEl) carEl.classList.add('arrived-glow');
              }
              sound.playChime('arrived');
              if (onDriverArrived) onDriverArrived();
            }
          }
        }, 2200); // Advances smoothly every 2.2s
      }
    } else {
      // Browsing / Selection mode: Real-time patrolling idle vehicles
      // Initialize 8 vehicles near pickup
      const configs = [
        { id: 1, carType: 'auto', offset: [0.0028, -0.0035], heading: 45, speed: 0.00007 },
        { id: 2, carType: 'x', offset: [-0.0032, 0.0025], heading: -20, speed: 0.00008 },
        { id: 3, carType: 'x', offset: [0.0018, 0.0042], heading: 160, speed: 0.00006 },
        { id: 4, carType: 'auto', offset: [-0.0055, -0.0048], heading: 75, speed: 0.00009 },
        { id: 5, carType: 'premier', offset: [0.0062, 0.0028], heading: -60, speed: 0.00006 },
        { id: 6, carType: 'x', offset: [-0.0044, 0.0065], heading: 120, speed: 0.00008 },
        { id: 7, carType: 'auto', offset: [0.0075, -0.0058], heading: -110, speed: 0.00007 },
        { id: 8, carType: 'premier', offset: [-0.0068, -0.0022], heading: 15, speed: 0.00006 }
      ];

      // Remove previous idle markers
      idleCarsRef.current.forEach(m => map.removeLayer(m));
      idleCarsRef.current = [];

      const vehiclesData = configs.map(c => {
        const [w, h] = vehicleSizes[c.carType] || vehicleSizes.x;
        const img = upperImages[c.carType] || upperImages.x;
        const pos = [pickupCoords[0] + c.offset[0], pickupCoords[1] + c.offset[1]];

        const icon = L.divIcon({
          className: 'leaflet-car-wrapper',
          html: `
            <div class="uber-car-topview idle" style="transform: rotate(${c.heading}deg); width: ${w}px; height: ${h}px;">
              <img src="${img}" alt="Nearby Vehicle" style="width: 100%; height: 100%; object-fit: contain;" />
            </div>
          `,
          iconSize: [w, h],
          iconAnchor: [w / 2, h / 2]
        });

        const marker = L.marker(pos, { icon }).addTo(map);
        idleCarsRef.current.push(marker);

        return {
          id: c.id,
          pos: [...pos],
          heading: c.heading,
          speed: c.speed,
          marker
        };
      });

      idleVehiclesDataRef.current = vehiclesData;

      // Real-time Traffic Patrol Loop (moves cars smoothly every 1200ms)
      idleTimerRef.current = setInterval(() => {
        vehiclesData.forEach(v => {
          // Convert heading to radians
          const rad = (-v.heading * Math.PI) / 180;
          const dLng = Math.cos(rad) * v.speed;
          const dLat = -Math.sin(rad) * v.speed;

          v.pos[0] += dLat;
          v.pos[1] += dLng;

          // If wandering too far from pickup (> 0.012 distance), steer back toward center
          const distFromCenter = Math.hypot(v.pos[0] - pickupCoords[0], v.pos[1] - pickupCoords[1]);
          if (distFromCenter > 0.013) {
            v.heading = calculateHeading(v.pos, pickupCoords);
          } else if (Math.random() < 0.25) {
            // Subtle road turning (-20 to +20 degrees)
            v.heading += (Math.random() - 0.5) * 40;
          }

          v.marker.setLatLng(v.pos);

          const el = v.marker.getElement();
          if (el) {
            const inner = el.querySelector('.uber-car-topview');
            if (inner) inner.style.transform = `rotate(${v.heading}deg)`;
          }
        });
      }, 1200);
    }
  }, [bookingState, pickup, destination, selectedCarId, arrived, tripStatus]);

  const handleRecenter = () => {
    const map = mapInstanceRef.current;
    if (!map) return;
    const coords = resolveCoords(pickup || 'Bandra West');
    map.flyTo(coords, 15, { animate: true, duration: 0.8 });
    sound.playChime('tap');
  };

  const handleToggleSurge = () => {
    setShowSurge(prev => !prev);
    sound.playChime('tap');
  };

  return (
    <div className={`leaflet-map-wrapper ${theme === 'dark' ? 'dark-map-theme' : ''}`}>
      <div id="uber-leaflet-map" ref={mapContainerRef} className="uber-leaflet-canvas" />

      {/* MAP FLOATING CONTROLS */}
      <div className="map-controls-group">
        {/* SURGE TOGGLE */}
        <button
          className={`map-tool-btn surge-toggle ${showSurge ? 'active' : ''}`}
          onClick={handleToggleSurge}
          title="Toggle Surge Demand Heatmap"
          aria-label="Toggle surge pricing heatmap"
        >
          <span className="surge-icon">🔥</span>
          <span className="surge-text">{showSurge ? 'Surge: ON' : 'Surge Zones'}</span>
        </button>

        {/* RECENTER BUTTON */}
        <button
          className="map-recenter-btn"
          onClick={handleRecenter}
          aria-label="Recenter map to pickup location"
          title="Recenter to pickup"
        >
          <img src="/src/assets/icons/target.png" alt="Recenter" className="icon-sm" />
        </button>
      </div>

      {/* SAFETY BADGE */}
      <div className="map-safety-pill">
        <img src="/src/assets/icons/check.png" alt="Safety" className="icon-xs" />
        <span>Safe, reliable rides 24/7</span>
      </div>
    </div>
  );
}
