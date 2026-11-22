"use client";
import React, { useState, useEffect } from "react";

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
        className={`fixed inset-0  h-dvh bg-black/50  transition-opacity duration-300 ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
      >
        <aside
          id="sidebar"
          inert={!open}
          className={`fixed top-0 right-0 z-50 flex h-dvh w-72 max-w-[85vw] flex-col gap-6 border-l border-accent/20 bg-surface-elevated p-4 transition-transform duration-300 ease-out ${open ? 'translate-x-0':'translate-x-full'}`}
        ></aside>
      </div>
    </>
  );
}
