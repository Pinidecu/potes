export function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const toRad = (v: number) => (v * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export type DeliveryCheckResult =
  | { ok: true; distanceKm: number; coords: { lat: number; lng: number; acc?: number } }
  | { ok: false; reason: "denied" | "unavailable" | "timeout" | "no_geolocation" | "unknown" };

const STORAGE_KEY = "delivery_radius_check_v1";

export function readCachedDeliveryCheck(maxAgeMs: number): DeliveryCheckResult | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { ts: number; result: DeliveryCheckResult };
    if (!parsed?.ts || !parsed?.result) return null;

    if (Date.now() - parsed.ts > maxAgeMs) return null;
    return parsed.result;
  } catch {
    return null;
  }
}

export function writeCachedDeliveryCheck(result: DeliveryCheckResult) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ts: Date.now(), result }));
  } catch {
    // ignore
  }
}

export function clearCachedDeliveryCheck() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export async function checkDeliveryRadius(opts: {
  target: { lat: number; lng: number };
  maxKm: number;
  timeoutMs?: number;
  highAccuracy?: boolean;
}): Promise<DeliveryCheckResult> {
  if (!("geolocation" in navigator)) {
    return { ok: false, reason: "no_geolocation" };
  }

  const timeoutMs = opts.timeoutMs ?? 10000;
  const highAccuracy = opts.highAccuracy ?? true;

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const acc = pos.coords.accuracy;

        const km = haversineKm(lat, lng, opts.target.lat, opts.target.lng);

        resolve({
          ok: true,
          distanceKm: km,
          coords: { lat, lng, acc },
        });
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) resolve({ ok: false, reason: "denied" });
        else if (err.code === err.POSITION_UNAVAILABLE) resolve({ ok: false, reason: "unavailable" });
        else if (err.code === err.TIMEOUT) resolve({ ok: false, reason: "timeout" });
        else resolve({ ok: false, reason: "unknown" });
      },
      {
        enableHighAccuracy: highAccuracy,
        timeout: timeoutMs,
        maximumAge: 0,
      }
    );
  });
}
