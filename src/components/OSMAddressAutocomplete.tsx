import { useEffect, useRef } from "react";

export default function OSMAddressAutocomplete({ query, onSelect }) {
  const timer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!query || query.trim().length < 3) return;

    // ❌ Cancela búsquedas previas
    if (timer.current) clearTimeout(timer.current);

    // ⏳ Espera 400 ms antes de buscar
    timer.current = setTimeout(async () => {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        query + " Salta"
      )}&bounded=1&viewbox=-65.46,-24.72,-65.355,-24.855`;

      const res = await fetch(url);
      const data = await res.json();

      if (data.length > 0) {
        const best = data[0];
        onSelect({
          lat: Number(best.lat),
          lng: Number(best.lon),
        });
      }
    }, 1000);

    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [query]);

  return null;
}
