'use client';

import { useEffect, useMemo, useState } from 'react';
import { APIProvider, Map, useMap } from '@vis.gl/react-google-maps';
import { LOCATION, THEMES } from '@/lib/constants';

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

const LONDON = { lat: 51.5074, lng: -0.1278 };

const THEME_IDS = THEMES.map((theme) => theme.id);

type Palette = {
    surface: string;
    elevated: string;
    hovered: string;
    accent: string;
    muted: string;
    fg: string;
    cool: string;
};

type ThemeRecipe = {
    light: boolean;
    waterFrom: 'accent' | 'cool';
    waterMix: number;
    parkMix: number;
    highwayMix: number;
};

const RECIPES: Record<string, ThemeRecipe> = {
    palenight: {
        light: false,
        waterFrom: 'cool',
        waterMix: 0.32,
        parkMix: 0.1,
        highwayMix: 0.16,
    },
    void: {
        light: false,
        waterFrom: 'accent',
        waterMix: 0.14,
        parkMix: 0.06,
        highwayMix: 0.1,
    },
    cyberpunk: {
        light: false,
        waterFrom: 'cool',
        waterMix: 0.48,
        parkMix: 0.14,
        highwayMix: 0.42,
    },
    ashlight: {
        light: true,
        waterFrom: 'cool',
        waterMix: 0.24,
        parkMix: 0.12,
        highwayMix: 0.08,
    },
    cream: {
        light: true,
        waterFrom: 'cool',
        waterMix: 0.18,
        parkMix: 0.1,
        highwayMix: 0.08,
    },
};

function cssVarToHex(name: string): string {
    const probe = document.createElement('span');
    probe.style.color = `var(${name})`;
    document.documentElement.append(probe);
    const rgb = getComputedStyle(probe).color;
    probe.remove();

    const canvas = document.createElement('canvas').getContext('2d');
    if (!canvas) return '#222222';
    canvas.fillStyle = rgb;
    return canvas.fillStyle;
}

function hexRgb(hex: string): [number, number, number] {
    const value = Number.parseInt(hex.slice(1), 16);
    return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

function mix(a: string, b: string, amount: number): string {
    const left = hexRgb(a);
    const right = hexRgb(b);
    const channel = (index: number) =>
        Math.round(left[index] + (right[index] - left[index]) * amount)
            .toString(16)
            .padStart(2, '0');
    return `#${channel(0)}${channel(1)}${channel(2)}`;
}

function readThemeId(): string {
    return THEME_IDS.find((id) => document.documentElement.classList.contains(id)) ?? 'void';
}

function readPalette(): Palette {
    return {
        surface: cssVarToHex('--color-surface-base'),
        elevated: cssVarToHex('--color-surface-elevated'),
        hovered: cssVarToHex('--color-surface-hovered'),
        accent: cssVarToHex('--color-accent'),
        muted: cssVarToHex('--color-fg-muted'),
        fg: cssVarToHex('--color-fg-base'),
        cool: cssVarToHex('--color-glacier-blue'),
    };
}

function mapStyles(themeId: string, palette: Palette): google.maps.MapTypeStyle[] {
    const recipe = RECIPES[themeId] ?? RECIPES.void;
    const waterTint = recipe.waterFrom === 'cool' ? palette.cool : palette.accent;
    const water = mix(palette.surface, waterTint, recipe.waterMix);
    const park = mix(palette.surface, palette.accent, recipe.parkMix);
    const highway = mix(palette.hovered, palette.accent, recipe.highwayMix);
    const label = recipe.light ? palette.fg : palette.muted;
    const smallLabel = mix(label, palette.surface, recipe.light ? 0.28 : 0.38);
    const waterLabel = recipe.waterFrom === 'cool' ? palette.cool : palette.accent;

    return [
        { elementType: 'geometry', stylers: [{ color: palette.surface }] },
        { elementType: 'labels.text.fill', stylers: [{ color: smallLabel }] },
        { elementType: 'labels.text.stroke', stylers: [{ visibility: 'off' }] },
        { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
        {
            featureType: 'administrative',
            elementType: 'geometry',
            stylers: [{ visibility: 'off' }],
        },
        {
            featureType: 'administrative.locality',
            elementType: 'labels.text.fill',
            stylers: [{ color: palette.accent }],
        },
        {
            featureType: 'administrative.neighborhood',
            elementType: 'labels.text.fill',
            stylers: [{ color: smallLabel }],
        },
        { featureType: 'poi', stylers: [{ visibility: 'off' }] },
        { featureType: 'transit', stylers: [{ visibility: 'off' }] },
        {
            featureType: 'landscape',
            elementType: 'geometry',
            stylers: [{ color: palette.surface }],
        },
        {
            featureType: 'landscape.man_made',
            elementType: 'geometry',
            stylers: [{ color: palette.elevated }],
        },
        {
            featureType: 'poi.park',
            elementType: 'geometry',
            stylers: [{ color: park, visibility: 'on' }],
        },
        {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{ color: palette.elevated }],
        },
        {
            featureType: 'road',
            elementType: 'labels',
            stylers: [{ visibility: 'simplified' }],
        },
        {
            featureType: 'road',
            elementType: 'labels.text.fill',
            stylers: [{ color: smallLabel }],
        },
        {
            featureType: 'road.arterial',
            elementType: 'geometry',
            stylers: [{ color: palette.hovered }],
        },
        {
            featureType: 'road.highway',
            elementType: 'geometry',
            stylers: [{ color: highway }],
        },
        {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{ color: water }],
        },
        {
            featureType: 'water',
            elementType: 'labels.text.fill',
            stylers: [{ color: waterLabel }],
        },
    ];
}

