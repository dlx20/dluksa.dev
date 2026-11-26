"use client";

import { navLinks } from "@/lib/constants";
import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";

// Panes/Sections titles
const PANES = ["nav", "widgets", "theme", "accent", "net"] as const;

// Func props
type SideNavProps = {
  open: boolean;
  onClose: () => void;
};

type PaneProps = {
  children?: ReactNode;
  className?: string;
  active?: boolean;
  onFocus?: () => void;
  action?: ReactNode;
  index: number;
};

// Panes
const Pane = ({
  children,
  className = "",
  active,
  onFocus,
  action,
  index,
}: PaneProps) => {
  return (
    <div
      role="group"
      onFocus={onFocus}
      className={`flex flex-col gap-3 p-3 ${className}`}
    >
      <div className="flex items-center justify-between">
        <span className={`text-ui ${active ? "text-accent" : "text-fg-muted"}`}>
          {index}:{PANES[index]}
        </span>
        {action}
      </div>
      {children}
    </div>
  );
};

// main components
export default function SideNav({ open, onClose }: SideNavProps) {
  // Pane indexes
  const [activePane, setActivePane] = useState(0);
  const pane = (index: number) => ({
    index,
    active: activePane === index,
    onFocus: () => setActivePane(index),
  });

  return (
    <>
      <div
        aria-hidden="true"
        onClick={onClose}
        inert={!open}
        id="overlay"
        className={`fixed inset-0 h-dvh bg-black/50 ${open ? "opacity-100" : "opacity-0"}`}
      />

      <aside
        className={`fixed top-0 right-0 bg-surface-elevated h-dvh w-96 transition-transform duration-300 ease-out ${open ? "translate-x-0" : "translate-x-full"}`}
        id="sidebar"
        inert={!open}
      >
        <Pane
          {...pane(0)}
          className="flex flex-col gap-2 p-3 shrin-0"
          aria-label="nav"
          action={
            <button
              type="button"
              aria-label="Close menu"
              onClick={onClose}
              className="flex items-center px-1.5 bg-accent/5 border-accent/25 hover:bg-accent/15 cursor-pointer text-accent text-ui 0 box rounded"
            >
              esc
            </button>
          }
        >
          <nav className="flex flex-col" aria-label="menu">
            {navLinks.map(({ title, url }) => (
              <Link
                key={url}
                href={url}
                className="flex items-center justify-between px-2 p-1 transition-colors hover:bg-surface-hovered.text-accent"
              >
                <span>
                  <span className="text-primary">~</span>
                  <span className="text-accent">/</span>
                  {title}
                </span>
                <span className="text-ui text-accent">●</span>
              </Link>
            ))}
          </nav>
        </Pane>
      </aside>
    </>
  );
}
