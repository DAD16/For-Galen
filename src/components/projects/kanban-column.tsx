"use client";

import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import type { Column, Task } from "@/lib/content/projects";
import { TaskCard } from "./task-card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface KanbanColumnProps {
  column: Column;
  tasks: Task[];
  onAddTask: (columnId: string) => void;
  onEditTask: (task: Task) => void;
}

export function KanbanColumn({
  column,
  tasks,
  onAddTask,
  onEditTask,
}: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({ id: column.id });

  const taskIds = tasks.map((t) => t.id);

  return (
    <div className="flex h-full w-[260px] shrink-0 flex-col rounded-lg bg-muted/50 sm:w-[300px]">
      <div className="flex items-center justify-between px-3 py-2.5">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold">{column.title}</h3>
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-[10px] font-medium text-muted-foreground">
            {tasks.length}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => onAddTask(column.id)}
        >
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </div>

      <div ref={setNodeRef} className="flex flex-1 flex-col gap-2 overflow-y-auto px-2 pb-2">
        <SortableContext
          items={taskIds}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onClick={() => onEditTask(task)}
            />
          ))}
        </SortableContext>
        {tasks.length === 0 && (
          <div className="flex flex-1 items-center justify-center py-8">
            <p className="text-xs text-muted-foreground">No tasks</p>
          </div>
        )}
      </div>
    </div>
  );
}
