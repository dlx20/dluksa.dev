"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import {
  AccentColors,
  themes,
  getAccent,
  getDefaultAccent,
  setAccent,
  subscribe,
} from "@/lib/theme";

import { useLayoutEffect } from "react";

const ThemeSwitcher = () => {
  const { setTheme } = useTheme();
  const activeAccent = useSyncExternalStore(
    subscribe,
    getAccent,
    getDefaultAccent,
  );

  return (
    <div className="p-3 border border-accent flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-2">
        {themes.map((theme) => (
          <button
            className="gap-3 p-2 border border-primary last:col-span-2"
            key={theme.name}
            onClick={() => setTheme(theme.class)}
          >
            {theme.name}
          </button>
        ))}
      </div>
      <div className="flex gap-2 flex-wrap">
        {AccentColors.map((color) => (
          <button
            key={color}
            onClick={() => setAccent(color)}
            className="size-10 border"
            style={{ backgroundColor: `var(${color}) ` }}
          >
            {}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThemeSwitcher;
