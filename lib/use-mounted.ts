'use client';

import { useSyncExternalStore } from 'react';

const neverChanges = () => () => {};

/**
 * False while server rendering and during hydration, true afterwards.
 * Lets a component defer browser-only state — a stored theme, for example —
 * until after hydration without causing a markup mismatch.
 */
export function useMounted(): boolean {
    return useSyncExternalStore(
        neverChanges,
        () => true,
        () => false
    );
}
