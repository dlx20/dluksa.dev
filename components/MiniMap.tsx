// components/MiniMap.js
"use client";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string;

const containerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "5px",
  overflow: "hidden",
};

const center = {
  lat: 51.5074,
  lng: -0.1278,
};

const options = {
  disableDefaultUI: true,
  zoomControl: false,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: false,
};

export default function MiniMap() {
  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={13}
        options={options}
      >
        <Marker position={center} />
      </GoogleMap>
    </LoadScript>
  );
}