"use client";

import { Bot, Send, Loader2, X } from "lucide-react";
import { useState } from "react";
import FluidGlass from "@/components/ui/FluidGlass";

const CONTEXTUAL = [
  "Explain architecture",
  "Find bottlenecks",
  "Improve scalability",
  "Improve security",
  "Suggest alternatives",
  "Generate documentation",
];

type Props = {
  onAsk: (q: string) => Promise<string | null>;
  loading?: boolean;
  projectTitle?: string;
};

export default function AIAssistantDock({ onAsk, loading, projectTitle }: Props) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "ai"; text: string }[]>([]);
  const [busy, setBusy] = useState(false);

  async function send(text: string) {
    if (!text.trim() || busy) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setBusy(true);
    const reply = await onAsk(text);
    setMessages((m) => [...m, { role: "ai", text: reply ?? "Could not process request." }]);
    setBusy(false);
  }

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="ai-dock-trigger" aria-label="Open AI assistant">
        <Bot className="h-5 w-5" />
        <span>AI Assistant</span>
      </button>
    );
  }

  return (
    <FluidGlass className="ai-assistant-dock rounded-xl overflow-hidden">
      <div className="ai-dock-header">
        <div className="flex items-center gap-2">
          <Bot className="h-4 w-4 text-violet-400" />
          <div>
            <p className="text-xs font-semibold">AI Copilot</p>
            {projectTitle && <p className="text-[10px] text-muted truncate max-w-[180px]">{projectTitle}</p>}
          </div>
        </div>
        <button type="button" onClick={() => setOpen(false)} className="header-icon-btn" aria-label="Close">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="ai-dock-messages">
        {messages.length === 0 && (
          <p className="text-xs text-muted">
            Context-aware refinements apply to the current architecture. Ask to explain, harden, or adapt the design.
          </p>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`ai-dock-msg ${m.role === "user" ? "ai-dock-msg-user" : "ai-dock-msg-ai"}`}>{m.text}</div>
        ))}
        {(busy || loading) && <Loader2 className="mx-auto h-4 w-4 animate-spin text-cyan-400" />}
      </div>

      <div className="ai-dock-quick">
        {CONTEXTUAL.map((q) => (
          <button key={q} type="button" disabled={busy || loading} onClick={() => send(q)} className="ai-dock-chip">{q}</button>
        ))}
      </div>

      <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="ai-dock-form">
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about this architecture…" className="ai-dock-input" aria-label="Assistant message" />
        <button type="submit" disabled={!input.trim() || busy || loading} className="ai-dock-send" aria-label="Send">
          <Send className="h-4 w-4" />
        </button>
      </form>
    </FluidGlass>
  );
}
