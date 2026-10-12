"use client";

import React from "react";
import { useTheme } from "next-themes";

const ThemeSwitcher = () => {
  const { setTheme } = useTheme();

  return (
    <div>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mr-2 text-base"
        onClick={() => setTheme("cyberpunk")}
      >
        Cream
      </button>
    </div>
  );
};

export default ThemeSwitcher;
