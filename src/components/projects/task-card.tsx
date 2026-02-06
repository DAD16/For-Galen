"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Task } from "@/lib/content/projects";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";

const priorityConfig: Record<
  string,
  { label: string; className: string }
> = {
  low: { label: "Low", className: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300" },
  medium: { label: "Med", className: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" },
  high: { label: "High", className: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300" },
  urgent: { label: "Urgent", className: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300" },
};

interface TaskCardProps {
  task: Task;
  isOverlay?: boolean;
  onClick?: () => void;
}

export function TaskCard({ task, isOverlay, onClick }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isOverdue =
    task.dueDate && new Date(task.dueDate) < new Date();
  const config = priorityConfig[task.priority] || priorityConfig.medium;

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`cursor-grab p-3 transition-shadow hover:shadow-md ${
        isOverlay ? "shadow-lg rotate-2" : ""
      } ${isDragging ? "opacity-40" : ""}`}
      onClick={onClick}
    >
      <div className="mb-1.5 flex items-center gap-1.5">
        <Badge
          variant="secondary"
          className={`text-[10px] px-1.5 py-0 ${config.className}`}
        >
          {config.label}
        </Badge>
      </div>

      <p className="text-sm font-medium leading-snug">{task.title}</p>

      {(task.labels.length > 0 || task.dueDate) && (
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          {task.labels.map((label) => (
            <Badge key={label} variant="outline" className="text-[10px] px-1.5 py-0">
              {label}
            </Badge>
          ))}
          {task.dueDate && (
            <span
              className={`flex items-center gap-1 text-[10px] ${
                isOverdue
                  ? "text-destructive font-medium"
                  : "text-muted-foreground"
              }`}
            >
              <Calendar className="h-3 w-3" />
              {new Date(task.dueDate).toLocaleDateString()}
            </span>
          )}
        </div>
      )}
    </Card>
  );
}
