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

import { MdOutlinePalette } from "react-icons/md";

const ThemeSwitcher = () => {
  const { setTheme } = useTheme();
  const activeAccent = useSyncExternalStore(
    subscribe,
    getAccent,
    getDefaultAccent,
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <MdOutlinePalette size={40} className="fill-accent box p-1 bg-accent/10 border-none"/>
        <h3 className="flex flex-col text-accent">Appearance <span className="text-fg-muted">Themes and accents</span></h3>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {themes.map((theme) => (
          <button
            className="btn last:col-span-2"
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
            className="size-10"
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
