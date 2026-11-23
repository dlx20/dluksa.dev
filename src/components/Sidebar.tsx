"use client";
import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import ThemeSwitcher from "./ThemeSwitcher";

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
          className={`fixed top-0 right-0 z-50 flex h-dvh w-100 max-w-[85vw] flex-col gap-6 border-l border-accent/20 bg-surface-elevated p-4 transition-transform duration-300 ease-out ${open ? "translate-x-0" : "translate-x-full"}`}
        >
          <button
            aria-label="Close menu"
            onClick={onClose}
            className={`flex size-9 cursor-pointer items-center justify-center rounded-card border border-accent/20 bg-accent/10 hover:text-accent transition-colors hover:bg-accent/15`}
          >
            <FaTimes size={14} />
          </button>

          <div>
            <ThemeSwitcher />
          </div>
        </aside>
      </div>
    </>
  );
}
