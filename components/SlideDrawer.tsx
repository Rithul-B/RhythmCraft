"use client";

import { useEffect, useRef, useState } from "react";
import { useIsDesktopLayout } from "@/hooks/useIsDesktopLayout";

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
  const isDesktop = useIsDesktopLayout();
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragging = useRef(false);
  const startY = useRef(0);
  const dragYRef = useRef(0);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Prevent background rubber-banding while a sheet/drawer is open on iOS.
  useEffect(() => {
    if (!open) return;
    const main = document.querySelector("main");
    const prev = main instanceof HTMLElement ? main.style.overflow : "";
    if (main instanceof HTMLElement) main.style.overflow = "hidden";
    return () => {
      if (main instanceof HTMLElement) main.style.overflow = prev;
    };
  }, [open]);

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    dragging.current = true;
    setIsDragging(true);
    startY.current = e.clientY;
    dragYRef.current = 0;
    e.currentTarget.setPointerCapture?.(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!dragging.current) return;
    const delta = Math.max(0, e.clientY - startY.current);
    dragYRef.current = delta;
    setDragY(delta);
  }

  function onPointerUp(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragging.current) return;
    dragging.current = false;
    setIsDragging(false);
    e.currentTarget.releasePointerCapture?.(e.pointerId);
    if (dragYRef.current > 100) onClose();
    dragYRef.current = 0;
    setDragY(0);
  }

  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-black/20 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden={!open}
      />

      {!isDesktop ? (
        <div
          className="fixed inset-x-0 bottom-0 z-40 flex flex-col rounded-t-3xl border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-xl"
          style={{
            boxShadow: "var(--drawer-shadow)",
            maxHeight: "min(90dvh, 90%)",
            paddingBottom: "env(safe-area-inset-bottom, 0px)",
            transform: open
              ? `translate3d(0, ${dragY}px, 0)`
              : "translate3d(0, 100%, 0)",
            transition: isDragging ? "none" : "transform 300ms ease-in-out",
            willChange: "transform",
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
          className={`fixed top-0 bottom-0 z-40 flex flex-col border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-xl transition-transform duration-300 ease-in-out ${
            side === "left" ? "left-0 border-r" : "right-0 border-l"
          } ${open ? "translate-x-0" : side === "left" ? "-translate-x-full" : "translate-x-full"}`}
          style={{
            width: "min(100vw, var(--drawer-width))",
            ["--drawer-width" as string]: drawerWidth,
            boxShadow: "var(--drawer-shadow)",
            paddingTop: "env(safe-area-inset-top, 0px)",
            paddingBottom: "env(safe-area-inset-bottom, 0px)",
          }}
          role="dialog"
          aria-label={label}
          aria-modal={open}
          inert={!open}
        >
          <div className="flex h-full min-h-0 flex-col overflow-hidden">{children}</div>
        </div>
      )}
    </>
  );
}
