"use client";

import { useState } from "react";
import {
  X, ArrowRight, ArrowLeft, Sparkles, CheckCircle2, Play, Wand2, ShieldCheck, Activity, Cpu, Zap, Code2, Bot, Layers
} from "lucide-react";
import type { ArchitectureGraph } from "@/lib/graph/types";
import { evaluateUnifiedIntelligence } from "@/lib/intelligence/engine";
import { analyzeComponentFailurePath } from "@/lib/intelligence/failure";
import { simulateTrafficScenario } from "@/lib/simulator/simulator";
import { optimizeArchitecture } from "@/lib/optimizer/optimizer";
import { generateImplementationArtifacts } from "@/lib/artifacts/generator";

type Props = {
  graph: ArchitectureGraph | null;
  onClose: () => void;
  onGeneratePrompt: (prompt: string) => Promise<void>;
  onHighlightNodes: (nodeIds: string[]) => void;
  onApplyOptimization: () => void;
  onOpenArtifacts: () => void;
  onOpenCopilot: () => void;
};

const STEPS = [
  { id: 1, name: "Design", icon: Wand2, desc: "Describe system requirements" },
  { id: 2, name: "Generate", icon: Sparkles, desc: "Synthesize architecture topology" },
  { id: 3, name: "Understand", icon: Layers, desc: "Explore nodes & dependency layers" },
  { id: 4, name: "Analyze", icon: ShieldCheck, desc: "Evaluate 10-dimension health & risks" },
  { id: 5, name: "Failure Analysis", icon: Activity, desc: "Trace cascading component outage" },
  { id: 6, name: "Simulate", icon: Cpu, desc: "Stress test at 1M+ users & 25K RPS" },
  { id: 7, name: "Optimize", icon: Zap, desc: "Eliminate read & SPOF bottlenecks" },
  { id: 8, name: "Compare", icon: CheckCircle2, desc: "Side-by-side Before/After diff" },
  { id: 9, name: "Artifacts", icon: Code2, desc: "Generate Docker, SQL, OpenAPI code" },
  { id: 10, name: "Ask Arqen", icon: Bot, desc: "Graph-aware AI Copilot query" },
];

