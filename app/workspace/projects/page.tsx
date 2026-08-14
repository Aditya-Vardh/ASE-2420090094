"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FolderOpen, Plus, Check, X, MoreHorizontal, Download, Sparkles, Trash2, Copy, Edit3 } from "lucide-react";
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

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  function refresh() {
    setProjects(getProjects());
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
    <div className="mx-auto max-w-6xl p-6 lg:p-10 space-y-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-white/[0.08] pb-8">
        <div>
          <div className="mb-2.5 inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-400/10 px-3.5 py-1 backdrop-blur-md">
            <FolderOpen className="h-3.5 w-3.5 text-indigo-400" />
            <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-indigo-300">
              Project Repository
            </span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Software Architecture Projects
          </h1>
          <p className="mt-2 text-base text-slate-300 max-w-xl">
            Manage your saved system diagrams, microservice maps, and exported specifications.
          </p>
        </div>

        <Link
          href="/workspace/generate?new=1"
          className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 px-6 py-3.5 text-sm font-bold text-slate-950 shadow-[0_0_25px_rgba(34,211,238,0.3)] transition-all hover:scale-[1.03] shrink-0"
        >
          <Plus className="h-4 w-4" />
          Create New Project
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="flex h-full min-h-[350px] flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-[#0A0C14]/60 p-10 text-center backdrop-blur-2xl">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
            <FolderOpen className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-bold text-white">No Projects Saved Yet</h3>
          <p className="mt-2 text-sm text-slate-400 max-w-sm leading-relaxed">
            Generate your first architecture in the Studio Canvas to save and manage projects here.
          </p>
          <Link
            href="/workspace/generate?new=1"
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-cyan-400 px-6 py-3 text-xs font-bold text-slate-950 shadow-[0_0_20px_rgba(34,211,238,0.3)]"
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
                className="group relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0A0C14]/90 p-6 backdrop-blur-2xl transition-all duration-300 hover:border-white/20 hover:shadow-[0_20px_40px_rgba(0,0,0,0.8),0_0_25px_rgba(99,102,241,0.15)] hover:-translate-y-1 flex flex-col justify-between"
              >
                <Link
                  href={`/workspace/generate?project=${project.id}`}
                  onClick={() => setActiveProjectId(project.id)}
                  className="block flex-1"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <span className="rounded-full bg-indigo-500/10 border border-indigo-500/30 px-3 py-1 font-mono text-[10px] font-bold text-indigo-300 uppercase">
                      {DIAGRAM_TYPE_LABELS[project.diagramType]}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {new Date(project.updatedAt).toLocaleDateString()}
                    </span>
                  </div>

                  {editingId === project.id ? (
                    <div className="flex items-center gap-2 mb-3" onClick={(e) => e.preventDefault()}>
                      <input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="flex-1 rounded-xl border border-indigo-400/50 bg-[#090A10] px-3 py-1.5 text-xs text-white outline-none"
                        autoFocus
                      />
                      <button type="button" onClick={() => saveRename(project.id)} className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-400 text-slate-950">
                        <Check className="h-4 w-4" />
                      </button>
                      <button type="button" onClick={() => setEditingId(null)} className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 text-slate-300">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <h3 className="truncate text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {project.title}
                      </h3>
                      <p className="mt-1 text-xs text-slate-400 line-clamp-2">
                        {project.prompt || "No prompt description recorded."}
                      </p>
                    </div>
                  )}

                  {health && (
                    <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 text-xs font-semibold text-emerald-400 w-fit">
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Health {health.health}/100 · {health.healthLabel}</span>
                    </div>
                  )}
                </Link>

                <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between">
                  <Link
                    href={`/workspace/generate?project=${project.id}`}
                    className="text-xs font-bold text-cyan-400 group-hover:text-cyan-300 transition-colors"
                  >
                    Open Canvas →
                  </Link>

                  <div className="relative">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setMenuOpen(menuOpen === project.id ? null : project.id);
                      }}
                      className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-300 hover:text-white"
                      aria-label="Project actions"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>

                    {menuOpen === project.id && (
                      <div className="absolute right-0 bottom-full mb-2 z-20 w-44 rounded-2xl border border-white/10 bg-[#0E101A] p-1.5 shadow-2xl backdrop-blur-2xl text-xs">
                        <button type="button" onClick={() => startRename(project)} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-slate-300 hover:bg-white/[0.06] hover:text-white">
                          <Edit3 className="h-3.5 w-3.5 text-cyan-400" /> Rename
                        </button>
                        <button type="button" onClick={() => handleDuplicate(project.id)} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-slate-300 hover:bg-white/[0.06] hover:text-white">
                          <Copy className="h-3.5 w-3.5 text-indigo-400" /> Duplicate
                        </button>
                        {project.result && (
                          <button type="button" onClick={() => handleExport(project)} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-slate-300 hover:bg-white/[0.06] hover:text-white">
                            <Download className="h-3.5 w-3.5 text-emerald-400" /> Export MD
                          </button>
                        )}
                        <div className="my-1 border-t border-white/10" />
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
    </div>
  );
}
