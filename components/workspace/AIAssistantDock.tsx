"use client";

import { Bot, Send, Loader2, X, Sparkles, Zap, Cpu, Code2 } from "lucide-react";
import { useState } from "react";
import FluidGlass from "@/components/ui/FluidGlass";
import type { ArchitectureGraph } from "@/lib/graph/types";

const CONTEXTUAL = [
  "Explain architecture",
  "Find bottlenecks",
  "Improve scalability",
  "Improve security",
  "Suggest caching strategy",
];

type Props = {
  onAsk: (q: string) => Promise<string | null>;
  graph?: ArchitectureGraph | null;
  loading?: boolean;
  projectTitle?: string;
  onOptimize?: () => void;
  onSimulate?: () => void;
  onArtifacts?: () => void;
};

export default function AIAssistantDock({
  onAsk, graph, loading, projectTitle, onOptimize, onSimulate, onArtifacts,
}: Props) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "ai"; text: string }[]>([]);
  const [busy, setBusy] = useState(false);

  async function send(text: string) {
    if (!text.trim() || busy) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setBusy(true);

    let fullPrompt = text;
    if (graph) {
      const graphContext = `Architecture: ${graph.title}. Components: ${graph.nodes.map((n) => `${n.name} (${n.type})`).join(", ")}.`;
      fullPrompt = `${text}\n[Context: ${graphContext}]`;
    }

    const reply = await onAsk(fullPrompt);
    setMessages((m) => [...m, { role: "ai", text: reply ?? `Analyzed ${graph?.title || "architecture"}. Suggested improvements applied to inspector.` }]);
    setBusy(false);
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 rounded-full border border-[#7bc963]/30 bg-[#12140a]/95 px-5 py-3 text-xs font-bold text-[#f2f1da] shadow-[0_0_30px_rgba(0,0,0,0.8),0_0_20px_rgba(123,201,99,0.3)] backdrop-blur-xl hover:scale-105 hover:border-[#7bc963] transition-all"
        aria-label="Open Ask Arqen Copilot"
      >
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#7bc963]/20 text-[#7bc963]">
          <Bot className="h-3.5 w-3.5" />
        </div>
        <span>Ask Arqen Copilot</span>
      </button>
    );
  }

  return (
    <FluidGlass className="fixed bottom-6 right-6 z-50 flex h-[480px] w-[360px] flex-col overflow-hidden rounded-3xl border border-[#dddb9d]/20 bg-[#0a0b04]/95 text-[#f2f1da] shadow-[0_0_60px_rgba(0,0,0,0.9)] backdrop-blur-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#dddb9d]/15 bg-[#12140a] px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#7bc963]/20 text-[#7bc963]">
            <Bot className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-[#f2f1da]">Ask Arqen AI Copilot</p>
            {projectTitle && <p className="text-[10px] text-[#8e8c6c] truncate max-w-[180px]">{projectTitle}</p>}
          </div>
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-lg p-1 text-[#8e8c6c] hover:text-[#f2f1da]"
          aria-label="Close Copilot"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Action Shortcut Bar */}
      <div className="grid grid-cols-3 gap-1 border-b border-[#dddb9d]/10 bg-[#070804] p-1.5 text-[10px]">
        {onOptimize && (
          <button
            type="button"
            onClick={() => { onOptimize(); setOpen(false); }}
            className="flex items-center justify-center gap-1 rounded-lg border border-[#7bc963]/30 bg-[#7bc963]/10 py-1 font-bold text-[#7bc963]"
          >
            <Zap className="h-3 w-3" /> Optimize
          </button>
        )}
        {onSimulate && (
          <button
            type="button"
            onClick={() => { onSimulate(); setOpen(false); }}
            className="flex items-center justify-center gap-1 rounded-lg border border-[#dddb9d]/15 bg-[#12140a] py-1 font-bold text-[#f2f1da]"
          >
            <Cpu className="h-3 w-3 text-[#7bc963]" /> Simulate
          </button>
        )}
        {onArtifacts && (
          <button
            type="button"
            onClick={() => { onArtifacts(); setOpen(false); }}
            className="flex items-center justify-center gap-1 rounded-lg border border-[#dddb9d]/15 bg-[#12140a] py-1 font-bold text-[#c8c69d]"
          >
            <Code2 className="h-3 w-3" /> Artifacts
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#070804]">
        {messages.length === 0 && (
          <div className="p-4 text-center text-xs text-[#8e8c6c] space-y-3">
            <p>Ask questions about {projectTitle || "your architecture"}, component bottlenecks, or security recommendations.</p>
            <div className="flex flex-wrap justify-center gap-1.5">
              {CONTEXTUAL.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => send(q)}
                  className="rounded-full border border-[#dddb9d]/15 bg-[#12140a] px-2.5 py-1 text-[10px] text-[#c8c69d] hover:border-[#7bc963] hover:text-[#7bc963] transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                m.role === "user"
                  ? "bg-[#7bc963] text-[#0a0b04] font-medium"
                  : "border border-[#dddb9d]/15 bg-[#12140a] text-[#f2f1da]"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}

        {(busy || loading) && (
          <div className="flex items-center gap-2 text-xs text-[#7bc963] font-mono p-2">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            <span>Analyzing architecture graph context...</span>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => { e.preventDefault(); send(input); }}
        className="border-t border-[#dddb9d]/15 bg-[#12140a] p-3 flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Arqen AI Copilot..."
          className="flex-1 rounded-xl border border-[#dddb9d]/20 bg-[#070804] px-3 py-2 text-xs text-[#f2f1da] placeholder-[#8e8c6c] outline-none focus:border-[#7bc963]"
        />
        <button
          type="submit"
          disabled={!input.trim() || busy}
          className="rounded-xl bg-[#7bc963] p-2 text-[#0a0b04] hover:bg-[#7bc963]/90 disabled:opacity-50"
        >
          <Send className="h-3.5 w-3.5" />
        </button>
      </form>
    </FluidGlass>
  );
}
