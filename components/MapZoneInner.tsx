"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import type { ClientCoords } from "./MapZone";

const BASE_COORDS: [number, number] = [50.5287, 4.2594];

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
  const containerRef       = useRef<HTMLDivElement>(null);
  const mapRef             = useRef<L.Map | null>(null);
  const clientMarkerRef    = useRef<L.Marker | null>(null);
  const clientPolylineRef  = useRef<L.Polyline | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (container as any)._leaflet_id;

    const map = L.map(container, { center: BASE_COORDS, zoom: 11, scrollWheelZoom: false });
    mapRef.current = map;

    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 19,
    }).addTo(map);

    L.marker(BASE_COORDS, { icon: centerIcon })
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

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    clientMarkerRef.current?.remove();
    clientMarkerRef.current = null;
    clientPolylineRef.current?.remove();
    clientPolylineRef.current = null;

    if (!clientCoords) {
      map.setView(BASE_COORDS, 11);
      return;
    }

    const { lat, lng, name } = clientCoords;
    const clientPos: [number, number] = [lat, lng];

    clientPolylineRef.current = L.polyline([BASE_COORDS, clientPos], {
      color: "#b85d38",
      dashArray: "5, 10",
      weight: 3,
    }).addTo(map);

    clientMarkerRef.current = L.marker(clientPos, { icon: clientIcon })
      .addTo(map)
      .bindTooltip(name, { sticky: true, className: "leaflet-tooltip-custom" });

    map.fitBounds([BASE_COORDS, clientPos], { padding: [50, 50] });
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
        aria-label="Carte du trajet Julie Coiff"
      />
    </>
  );
}
