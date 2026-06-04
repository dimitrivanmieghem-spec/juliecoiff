"use client";
// components/MapZone.tsx

import dynamic from "next/dynamic";

export interface ClientCoords {
  lat: number;
  lng: number;
  name: string;
}

interface Props {
  clientCoords?: ClientCoords | null;
}

const MapZoneInner = dynamic(() => import("./MapZoneInner"), { ssr: false });

export default function MapZone({ clientCoords }: Props) {
  return <MapZoneInner clientCoords={clientCoords} />;
}