function LondonPin() {
    const map = useMap();

    useEffect(() => {
        if (!map) return;

        const el = document.createElement('div');
        el.className = 'mini-map__pin';
        el.title = LOCATION;

        const overlay = new google.maps.OverlayView();
        overlay.onAdd = () => {
            overlay.getPanes()?.overlayMouseTarget.appendChild(el);
        };
        overlay.draw = () => {
            const projection = overlay.getProjection();
            if (!projection) return;
            const point = projection.fromLatLngToDivPixel(
                new google.maps.LatLng(LONDON.lat, LONDON.lng)
            );
            if (!point) return;
            el.style.left = `${point.x}px`;
            el.style.top = `${point.y}px`;
        };
        overlay.onRemove = () => {
            el.remove();
        };
        overlay.setMap(map);

        return () => overlay.setMap(null);
    }, [map]);

    return null;
}

const MiniMap = () => {
    const [themeId, setThemeId] = useState('void');
    const [palette, setPalette] = useState<Palette | null>(null);

    useEffect(() => {
        const sync = () => {
            setThemeId(readThemeId());
            setPalette(readPalette());
        };

        sync();
        const observer = new MutationObserver(sync);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class', 'style'],
        });

        return () => observer.disconnect();
    }, []);

    const recipe = RECIPES[themeId] ?? RECIPES.void;
    const styles = useMemo(
        () => (palette ? mapStyles(themeId, palette) : []),
        [themeId, palette]
    );

    if (!apiKey) {
        return (
            <div className="mini-map mini-map--fallback">
                <p>{LOCATION}</p>
            </div>
        );
    }

    if (!palette) {
        return <div className="mini-map" />;
    }

    return (
        <div className="mini-map">
            <APIProvider apiKey={apiKey}>
                <Map
                    key={`${themeId}-${palette.accent}`}
                    defaultZoom={11}
                    defaultCenter={LONDON}
                    disableDefaultUI
                    clickableIcons={false}
                    gestureHandling="cooperative"
                    colorScheme={recipe.light ? 'LIGHT' : 'DARK'}
                    styles={styles}
                    style={{ width: '100%', height: '100%' }}
                >
                    <LondonPin />
                </Map>
            </APIProvider>

            <p className="mini-map__label">{LOCATION}</p>
        </div>
    );
};

export default MiniMap;
