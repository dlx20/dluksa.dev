"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks } from "@/lib/constants";
import { isActivePath } from "@/lib/nav";
import { themes, useActiveTheme } from "@/lib/theme";
import AccentPicker from "./AccentPicker";
import Socials from "./Socials";

type MenuSheetProps = {
  open: boolean;
  onClose: () => void;
};

// Matches Tailwind's md breakpoint; the sheet is only used below it
const MOBILE_QUERY = "(width < 48rem)";

// Mobile menu: a bottom sheet with a vim-style status line, below md
export default function MenuSheet({ open, onClose }: MenuSheetProps) {
  const pathName = usePathname();
  const { theme, setTheme } = useActiveTheme();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // While open on a phone: move focus into the sheet and stop the page
  // behind it from scrolling
  useEffect(() => {
    if (!open || !window.matchMedia(MOBILE_QUERY).matches) return;

    closeButtonRef.current?.focus({ preventScroll: true });
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [open]);

  return (
    <div className="md:hidden">
      {/* Backdrop, a sibling of the sheet so clicks inside the sheet don't close it */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <div
        id="menu-sheet"
        role="dialog"
        aria-label="Menu"
        inert={!open}
        className={`fixed inset-x-0 bottom-0 z-50 flex max-h-[85dvh] flex-col overflow-y-auto overscroll-contain rounded-t-2xl border-t border-accent/25 bg-surface-elevated pb-[env(safe-area-inset-bottom)] transition-transform duration-300 ease-out ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="flex flex-col gap-4 px-4 pt-2 pb-4">
          <span
            aria-hidden="true"
            className="mx-auto h-1 w-9 rounded-full bg-fg-muted/40"
          />

          {/* Command-mode prompt */}
          <div className="flex items-center justify-between">
            <p className="flex items-center">
              <span className="text-accent">:</span>menu
              <span
                aria-hidden="true"
                className="ml-0.5 inline-block h-4 w-2 animate-blink bg-fg-base"
              />
            </p>
            <button
              ref={closeButtonRef}
              type="button"
              aria-label="Close menu"
              onClick={onClose}
              className="cursor-pointer rounded-card border border-accent/25 bg-accent/5 px-2.5 py-1 text-ui text-accent transition-colors hover:bg-accent/15"
            >
              :q
            </button>
          </div>

          {/* Pages */}
          <nav aria-label="Menu" className="flex flex-col">
            {navLinks.map(({ title, url }, index) => {
              const active = isActivePath(pathName, url);
              return (
                <Link
                  key={url}
                  href={url}
                  onNavigate={onClose}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center justify-between rounded px-2 py-2 transition-colors ${
                    active
                      ? "bg-surface-hovered text-accent"
                      : "text-fg-base hover:bg-surface-hovered"
                  }`}
                >
                  {title.toLowerCase()}
                  <span className="text-ui text-fg-muted">{index + 1}</span>
                </Link>
              );
            })}
          </nav>

          {/* Theme and accent */}
          <div role="group" aria-label="Theme" className="flex flex-wrap gap-1.5">
            {themes.map(({ name, class: value }) => {
              const active = theme === value;
              return (
                <button
                  key={value}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setTheme(value)}
                  className={`cursor-pointer rounded-card border px-2.5 py-1 text-ui transition-colors ${
                    active
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-accent/20 text-fg-muted hover:border-accent/40 hover:text-accent"
                  }`}
                >
                  {name.toLowerCase()}
                </button>
              );
            })}
          </div>
          <AccentPicker size="lg" className="justify-between px-1" />

          <Socials />
        </div>

        {/* Vim-style status line */}
        <div className="flex items-center bg-surface-base text-ui">
          <span className="bg-accent px-2 py-0.5 font-bold text-surface-base">
            MENU
          </span>
          <span className="truncate px-2 text-fg-base">
            ~{pathName === "/" ? "" : pathName}
          </span>
          <span className="ml-auto px-3 text-fg-muted">{theme}</span>
        </div>
      </div>
    </div>
  );
}
