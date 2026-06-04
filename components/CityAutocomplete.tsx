"use client";
// components/CityAutocomplete.tsx

import { useState, useEffect, useRef } from "react";
import { MapPin, Loader2 } from "lucide-react";
import { searchCitySuggestions, type CitySuggestion } from "@/lib/geocoding";

interface Props {
  onCitySelect: (lat: number, lng: number, cityName: string) => void;
}

export default function CityAutocomplete({ onCitySelect }: Props) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounced fetch
  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      setOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      const results = await searchCitySuggestions(query);
      setSuggestions(results);
      setOpen(results.length > 0);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleSelect(s: CitySuggestion) {
    setQuery(s.name);
    setSuggestions([]);
    setOpen(false);
    onCitySelect(s.lat, s.lng, s.name);
  }

  return (
    <div ref={containerRef} className="relative">
      <label
        htmlFor="city-autocomplete"
        className="block text-xs font-medium text-text-main/60 mb-1.5"
      >
        Ville ou code postal
      </label>

      <div className="relative">
        <input
          id="city-autocomplete"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          placeholder="ex : Seneffe, Nivelles, Charleroi…"
          autoComplete="off"
          aria-autocomplete="list"
          aria-controls="city-suggestions"
          aria-expanded={open}
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
          id="city-suggestions"
          role="listbox"
          aria-label="Suggestions de villes"
          className="absolute z-10 left-0 right-0 mt-1.5 bg-white border border-primary/15 rounded-xl shadow-lg overflow-hidden"
        >
          {suggestions.map((s, i) => (
            <li
              key={i}
              role="option"
              aria-selected={false}
              onMouseDown={() => handleSelect(s)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-text-main cursor-pointer hover:bg-primary/5 transition-colors"
            >
              <MapPin size={13} className="text-primary shrink-0" aria-hidden="true" />
              {s.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
