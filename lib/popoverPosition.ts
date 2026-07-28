/**
 * Keep fixed popovers inside the visible viewport (incl. iOS visualViewport / keyboard).
 */
export function clampPopoverPosition(
  anchor: { top: number; left: number },
  width: number,
  estimatedHeight: number
): { top: number; left: number } {
  const vv = typeof window !== "undefined" ? window.visualViewport : null;
  const viewH = vv?.height ?? window.innerHeight;
  const viewW = vv?.width ?? window.innerWidth;
  const offsetTop = vv?.offsetTop ?? 0;
  const offsetLeft = vv?.offsetLeft ?? 0;
  const pad = 12;

  let top = anchor.top + 8;
  if (top + estimatedHeight > offsetTop + viewH - pad) {
    top = Math.max(offsetTop + pad, anchor.top - estimatedHeight - 8);
  }

  const left = Math.max(
    offsetLeft + pad,
    Math.min(anchor.left, offsetLeft + viewW - width - pad)
  );

  return { top, left };
}
