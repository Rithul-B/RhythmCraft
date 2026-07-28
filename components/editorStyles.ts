"use client";

export const EDITOR_LINE_HEIGHT = 2.4;
export const EDITOR_FONT_SIZE = "1.25rem";
export const EDITOR_PADDING_Y = "3rem";

/**
 * Shared between the textarea and both overlays (meter + grammar).
 * Keep all metric changes here so underlines stay aligned.
 * Mobile tweaks use CSS variables set on the editor root rather than
 * diverging style objects per component.
 */
export const editorTextStyles: React.CSSProperties = {
  fontSize: "var(--editor-font-size, 1.25rem)",
  lineHeight: EDITOR_LINE_HEIGHT,
  paddingTop: "var(--editor-padding-y, 3rem)",
  paddingBottom: "var(--editor-padding-y, 3rem)",
  paddingLeft: "var(--editor-padding-x, 2rem)",
  paddingRight: "var(--editor-padding-x, 2rem)",
  letterSpacing: "0.01em",
};