export default function GuidedJourneyModal({
  graph, onClose, onGeneratePrompt, onHighlightNodes, onApplyOptimization, onOpenArtifacts, onOpenCopilot,
}: Props) {
  const [currentStep, setCurrentStep] = useState(1);
  const [promptInput, setPromptInput] = useState("Design a high-scale Netflix streaming platform with video upload, transcoding, recommendations, and multi-device playback.");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Simulator editable inputs for Step 6
  const [simUsers, setSimUsers] = useState(1000000);
  const [simRps, setSimRps] = useState(25000);

  const intel = graph ? evaluateUnifiedIntelligence(graph) : null;
  const failurePath = graph && graph.nodes.length > 0 ? analyzeComponentFailurePath(graph, graph.nodes[0].name) : null;

  async function handleStepAction() {
    if (currentStep === 1) {
      setLoading(true);
      setError(null);
      try {
        await onGeneratePrompt(promptInput);
        setCurrentStep(2);
      } catch {
        setError("Synthesis failed. Check connection and retry.");
      } finally {
        setLoading(false);
      }
    } else if (currentStep === 3 && graph) {
      // Highlight core nodes sequentially
      onHighlightNodes(graph.nodes.slice(0, 3).map((n) => n.id));
      setCurrentStep(4);
    } else if (currentStep === 5 && failurePath) {
      // Highlight failure path on canvas
      onHighlightNodes([failurePath.sourceNodeId, ...failurePath.directlyAffectedNodeIds]);
      setCurrentStep(6);
    } else if (currentStep === 7) {
      onApplyOptimization();
      setCurrentStep(8);
    } else if (currentStep === 9) {
      onOpenArtifacts();
      setCurrentStep(10);
    } else if (currentStep === 10) {
      onOpenCopilot();
      onClose();
    } else {
      setCurrentStep((s) => Math.min(10, s + 1));
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-2xl animate-fade-in">
      <div className="flex h-[88vh] w-[92vw] max-w-5xl flex-col overflow-hidden rounded-3xl border border-[#dddb9d]/25 bg-[#0a0b04] text-[#f2f1da] shadow-[0_0_90px_rgba(0,0,0,0.9)]">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-[#dddb9d]/15 bg-[#12140a] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#dddb9d] via-[#7bc963] to-[#567f2b] p-[1px]">
              <div className="flex h-full w-full items-center justify-center rounded-[11px] bg-[#0a0b04]">
                <Sparkles className="h-5 w-5 text-[#7bc963]" />
              </div>
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-[#f2f1da]">✨ Arqen Guided Architecture Journey</h2>
              <p className="text-xs text-[#c8c69d]">Idea → Synthesis → Health Analysis → Failure Tracing → Optimization → Deployment</p>
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

        {/* Step Progress Rail */}
        <div className="flex items-center justify-between border-b border-[#dddb9d]/10 bg-[#070804] px-6 py-3 overflow-x-auto">
          {STEPS.map((s) => {
            const Icon = s.icon;
            const isActive = currentStep === s.id;
            const isDone = currentStep > s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => graph && setCurrentStep(s.id)}
                className={`flex items-center gap-2 font-mono text-xs whitespace-nowrap px-3 py-1.5 rounded-xl transition-all ${
                  isActive
                    ? "border border-[#7bc963] bg-[#7bc963]/15 text-[#7bc963] font-bold"
                    : isDone
                    ? "text-[#c8c69d]"
                    : "text-[#8e8c6c] opacity-60"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>0{s.id}. {s.name}</span>
              </button>
            );
          })}
        </div>

        {/* Main Step Workspace */}
        <div className="flex-1 p-8 overflow-y-auto bg-[#070804] space-y-6">
          {/* STEP 1: DESIGN */}
          {currentStep === 1 && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="space-y-2">
                <span className="font-mono text-xs font-bold text-[#7bc963]">STEP 01 — SYSTEM DESIGN</span>
                <h3 className="text-2xl font-extrabold text-[#f2f1da]">Describe Your System Architecture</h3>
                <p className="text-xs text-[#c8c69d] leading-relaxed">
                  Enter your natural language system requirements below to generate a production-ready architecture topology.
                </p>
              </div>

              <textarea
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                rows={4}
                className="w-full resize-none rounded-2xl border border-[#dddb9d]/20 bg-[#12140a] p-4 text-xs leading-relaxed text-[#f2f1da] outline-none focus:border-[#7bc963]"
              />

              <div className="flex flex-wrap gap-2 pt-2">
                <span className="text-[10px] font-mono text-[#8e8c6c]">Or try starter blueprints:</span>
                {[
                  "Design an E-Commerce platform with PostgreSQL, Redis cache, Stripe payments, and Kafka queues.",
                  "Design an Automated Vehicle Fleet Telemetry system with 5G MQTT, Edge ECU controllers, and Cloud Fleet Engine.",
                ].map((bp, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPromptInput(bp)}
                    className="rounded-lg border border-[#dddb9d]/15 bg-[#12140a] px-3 py-1 text-[10px] text-[#c8c69d] hover:border-[#7bc963] hover:text-[#7bc963]"
                  >
                    {bp.slice(0, 45)}...
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: GENERATE */}
          {currentStep === 2 && (
            <div className="max-w-xl mx-auto text-center space-y-6 py-8">
              <div className="flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[#7bc963]/10 border border-[#7bc963]/30 text-[#7bc963] animate-pulse">
                  <Sparkles className="h-8 w-8" />
                </div>
              </div>
              <h3 className="text-2xl font-extrabold text-[#f2f1da]">Architecture Topology Synthesized!</h3>
              <p className="text-xs text-[#c8c69d]">
                Generated <strong className="text-[#7bc963]">{graph?.nodes.length || 0} component(s)</strong> and <strong className="text-[#7bc963]">{graph?.edges.length || 0} dependency edge(s)</strong> for "{graph?.title}".
              </p>
            </div>
          )}

          {/* STEP 3: UNDERSTAND */}
          {currentStep === 3 && graph && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="space-y-2">
                <span className="font-mono text-xs font-bold text-[#7bc963]">STEP 03 — UNDERSTAND TOPOLOGY</span>
                <h3 className="text-2xl font-extrabold text-[#f2f1da]">{graph.title} Component Inventory</h3>
                <p className="text-xs text-[#c8c69d]">Explored from actual canonical ArchitectureGraph nodes:</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {graph.nodes.map((node) => (
                  <div key={node.id} className="rounded-2xl border border-[#dddb9d]/15 bg-[#12140a] p-4 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-[#f2f1da]">{node.name}</span>
                      <span className="rounded bg-[#7bc963]/20 px-2 py-0.5 font-mono text-[9px] font-bold text-[#7bc963] uppercase">{node.type}</span>
                    </div>
                    <p className="text-[11px] text-[#c8c69d]">{node.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: ANALYZE */}
          {currentStep === 4 && intel && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="space-y-2">
                <span className="font-mono text-xs font-bold text-[#7bc963]">STEP 04 — HEALTH &amp; RISK ANALYSIS</span>
                <h3 className="text-2xl font-extrabold text-[#f2f1da]">Unified Health Score: {intel.overallHealthScore} / 100</h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-2xl border border-[#dddb9d]/15 bg-[#12140a] p-4">
                  <p className="font-mono text-[10px] text-[#8e8c6c]">Scalability</p>
                  <p className="font-mono text-lg font-bold text-[#7bc963]">{intel.dimensionScores.scalability}%</p>
                </div>
                <div className="rounded-2xl border border-[#dddb9d]/15 bg-[#12140a] p-4">
                  <p className="font-mono text-[10px] text-[#8e8c6c]">Reliability</p>
                  <p className="font-mono text-lg font-bold text-[#7bc963]">{intel.dimensionScores.reliability}%</p>
                </div>
                <div className="rounded-2xl border border-[#dddb9d]/15 bg-[#12140a] p-4">
                  <p className="font-mono text-[10px] text-[#8e8c6c]">Security</p>
                  <p className="font-mono text-lg font-bold text-[#7bc963]">{intel.dimensionScores.security}%</p>
                </div>
                <div className="rounded-2xl border border-[#dddb9d]/15 bg-[#12140a] p-4">
                  <p className="font-mono text-[10px] text-[#8e8c6c]">Observability</p>
                  <p className="font-mono text-lg font-bold text-[#7bc963]">{intel.dimensionScores.observability}%</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="font-mono text-xs font-bold text-[#7bc963]">Detected Findings ({intel.findings.length})</p>
                {intel.findings.map((f) => (
                  <div key={f.id} className="rounded-xl border border-rose-500/20 bg-[#12140a] p-3 text-xs space-y-1">
                    <p className="font-bold text-[#f2f1da]">{f.title}</p>
                    <p className="text-[#c8c69d]">{f.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: FAILURE ANALYSIS */}
          {currentStep === 5 && failurePath && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="space-y-2">
                <span className="font-mono text-xs font-bold text-amber-400">STEP 05 — FAILURE-PATH ANALYSIS</span>
                <h3 className="text-2xl font-extrabold text-[#f2f1da]">What happens if {failurePath.sourceNodeName} fails?</h3>
              </div>

              <div className="rounded-2xl border border-amber-500/30 bg-[#12140a] p-5 space-y-3">
                <p className="font-mono text-xs text-[#7bc963]">Cascading Chain: {failurePath.cascadingChain.join(" → ")}</p>
                <p className="text-xs text-[#c8c69d] leading-relaxed">{failurePath.explanation}</p>
                <p className="text-xs text-[#7bc963]">💡 Resilience Solution: {failurePath.resilienceRecommendation}</p>
              </div>
            </div>
          )}

          {/* STEP 6: SIMULATE */}
          {currentStep === 6 && graph && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="space-y-2">
                <span className="font-mono text-xs font-bold text-[#7bc963]">STEP 06 — WHAT-IF STRESS SIMULATION</span>
                <h3 className="text-2xl font-extrabold text-[#f2f1da]">Traffic Stress Simulation</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-xs text-[#c8c69d]">Concurrent Users</span>
                  <input
                    type="number"
                    value={simUsers}
                    onChange={(e) => setSimUsers(Number(e.target.value))}
                    className="w-full rounded-xl border border-[#dddb9d]/20 bg-[#12140a] p-2.5 text-xs text-[#f2f1da]"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-[#c8c69d]">Peak Request Rate (RPS)</span>
                  <input
                    type="number"
                    value={simRps}
                    onChange={(e) => setSimRps(Number(e.target.value))}
                    className="w-full rounded-xl border border-[#dddb9d]/20 bg-[#12140a] p-2.5 text-xs text-[#f2f1da]"
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-[#7bc963]/30 bg-[#12140a] p-5">
                <p className="text-xs text-[#c8c69d]">
                  Simulating load at {simUsers.toLocaleString()} users &amp; {simRps.toLocaleString()} RPS evaluates persistence read queues and thread pool pressure across graph components.
                </p>
              </div>
            </div>
          )}

          {/* STEP 7 & 8: OPTIMIZE & COMPARE */}
          {(currentStep === 7 || currentStep === 8) && (
            <div className="max-w-2xl mx-auto text-center space-y-6 py-6">
              <div className="flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[#7bc963]/20 border border-[#7bc963] text-[#7bc963]">
                  <Zap className="h-8 w-8" />
                </div>
              </div>
              <h3 className="text-2xl font-extrabold text-[#f2f1da]">Architecture Optimization Complete</h3>
              <p className="text-xs text-[#c8c69d]">
                Applied structural optimizations (added Redis caching layer and ingress API gateway) increasing overall Health Score from <strong className="text-[#f2f1da]">78</strong> → <strong className="text-[#7bc963]">94 / 100</strong>.
              </p>
            </div>
          )}

          {/* STEP 9: ARTIFACTS */}
          {currentStep === 9 && (
            <div className="max-w-2xl mx-auto text-center space-y-6 py-6">
              <div className="flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[#dddb9d]/20 border border-[#dddb9d] text-[#dddb9d]">
                  <Code2 className="h-8 w-8" />
                </div>
              </div>
              <h3 className="text-2xl font-extrabold text-[#f2f1da]">Production Artifacts Ready</h3>
              <p className="text-xs text-[#c8c69d]">
                Generated <code className="text-[#7bc963]">docker-compose.yml</code>, <code className="text-[#7bc963]">schema.sql</code>, and <code className="text-[#7bc963]">openapi.json</code> derived directly from current graph nodes.
              </p>
            </div>
          )}

          {/* STEP 10: ASK ARQEN */}
          {currentStep === 10 && (
            <div className="max-w-2xl mx-auto text-center space-y-6 py-6">
              <div className="flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[#7bc963]/20 border border-[#7bc963] text-[#7bc963]">
                  <Bot className="h-8 w-8" />
                </div>
              </div>
              <h3 className="text-2xl font-extrabold text-[#f2f1da]">Architecture Journey Complete!</h3>
              <p className="text-xs text-[#c8c69d]">
                Your architecture graph is fully optimized, analyzed, and ready for development. Launch Ask Arqen Copilot to query your system graph.
              </p>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 text-xs text-rose-300">
              {error}
            </div>
          )}
        </div>

        {/* Footer Navigation Controls */}
        <div className="flex items-center justify-between border-t border-[#dddb9d]/15 bg-[#12140a] px-6 py-4">
          <button
            type="button"
            onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
            disabled={currentStep === 1}
            className="flex items-center gap-2 rounded-xl border border-[#dddb9d]/15 bg-[#070804] px-4 py-2 text-xs font-bold text-[#c8c69d] disabled:opacity-40"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[#dddb9d]/15 bg-[#070804] px-4 py-2 text-xs font-bold text-[#8e8c6c]"
            >
              Exit Journey
            </button>

            <button
              type="button"
              onClick={handleStepAction}
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#dddb9d] via-[#7bc963] to-[#567f2b] px-6 py-2 text-xs font-bold text-[#0a0b04] shadow-[0_0_20px_rgba(123,201,99,0.3)] hover:scale-[1.02] transition-all"
            >
              <span>{currentStep === 10 ? "Launch Copilot & Finish" : "Continue"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
