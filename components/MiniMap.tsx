// components/MiniMap.js
"use client";
import React from 'react';
import {createRoot} from "react-dom/client";
import {APIProvider, Map, MapCameraChangedEvent} from '@vis.gl/react-google-maps';

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string;

const center = {
  lat: 51.5074,
  lng: -0.1278,
};


export default function MiniMap() {
  return (
    <APIProvider apiKey={apiKey} onLoad={() => console.log('Maps API has loaded.')}>
      <Map
        defaultZoom={13}
        defaultCenter={{ lat: 51.5074, lng: -0.1278}}
        onCameraChanged={(ev: MapCameraChangedEvent) =>
          console.log('camera changed:', ev.detail.center, 'zoom:', ev.detail.zoom)
        }>
      </Map>
    </APIProvider>
  );
}