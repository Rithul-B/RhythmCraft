"use client";

import { useSyncExternalStore } from "react";

/**
 * Side drawers only on true desktop: wide screen, fine pointer, hover,
 * and no touch primary. Samsung Tabs / Redmi / iPads always get bottom sheets
 * even when an S-Pen reports pointer:fine.
 */
function isDesktopLayout(): boolean {
  if (typeof window === "undefined") return false;
  const wide = window.matchMedia("(min-width: 1280px)").matches;
  const fineHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const hasTouch =
    navigator.maxTouchPoints > 0 || "ontouchstart" in window;
  return wide && fineHover && !coarse && !hasTouch;
}

function subscribe(onChange: () => void) {
  const queries = [
    window.matchMedia("(min-width: 1280px)"),
    window.matchMedia("(hover: hover)"),
    window.matchMedia("(pointer: fine)"),
    window.matchMedia("(pointer: coarse)"),
  ];
  for (const q of queries) q.addEventListener("change", onChange);
  window.addEventListener("orientationchange", onChange);
  return () => {
    for (const q of queries) q.removeEventListener("change", onChange);
    window.removeEventListener("orientationchange", onChange);
  };
}

function getServerSnapshot() {
  return false;
}

export function useIsDesktopLayout() {
  return useSyncExternalStore(subscribe, isDesktopLayout, getServerSnapshot);
}
