"use client";

import { AccentColors, setAccent, useAccent } from "@/lib/theme";

const sizes = {
  sm: "size-5",
  lg: "size-8",
} as const;

type AccentPickerProps = {
  size?: keyof typeof sizes;
  className?: string;
};

// "--color-coral-rose" -> "coral rose"
const accentName = (color: string) =>
  color.replace("--color-", "").replaceAll("-", " ");

const AccentPicker = ({ size = "sm", className = "" }: AccentPickerProps) => {
  const activeAccent = useAccent();

  return (
    <div
      role="group"
      aria-label="Accent color"
      className={`flex gap-1.5 ${className}`}
    >
      {AccentColors.map((color) => {
        const isActive = activeAccent === color;
        return (
          <button
            key={color}
            type="button"
            aria-label={accentName(color)}
            aria-pressed={isActive}
            onClick={() => setAccent(color)}
            className={`shrink-0 cursor-pointer rounded ${sizes[size]} ${isActive ? "outline-2 outline-offset-2" : ""}`}
            style={{
              backgroundColor: `var(${color})`,
              outlineColor: `var(${color})`,
            }}
          />
        );
      })}
    </div>
  );
};

export default AccentPicker;
