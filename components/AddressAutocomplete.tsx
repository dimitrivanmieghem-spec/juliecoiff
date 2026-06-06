"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { MapPin, Loader2 } from "lucide-react";

interface NominatimResult {
  place_id: number;
  lat: string;
  lon: string;
  address: {
    road?: string;
    pedestrian?: string;
    path?: string;
    house_number?: string;
    postcode?: string;
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
  };
}

interface AddressSuggestion {
  id: string;
  label: string;
  lat: number;
  lng: number;
  street: string;
  postalCode: string;
  cityName: string;
}

function parseResult(r: NominatimResult): AddressSuggestion | null {
  const road = r.address.road ?? r.address.pedestrian ?? r.address.path;
  if (!road) return null;
  const postcode = r.address.postcode ?? "";
  const city = r.address.city ?? r.address.town ?? r.address.village ?? r.address.municipality ?? "";
  if (!postcode || !city) return null;
  const street = r.address.house_number ? `${road} ${r.address.house_number}` : road;
  return {
    id: String(r.place_id),
    label: `${street}, ${postcode} ${city}`,
    lat: parseFloat(r.lat),
    lng: parseFloat(r.lon),
    street,
    postalCode: postcode,
    cityName: city,
  };
}

async function fetchAddresses(query: string): Promise<AddressSuggestion[]> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&countrycodes=be&limit=6`,
      { headers: { "Accept-Language": "fr" } }
    );
    if (!res.ok) return [];
    const data: NominatimResult[] = await res.json();
    const seen = new Set<string>();
    return data
      .map(parseResult)
      .filter((s): s is AddressSuggestion => s !== null && !seen.has(s.label) && !!seen.add(s.label));
  } catch {
    return [];
  }
}

interface Props {
  onAddressSelect: (lat: number, lng: number, cityName: string, street: string, postalCode: string) => void;
  onClear?: () => void;
}

export default function AddressAutocomplete({ onAddressSelect, onClear }: Props) {
  const [query, setQuery]             = useState("");
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [loading, setLoading]         = useState(false);
  const [open, setOpen]               = useState(false);
  const [activeIdx, setActiveIdx]     = useState(-1);
  const [confirmed, setConfirmed]     = useState(false);
  const containerRef                  = useRef<HTMLDivElement>(null);
  const timerRef                      = useRef<ReturnType<typeof setTimeout> | null>(null);

  const search = useCallback(async (q: string) => {
    setLoading(true);
    const results = await fetchAddresses(q);
    setSuggestions(results);
    setOpen(results.length > 0);
    setActiveIdx(-1);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (confirmed || query.trim().length < 3) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => search(query), 350);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [query, confirmed, search]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function handleSelect(s: AddressSuggestion) {
    setQuery(s.label);
    setSuggestions([]);
    setOpen(false);
    setActiveIdx(-1);
    setConfirmed(true);
    onAddressSelect(s.lat, s.lng, s.cityName, s.street, s.postalCode);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
    if (confirmed) {
      setConfirmed(false);
      onClear?.();
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setActiveIdx((i) => Math.min(i + 1, suggestions.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActiveIdx((i) => Math.max(i - 1, -1)); }
    else if (e.key === "Enter" && activeIdx >= 0) { e.preventDefault(); handleSelect(suggestions[activeIdx]); }
    else if (e.key === "Escape") { setOpen(false); setActiveIdx(-1); }
  }

  return (
    <div ref={containerRef} className="relative">
      <label htmlFor="address-autocomplete" className="block text-xs font-medium text-text-main/60 mb-1.5">
        Votre adresse complète <span aria-hidden="true">*</span>
      </label>
      <div className="relative">
        <input
          id="address-autocomplete"
          type="text"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          placeholder="Rue de la Station 12, 7180 Seneffe"
          autoComplete="off"
          aria-autocomplete="list"
          aria-controls="address-suggestions"
          aria-expanded={open}
          aria-activedescendant={activeIdx >= 0 ? `addr-opt-${activeIdx}` : undefined}
          className="w-full bg-white/80 border border-primary/20 rounded-xl pl-4 pr-10 py-3 text-sm text-text-main placeholder:text-text-main/40 focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-main/30 pointer-events-none">
          {loading
            ? <Loader2 size={15} className="animate-spin" aria-hidden="true" />
            : <MapPin size={15} aria-hidden="true" />
          }
        </span>
      </div>

      {open && (
        <ul
          id="address-suggestions"
          role="listbox"
          aria-label="Suggestions d'adresses"
          className="absolute z-50 left-0 right-0 mt-1.5 bg-white border border-primary/15 rounded-xl shadow-lg overflow-hidden"
        >
          {suggestions.map((s, i) => (
            <li
              key={s.id}
              id={`addr-opt-${i}`}
              role="option"
              aria-selected={i === activeIdx}
              onMouseDown={(e) => { e.preventDefault(); handleSelect(s); }}
              className={`flex items-center gap-2.5 px-4 py-2.5 text-sm cursor-pointer transition-colors ${
                i > 0 ? "border-t border-primary/8" : ""
              } ${i === activeIdx ? "bg-primary/8 text-primary" : "text-text-main hover:bg-primary/5"}`}
            >
              <MapPin size={13} className="text-primary shrink-0" aria-hidden="true" />
              {s.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
