import { getTech } from "@/lib/technologies";
import type { CSSProperties } from "react";

type TechBadgeProps = {
  name: string;
  size?: "sm" | "md";
};

const baseClasses = "inline-flex items-center gap-2 border";
const sizeClasses = {
  sm: "gap-1.5 rounded-card px-2 py-1 font-display text-ui leading-none tracking-default",
  md: "gap-2 rounded-card px-2.5 py-1.5 text-body leading-none tracking-default",
};

const TechBadge = ({ name, size = "md" }: TechBadgeProps) => {
  const { label, icon: Icon, color } = getTech(name);

  return (
    <div
      className={`${baseClasses} ${sizeClasses[size]} bg-[color-mix(in_srgb,var(--tech)_6%,transparent)] border-[color-mix(in_srgb,var(--tech)_18%,transparent)]`}
      style={{ "--tech": color } as CSSProperties}
    >
      <Icon className="text-[color-mix(in_okLab,var(--tech)_40%,var(--color-fg-muted))] size-4 shrink-0" />
      {label}
    </div>
  );
};

export default TechBadge;