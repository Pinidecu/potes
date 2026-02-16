"use client";
import { useState } from "react";

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // km
  const toRad = (v: number) => (v * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function DistanciaPage() {
  const [status, setStatus] = useState<string>("");
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number; acc?: number } | null>(null);

  const target = {
    lat: -24.7892417,
    lng: -65.4104199,
  };

  const pedirUbicacionYCalcular = () => {
    setStatus("");
    setDistanceKm(null);

    if (!("geolocation" in navigator)) {
      setStatus("Este navegador no soporta geolocalización.");
      return;
    }

    setStatus("Pidiendo ubicación...");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const acc = pos.coords.accuracy;

        setCoords({ lat, lng, acc });

        const km = haversineKm(lat, lng, target.lat, target.lng);
        setDistanceKm(km);

        setStatus("OK");
      },
      (err) => {
        // Mensajes típicos
        if (err.code === err.PERMISSION_DENIED) setStatus("Permiso denegado por el usuario.");
        else if (err.code === err.POSITION_UNAVAILABLE) setStatus("No se pudo obtener la ubicación.");
        else if (err.code === err.TIMEOUT) setStatus("Timeout obteniendo ubicación.");
        else setStatus("Error obteniendo ubicación.");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  return (
    <div style={{ padding: 24, fontFamily: "system-ui" }}>
      <h1>Prueba de distancia por GPS</h1>

      <p>
        Punto objetivo: <b>{target.lat}, {target.lng}</b>
      </p>

      <button onClick={pedirUbicacionYCalcular} style={{ padding: "10px 14px", cursor: "pointer" }}>
        Pedir ubicación y calcular distancia
      </button>

      <div style={{ marginTop: 16 }}>
        <p><b>Estado:</b> {status || "-"}</p>

        {coords && (
          <>
            <p><b>Tu ubicación:</b> {coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}</p>
            <p><b>Precisión aprox:</b> {Math.round(coords.acc ?? 0)} m</p>
          </>
        )}

        {distanceKm !== null && (
          <p>
            <b>Distancia:</b> {distanceKm.toFixed(3)} km ({Math.round(distanceKm * 1000)} m)
          </p>
        )}
      </div>
    </div>
  );
}
