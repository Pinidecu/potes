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

    if (r.ok) {
      writeCachedDeliveryCheck(r);
    } else {
      clearCachedDeliveryCheck();
    }

    setLoading(false);
  };

  useEffect(() => {
    const cached = readCachedDeliveryCheck(CACHE_MAX_AGE_MS);

    if (cached?.ok) {
      setResult(cached);
      return;
    }

    (async () => {
      try {
        if (!("permissions" in navigator)) {
          runCheck();
          return;
        }

        const perm = await (navigator as any).permissions.query({
          name: "geolocation",
        });

        if (perm.state === "granted") {
          runCheck();
        } else if (perm.state === "denied") {
          setResult({ ok: false, reason: "denied" });
        } else {
          setResult({ ok: false, reason: "unavailable" });
        }
      } catch {
        runCheck();
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!result) return null;

  if (result.ok && result.distanceKm <= MAX_KM) return null;

  let message = "";
  let bgColor = "bg-red-600";

  if (result.ok && result.distanceKm > MAX_KM) {
    message = `Lo sentimos 😕 Estás a ${result.distanceKm.toFixed(
      2
    )} km y solo hacemos envíos hasta ${MAX_KM} km.`;
    bgColor = "bg-red-600";
  } else {
    message =
      result.reason === "denied"
        ? "Necesitamos tu ubicación para confirmar el radio de entrega (permiso denegado)."
        : "Necesitamos tu ubicación para confirmar el radio de entrega.";
    bgColor = "bg-yellow-500";
  }

  return (
    <div className="fixed top-6 right-6 z-[9999] w-[90%] sm:w-[40%] lg:w-[30%]">
      <div
        className={`${bgColor} text-white rounded-xl shadow-2xl p-4 animate-fade-in`}
      >
        <div className="text-sm font-medium mb-3">{message}</div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => {
              clearCachedDeliveryCheck();
              runCheck();
            }}
            className="bg-white/20 hover:bg-white/30 text-white text-xs font-semibold px-3 py-2 rounded-md transition"
            disabled={loading}
          >
            {loading ? "Verificando..." : "Reintentar"}
          </button>

          <button
            type="button"
            onClick={() => setResult(null)}
            className="bg-white/20 hover:bg-white/30 text-white text-xs font-semibold px-3 py-2 rounded-md transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
