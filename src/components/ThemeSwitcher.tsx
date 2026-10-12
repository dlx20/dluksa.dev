"use client";

import React from "react";
import { useTheme } from "next-themes";
import { themes } from "@/lib/theme";

const ThemeSwitcher = () => {
  const { setTheme } = useTheme();

  return (
    <div className="w-full p-3 border border-accent flex gap-3">
      {
        themes.map((theme) =>(
          <button
            className="gap-3 p-2 border border-primary"
            key={theme.name}
            onClick={() => setTheme(theme.class)}
          >
            {theme.name}
          </button>
        ))
      }
    </div>
  );
};

export default ThemeSwitcher;
