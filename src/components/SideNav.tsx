import { useEffect } from "react";

type SideNavProps = {
  open: boolean;
  onClose: () => void;
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
        className={`fixed top-0 right-0 bg-surface-elevated h-dvh w-100 transition-transform duration-300 ease-out ${open ? "translate-x-0" : "translate-x-full"}`}
        id="sidebar"
        inert={!open}
      >
        <div className="flex items-center justify-between p-4 py-5">
          <p className="text-accent text-ui">0:nav</p>
          <button className="flex items-center px-1.5 bg-accent/5 border-accent/25 hover:bg-accent/15 cursor-pointer text-accent text-ui 0 box rounded" onClick={onClose}>esc</button>
        </div>
        <nav>
          
        </nav>
      </aside>
    </>
  );
}
