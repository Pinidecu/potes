"use client";

import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect, useState } from "react";

// Icono
const defaultIcon = L.icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface MapSelectorProps {
  onSelect: (location: { lat: number; lng: number }) => void;
  center?: { lat: number; lng: number } | null; // ← NUEVO
}

export default function MapSelector({ onSelect, center }: MapSelectorProps) {
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);

  const destino = { lat: -24.747460, lng: -65.408352 };

  useEffect(() => {
    if (position) {
      const dist = L.latLng(position.lat, position.lng)
        .distanceTo(L.latLng(destino.lat, destino.lng));

      console.log("Distancia en metros:", dist);
    }
  }, [position]);

  // Obtener ubicación inicial del dispositivo
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition({ lat: latitude, lng: longitude });
      },
      () => {
        // fallback: Salta
        setPosition({ lat: -24.79, lng: -65.41 });
      }
    );
  }, []);

  // Mover el mapa cuando llegue un center desde afuera
  function MapCenterUpdater({ center }: { center: any }) {
    const map = useMap();

    useEffect(() => {
        if (center) {
        map.setView(center, 15);
        setPosition(center);  // mueve marker
        }
    }, [center]);

    return null;
    }

  if (!position) return <p>Cargando mapa...</p>;

  function LocationMarker() {
    useMapEvents({
      click(e) {
        const latlng = { lat: e.latlng.lat, lng: e.latlng.lng };
        setPosition(latlng);
        onSelect(latlng);
      },
    });

    return <Marker position={position} icon={defaultIcon} />;
  }

  return (
    <MapContainer
      center={position}
      zoom={13}
      className="rounded-lg shadow-md"
      style={{ height: "250px", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {/* cuando cambian las coords desde el autocomplete */}
    <MapCenterUpdater center={center} />
      <LocationMarker />
    </MapContainer>
  );
}
