import type { RhymeSchemeResult } from "./rhymeScheme";

export interface ExportOptions {
  title: string;
  includeLineNumbers?: boolean;
  includeRhymeLabels?: boolean;
  rhymeScheme?: RhymeSchemeResult;
}

export function exportPlainText(text: string, options: ExportOptions): string {
  const lines: string[] = [];
  if (options.title) {
    lines.push(options.title);
    lines.push("");
  }

  const textLines = text.split("\n");
  textLines.forEach((line, i) => {
    const parts: string[] = [];
    if (options.includeLineNumbers) {
      parts.push(String(i + 1).padStart(2, "0") + " |");
    }
    if (options.includeRhymeLabels && options.rhymeScheme?.labels[i]) {
      parts.push(`[${options.rhymeScheme.labels[i]}]`);
    }
    parts.push(line);
    lines.push(parts.join(" "));
  });

  return lines.join("\n");
}

export function downloadTextFile(content: string, filename: string) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export async function exportPdf(text: string, options: ExportOptions) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const margin = 72;
  const pageWidth = doc.internal.pageSize.getWidth();
  const maxWidth = pageWidth - margin * 2;
  let y = margin;

  doc.setFont("times", "normal");
  doc.setFontSize(18);
  if (options.title) {
    doc.text(options.title, margin, y);
    y += 28;
  }

  doc.setFontSize(12);
  const textLines = text.split("\n");

  for (let i = 0; i < textLines.length; i++) {
    const line = textLines[i];
    let prefix = "";
    if (options.includeLineNumbers) {
      prefix += `${String(i + 1).padStart(2, "0")}  `;
    }
    if (options.includeRhymeLabels && options.rhymeScheme?.labels[i]) {
      prefix += `[${options.rhymeScheme.labels[i]}] `;
    }

    const fullLine = prefix + line;
    const wrapped = doc.splitTextToSize(fullLine, maxWidth);

    for (const w of wrapped) {
      if (y > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(w, margin, y);
      y += 18;
    }
  }

  const safeName = (options.title || "poem").replace(/[^a-z0-9]/gi, "_").toLowerCase();
  doc.save(`${safeName}.pdf`);
}
