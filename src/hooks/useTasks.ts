"use client";

import { useCallback, useSyncExternalStore } from "react";
import { tasks as seedTasks } from "@/data/tasks";
import type { Task, TaskPriority } from "@/types/task";

const STORAGE_KEY = "agentteam.tasks";

export interface NewTaskInput {
  title: string;
  description: string;
  priority: TaskPriority;
  dueDate: string;
}

type Listener = () => void;
const listeners = new Set<Listener>();

function isTask(value: unknown): value is Task {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.title === "string" &&
    typeof candidate.description === "string" &&
    typeof candidate.status === "string" &&
    typeof candidate.priority === "string" &&
    typeof candidate.assignee === "string" &&
    typeof candidate.dueDate === "string" &&
    Array.isArray(candidate.tags)
  );
}

function parseStoredTasks(raw: string | null): Task[] | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || !parsed.every(isTask)) return null;
    return parsed;
  } catch {
    return null;
  }
}

// Cached by the raw string last read so useSyncExternalStore gets a stable
// reference when localStorage hasn't actually changed.
let cachedRaw: string | null | undefined;
let cachedTasks: Task[] = seedTasks;

function readSnapshot(): Task[] {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (cachedRaw !== undefined && raw === cachedRaw) return cachedTasks;
  cachedRaw = raw;
  const parsed = parseStoredTasks(raw);
  if (parsed) {
    cachedTasks = parsed;
  } else {
    // Missing or corrupted data: fall back to (and persist) the seed set.
    cachedTasks = seedTasks;
    cachedRaw = JSON.stringify(seedTasks);
    window.localStorage.setItem(STORAGE_KEY, cachedRaw);
  }
  return cachedTasks;
}

function writeTasks(tasks: Task[]) {
  cachedRaw = JSON.stringify(tasks);
  cachedTasks = tasks;
  window.localStorage.setItem(STORAGE_KEY, cachedRaw);
  listeners.forEach((listener) => listener());
}

function subscribe(onStoreChange: Listener): () => void {
  listeners.add(onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    listeners.delete(onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function getServerSnapshot(): Task[] {
  return seedTasks;
}

/**
 * Reads/writes tasks to localStorage, seeded from the mock data on first
 * load. Uses useSyncExternalStore so the server/client snapshots match
 * before localStorage is consulted, and so writes made via addTask are
 * reflected immediately without a setState-in-effect.
 */
export function useTasks() {
  const tasks = useSyncExternalStore(subscribe, readSnapshot, getServerSnapshot);

  const addTask = useCallback((input: NewTaskInput) => {
    const task: Task = {
      id: crypto.randomUUID(),
      title: input.title.trim(),
      description: input.description.trim(),
      status: "todo",
      priority: input.priority,
      assignee: "",
      dueDate: input.dueDate,
      tags: [],
    };
    writeTasks([task, ...readSnapshot()]);
    return task;
  }, []);

  return { tasks, addTask };
}
