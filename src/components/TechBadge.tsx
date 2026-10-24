import { getTech } from "@/lib/technologies";
import type { CSSProperties } from "react";

type TechBadgeProps = {
  name: string;
  size?: "sm" | "md";
};

const baseClasses = "inline-flex items-center gap-2 border";
const sizeClasses = {
  sm: "gap-1.5 rounded-card px-2 py-1 font-display text-ui leading-none tracking-default",
  md: "gap-2 rounded-card px-4 py-2 font-display text-ui leading-none tracking-default",
};

const TechBadge = ({ name, size = "md" }: TechBadgeProps) => {
  const { label, icon: Icon, color } = getTech(name);

  return (
    <div
      className={`${baseClasses} ${sizeClasses[size]} bg-[color-mix(in_srgb,var(--tech)_6%,transparent)] border-[color-mix(in_srgb,var(--tech)_20%,transparent)]`}
      style={{ "--tech": color } as CSSProperties}
    >
      <Icon className="text-(--tech)" />
      {label}
    </div>
  );
};

export default TechBadge;