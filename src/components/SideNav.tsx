import { navLinks } from "@/lib/constants";
import Link from "next/link";
import { ReactNode, useEffect } from "react";

type SideNavProps = {
  open: boolean;
  onClose: () => void;
};

type PaneProps = {
  children?: ReactNode;
  className?: string;
};

const Pane = ({ children, className = "" }: PaneProps) => {
  return (
    <div role="group" className={`flex flex-col gap-3 p-3 ${className}`}>
      {children}
    </div>
  );
};

export default function SideNav({ open, onClose }: SideNavProps) {
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key == "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);

    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

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
        <Pane className="flex flex-col gap-2 p-3 shrin-0" aria-label="nav">
          <div className="flex items-center justify-between">
            <span className="text-accent text-ui">0:nav</span>
            <button
              className="flex items-center px-1.5 bg-accent/5 border-accent/25 hover:bg-accent/15 cursor-pointer text-accent text-ui 0 box rounded"
              onClick={onClose}
            >
              esc
            </button>
          </div>
          <nav className="flex flex-col" aria-label="menu">
            {navLinks.map(({ title, url }) => (
              <Link
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
