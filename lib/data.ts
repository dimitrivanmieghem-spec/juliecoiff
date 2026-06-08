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

export function getTravelFee(postalCode: string): number | null {
  if (["7180", "7181", "7170"].includes(postalCode)) return 0;
  if (["6230", "7190"].includes(postalCode))          return 8;
  if (["1400", "7100", "7110", "7060"].includes(postalCode)) return 15;
  return null;
}

export function zoneIdFromKm(km: number): string {
  if (km <= 8) return "zone-1";
  if (km <= 15) return "zone-2";
  return "zone-3";
}

export interface Review {
  id: number;
  name: string;
  rating: number;
  text: string;
}

export const reviews: Review[] = [
  { id: 1,  name: "Cathy Vanreckt",    rating: 5, text: "Très contente de ma nouvelle coiffure. J'adore. Merci pour le travail 🌼" },
  { id: 2,  name: "Hélène Kalnak",     rating: 5, text: "Accueil très sympa. Coiffeuse très à l'écoute, efficace. Une cliente très satisfaite ! Je recommande. Merci Julie" },
  { id: 3,  name: "marie damoisiaux",  rating: 5, text: "Super coiffeuse.. d une gentillesse incroyable. Soucieuse du bonheur de ses clientes, de bon conseils, on est chouchoutée et très bon travail. Merci" },
  { id: 4,  name: "Kiera V.",          rating: 5, text: "Super contente du resultat et super coiffeuse. J'adore !! 😍" },
  { id: 5,  name: "Sabah El Haman",    rating: 5, text: "Expérience incroyable chez Julie. Elle parvient toujours à créer le style parfait que je recherche et l'ambiance est accueillante. Je recommande vivement !" },
  { id: 6,  name: "Natacha Hubert",    rating: 5, text: "Un superbe moment de détente dans un beau salon, une petite attention ( café et biscuit) qui fait bien plaisir et un résultat coiffure qui me plait bcp" },
  { id: 7,  name: "Hélène Bouvy",      rating: 5, text: "Super chouette moment ! Une personne aux petits soins et à l'écoute de ses clients 🙂" },
  { id: 8,  name: "Fabienne Saeys",    rating: 5, text: "Un bon moment de détente et très satisfaite 😌. Merci Julie" },
  { id: 9,  name: "Caroline Koeks",    rating: 5, text: "Excellente coiffeuse je recommande vivement :-)" },
  { id: 10, name: "CAROLE KOEKS",      rating: 5, text: "Jeune coiffeuse dynamique, sociable et tres agréable. Je la conseille vivement !" },
];
