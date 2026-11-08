"use client";

import { useState } from "react";
import type { NewTaskInput } from "@/hooks/useTasks";
import { TaskModal } from "./TaskModal";

interface CreateTaskButtonProps {
  onCreateTask: (input: NewTaskInput) => void;
}

export function CreateTaskButton({ onCreateTask }: CreateTaskButtonProps) {
  const [open, setOpen] = useState(false);

  function handleSubmit(input: NewTaskInput) {
    onCreateTask(input);
    setOpen(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
      >
        Create task
      </button>
      {open && <TaskModal onClose={() => setOpen(false)} onSubmit={handleSubmit} />}
    </>
  );
}
