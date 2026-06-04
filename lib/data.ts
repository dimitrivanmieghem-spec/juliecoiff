// lib/data.ts

export interface Service {
  id: string;
  name: string;
  price: number;
  duration: number; // minutes
  category: string;
}

// ── Base services (single selection) ─────────────────────────────────────────
export const BASE_SERVICES: Service[] = [
  { id: "b1",  name: "Shampoing + Coupe + Brushing (Cheveux courts)",    price: 47, duration: 60,  category: "Femme"  },
  { id: "b2",  name: "Shampoing + Coupe + Brushing (Cheveux longs)",     price: 57, duration: 75,  category: "Femme"  },
  { id: "b3",  name: "Shampoing + Brushing (Cheveux courts)",            price: 22, duration: 30,  category: "Femme"  },
  { id: "b4",  name: "Shampoing + Brushing (Cheveux longs)",             price: 32, duration: 45,  category: "Femme"  },
  { id: "b5",  name: "Shampoing + Coupe Homme",                          price: 25, duration: 30,  category: "Homme"  },
  { id: "b6",  name: "Shampoing + Coupe + Taille de Barbe",             price: 37, duration: 45,  category: "Homme"  },
  { id: "b7",  name: "Coupe Enfant (-12 ans)",                           price: 18, duration: 30,  category: "Enfant" },
  { id: "b8",  name: "Shampoing + Séchage simple (sans brushing)",       price: 12, duration: 15,  category: "Femme"  },
  { id: "b9",  name: "Traitement Anti-Poux complet (Cheveux courts)",    price: 45, duration: 45,  category: "Enfant" },
  { id: "b10", name: "Traitement Anti-Poux complet (Cheveux longs)",     price: 65, duration: 90,  category: "Enfant" },
];

// ── Add-ons (multiple selection) ─────────────────────────────────────────────
export const ADDONS: Service[] = [
  { id: "a1", name: "Supplément Fixant",              price: 5,  duration: 5,  category: "Finition"  },
  { id: "a2", name: "Coloration",                     price: 45, duration: 45, category: "Technique" },
  { id: "a3", name: "Mèches",                         price: 55, duration: 90, category: "Technique" },
  { id: "a4", name: "Balayage",                       price: 45, duration: 90, category: "Technique" },
  { id: "a5", name: "Coulage",                        price: 15, duration: 10, category: "Technique" },
  { id: "a6", name: "Permanente (Cheveux courts)",    price: 40, duration: 75, category: "Technique" },
  { id: "a7", name: "Soin profond réparateur",        price: 10, duration: 15, category: "Soin"      },
  { id: "a8", name: "Permanente (Cheveux longs)",     price: 60, duration: 90, category: "Technique" },
];

// Combined lookup used by the admin dashboard
export const ALL_SERVICES: Service[] = [...BASE_SERVICES, ...ADDONS];

export interface Zone {
  id: string;
  name: string;
  towns: string;
  fee: number;
}

export const ZONES: Zone[] = [
  { id: "zone-1", name: "Zone 1", towns: "Seneffe, Feluy, Familleureux, Arquennes",        fee: 0  },
  { id: "zone-2", name: "Zone 2", towns: "Manage, Pont-à-Celles, Nivelles, Ecaussinnes",   fee: 5  },
  { id: "zone-3", name: "Zone 3", towns: "Charleroi, Soignies, Braine-le-Comte, Tubize",   fee: 10 },
];

export const SENEFFE: { lat: number; lng: number } = { lat: 50.528, lng: 4.258 };

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h}h` : `${h}h${m.toString().padStart(2, "0")}`;
}

export function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function zoneIdFromKm(km: number): string {
  if (km <= 8) return "zone-1";
  if (km <= 15) return "zone-2";
  return "zone-3";
}
