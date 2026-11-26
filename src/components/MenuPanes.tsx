"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks } from "@/lib/constants";
import { isActivePath } from "@/lib/nav";
import { themes, useActiveTheme } from "@/lib/theme";
import type { Weather } from "@/lib/weather";
import AccentPicker from "./AccentPicker";
import Socials from "./Socials";
import WidgetStack from "./widgets/WidgetStack";

type MenuPanesProps = {
  open: boolean;
  onClose: () => void;
  // Clock from the header, shown on the right of the status bar
  time: string;
  // London weather, loaded on the server
  weather: Promise<Weather | null>;
};

const PANES = ["nav", "widgets", "theme", "accent", "net"] as const;

// Matches Tailwind's md breakpoint; the panes are only used from it up
const DESKTOP_QUERY = "(width >= 48rem)";

type PaneProps = {
  index: number;
  active: boolean;
  onFocus: () => void;
  className?: string;
  // Extra control on the right of the pane's title
  action?: ReactNode;
  children: ReactNode;
};

// One tmux pane: a "0:nav" style title, then its content
function Pane({ index, active, onFocus, className = "", action, children }: PaneProps) {
  return (
    <div
      role="group"
      aria-label={PANES[index]}
      onFocus={onFocus}
      className={`flex flex-col gap-2 p-3 ${className}`}
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
}

// Desktop menu: a drawer split into tmux panes, from md up
export default function MenuPanes({
  open,
  onClose,
  time,
  weather,
}: MenuPanesProps) {
  const pathName = usePathname();
  const { theme, setTheme } = useActiveTheme();
  // The pane holding focus, starred in the status bar like tmux's active window
  const [activePane, setActivePane] = useState(0);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Move focus into the drawer when it opens on desktop
  useEffect(() => {
    if (!open || !window.matchMedia(DESKTOP_QUERY).matches) return;
    closeButtonRef.current?.focus({ preventScroll: true });
  }, [open]);

  const pane = (index: number) => ({
    index,
    active: activePane === index,
    onFocus: () => setActivePane(index),
  });

  return (
    <div className="hidden md:block">
      {/* Backdrop, a sibling of the drawer so clicks inside the drawer don't close it */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <div
        id="menu-panes"
        role="dialog"
        aria-label="Menu"
        inert={!open}
        className={`fixed top-0 right-0 z-50 flex h-dvh w-80 flex-col border-l border-accent/20 bg-surface-elevated transition-transform duration-300 ease-out lg:w-96 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* 0: pages */}
        <Pane
          {...pane(0)}
          className="shrink-0"
          action={
            <button
              ref={closeButtonRef}
              type="button"
              aria-label="Close menu"
              onClick={onClose}
              className="cursor-pointer rounded border border-accent/25 bg-accent/5 px-1.5 text-ui text-accent transition-colors hover:bg-accent/15"
            >
              esc
            </button>
          }
        >
          <nav aria-label="Menu" className="flex flex-col">
            {navLinks.map(({ title, url }) => {
              const active = isActivePath(pathName, url);
              return (
                <Link
                  key={url}
                  href={url}
                  onNavigate={onClose}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center justify-between rounded px-2 py-1 transition-colors hover:bg-surface-hovered ${
                    active ? "bg-surface-hovered text-accent" : "text-fg-base"
                  }`}
                >
                  <span>
                    <span className="text-primary">~</span>
                    <span className="text-accent">/</span>
                    {title.toLowerCase()}
                  </span>
                  {active && (
                    <span aria-hidden="true" className="text-ui">
                      ●
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </Pane>

        {/* 1: widgets, filling the space between the pages and settings.
            The stack scrolls on its own when it's taller than the pane */}
        <Pane
          {...pane(1)}
          className="min-h-0 flex-1 overflow-hidden border-t border-accent/25"
        >
          <WidgetStack active={open} weather={weather} />
        </Pane>

        <div className="flex border-t border-accent/25">
          {/* 2: theme */}
          <Pane {...pane(2)} className="flex-1">
            <div className="flex flex-col">
              {themes.map(({ name, class: value }) => {
                const active = theme === value;
                return (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setTheme(value)}
                    className={`flex cursor-pointer items-center gap-2 rounded px-1 py-0.5 text-left transition-colors hover:text-accent ${
                      active ? "text-accent" : "text-fg-muted"
                    }`}
                  >
                    <span aria-hidden="true">{active ? "●" : "○"}</span>
                    {name.toLowerCase()}
                  </button>
                );
              })}
            </div>
          </Pane>

          {/* 3: accent */}
          <Pane {...pane(3)} className="w-32 border-l border-accent/25">
            <AccentPicker className="flex-wrap" />
          </Pane>
        </div>

        {/* 4: socials */}
        <Pane {...pane(4)} className="border-t border-accent/25">
          <Socials />
        </Pane>

        {/* tmux status bar */}
        <div className="flex items-center justify-between gap-2 bg-accent px-2 py-0.5 text-ui text-surface-base">
          <span className="truncate">
            {/* Dropped on the narrower drawer so all five panes fit */}
            <span className="hidden lg:inline">[ddev] </span>
            {PANES.map(
              (name, index) =>
                `${index}:${name}${index === activePane ? "*" : ""}`,
            ).join(" ")}
          </span>
          <span className="shrink-0">{time}</span>
        </div>
      </div>
    </div>
  );
}
