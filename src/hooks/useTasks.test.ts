import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { tasks as seedTasks } from "@/data/tasks";
import { useTasks } from "./useTasks";

const STORAGE_KEY = "agentteam.tasks";

beforeEach(() => {
  window.localStorage.clear();
});

afterEach(() => {
  window.localStorage.clear();
});

describe("useTasks", () => {
  it("seeds localStorage with the mock tasks on first load", async () => {
    const { result } = renderHook(() => useTasks());

    await waitFor(() => {
      expect(result.current.tasks).toHaveLength(seedTasks.length);
    });

    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
    expect(stored).toHaveLength(seedTasks.length);
  });

  it("reads previously persisted tasks instead of the seed data", async () => {
    const persisted = [
      {
        id: "custom-1",
        title: "Persisted task",
        description: "",
        status: "todo",
        priority: "low",
        assignee: "",
        dueDate: "",
        tags: [],
      },
    ];
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));

    const { result } = renderHook(() => useTasks());

    await waitFor(() => {
      expect(result.current.tasks).toHaveLength(1);
    });
    expect(result.current.tasks[0].title).toBe("Persisted task");
  });

  it("falls back to seed data when localStorage contains corrupted JSON", async () => {
    window.localStorage.setItem(STORAGE_KEY, "{not valid json");

    const { result } = renderHook(() => useTasks());

    await waitFor(() => {
      expect(result.current.tasks).toHaveLength(seedTasks.length);
    });
  });

  it("falls back to seed data when localStorage contains a malformed task shape", async () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([{ foo: "bar" }]));

    const { result } = renderHook(() => useTasks());

    await waitFor(() => {
      expect(result.current.tasks).toHaveLength(seedTasks.length);
    });
  });

  it("adds a new task and persists it to localStorage", async () => {
    const { result } = renderHook(() => useTasks());

    await waitFor(() => {
      expect(result.current.tasks).toHaveLength(seedTasks.length);
    });

    act(() => {
      result.current.addTask({
        title: "New task",
        description: "Some description",
        priority: "high",
        dueDate: "2026-12-01",
      });
    });

    await waitFor(() => {
      expect(result.current.tasks).toHaveLength(seedTasks.length + 1);
    });
    expect(result.current.tasks[0].title).toBe("New task");
    expect(result.current.tasks[0].id).toBeTruthy();

    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
    expect(stored).toHaveLength(seedTasks.length + 1);
  });

  it("trims whitespace from the title and description of a new task", async () => {
    const { result } = renderHook(() => useTasks());

    await waitFor(() => {
      expect(result.current.tasks).toHaveLength(seedTasks.length);
    });

    act(() => {
      result.current.addTask({
        title: "  Padded title  ",
        description: "  Padded description  ",
        priority: "medium",
        dueDate: "",
      });
    });

    await waitFor(() => {
      expect(result.current.tasks[0].title).toBe("Padded title");
    });
    expect(result.current.tasks[0].description).toBe("Padded description");
  });
});
