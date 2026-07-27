export interface SelectionRange {
  start: number;
  end: number;
}

export function getSelectedWord(
  text: string,
  start: number,
  end: number
): string | null {
  if (start === end) return null;

  const selected = text.slice(start, end).trim();
  if (!selected || /\s/.test(selected)) return null;

  return selected.replace(/[^a-zA-Z'-]/g, "");
}

export function getSelectionAnchor(
  textarea: HTMLTextAreaElement,
  selectionEnd: number
): { top: number; left: number } | null {
  const style = window.getComputedStyle(textarea);
  const mirror = document.createElement("div");
  const properties = [
    "fontFamily",
    "fontSize",
    "fontWeight",
    "lineHeight",
    "letterSpacing",
    "paddingTop",
    "paddingRight",
    "paddingBottom",
    "paddingLeft",
    "borderWidth",
    "boxSizing",
    "width",
    "whiteSpace",
    "wordWrap",
    "overflowWrap",
  ] as const;

  properties.forEach((prop) => {
    mirror.style[prop] = style[prop];
  });

  mirror.style.position = "absolute";
  mirror.style.visibility = "hidden";
  mirror.style.whiteSpace = "pre-wrap";
  mirror.style.wordWrap = "break-word";
  mirror.style.width = `${textarea.offsetWidth}px`;

  const textBefore = textarea.value.substring(0, selectionEnd);
  mirror.textContent = textBefore;

  const span = document.createElement("span");
  span.textContent = textarea.value.substring(selectionEnd) || ".";
  mirror.appendChild(span);

  document.body.appendChild(mirror);
  const spanRect = span.getBoundingClientRect();
  const mirrorRect = mirror.getBoundingClientRect();
  document.body.removeChild(mirror);

  const textareaRect = textarea.getBoundingClientRect();
  const lineHeight = parseFloat(style.lineHeight) || 24;

  return {
    top: textareaRect.top + (spanRect.top - mirrorRect.top) - textarea.scrollTop + lineHeight,
    left: textareaRect.left + (spanRect.left - mirrorRect.left) - textarea.scrollLeft,
  };
}
