"use client";

// Timing hooks shared by the menu widgets

import { useEffect, useState, useSyncExternalStore } from "react";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

const subscribeToMotion = (onChange: () => void) => {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};

// True when the visitor asked for less motion
export const useReducedMotion = () =>
  useSyncExternalStore(
    subscribeToMotion,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false,
  );

// A counter that goes up every `ms` while running, and holds still otherwise
export const useTicker = (running: boolean, ms: number) => {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => setTick((t) => t + 1), ms);
    return () => clearInterval(interval);
  }, [running, ms]);

  return tick;
};

const subscribeEverySecond = (onChange: () => void) => {
  const interval = setInterval(onChange, 1000);
  return () => clearInterval(interval);
};

const subscribeNever = () => () => {};

// The current time to the second, updating only while active. Null on the
// server, so the first client render matches it
export const useNow = (active: boolean) => {
  const seconds = useSyncExternalStore(
    active ? subscribeEverySecond : subscribeNever,
    () => Math.floor(Date.now() / 1000),
    () => null,
  );
  return seconds === null ? null : new Date(seconds * 1000);
};
