
import React, { useEffect, useRef } from 'react';
import { ItineraryStop } from '../types';
import { MapPin } from 'lucide-react';

declare global {
  interface Window {
    L: any;
  }
}

interface InteractiveMapProps {
  stops: ItineraryStop[];
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ stops }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!mapContainerRef.current || !window.L) return;

    // Cleanup existing map
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
    }

    // Check if we have valid coordinates
    const validStops = stops.filter(s => s.coordinates && typeof s.coordinates.lat === 'number' && typeof s.coordinates.lng === 'number');
    if (validStops.length === 0) return;

    // Initialize map centered on the first stop
    const map = window.L.map(mapContainerRef.current).setView(
      [validStops[0].coordinates.lat, validStops[0].coordinates.lng], 
      5
    );
    
    mapInstanceRef.current = map;

    // Add CartoDB Positron tiles (Clean, light theme matching the app)
    window.L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map);

    // Add markers and path
    const latLngs: [number, number][] = [];

    validStops.forEach((stop, index) => {
      const { lat, lng } = stop.coordinates;
      latLngs.push([lat, lng]);

      // Custom DivIcon for numbered markers
      const icon = window.L.divIcon({
        className: 'custom-map-marker',
        html: `<div style="
          background-color: #4f46e5; 
          color: white;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          border: 3px solid white;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          font-family: sans-serif;
        ">${index + 1}</div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32], // Bottom center anchor
        popupAnchor: [0, -32]
      });

      // Create marker with popup
      const marker = window.L.marker([lat, lng], { icon }).addTo(map);
      
      marker.bindPopup(`
        <div class="font-sans p-2 min-w-[150px]">
          <h3 class="font-bold text-lg text-slate-800 mb-1">${stop.city}</h3>
          <div class="text-sm text-indigo-600 font-bold bg-indigo-50 inline-block px-2 py-0.5 rounded mb-2">${stop.nights} noches</div>
          <p class="text-xs text-slate-500 border-t pt-2 mt-1">${stop.country}</p>
        </div>
      `);
    });

    // Draw dashed line connecting stops
    if (latLngs.length > 1) {
      window.L.polyline(latLngs, {
        color: '#6366f1', // Indigo 500
        weight: 4,
        opacity: 0.7,
        dashArray: '10, 10',
        lineCap: 'round',
        className: 'animate-pulse-slow' // Optional: if you want subtle animation
      }).addTo(map);
    }

    // Fit bounds to show all markers with padding
    if (latLngs.length > 0) {
      const bounds = window.L.latLngBounds(latLngs);
      map.fitBounds(bounds, { padding: [50, 50] });
    }

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [stops]);

  return (
    <div className="w-full h-full z-0 relative group">
      <div className="absolute top-4 left-4 z-[400] bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
         <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
           <MapPin className="text-indigo-600" size={16} /> 
           Mapa Interactivo
         </h3>
      </div>
      <div ref={mapContainerRef} className="w-full h-[400px] z-0 relative outline-none bg-slate-100" style={{ zIndex: 0 }} />
    </div>
  );
};

export default InteractiveMap;
