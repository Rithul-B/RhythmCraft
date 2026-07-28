"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

const subscribeToNothing = () => () => {};

/**
 * Keep fixed bottom UI above the Android Chrome URL bar / soft keyboard
 * by tracking visualViewport.
 */
export function useStableViewport() {
  const [bottomInset, setBottomInset] = useState(0);
  const [viewportHeight, setViewportHeight] = useState<number | null>(null);

  const isClient = useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false
  );

  useEffect(() => {
    if (!isClient || typeof window === "undefined") return;

    const vv = window.visualViewport;
    function update() {
      if (!vv) {
        setBottomInset(0);
        setViewportHeight(window.innerHeight);
        return;
      }
      // Space between layout viewport bottom and visual viewport bottom
      // (URL bar / keyboard / browser chrome).
      const inset = Math.max(0, window.innerHeight - (vv.height + vv.offsetTop));
      setBottomInset(inset);
      setViewportHeight(vv.height);
    }

    update();
    vv?.addEventListener("resize", update);
    vv?.addEventListener("scroll", update);
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);
    return () => {
      vv?.removeEventListener("resize", update);
      vv?.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, [isClient]);

  return { bottomInset, viewportHeight };
}
