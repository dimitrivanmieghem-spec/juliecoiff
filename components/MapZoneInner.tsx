"use client";
// components/MapZoneInner.tsx  (loaded dynamically — SSR disabled)

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import type { ClientCoords } from "./MapZone";

const CENTER: L.LatLngTuple = [50.528, 4.258];

const zones: { label: string; radius: number; options: L.CircleOptions }[] = [
  {
    label: "Zone 1 — Gratuit",
    radius: 8000,
    options: { color: "#b85d38", fillColor: "#b85d38", fillOpacity: 0.15, weight: 2 },
  },
  {
    label: "Zone 2 — +5€",
    radius: 15000,
    options: { color: "#d67a50", fillColor: "#d67a50", fillOpacity: 0.08, weight: 2, dashArray: "5, 5" },
  },
  {
    label: "Zone 3 — +10€",
    radius: 25000,
    options: { color: "#e8bba6", fillColor: "#e8bba6", fillOpacity: 0.04, weight: 1.5, dashArray: "4, 6" },
  },
];

const centerIcon = L.divIcon({
  className: "bg-transparent",
  iconSize: [16, 16],
  iconAnchor: [8, 8],
  html: `<div style="width:16px;height:16px;background:#b85d38;border-radius:50%;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.25);"></div>`,
});

const clientIcon = L.divIcon({
  className: "bg-transparent",
  iconSize: [16, 16],
  iconAnchor: [8, 8],
  html: `<div style="width:16px;height:16px;background:#d67a50;border-radius:50%;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.25);"></div>`,
});

interface Props {
  clientCoords?: ClientCoords | null;
}

export default function MapZoneInner({ clientCoords }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const clientMarkerRef = useRef<L.Marker | null>(null);
  const clientPolylineRef = useRef<L.Polyline | null>(null);

  // Init map once
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (container as any)._leaflet_id;

    const map = L.map(container, { center: CENTER, zoom: 10, scrollWheelZoom: false });
    mapRef.current = map;

    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 19,
    }).addTo(map);

    [...zones].reverse().forEach(({ label, radius, options }) => {
      L.circle(CENTER, { radius, ...options })
        .addTo(map)
        .bindTooltip(label, { sticky: true, className: "leaflet-tooltip-custom" });
    });

    L.marker(CENTER, { icon: centerIcon })
      .addTo(map)
      .bindTooltip("Julie Coiff — Seneffe", {
        permanent: true,
        direction: "top",
        offset: [0, -10],
        className: "leaflet-tooltip-custom",
      });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update client marker + polyline when coords change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    clientMarkerRef.current?.remove();
    clientMarkerRef.current = null;
    clientPolylineRef.current?.remove();
    clientPolylineRef.current = null;

    if (!clientCoords) return;

    const { lat, lng, name } = clientCoords;

    clientPolylineRef.current = L.polyline([CENTER, [lat, lng]], {
      color: "#b85d38",
      weight: 2,
      dashArray: "5, 8",
      opacity: 0.7,
    }).addTo(map);

    clientMarkerRef.current = L.marker([lat, lng], { icon: clientIcon })
      .addTo(map)
      .bindTooltip(name, { sticky: true, className: "leaflet-tooltip-custom" });

    map.flyToBounds(L.latLngBounds([CENTER, [lat, lng]]), {
      padding: [40, 40],
      duration: 0.8,
    });
  }, [clientCoords]);

  return (
    <>
      <style>{`
        .leaflet-tooltip-custom {
          background: #b85d38;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 500;
          padding: 3px 8px;
          box-shadow: 0 1px 6px rgba(184,93,56,0.25);
          white-space: nowrap;
        }
        .leaflet-tooltip-custom::before {
          border-top-color: #b85d38;
        }
      `}</style>
      <div
        ref={containerRef}
        className="w-full h-64 rounded-xl z-0 overflow-hidden"
        role="img"
        aria-label="Carte des zones de déplacement Julie Coiff"
      />
    </>
  );
}
