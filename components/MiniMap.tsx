'use client';

import { APIProvider, Map } from '@vis.gl/react-google-maps';
import { LOCATION } from '@/lib/constants';

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

const LONDON = { lat: 51.5074, lng: -0.1278 };

const MiniMap = () => {
    if (!apiKey) {
        return (
            <div className="flex h-full items-center justify-center p-4 text-center text-ui text-fg-muted">
                {LOCATION}
            </div>
        );
    }

    return (
        <APIProvider apiKey={apiKey}>
            <Map
                defaultZoom={11}
                defaultCenter={LONDON}
                disableDefaultUI
                gestureHandling="cooperative"
                style={{ width: '100%', height: '100%' }}
            />
        </APIProvider>
    );
};

export default MiniMap;
