import { useEffect, useState } from "react";
import {
  checkDeliveryRadius,
  clearCachedDeliveryCheck,
  readCachedDeliveryCheck,
  writeCachedDeliveryCheck,
  type DeliveryCheckResult,
} from "../utils/deliveryRadius";

const TARGET = { lat: -24.7892417, lng: -65.4104199 };
const MAX_KM = 4;
const CACHE_MAX_AGE_MS = 2 * 60 * 60 * 1000; // 2 horas

export default function DeliveryBanner() {
  const [result, setResult] = useState<DeliveryCheckResult | null>(null);
  const [loading, setLoading] = useState(false);

  const runCheck = async () => {
    setLoading(true);
    const r = await checkDeliveryRadius({ target: TARGET, maxKm: MAX_KM });
    setResult(r);

    // ✅ Solo cachear si fue OK (si falla, no dejes “pegado” el error)
    if (r.ok) {
      writeCachedDeliveryCheck(r);
    } else {
      clearCachedDeliveryCheck();
    }

    setLoading(false);
  };

  useEffect(() => {
    const cached = readCachedDeliveryCheck(CACHE_MAX_AGE_MS);

    // ✅ Si hay cache OK, lo usamos
    if (cached?.ok) {
      setResult(cached);
      return;
    }

    // ✅ Si no hay cache OK, intentamos pedir automático SOLO si el permiso ya está concedido.
    // Si está en "prompt" o "denied", mostramos un banner y esperamos a que el usuario haga click en "Reintentar".
    (async () => {
      try {
        if (!("permissions" in navigator)) {
          // Fallback: intentamos una vez (en algunos browsers puede fallar sin gesto)
          runCheck();
          return;
        }

        const perm = await (navigator as any).permissions.query({ name: "geolocation" });

        if (perm.state === "granted") {
          runCheck();
        } else if (perm.state === "denied") {
          setResult({ ok: false, reason: "denied" });
        } else {
          // prompt
          setResult({ ok: false, reason: "unavailable" });
        }
      } catch {
        // Fallback
        runCheck();
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Si aún no sabemos nada, no mostramos nada
  if (!result) return null;

  // Si ok y dentro del radio -> no mostramos banner
  if (result.ok && result.distanceKm <= MAX_KM) return null;

  // Mensajes
  let message = "";
  if (result.ok && result.distanceKm > MAX_KM) {
    message = `Lo sentimos 😕. Estás a ${result.distanceKm.toFixed(
      2
    )} km y solo hacemos envíos hasta ${MAX_KM} km.`;
  } else {
    message =
      result.reason === "denied"
        ? "Necesitamos tu ubicación para confirmar si estás dentro del radio de entrega (permiso denegado)."
        : "Necesitamos tu ubicación para confirmar si estás dentro del radio de entrega.";
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] bg-red-600 text-white">
      <div className="mx-auto max-w-6xl px-4 py-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm font-medium">{message}</div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              clearCachedDeliveryCheck();
              runCheck();
            }}
            className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-3 py-2 rounded-md"
            disabled={loading}
          >
            {loading ? "Verificando..." : "Reintentar"}
          </button>

          <button
            type="button"
            onClick={() => setResult(null)}
            className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-3 py-2 rounded-md"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
