// lib/geocoding.ts

export interface CitySuggestion {
  name: string;
  lat: number;
  lng: number;
}

interface NominatimResult {
  display_name: string;
  lat: string;
  lon: string;
}

export async function searchCitySuggestions(query: string): Promise<CitySuggestion[]> {
  if (query.trim().length < 2) return [];

  try {
    const url = `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(query)}&country=Belgium&format=json&limit=5&addressdetails=0`;
    const res = await fetch(url, {
      headers: {
        "Accept-Language": "fr-BE,fr",
        "User-Agent": "JulieCoiff/1.0 (contact@juliecoiff.be)",
      },
    });

    if (!res.ok) return [];

    const data: NominatimResult[] = await res.json();

    return data.map((item) => ({
      // Keep only "City, Province" — drop the long country suffix
      name: item.display_name.split(",").slice(0, 2).join(",").trim(),
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
    }));
  } catch {
    return [];
  }
}
