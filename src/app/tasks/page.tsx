import { PageHeader } from "@/components/PageHeader";
import { TaskGrid } from "@/components/TaskGrid";
import { tasks } from "@/data/tasks";

export default function TasksPage() {
  return (
    <>
      <PageHeader title="Tasks" description="All tasks, from local mock data." />
      <TaskGrid tasks={tasks} />
    </>
  );
}
