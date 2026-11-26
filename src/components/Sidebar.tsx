"use client";
import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import ThemeSwitcher from "./ThemeSwitcher";
import { navLinks, SocialLinks } from "@/lib/constants";
import Link from "next/link";
import Socials from "./Socials";

type SidebarProps = {
  open: boolean;
  onClose: () => void;
};

export default function Sidebar({ open, onClose }: SidebarProps) {
  console.log(open);

  useEffect(() => {
    if (!open) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ESCAPE") onClose();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40  h-dvh bg-black/50  transition-opacity duration-300 ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
      >
        <aside
          id="sidebar"
          inert={!open}
          className={`fixed top-0 right-0 z-40 flex h-dvh w-75  sm:w-100 max-w-[100vw] flex-col gap-6 border border-accent/20 bg-surface-elevated p-4 transition-transform duration-300 ease-out ${open ? "translate-x-0" : "translate-x-full"}`}
        >
          <button
            aria-label="Close menu"
            onClick={onClose}
            className={`flex size-9 cursor-pointer items-center justify-center rounded-card border border-accent/20 bg-accent/10 hover:text-accent transition-colors hover:bg-accent/15`}
          >
            <FaTimes size={14} />
          </button>

          <section className="flex flex-col h-full justify-between">
            {/* Theme switcher */}
            <div className="">
              <ThemeSwitcher />
            </div>

            {/* Site navigation links */}
            <div className="flex flex-col gap-2 border-accent/20">
              <h1 className="flex border-b border-accent/20 w-full justify-center ">Navigation</h1>
              <div className="flex flex-col gap-2 pl-3">
                {navLinks.map(({ title, url }) => (
                  <Link href={url}>
                    <>
                      <span className="text-primary">~</span>
                      <span className="text-accent">/</span>
                    </>
                    {title}
                  </Link>
                ))}
              </div>
            </div>

            {/* Social icon-links */}
            <div className="flex flex-col gap-2 items-center justify-center p-3">
            <h1 className="flex w-full justify-center border-b border-accent/20 ">Socials</h1>
              <Socials />
            </div>
          </section>
        </aside>
      </div>
    </>
  );
}
