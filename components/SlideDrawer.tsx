"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

interface SlideDrawerProps {
  side: "left" | "right";
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  width?: string;
  label: string;
}

const MD_QUERY = "(min-width: 768px)";

function subscribeMd(onChange: () => void) {
  const mql = window.matchMedia(MD_QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

function getMdSnapshot() {
  return window.matchMedia(MD_QUERY).matches;
}

function getMdServerSnapshot() {
  return true;
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
  const isDesktop = useSyncExternalStore(subscribeMd, getMdSnapshot, getMdServerSnapshot);
  const [dragY, setDragY] = useState(0);
  const dragging = useRef(false);
  const startY = useRef(0);
  // Reset drag offset when the sheet closes without an effect-driven setState.
  const effectiveDragY = open ? dragY : 0;

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  function onPointerDown(e: React.PointerEvent) {
    dragging.current = true;
    startY.current = e.clientY;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!dragging.current) return;
    const delta = Math.max(0, e.clientY - startY.current);
    setDragY(delta);
  }

  function onPointerUp() {
    if (!dragging.current) return;
    dragging.current = false;
    if (dragY > 120) onClose();
    setDragY(0);
  }

  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-black/20 backdrop-blur-sm transition-opacity duration-300 ease-in-out md:bg-black/15 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden={!open}
      />

      {!isDesktop ? (
        <div
          className={`fixed inset-x-0 bottom-0 z-40 flex max-h-[90vh] flex-col rounded-t-3xl border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-xl transition-transform duration-300 ease-in-out ${
            open ? "translate-y-0" : "translate-y-full"
          }`}
          style={{
            boxShadow: "var(--drawer-shadow)",
            transform: open ? `translateY(${effectiveDragY}px)` : undefined,
          }}
          role="dialog"
          aria-label={label}
          aria-modal={open}
          inert={!open}
          data-testid={open ? "mobile-bottom-sheet" : undefined}
        >
          <div
            className="flex cursor-grab touch-none justify-center py-3 active:cursor-grabbing"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            <div className="h-1.5 w-12 rounded-full bg-[var(--muted-light)]" />
          </div>
          <div className="min-h-0 flex-1 overflow-hidden">{children}</div>
        </div>
      ) : (
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
          inert={!open}
        >
          {children}
        </div>
      )}
    </>
  );
}
