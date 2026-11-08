"use client";

import { CreateTaskButton } from "@/components/CreateTaskButton";
import { PageHeader } from "@/components/PageHeader";
import { TaskGrid } from "@/components/TaskGrid";
import { useTasks } from "@/hooks/useTasks";

export default function TasksPage() {
  const { tasks, addTask } = useTasks();

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageHeader title="Tasks" description="All tasks." />
        <CreateTaskButton onCreateTask={addTask} />
      </div>
      <TaskGrid tasks={tasks} />
    </>
  );
}
