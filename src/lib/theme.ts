"use client";
import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";

// Themes
export const themes = [
  { name: "Ashlight", class: "ashlight" },
  { name: "Cream", class: "cream" },
  { name: "Palenight", class: "palenight" },
  { name: "Void", class: "void" },
  { name: "Cyberpunk", class: "cyberpunk" },
];

// Accent colors

export const AccentColors = [
  "--color-coral-rose",
  "--color-sage-green",
  "--color-amber-glow",
  "--color-glacier-blue",
  "--color-orchid-purple",
  "--color-sky-blue",
  "--color-steel-grey",
];

// accent caching ///////////////////////////////////////////////////////////////////////////////
const STORAGE_KEY = "accent-color";
export const DEFAULT_ACCENT = "";
const listeners = new Set<() => void>();

export const subscribe = (listener: () => void) => {
  listeners.add(listener);
  window.addEventListener("storage", listener);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
};

export const getAccent = (): string => {
  return localStorage.getItem(STORAGE_KEY) ?? DEFAULT_ACCENT;
};

export const getDefaultAccent = (): string => {
  return DEFAULT_ACCENT;
};

export const applyAccent = (accent: string): void => {
  document.documentElement.style.setProperty(
    "--color-accent",
    `var(${accent})`,
  );
};
export const setAccent = (accent: string): void => {
  localStorage.setItem(STORAGE_KEY, accent);
  applyAccent(accent);
  listeners.forEach((listener) => listener());
};

export const restoreAccent = (): void => {
  applyAccent(getAccent());
  // DEFAULT_ACCENT = getAccent()
};

// Active accent, empty until hydrated
export const useAccent = () =>
  useSyncExternalStore(subscribe, getAccent, getDefaultAccent);

// The saved theme only exists in the browser, so it stays undefined until
// hydration to keep the server and first client render identical
const subscribeNoop = () => () => {};

export const useActiveTheme = () => {
  const { theme, setTheme } = useTheme();
  const hydrated = useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );
  return { theme: hydrated ? theme : undefined, setTheme };
};

/////////////////////////////////////////////////////////////////////////////////////////////////