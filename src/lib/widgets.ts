"use client";

// Which widgets the menu shows and in what order, saved per visitor

import { useSyncExternalStore } from "react";

export const WIDGET_IDS = ["weather", "clock", "boot", "fortune", "visitor"] as const;
export type WidgetId = (typeof WIDGET_IDS)[number];

export const DEFAULT_WIDGETS: WidgetId[] = ["weather", "clock"];

const STORAGE_KEY = "menu-widgets";
const listeners = new Set<() => void>();

// The saved JSON, read once and then kept in memory, so changes still work
// when storage is unavailable (private windows, blocked site data)
let saved: string | null | undefined;
let parsedFrom: string | null | undefined;
let parsed: WidgetId[] = DEFAULT_WIDGETS;

const isWidgetId = (value: unknown): value is WidgetId =>
  WIDGET_IDS.includes(value as WidgetId);

// Unknown or repeated ids are dropped, so old saves never break the menu
const parse = (raw: string | null): WidgetId[] => {
  if (raw === null) return DEFAULT_WIDGETS;
  try {
    const ids: unknown = JSON.parse(raw);
    return Array.isArray(ids) ? [...new Set(ids.filter(isWidgetId))] : DEFAULT_WIDGETS;
  } catch {
    return DEFAULT_WIDGETS;
  }
};

const readSaved = () => {
  if (saved === undefined) {
    try {
      saved = localStorage.getItem(STORAGE_KEY);
    } catch {
      saved = null;
    }
  }
  return saved;
};

const notify = () => listeners.forEach((listener) => listener());

// Another tab changed the layout
const handleStorage = (e: StorageEvent) => {
  if (e.key !== STORAGE_KEY) return;
  saved = e.newValue;
  notify();
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  if (listeners.size === 1) window.addEventListener("storage", handleStorage);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener("storage", handleStorage);
  };
};

// Same array until the saved value changes, as useSyncExternalStore needs
const getWidgets = () => {
  const raw = readSaved();
  if (raw !== parsedFrom) {
    parsedFrom = raw;
    parsed = parse(raw);
  }
  return parsed;
};

const getServerWidgets = () => DEFAULT_WIDGETS;

export const setWidgets = (ids: WidgetId[]) => {
  saved = JSON.stringify(ids);
  try {
    localStorage.setItem(STORAGE_KEY, saved);
  } catch {
    // Storage unavailable, so the layout lasts until the page reloads
  }
  notify();
};

// The defaults on the server and first render, then the visitor's layout
export const useWidgets = () =>
  useSyncExternalStore(subscribe, getWidgets, getServerWidgets);
