"use client";

import { useEffect } from "react";

interface SlideDrawerProps {
  side: "left" | "right";
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  width?: string;
  label: string;
}

export function SlideDrawer({
  side,
  open,
  onClose,
  children,
  width,
  label,
}: SlideDrawerProps) {
  const drawerWidth = width ?? (side === "left" ? "280px" : "360px");

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-black/20 backdrop-blur-sm transition-opacity duration-300 ease-in-out md:bg-black/15 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden={!open}
      />

      <div
        className={`fixed top-0 z-40 flex h-full flex-col border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-xl transition-all duration-300 ease-in-out ${
          side === "left" ? "left-0 border-r" : "right-0 border-l"
        } ${open ? "translate-x-0" : side === "left" ? "-translate-x-full" : "translate-x-full"}`}
        style={{
          width: "min(100vw, var(--drawer-width))",
          ["--drawer-width" as string]: drawerWidth,
          boxShadow: "var(--drawer-shadow)",
        }}
        role="dialog"
        aria-label={label}
        aria-modal={open}
        // The drawer stays mounted so it can animate, so it must be inert while closed;
        // aria-hidden alone would still leave its controls in the tab order.
        inert={!open}
      >
        {children}
      </div>
    </>
  );
}
