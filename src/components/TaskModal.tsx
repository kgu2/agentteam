"use client";

import { useId, useState, type FormEvent } from "react";
import type { NewTaskInput } from "@/hooks/useTasks";
import { PRIORITY_LABELS } from "@/lib/tasks";
import type { TaskPriority } from "@/types/task";

const priorities: TaskPriority[] = ["low", "medium", "high"];

interface TaskModalProps {
  onClose: () => void;
  onSubmit: (input: NewTaskInput) => void;
}

export function TaskModal({ onClose, onSubmit }: TaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [dueDate, setDueDate] = useState("");
  const [titleError, setTitleError] = useState<string | null>(null);

  const titleId = useId();
  const descriptionId = useId();
  const priorityId = useId();
  const dueDateId = useId();
  const titleErrorId = useId();
  const headingId = useId();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setTitleError("Title is required.");
      return;
    }
    onSubmit({ title: trimmedTitle, description, priority, dueDate });
  }

  return (
    <div
      className="fixed inset-0 z-30 flex items-center justify-center bg-slate-900/50 p-4"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id={headingId} className="text-lg font-semibold text-slate-900">
          Create task
        </h2>
        <form className="mt-4 flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label htmlFor={titleId} className="text-sm font-medium text-slate-700">
              Title <span aria-hidden="true">*</span>
            </label>
            <input
              id={titleId}
              type="text"
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                if (titleError) setTitleError(null);
              }}
              aria-required="true"
              aria-invalid={titleError ? "true" : "false"}
              aria-describedby={titleError ? titleErrorId : undefined}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            {titleError && (
              <p id={titleErrorId} role="alert" className="text-sm text-red-600">
                {titleError}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor={descriptionId} className="text-sm font-medium text-slate-700">
              Description
            </label>
            <textarea
              id={descriptionId}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={3}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex flex-1 flex-col gap-1">
              <label htmlFor={priorityId} className="text-sm font-medium text-slate-700">
                Priority
              </label>
              <select
                id={priorityId}
                value={priority}
                onChange={(event) => setPriority(event.target.value as TaskPriority)}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {priorities.map((value) => (
                  <option key={value} value={value}>
                    {PRIORITY_LABELS[value]}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-1 flex-col gap-1">
              <label htmlFor={dueDateId} className="text-sm font-medium text-slate-700">
                Due date
              </label>
              <input
                id={dueDateId}
                type="date"
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              Create task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
