import type { TaskPriority, TaskStatus } from "@/types/task";
import { PRIORITY_LABELS, STATUS_LABELS } from "@/lib/tasks";

const baseClass = "inline-block rounded-full px-2 py-0.5 text-xs font-medium";

const statusStyles: Record<TaskStatus, string> = {
  todo: "bg-slate-100 text-slate-700",
  "in-progress": "bg-blue-100 text-blue-700",
  review: "bg-amber-100 text-amber-800",
  done: "bg-green-100 text-green-700",
};

const priorityStyles: Record<TaskPriority, string> = {
  low: "bg-slate-100 text-slate-600",
  medium: "bg-orange-100 text-orange-700",
  high: "bg-red-100 text-red-700",
};

export function StatusBadge({ status }: { status: TaskStatus }) {
  return (
    <span className={`${baseClass} ${statusStyles[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  return (
    <span className={`${baseClass} ${priorityStyles[priority]}`}>
      {PRIORITY_LABELS[priority]} priority
    </span>
  );
}
