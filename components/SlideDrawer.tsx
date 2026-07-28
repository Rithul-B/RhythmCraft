"use client";

import { useEffect, useRef, useState } from "react";
import { useIsDesktopLayout } from "@/hooks/useIsDesktopLayout";
import { useStableViewport } from "@/hooks/useStableViewport";

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
  const { bottomInset, viewportHeight } = useStableViewport();
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

  useEffect(() => {
    if (!open) return;
    const main = document.querySelector("main");
    const prevOverflow = main instanceof HTMLElement ? main.style.overflow : "";
    const prevTouch = document.body.style.touchAction;
    if (main instanceof HTMLElement) main.style.overflow = "hidden";
    document.body.style.touchAction = "none";
    return () => {
      if (main instanceof HTMLElement) main.style.overflow = prevOverflow;
      document.body.style.touchAction = prevTouch;
    };
  }, [open]);

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    // Only primary touch/mouse — ignore multi-touch glitches on Android.
    if (e.isPrimary === false) return;
    dragging.current = true;
    setIsDragging(true);
    startY.current = e.clientY;
    dragYRef.current = 0;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Some Android WebViews throw if capture is unsupported.
    }
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!dragging.current || e.isPrimary === false) return;
    const delta = Math.max(0, e.clientY - startY.current);
    dragYRef.current = delta;
    setDragY(delta);
  }

  function onPointerUp(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragging.current) return;
    dragging.current = false;
    setIsDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
    if (dragYRef.current > 100) onClose();
    dragYRef.current = 0;
    setDragY(0);
  }

  const sheetMaxHeight =
    viewportHeight != null
      ? Math.round(viewportHeight * 0.92)
      : undefined;

  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-black/35 transition-opacity duration-200 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        style={{ touchAction: "none" }}
        onClick={onClose}
        aria-hidden={!open}
      />

      {!isDesktop ? (
        <div
          className="mobile-sheet fixed inset-x-0 bottom-0 z-40 flex flex-col rounded-t-3xl border border-[var(--glass-border)] bg-[var(--surface-raised)]"
          style={{
            boxShadow: "var(--drawer-shadow)",
            maxHeight: sheetMaxHeight ? `${sheetMaxHeight}px` : "92vh",
            paddingBottom: `max(12px, env(safe-area-inset-bottom, 0px))`,
            // Sit above Android browser chrome / keyboard.
            bottom: open ? bottomInset : 0,
            transform: open
              ? `translate3d(0, ${dragY}px, 0)`
              : "translate3d(0, 110%, 0)",
            transition: isDragging
              ? "none"
              : "transform 220ms ease-out, bottom 120ms ease-out",
            visibility: open ? "visible" : "hidden",
            pointerEvents: open ? "auto" : "none",
            // Avoid permanent will-change layers that glitch on MIUI/Chrome.
            willChange: isDragging || open ? "transform" : "auto",
          }}
          role="dialog"
          aria-label={label}
          aria-modal={open}
          aria-hidden={!open}
          data-testid={open ? "mobile-bottom-sheet" : undefined}
        >
          <div
            className="flex touch-none justify-center py-3"
            style={{ touchAction: "none" }}
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
          className={`fixed top-0 bottom-0 z-40 flex flex-col border-[var(--glass-border)] bg-[var(--surface-raised)] transition-transform duration-200 ease-out ${
            side === "left" ? "left-0 border-r" : "right-0 border-l"
          } ${open ? "translate-x-0" : side === "left" ? "-translate-x-full" : "translate-x-full"}`}
          style={{
            width: "min(100vw, var(--drawer-width))",
            ["--drawer-width" as string]: drawerWidth,
            boxShadow: "var(--drawer-shadow)",
            paddingTop: "env(safe-area-inset-top, 0px)",
            paddingBottom: "env(safe-area-inset-bottom, 0px)",
            visibility: open ? "visible" : "hidden",
            pointerEvents: open ? "auto" : "none",
          }}
          role="dialog"
          aria-label={label}
          aria-modal={open}
          aria-hidden={!open}
        >
          <div className="flex h-full min-h-0 flex-col overflow-hidden">{children}</div>
        </div>
      )}
    </>
  );
}
