import type { ArchitectureResult } from "@/lib/storage/types";

import { sanitizeMermaid } from "@/lib/mermaid-repair";

export { sanitizeMermaid };

export function toMarkdownExport(result: ArchitectureResult): string {
  const { title, diagramType, mermaidCode, explanation, technologies } = result;
  const components = explanation.components
    .map((c) => `- **${c.name}**: ${c.description}`)
    .join("\n");

  return `# ${title}

**Diagram Type:** ${diagramType}

## Overview

${explanation.overview}

## Technologies

${technologies.map((t) => `- ${t}`).join("\n")}

## Components

${components}

## Data Flow

${explanation.dataFlow}

## Technology Choices

${explanation.technologyChoices}

## Scalability

${explanation.scalability}

## Security

${explanation.security}

## Reliability

${explanation.reliability}

## Trade-offs

${explanation.tradeoffs}

## Improvements

${explanation.improvements}

## Mermaid Diagram

\`\`\`mermaid
${mermaidCode}
\`\`\`
`;
}

export async function downloadText(content: string, filename: string, mime = "text/plain") {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export async function svgToPng(svgContent: string, filename: string) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const img = new window.Image();
  const svgBlob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);

  await new Promise<void>((resolve, reject) => {
    img.onload = () => {
      canvas.width = img.width * 2;
      canvas.height = img.height * 2;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("PNG conversion failed"));
          return;
        }
        const pngUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = pngUrl;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(pngUrl);
        resolve();
      }, "image/png");
      URL.revokeObjectURL(url);
    };
    img.onerror = reject;
    img.src = url;
  });
}

export async function svgToPdf(svgContent: string, filename: string) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const img = new window.Image();
  const svgBlob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);

  await new Promise<void>((resolve, reject) => {
    img.onload = () => {
      canvas.width = img.width * 2;
      canvas.height = img.height * 2;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("PDF export failed"));
          return;
        }
        const printWindow = window.open("", "_blank");
        if (!printWindow) {
          reject(new Error("Popup blocked"));
          return;
        }
        const imgUrl = URL.createObjectURL(blob);
        printWindow.document.write(`
          <html><head><title>${filename}</title></head>
          <body style="margin:0;display:flex;justify-content:center;">
            <img src="${imgUrl}" style="max-width:100%" onload="window.print();window.close();" />
          </body></html>
        `);
        printWindow.document.close();
        URL.revokeObjectURL(imgUrl);
        resolve();
      }, "image/png");
      URL.revokeObjectURL(url);
    };
    img.onerror = reject;
    img.src = url;
  });
}
