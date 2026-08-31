'use client';

/**
 * The accent colour is a CSS variable rather than a theme class, so it lives
 * outside next-themes. This tiny store keeps every `AccentSwitcher` on the page
 * in sync and is readable with `useSyncExternalStore`.
 */

const STORAGE_KEY = 'accent-color';

export const DEFAULT_ACCENT = 'sage-green';

const listeners = new Set<() => void>();

export function subscribe(listener: () => void): () => void {
    listeners.add(listener);
    // Keep other browser tabs in step.
    window.addEventListener('storage', listener);

    return () => {
        listeners.delete(listener);
        window.removeEventListener('storage', listener);
    };
}

export function getAccent(): string {
    return localStorage.getItem(STORAGE_KEY) ?? DEFAULT_ACCENT;
}

/** Snapshot used while server rendering and hydrating. */
export function getDefaultAccent(): string {
    return DEFAULT_ACCENT;
}

function applyAccent(accent: string): void {
    document.documentElement.style.setProperty('--color-accent', `var(--color-${accent})`);
}

export function setAccent(accent: string): void {
    localStorage.setItem(STORAGE_KEY, accent);
    applyAccent(accent);
    listeners.forEach((listener) => listener());
}

/** Re-apply the stored accent after a page load. */
export function restoreAccent(): void {
    applyAccent(getAccent());
}
