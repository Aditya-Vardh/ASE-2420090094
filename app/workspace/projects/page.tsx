"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FolderOpen, Plus, Check, X, MoreHorizontal, Download, Sparkles, Trash2, Copy, Edit3, Eye, Layers, RefreshCw
} from "lucide-react";
import {
  deleteProject,
  duplicateProject,
  getProjects,
  saveProject,
  setActiveProjectId,
} from "@/lib/storage/store";
import type { Project } from "@/lib/storage/types";
import { DIAGRAM_TYPE_LABELS } from "@/lib/storage/types";
import { deriveAdaptiveInsights } from "@/lib/adaptive";
import { toMarkdownExport, downloadText } from "@/lib/export";
import { synthesizeFallbackArchitecture } from "@/lib/ai/fallback-synthesizer";
import ArchitectureCanvas from "@/components/workspace/ArchitectureCanvas";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [previewProject, setPreviewProject] = useState<Project | null>(null);

  function refresh() {
    const list = getProjects();
    // Hydrate any project missing a result using fallback synthesizer so all projects render
    const hydrated = list.map((p) => {
      if (!p.result) {
        const synth = synthesizeFallbackArchitecture(p.prompt || p.title, p.diagramType);
        const updated = { ...p, result: synth };
        saveProject(updated);
        return updated;
      }
      return p;
    });
    setProjects(hydrated);
  }

  useEffect(() => {
    const id = requestAnimationFrame(() => refresh());
    return () => cancelAnimationFrame(id);
  }, []);

  function startRename(project: Project) {
    setEditingId(project.id);
    setEditTitle(project.title);
    setMenuOpen(null);
  }

  function saveRename(id: string) {
    const project = projects.find((p) => p.id === id);
    if (project && editTitle.trim()) {
      saveProject({ ...project, title: editTitle.trim(), updatedAt: new Date().toISOString() });
      refresh();
    }
    setEditingId(null);
  }

  function handleDelete(id: string) {
    if (confirm("Delete this project and its history entries?")) {
      deleteProject(id);
      refresh();
    }
    setMenuOpen(null);
  }

  function handleDuplicate(id: string) {
    duplicateProject(id);
    refresh();
    setMenuOpen(null);
  }

  function handleExport(project: Project) {
    if (!project.result) return;
    downloadText(toMarkdownExport(project.result), `${project.title.replace(/\s+/g, "-").toLowerCase()}.md`, "text/markdown");
    setMenuOpen(null);
  }

  return (
    <div className="mx-auto max-w-6xl p-6 lg:p-10 pt-8 sm:pt-12 pb-16 space-y-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-[#dddb9d]/15 pb-8">
        <div>
          <div className="mb-2.5 inline-flex items-center gap-2 rounded-full border border-[#7bc963]/30 bg-[#7bc963]/10 px-3.5 py-1 backdrop-blur-md">
            <FolderOpen className="h-3.5 w-3.5 text-[#7bc963]" />
            <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-[#7bc963]">
              Project Repository &amp; Specs
            </span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-[#f2f1da] sm:text-5xl">
            Software Architecture Projects
          </h1>
          <p className="mt-2 text-base text-[#c8c69d] max-w-xl">
            Manage your saved system diagrams, microservice maps, and exported specifications.
          </p>
        </div>

        <Link
          href="/workspace/generate?new=1"
          className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#dddb9d] via-[#7bc963] to-[#567f2b] px-6 py-3.5 text-xs font-bold text-[#0a0b04] shadow-[0_0_25px_rgba(123,201,99,0.3)] transition-all hover:scale-[1.03] shrink-0"
        >
          <Plus className="h-4 w-4" />
          Create New Project
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="flex h-full min-h-[350px] flex-col items-center justify-center rounded-3xl border border-dashed border-[#dddb9d]/20 bg-[#12140a]/60 p-10 text-center backdrop-blur-2xl">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#dddb9d]/10 border border-[#dddb9d]/30 text-[#7bc963] shadow-[0_0_30px_rgba(123,201,99,0.2)]">
            <FolderOpen className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-bold text-[#f2f1da]">No Projects Saved Yet</h3>
          <p className="mt-2 text-sm text-[#c8c69d] max-w-sm leading-relaxed">
            Generate your first architecture in the Studio Canvas to save and manage projects here.
          </p>
          <Link
            href="/workspace/generate?new=1"
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[#7bc963] px-6 py-3 text-xs font-bold text-[#0a0b04] shadow-[0_0_20px_rgba(123,201,99,0.3)] hover:bg-[#91e577] transition-colors"
          >
            <Plus className="h-4 w-4" /> Launch Studio Canvas
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => {
            const health = project.result ? deriveAdaptiveInsights(project.result) : null;
            return (
              <div
                key={project.id}
                className="group relative overflow-hidden rounded-3xl border border-[#dddb9d]/15 bg-gradient-to-b from-[#12140a]/90 via-[#0d0f06]/95 to-[#0a0b04] p-6 backdrop-blur-2xl transition-all duration-300 hover:border-[#dddb9d]/35 hover:shadow-[0_20px_40px_rgba(0,0,0,0.8),0_0_25px_rgba(123,201,99,0.15)] hover:-translate-y-1 flex flex-col justify-between"
              >
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#dddb9d_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.05]" />
                <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#dddb9d]/30 to-transparent" />

                <div className="block flex-1 relative z-10">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="rounded-full bg-[#dddb9d]/10 border border-[#dddb9d]/20 px-3 py-1 font-mono text-[10px] font-bold text-[#dddb9d] uppercase">
                      {DIAGRAM_TYPE_LABELS[project.diagramType]}
                    </span>
                    <span className="text-[10px] font-mono text-[#8e8c6c]">
                      {new Date(project.updatedAt).toLocaleDateString()}
                    </span>
                  </div>

                  {editingId === project.id ? (
                    <div className="flex items-center gap-2 mb-3" onClick={(e) => e.preventDefault()}>
                      <input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="flex-1 rounded-xl border border-[#dddb9d]/40 bg-[#070804] px-3 py-1.5 text-xs text-[#f2f1da] outline-none"
                        autoFocus
                      />
                      <button type="button" onClick={() => saveRename(project.id)} className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#7bc963] text-[#0a0b04]">
                        <Check className="h-4 w-4" />
                      </button>
                      <button type="button" onClick={() => setEditingId(null)} className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#12140a] text-[#c8c69d]">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Link
                        href={`/workspace/generate?project=${project.id}`}
                        onClick={() => setActiveProjectId(project.id)}
                      >
                        <h3 className="truncate text-lg font-bold text-[#f2f1da] group-hover:text-[#7bc963] transition-colors">
                          {project.title}
                        </h3>
                        <p className="mt-1 text-xs text-[#c8c69d] line-clamp-2">
                          {project.prompt || "Custom architecture specification."}
                        </p>
                      </Link>
                    </div>
                  )}

                  {health && (
                    <div className="mt-4 flex items-center gap-2 rounded-xl bg-[#7bc963]/10 border border-[#7bc963]/20 px-3 py-1.5 text-xs font-semibold text-[#7bc963] w-fit">
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Health {health.health}/100 · {health.healthLabel}</span>
                    </div>
                  )}
                </div>

                <div className="relative z-10 mt-6 pt-4 border-t border-[#dddb9d]/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/workspace/generate?project=${project.id}`}
                      onClick={() => setActiveProjectId(project.id)}
                      className="text-xs font-bold text-[#7bc963] hover:text-[#91e577] transition-colors flex items-center gap-1"
                    >
                      Open Canvas →
                    </Link>

                    {project.result && (
                      <button
                        type="button"
                        onClick={() => setPreviewProject(project)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#dddb9d] hover:text-white px-2 py-0.5 rounded-lg bg-[#dddb9d]/10 border border-[#dddb9d]/20 transition-colors"
                      >
                        <Eye className="h-3 w-3" /> Quick View
                      </button>
                    )}
                  </div>

                  <div className="relative">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setMenuOpen(menuOpen === project.id ? null : project.id);
                      }}
                      className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#dddb9d]/20 bg-[#12140a] text-[#c8c69d] hover:text-[#f2f1da]"
                      aria-label="Project actions"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>

                    {menuOpen === project.id && (
                      <div className="absolute right-0 bottom-full mb-2 z-20 w-44 rounded-2xl border border-[#dddb9d]/20 bg-[#12140a] p-1.5 shadow-2xl backdrop-blur-2xl text-xs">
                        <button type="button" onClick={() => startRename(project)} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-[#c8c69d] hover:bg-[#dddb9d]/10 hover:text-[#f2f1da]">
                          <Edit3 className="h-3.5 w-3.5 text-[#7bc963]" /> Rename
                        </button>
                        <button type="button" onClick={() => handleDuplicate(project.id)} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-[#c8c69d] hover:bg-[#dddb9d]/10 hover:text-[#f2f1da]">
                          <Copy className="h-3.5 w-3.5 text-[#dddb9d]" /> Duplicate
                        </button>
                        {project.result && (
                          <button type="button" onClick={() => handleExport(project)} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-[#c8c69d] hover:bg-[#dddb9d]/10 hover:text-[#f2f1da]">
                            <Download className="h-3.5 w-3.5 text-[#7bc963]" /> Export MD
                          </button>
                        )}
                        <div className="my-1 border-t border-[#dddb9d]/10" />
                        <button type="button" onClick={() => handleDelete(project.id)} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-rose-400 hover:bg-rose-500/10">
                          <Trash2 className="h-3.5 w-3.5" /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Quick View Diagram Modal */}
      {previewProject && previewProject.result && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative flex flex-col w-full max-w-5xl h-[85vh] overflow-hidden rounded-3xl border border-[#dddb9d]/30 bg-[#0a0b04] shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#dddb9d]/15 bg-[#12140a]">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#7bc963]/20 text-[#7bc963]">
                  <Layers className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#f2f1da]">{previewProject.title}</h2>
                  <p className="text-xs text-[#7bc963] font-mono uppercase">
                    {DIAGRAM_TYPE_LABELS[previewProject.diagramType]} Spec
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href={`/workspace/generate?project=${previewProject.id}`}
                  onClick={() => { setActiveProjectId(previewProject.id); setPreviewProject(null); }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-[#0a0b04] bg-[#7bc963] hover:bg-[#91e577] rounded-xl transition-colors"
                >
                  <Sparkles className="h-3.5 w-3.5" /> Edit in Studio
                </Link>

                <button
                  type="button"
                  onClick={() => setPreviewProject(null)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#dddb9d]/20 bg-[#12140a] text-[#c8c69d] hover:text-white"
                  aria-label="Close modal"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Modal Canvas View */}
            <div className="relative flex-1 overflow-hidden">
              <ArchitectureCanvas
                chart={previewProject.result.mermaidCode}
                result={previewProject.result}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
