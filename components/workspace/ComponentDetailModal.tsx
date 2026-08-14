"use client";

import { X, Layers, ArrowRight, ShieldCheck, Zap, AlertTriangle, Cpu } from "lucide-react";
import type { ArchNode, ArchitectureGraph } from "@/lib/graph/types";

type Props = {
  node: ArchNode;
  graph: ArchitectureGraph;
  onClose: () => void;
};

export default function ComponentDetailModal({ node, graph, onClose }: Props) {
  const incomingEdges = graph.edges.filter((e) => e.targetId === node.id);
  const outgoingEdges = graph.edges.filter((e) => e.sourceId === node.id);

  const incomingNodes = incomingEdges.map((e) => graph.nodes.find((n) => n.id === e.sourceId)).filter(Boolean) as ArchNode[];
  const outgoingNodes = outgoingEdges.map((e) => graph.nodes.find((n) => n.id === e.targetId)).filter(Boolean) as ArchNode[];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xl animate-fade-in">
      <div className="flex h-[80vh] w-[90vw] max-w-4xl flex-col overflow-hidden rounded-3xl border border-[#dddb9d]/20 bg-[#0a0b04] text-[#f2f1da] shadow-[0_0_80px_rgba(0,0,0,0.9)]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#dddb9d]/15 bg-[#12140a] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#dddb9d] via-[#7bc963] to-[#567f2b] p-[1px]">
              <div className="flex h-full w-full items-center justify-center rounded-[11px] bg-[#0a0b04]">
                <Layers className="h-5 w-5 text-[#7bc963]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-[#f2f1da]">{node.name}</h2>
                <span className="rounded-md bg-[#7bc963]/20 px-2 py-0.5 font-mono text-[10px] font-bold text-[#7bc963] uppercase">
                  {node.type}
                </span>
              </div>
              <p className="text-xs text-[#c8c69d]">Component Intelligence Specification &amp; Dependency Tree</p>
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

        {/* Content Body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-[#070804]">
          {/* Overview Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-[#dddb9d]/15 bg-[#12140a] p-4">
              <p className="font-mono text-[10px] uppercase text-[#8e8c6c]">Layer Tier</p>
              <p className="mt-1 font-bold text-sm text-[#f2f1da]">{node.layer}</p>
            </div>
            <div className="rounded-2xl border border-[#dddb9d]/15 bg-[#12140a] p-4">
              <p className="font-mono text-[10px] uppercase text-[#8e8c6c]">Technology Stack</p>
              <p className="mt-1 font-bold text-sm text-[#7bc963]">{node.technology}</p>
            </div>
            <div className="rounded-2xl border border-[#dddb9d]/15 bg-[#12140a] p-4">
              <p className="font-mono text-[10px] uppercase text-[#8e8c6c]">Scaling Strategy</p>
              <p className="mt-1 font-bold text-xs text-[#f2f1da]">{node.scalingStrategy}</p>
            </div>
            <div className="rounded-2xl border border-[#dddb9d]/15 bg-[#12140a] p-4">
              <p className="font-mono text-[10px] uppercase text-[#8e8c6c]">Risk Rating</p>
              <p className="mt-1 font-bold text-xs text-amber-400">{node.riskLevel}</p>
            </div>
          </div>

          {/* Component Description */}
          <div className="rounded-2xl border border-[#dddb9d]/15 bg-[#12140a] p-5 space-y-2">
            <p className="font-mono text-[11px] font-bold uppercase text-[#7bc963]">Purpose &amp; Functional Spec</p>
            <p className="text-xs leading-relaxed text-[#c8c69d]">{node.description}</p>
          </div>

          {/* Dependencies: Inbound & Outbound */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Inbound */}
            <div className="rounded-2xl border border-[#dddb9d]/15 bg-[#12140a] p-5 space-y-3">
              <p className="font-mono text-[11px] font-bold uppercase text-[#c8c69d]">Inbound Dependencies ({incomingNodes.length})</p>
              {incomingNodes.length === 0 ? (
                <p className="text-xs text-[#8e8c6c]">No incoming service callers (Entry point).</p>
              ) : (
                <ul className="space-y-2">
                  {incomingNodes.map((inNode) => (
                    <li key={inNode.id} className="flex items-center justify-between rounded-xl border border-[#dddb9d]/10 bg-[#070804] p-2.5 text-xs text-[#f2f1da]">
                      <span>{inNode.name}</span>
                      <span className="font-mono text-[10px] text-[#7bc963]">HTTPS / REST</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Outbound */}
            <div className="rounded-2xl border border-[#dddb9d]/15 bg-[#12140a] p-5 space-y-3">
              <p className="font-mono text-[11px] font-bold uppercase text-[#c8c69d]">Outbound Calls ({outgoingNodes.length})</p>
              {outgoingNodes.length === 0 ? (
                <p className="text-xs text-[#8e8c6c]">No outgoing dependencies (Terminal persistence node).</p>
              ) : (
                <ul className="space-y-2">
                  {outgoingNodes.map((outNode) => (
                    <li key={outNode.id} className="flex items-center justify-between rounded-xl border border-[#dddb9d]/10 bg-[#070804] p-2.5 text-xs text-[#f2f1da]">
                      <span>{outNode.name}</span>
                      <span className="font-mono text-[10px] text-[#7bc963]">Connection Pool</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
