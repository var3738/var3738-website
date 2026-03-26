'use client';

import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

interface MapContainerProps {
  onMapLoad?: (map: maplibregl.Map) => void;
  center?: [number, number]; // [lon, lat]
  zoom?: number;
  pitch?: number;
  bearing?: number;
  className?: string;
}

export default function MapContainer({ 
  onMapLoad, 
  center = [36.8219, -1.2921], // Nairobi Default
  zoom = 6,
  pitch = 0,
  bearing = 0,
  className = ""
}: MapContainerProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          'osm': {
            type: 'raster',
            tiles: [
              'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'
            ],
            tileSize: 256,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          }
        },
        layers: [
          {
            id: 'osm-layer',
            type: 'raster',
            source: 'osm',
            minzoom: 0,
            maxzoom: 19
          }
        ]
      },
      center: center,
      zoom: zoom,
      pitch: pitch,
      bearing: bearing,
      attributionControl: false
    });

    map.current.on('load', () => {
      if (map.current && onMapLoad) {
        onMapLoad(map.current);
      }
      setIsReady(true);
    });

    return () => {
      map.current?.remove();
    };
  }, []);

  // Update center/zoom if props change (optional implementation)
  useEffect(() => {
    if (map.current && isReady) {
      map.current.easeTo({ center, zoom, pitch, bearing });
    }
  }, [center, zoom, pitch, bearing, isReady]);

  return (
    <div className={`relative w-full h-full overflow-hidden rounded-2xl border border-white/10 ${className}`}>
      <div ref={mapContainer} className="w-full h-full" />
      
      {!isReady && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-10">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span className="text-[10px] font-black uppercase tracking-widest text-primary">Initialising Engine...</span>
          </div>
        </div>
      )}
    </div>
  );
}
