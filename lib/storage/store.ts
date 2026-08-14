import type { AppSettings, HistoryEntry, Project } from "@/lib/storage/types";
import { DEFAULT_SETTINGS } from "@/lib/storage/types";

const PROJECTS_KEY = "archigen_projects";
const HISTORY_KEY = "archigen_history";
const SETTINGS_KEY = "archigen_settings";
const ACTIVE_PROJECT_KEY = "archigen_active_project";

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function getProjects(): Project[] {
  return read<Project[]>(PROJECTS_KEY, []);
}

export function getProject(id: string): Project | undefined {
  return getProjects().find((p) => p.id === id);
}

export function saveProject(project: Project) {
  const projects = getProjects();
  const index = projects.findIndex((p) => p.id === project.id);
  if (index >= 0) {
    projects[index] = project;
  } else {
    projects.unshift(project);
  }
  write(PROJECTS_KEY, projects);
}

export function deleteProject(id: string) {
  write(
    PROJECTS_KEY,
    getProjects().filter((p) => p.id !== id),
  );
  write(
    HISTORY_KEY,
    getHistory().filter((h) => h.projectId !== id),
  );
  if (getActiveProjectId() === id) {
    localStorage.removeItem(ACTIVE_PROJECT_KEY);
  }
}

export function duplicateProject(id: string): Project | undefined {
  const source = getProject(id);
  if (!source) return undefined;
  const copy: Project = {
    ...source,
    id: generateId(),
    title: `${source.title} (Copy)`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  saveProject(copy);
  return copy;
}

export function getActiveProjectId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACTIVE_PROJECT_KEY);
}

export function setActiveProjectId(id: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACTIVE_PROJECT_KEY, id);
}

export function getHistory(): HistoryEntry[] {
  return read<HistoryEntry[]>(HISTORY_KEY, []);
}

export function addHistoryEntry(entry: HistoryEntry) {
  const history = getHistory();
  history.unshift(entry);
  write(HISTORY_KEY, history.slice(0, 100));
}

export function getHistoryEntry(id: string): HistoryEntry | undefined {
  return getHistory().find((h) => h.id === id);
}

export function getSettings(): AppSettings {
  return read<AppSettings>(SETTINGS_KEY, DEFAULT_SETTINGS);
}

export function saveSettings(settings: AppSettings) {
  write(SETTINGS_KEY, settings);
}

export function createProject(
  partial: Pick<Project, "title" | "prompt" | "diagramType"> &
    Partial<Pick<Project, "description" | "result">>,
): Project {
  const now = new Date().toISOString();
  const project: Project = {
    id: generateId(),
    description: "",
    ...partial,
    createdAt: now,
    updatedAt: now,
  };
  saveProject(project);
  setActiveProjectId(project.id);
  return project;
}
