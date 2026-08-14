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

function sanitizeSvgForCanvas(svgContent: string): string {
  // Strip external @import font declarations that taint HTMLCanvasElement
  let clean = svgContent
    .replace(/@import\s+url\([^)]+\);?/gi, "")
    .replace(/@font-face\s*\{[^}]+\}/gi, "");

  if (!clean.includes('xmlns="http://www.w3.org/2000/svg"')) {
    clean = clean.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"');
  }
  return clean;
}

export async function svgToPng(svgContent: string, filename: string) {
  const cleanSvg = sanitizeSvgForCanvas(svgContent);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const img = new window.Image();
  img.crossOrigin = "anonymous";

  const encoded = encodeURIComponent(cleanSvg)
    .replace(/'/g, "%27")
    .replace(/"/g, "%22");
  const dataUri = `data:image/svg+xml;charset=utf-8,${encoded}`;

  await new Promise<void>((resolve) => {
    img.onload = () => {
      try {
        const width = img.width || 1200;
        const height = img.height || 800;
        canvas.width = width * 2;
        canvas.height = height * 2;

        if (ctx) {
          ctx.fillStyle = "#0a0b04";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        }

        canvas.toBlob((blob) => {
          if (!blob) {
            downloadText(cleanSvg, filename.replace(/\.png$/i, ".svg"), "image/svg+xml");
            resolve();
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
      } catch (err) {
        console.warn("Canvas export fallback to SVG download:", err);
        downloadText(cleanSvg, filename.replace(/\.png$/i, ".svg"), "image/svg+xml");
        resolve();
      }
    };

    img.onerror = () => {
      downloadText(cleanSvg, filename.replace(/\.png$/i, ".svg"), "image/svg+xml");
      resolve();
    };

    img.src = dataUri;
  });
}

export async function svgToPdf(svgContent: string, filename: string) {
  const cleanSvg = sanitizeSvgForCanvas(svgContent);
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    downloadText(cleanSvg, filename.replace(/\.pdf$/i, ".svg"), "image/svg+xml");
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${filename}</title>
        <style>
          body { margin: 0; padding: 2rem; background: #0a0b04; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
          svg { max-width: 100%; height: auto; }
        </style>
      </head>
      <body>
        ${cleanSvg}
        <script>
          window.onload = function() {
            window.print();
            window.close();
          };
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
}
