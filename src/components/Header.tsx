"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { navLinks } from "@/lib/constants";
import { isActivePath } from "@/lib/nav";
import type { Weather } from "@/lib/weather";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaBars } from "react-icons/fa";
import MenuPanes from "./MenuPanes";
import MenuSheet from "./MenuSheet";

// Current time, updated every second
const subscribeToClock = (onChange: () => void) => {
  const interval = setInterval(onChange, 1000);
  return () => clearInterval(interval);
};

const getTime = () =>
  new Date().toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

// Viewport size, updated on resize
const subscribeToResize = (onChange: () => void) => {
  window.addEventListener("resize", onChange);
  return () => window.removeEventListener("resize", onChange);
};

const getViewport = () => `${window.innerWidth}x${window.innerHeight}`;

// Both are empty on the server and fill in once hydrated
const getEmptySnapshot = () => "";

type HeaderProps = {
  // London weather for the menu, loaded on the server
  weather: Promise<Weather | null>;
};

const Header = ({ weather }: HeaderProps) => {
  const time = useSyncExternalStore(
    subscribeToClock,
    getTime,
    getEmptySnapshot,
  );
  const viewport = useSyncExternalStore(
    subscribeToResize,
    getViewport,
    getEmptySnapshot,
  );
  const pathName = usePathname();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Close the menu whenever the page changes, from any link or the back button
  const [menuPath, setMenuPath] = useState(pathName);
  if (menuPath !== pathName) {
    setMenuPath(pathName);
    setIsOpen(false);
  }

  // Escape closes the menu and returns focus to its button
  useEffect(() => {
    if (!isOpen) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setIsOpen(false);
      menuButtonRef.current?.focus();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen]);

  const toggleMenu = () => {
    setIsOpen((open) => !open);
  };
  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-10 flex flex-col items-center justify-center">
        {/* Upper header */}
        <div className=" flex w-full justify-between items-center bg-surface-elevated border-b border-accent/10 px-4 py-2 sm:px-6 lg:px-10">
          {/* Mac window dots */}
          <div className="flex shrink-0 gap-2">
            <span className="size-3 rounded-full bg-danger/80" />
            <span className="size-3 rounded-full bg-warning/80" />
            <span className="size-3 rounded-full bg-success/80" />
          </div>

          {/* Header window dimensions */}
          <div className="hidden truncate text-ui font-bold tracking-default text-accent/60 md:block">
            DDEV — ZSH — {viewport}
          </div>
          <div className="shrink-0 text-ui font-bold tracking-default text-accent/60 md:block">
            {time}
          </div>
        </div>
        {/* Lower header */}
        <div className="flex w-full justify-between px-4 py-3 sm:px-6 lg:px-10 bg-surface-base/80 backdrop-blur-md">
          {/* site title */}
          <div className="flex min-w-0 items-center gap-1">
            <h2 className="truncate text-body font-bold text-accent sm:text-base">
              <span className="hidden sm:inline">ddev@dluksa.dev</span>
              <span className="sm:hidden">ddev</span>
              <span className="font-light text-fg-base">:</span>
              <span className="font-light text-primary">~$</span>
            </h2>

            <div className="flex h-4 w-2 shrink-0 animate-blink items-center justify-center bg-fg-base" />
          </div>
          {/* site navigation */}
          <nav className="flex items-center justify-center gap-6 lg:gap-10">
            {navLinks.map(({ title, url }) => (
              <Link
                key={title}
                href={url}
                className={`hidden text-ui uppercase tracking-wide transition-colors hover:text-accent sm:inline-flex ${
                  isActivePath(pathName, url)
                    ? "text-accent underline underline-offset-4"
                    : "text-accent/60"
                }`}
              >
                {title}
              </Link>
            ))}

            <button
              ref={menuButtonRef}
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
              aria-controls="menu-panes menu-sheet"
              className={`flex items-center justify-center size-9 shrink-0 cursor-pointer rounded-card border text-accent transition-colors hover:bg-accent/15 ${
                isOpen
                  ? "border-accent/40 bg-accent/15"
                  : "border-accent/25 bg-accent/5"
              }`}
              onClick={toggleMenu}
            >
              <FaBars size={14} />
            </button>
          </nav>
        </div>
        {/* Menus: tmux panes drawer on desktop, bottom sheet on mobile.
            Kept outside the blurred bar, because backdrop-blur would trap
            their fixed positioning inside the bar */}
        <MenuPanes
          open={isOpen}
          onClose={closeMenu}
          time={time}
          weather={weather}
        />
        <MenuSheet open={isOpen} onClose={closeMenu} />
      </header>
    </>
  );
};

export default Header;
