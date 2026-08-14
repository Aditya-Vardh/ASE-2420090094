"use client";

import { useState } from "react";
import { X, Code2, Download, Copy, Check, FileText } from "lucide-react";
import type { ArchitectureGraph } from "@/lib/graph/types";
import { generateImplementationArtifacts, type ArtifactFile } from "@/lib/artifacts/generator";

type Props = {
  graph: ArchitectureGraph;
  onClose: () => void;
};

export default function ArtifactsModal({ graph, onClose }: Props) {
  const artifacts = generateImplementationArtifacts(graph);
  const [selectedFile, setSelectedFile] = useState<ArtifactFile>(artifacts[0]);
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleDownload() {
    const blob = new Blob([selectedFile.content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = selectedFile.filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xl animate-fade-in">
      <div className="flex h-[85vh] w-[90vw] max-w-5xl flex-col overflow-hidden rounded-3xl border border-[#dddb9d]/20 bg-[#0a0b04] text-[#f2f1da] shadow-[0_0_80px_rgba(0,0,0,0.9)]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#dddb9d]/15 bg-[#12140a] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#dddb9d] via-[#7bc963] to-[#567f2b] p-[1px]">
              <div className="flex h-full w-full items-center justify-center rounded-[11px] bg-[#0a0b04]">
                <Code2 className="h-5 w-5 text-[#7bc963]" />
              </div>
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#f2f1da]">Generated Implementation Artifacts</h2>
              <p className="text-xs text-[#c8c69d]">Production-ready code, deployment manifests, OpenAPI specs, and database DDL derived from graph.</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-[#dddb9d]/15 bg-[#12140a] p-2 text-[#8e8c6c] hover:text-[#f2f1da] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="grid flex-1 grid-cols-1 md:grid-cols-4 min-h-0 overflow-hidden divide-y md:divide-y-0 md:divide-x divide-[#dddb9d]/15">
          {/* File Selector Sidebar */}
          <div className="p-4 bg-[#0a0b04] space-y-2 overflow-y-auto">
            <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#8e8c6c] mb-3 px-2">Artifact Files</p>
            {artifacts.map((file) => (
              <button
                key={file.filename}
                type="button"
                onClick={() => setSelectedFile(file)}
                className={`w-full flex items-center gap-3 rounded-xl p-3 text-left transition-all ${
                  selectedFile.filename === file.filename
                    ? "border border-[#7bc963]/30 bg-[#7bc963]/10 text-[#7bc963]"
                    : "border border-transparent hover:bg-[#12140a] text-[#c8c69d]"
                }`}
              >
                <FileText className="h-4 w-4 shrink-0" />
                <div className="min-w-0">
                  <p className="font-mono text-xs font-bold truncate">{file.filename}</p>
                  <p className="text-[10px] text-[#8e8c6c] truncate">{file.description}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Code Viewer Panel */}
          <div className="md:col-span-3 flex flex-col min-h-0 bg-[#070804]">
            <div className="flex items-center justify-between border-b border-[#dddb9d]/10 bg-[#12140a] px-6 py-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[#f2f1da]">{selectedFile.filename}</span>
                <span className="rounded bg-[#dddb9d]/10 px-2 py-0.5 font-mono text-[10px] uppercase text-[#7bc963]">{selectedFile.language}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 rounded-lg border border-[#dddb9d]/15 bg-[#070804] px-3 py-1.5 text-xs font-bold text-[#c8c69d] hover:text-[#f2f1da] transition-colors"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-[#7bc963]" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied ? "Copied" : "Copy Code"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownload}
                  className="flex items-center gap-1.5 rounded-lg bg-[#7bc963] px-3 py-1.5 text-xs font-bold text-[#0a0b04] hover:bg-[#7bc963]/90 transition-all"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download</span>
                </button>
              </div>
            </div>

            <div className="flex-1 p-6 overflow-auto">
              <pre className="font-mono text-xs leading-relaxed text-[#c8c69d] whitespace-pre-wrap select-all">
                {selectedFile.content}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
