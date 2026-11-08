import type { Task } from "@/types/task";
import { formatDueDate } from "@/lib/tasks";
import { PriorityBadge, StatusBadge } from "./Badge";

export function TaskCard({ task }: { task: Task }) {
  return (
    <article className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap gap-2">
        <StatusBadge status={task.status} />
        <PriorityBadge priority={task.priority} />
      </div>
      <div>
        <h3 className="font-semibold text-slate-900">{task.title}</h3>
        <p className="mt-1 text-sm text-slate-600">{task.description}</p>
      </div>
      <ul className="flex flex-wrap gap-1">
        {task.tags.map((tag) => (
          <li
            key={tag}
            className="rounded bg-indigo-50 px-1.5 py-0.5 text-xs text-indigo-700"
          >
            #{tag}
          </li>
        ))}
      </ul>
      <div className="mt-auto flex items-center justify-between text-xs text-slate-500">
        <span>{task.assignee}</span>
        <span>Due {formatDueDate(task.dueDate)}</span>
      </div>
    </article>
  );
}
