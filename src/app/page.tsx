import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { TaskGrid } from "@/components/TaskGrid";
import { tasks } from "@/data/tasks";
import { STATUS_LABELS, countByStatus } from "@/lib/tasks";
import type { TaskStatus } from "@/types/task";

const statuses: TaskStatus[] = ["todo", "in-progress", "review", "done"];

export default function DashboardPage() {
  const counts = countByStatus(tasks);
  const active = tasks.filter((t) => t.status !== "done").slice(0, 6);

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="An overview of your team's work."
      />
      <section
        aria-label="Task summary"
        className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4"
      >
        {statuses.map((status) => (
          <StatCard
            key={status}
            label={STATUS_LABELS[status]}
            value={counts[status]}
          />
        ))}
      </section>
      <section aria-labelledby="active-heading">
        <h2
          id="active-heading"
          className="mb-3 text-lg font-semibold text-slate-900"
        >
          Active tasks
        </h2>
        <TaskGrid tasks={active} />
      </section>
    </>
  );
}
