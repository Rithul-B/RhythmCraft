"use client";

import { useSyncExternalStore } from "react";

/**
 * Desktop chrome (side drawers) only when the device has a fine pointer
 * AND enough width. Touch tablets (iPad) stay on bottom sheets even at 768–1024.
 */
const DESKTOP_QUERY = "(min-width: 1024px) and (pointer: fine)";

function subscribe(onChange: () => void) {
  const mql = window.matchMedia(DESKTOP_QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

function getSnapshot() {
  return window.matchMedia(DESKTOP_QUERY).matches;
}

/** Mobile-first: avoid desktop flash on phones/tablets during hydration. */
function getServerSnapshot() {
  return false;
}

export function useIsDesktopLayout() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
