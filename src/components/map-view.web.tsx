import { useEffect, useRef } from 'react';
import { View } from 'react-native';
import type { BikeRoute } from '@/types/route';

const STADIA_KEY = process.env.EXPO_PUBLIC_STADIA_API_KEY;
const STADIA_TILES = `https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png?api_key=${STADIA_KEY}`;

interface Props {
  route: BikeRoute;
}

export function RouteMapView({ route }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<unknown>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    import('leaflet').then((L) => {
      // Inject Leaflet CSS
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      // Inject custom marker + popup styles
      if (!document.getElementById('map-custom-css')) {
        const style = document.createElement('style');
        style.id = 'map-custom-css';
        style.textContent = `
          .modern-marker {
            width: 16px; height: 16px; border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.25);
          }
          .modern-marker.start { background: #34C759; box-shadow: 0 2px 12px rgba(52,199,89,0.5); }
          .modern-marker.end { background: #FF3B30; box-shadow: 0 2px 12px rgba(255,59,48,0.5); }
          .leaflet-popup-content-wrapper {
            background: white; color: #1C1C1E;
            border-radius: 10px; box-shadow: 0 4px 16px rgba(0,0,0,0.12);
            font-family: -apple-system, system-ui, sans-serif;
          }
          .leaflet-popup-tip { background: white; }
          .leaflet-popup-content { font-size: 13px; font-weight: 500; margin: 8px 12px; }
        `;
        document.head.appendChild(style);
      }

      if (!containerRef.current) return;

      const map = L.map(containerRef.current, {
        zoomControl: false,
        attributionControl: false,
      }).setView(
        [route.centerCoordinate.latitude, route.centerCoordinate.longitude],
        route.defaultZoom
      );
      mapRef.current = map;

      L.control.zoom({ position: 'bottomright' }).addTo(map);
      L.control.attribution({ position: 'bottomleft', prefix: false })
        .addAttribution('&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>')
        .addTo(map);

      // Stadia Alidade Smooth tiles
      L.tileLayer(STADIA_TILES, {
        maxZoom: 20,
      }).addTo(map);

      const latlngs = route.polyline.map(
        (p) => [p.latitude, p.longitude] as [number, number]
      );

      // Glow effect underneath
      L.polyline(latlngs, {
        color: '#007AFF',
        weight: 14,
        opacity: 0.15,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(map);

      // Main route line
      L.polyline(latlngs, {
        color: '#007AFF',
        weight: 4,
        opacity: 1,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(map);

      // Custom circle markers
      if (latlngs.length > 0) {
        const startIcon = L.divIcon({
          className: '',
          html: '<div class="modern-marker start"></div>',
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        });
        const endIcon = L.divIcon({
          className: '',
          html: '<div class="modern-marker end"></div>',
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        });
        L.marker(latlngs[0], { icon: startIcon }).addTo(map).bindPopup('Start');
        L.marker(latlngs[latlngs.length - 1], { icon: endIcon }).addTo(map).bindPopup('End');
      }
    });

    return () => {
      if (mapRef.current) {
        (mapRef.current as { remove: () => void }).remove();
        mapRef.current = null;
      }
    };
  }, [route.id]);

  return (
    <View style={{ height: 300, overflow: 'hidden' }}>
      {/* @ts-ignore */}
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
    </View>
  );
}
