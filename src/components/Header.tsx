"use client";

import { useEffect, useState } from "react";
import { navLinks } from "@/lib/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Header = () => {
  const [time, setTime] = useState<string>("");
  const [viewport, setViewport] = useState<string>("");
  const pathName = usePathname()

  // get current time
  const currentTime = () => {
    setTime(
      new Date().toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    );
  };

  // Get vieport width
  const windowDimmensions = () => {
    setViewport(`${window.innerWidth}x${window.innerHeight}`);
  };

  useEffect(() => {
    currentTime();
    const interval = setInterval(currentTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    windowDimmensions();
    window.addEventListener("resize", windowDimmensions);
    return () => window.removeEventListener("resize", windowDimmensions);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-30 flex flex-col items-center justify-center bg-surface-elevated px-4 py-2 sm:px-6 lg:px-10 font-display backdrop-blur-md">
        {/* Upper header */}
        <div className="flex w-full justify-between items-center border-b border-accent/10 p-2">
          {/* Mac window dots */}
          <div className="flex shrin-0 gap-2">
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
        <div className="flex w-full justify-between p-2">
          {/* site title */}
          <div className="flex min-w-0 items-center gap-1">
            <h2 className="truncate text-body font-bold text-accent sm:text-base">
              <span className="hidden sm:inline">ddev@dluksa.dev</span>
              <span className="sm:hidden">ddev</span>
              <span className="font-light text-fg-base">:</span>
              <span className="font-light text-primary">~</span>
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
                  pathName === url || (url !== '/' && pathName.startsWith(url)) ? 'text-accent underline underline-offset-4' : ''
                }`}
              >
                {title}
              </Link>
            ))}
          </nav>
        </div>
      </header>
    </>
  );
};

export default Header;
