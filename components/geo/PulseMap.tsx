'use client';

import { useState, useEffect } from 'react';
import MapContainer from './MapContainer';
import maplibregl from 'maplibre-gl';
import { api } from '@/lib/api';
import { Layers, Maximize2, Minimize2 } from 'lucide-react';

export default function PulseMap() {
  const [map, setMap] = useState<maplibregl.Map | null>(null);
  const [adminLevel, setAdminLevel] = useState<number>(1); // 1: County, 3: Ward
  const [selectedPcode, setSelectedPcode] = useState<string | null>(null);

  const loadBoundaries = async (targetMap: maplibregl.Map, level: number, parentPcode?: string) => {
    try {
      const geojson = await api.getGeoBoundaries(level, parentPcode);
      
      // Augment with height for 3D wow factor
      const augmentedGeojson = {
        ...geojson,
        features: (geojson as any).features.map((f: any, i: number) => ({
          ...f,
          id: i, // Ensure ID for feature state
          properties: {
            ...f.properties,
            height: ((f.properties.pcode?.charCodeAt(5) || 10) * 300) % 5000 + 500
          }
        }))
      };

      // Remove existing source/layer if any
      if (targetMap.getLayer('boundaries-extrusion')) targetMap.removeLayer('boundaries-extrusion');
      if (targetMap.getLayer('boundaries-fill')) targetMap.removeLayer('boundaries-fill');
      if (targetMap.getLayer('boundaries-line')) targetMap.removeLayer('boundaries-line');
      if (targetMap.getSource('boundaries')) targetMap.removeSource('boundaries');

      targetMap.addSource('boundaries', {
        type: 'geojson',
        data: augmentedGeojson,
        generateId: true
      });

      targetMap.addLayer({
        id: 'boundaries-extrusion',
        type: 'fill-extrusion',
        source: 'boundaries',
        paint: {
          'fill-extrusion-color': [
            'interpolate',
            ['linear'],
            ['get', 'height'],
            500, '#eab308',
            5000, '#fde047'
          ],
          'fill-extrusion-height': ['get', 'height'],
          'fill-extrusion-base': 0,
          'fill-extrusion-opacity': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            0.9,
            0.6
          ]
        }
      });

      targetMap.addLayer({
        id: 'boundaries-line',
        type: 'line',
        source: 'boundaries',
        paint: {
          'line-color': '#ffffff',
          'line-width': 0.5,
          'line-opacity': 0.2
        }
      });

      // Fit bounds to the loaded GeoJSON
      const coordinates = [];
      for (const feature of (geojson as any).features) {
        if (feature.geometry.type === 'Polygon') {
          coordinates.push(...feature.geometry.coordinates[0]);
        } else if (feature.geometry.type === 'MultiPolygon') {
          feature.geometry.coordinates.forEach((poly: any) => coordinates.push(...poly[0]));
        }
      }

      if (coordinates.length > 0) {
        const bounds = coordinates.reduce((acc, coord) => [
          [Math.min(acc[0][0], coord[0]), Math.min(acc[0][1], coord[1])],
          [Math.max(acc[1][0], coord[0]), Math.max(acc[1][1], coord[1])]
        ], [[coordinates[0][0], coordinates[0][1]], [coordinates[0][0], coordinates[0][1]]]);
        
        targetMap.fitBounds(bounds as any, { padding: 50, duration: 2000 });
      }

      // Simple hover effect
      let hoveredStateId: string | number | null = null;
      targetMap.on('mousemove', 'boundaries-fill', (e: any) => {
        if (e.features && e.features.length > 0) {
          if (hoveredStateId !== null) {
            targetMap.setFeatureState(
              { source: 'boundaries', id: hoveredStateId },
              { hover: false }
            );
          }
          hoveredStateId = e.features[0].id || null;
          if (hoveredStateId !== null) {
            targetMap.setFeatureState(
              { source: 'boundaries', id: hoveredStateId },
              { hover: true }
            );
          }
        }
      });

      targetMap.on('mouseleave', 'boundaries-fill', () => {
        if (hoveredStateId !== null) {
          targetMap.setFeatureState(
            { source: 'boundaries', id: hoveredStateId },
            { hover: false }
          );
        }
        hoveredStateId = null;
      });

    } catch (err) {
      console.error('Failed to load boundaries:', err);
    }
  };

  const handleMapLoad = (loadedMap: maplibregl.Map) => {
    setMap(loadedMap);
    loadBoundaries(loadedMap, 1);
  };

  const toggleLevel = () => {
    const nextLevel = adminLevel === 1 ? 3 : 1;
    setAdminLevel(nextLevel);
    if (map) loadBoundaries(map, nextLevel);
  };

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/5 bg-white/2">
      <MapContainer 
        onMapLoad={handleMapLoad} 
        pitch={adminLevel === 1 ? 45 : 60}
        bearing={adminLevel === 1 ? -10 : 20}
        zoom={adminLevel === 1 ? 6 : 9}
      />
      
      {/* Map Controls */}
      <div className="absolute top-6 left-6 z-10 flex flex-col gap-2">
         <button 
           onClick={toggleLevel}
           className="bg-black/80 backdrop-blur-md border border-white/10 p-3 rounded-xl text-white hover:border-primary/50 transition-all flex items-center gap-3 group"
         >
           <Layers size={18} className="text-primary" />
           <span className="text-[10px] font-black uppercase tracking-widest">
             {adminLevel === 1 ? "Switch to Wards" : "Switch to Counties"}
           </span>
         </button>
      </div>

      {/* Legend Overlay */}
      <div className="absolute bottom-6 right-6 z-10 bg-black/80 backdrop-blur-md border border-white/10 p-6 rounded-2xl">
         <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-4">Activation Density</div>
         <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
               <div className="w-4 h-4 rounded bg-primary"></div>
               <span className="text-[10px] font-black uppercase tracking-widest text-white">High Impact</span>
            </div>
            <div className="flex items-center gap-3">
               <div className="w-4 h-4 rounded bg-primary/20"></div>
               <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Emerging</span>
            </div>
            <div className="flex items-center gap-3">
               <div className="w-4 h-4 rounded bg-white/5"></div>
               <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Baseline</span>
            </div>
         </div>
      </div>
    </div>
  );
}
