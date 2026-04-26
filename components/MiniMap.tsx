"use client";
import { useEffect, useRef } from "react";

const containerStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  borderRadius: "5px",
  overflow: "hidden",
};

const center: google.maps.LatLngLiteral = {
  lat: 51.5074,
  lng: -0.1278,
};

const mapOptions: google.maps.MapOptions = {
  disableDefaultUI: true,
  zoomControl: false,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: false,
  mapId: process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID,
};

export default function MiniMap() {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initMap = async (): Promise<void> => {
      if (!mapRef.current) return;

      const { Map } = (await google.maps.importLibrary(
        "maps"
      )) as google.maps.MapsLibrary;

      const { AdvancedMarkerElement } = (await google.maps.importLibrary(
        "marker"
      )) as google.maps.MarkerLibrary;

      const map = new Map(mapRef.current, {
        center,
        zoom: 13,
        ...mapOptions,
      });

      new AdvancedMarkerElement({
        position: center,
        map,
        title: "Location",
      });
    };

    initMap();
  }, []);

  return <div ref={mapRef} style={containerStyle} />;
}