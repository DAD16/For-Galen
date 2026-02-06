"use client";

import { useState, useCallback } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import type { Project, Task } from "@/lib/content/projects";
import { KanbanColumn } from "./kanban-column";
import { TaskCard } from "./task-card";
import { CreateTaskDialog } from "./create-task-dialog";
import { TaskDetailSheet } from "./task-detail-sheet";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface KanbanBoardProps {
  initialProject: Project;
}

export function KanbanBoard({ initialProject }: KanbanBoardProps) {
  const [project, setProject] = useState<Project>(initialProject);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [createColumnId, setCreateColumnId] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor)
  );

  const getColumnTasks = useCallback(
    (columnId: string) =>
      project.tasks
        .filter((t) => t.columnId === columnId)
        .sort((a, b) => a.sortOrder - b.sortOrder),
    [project.tasks]
  );

  // --- DnD Handlers ---

  const handleDragStart = (event: DragStartEvent) => {
    const task = project.tasks.find((t) => t.id === event.active.id);
    if (task) setActiveTask(task);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeTaskData = project.tasks.find((t) => t.id === activeId);
    if (!activeTaskData) return;

    // Determine if we're over a column or a task
    const overColumn = project.columns.find((c) => c.id === overId);
    const overTask = project.tasks.find((t) => t.id === overId);
    const targetColumnId = overColumn?.id || overTask?.columnId;

    if (!targetColumnId || activeTaskData.columnId === targetColumnId) return;

    // Optimistically move task to new column
    setProject((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) =>
        t.id === activeId
          ? { ...t, columnId: targetColumnId, sortOrder: 999 }
          : t
      ),
    }));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeTaskData = project.tasks.find((t) => t.id === activeId);
    if (!activeTaskData) return;

    const columnId = activeTaskData.columnId;
    const columnTasks = project.tasks
      .filter((t) => t.columnId === columnId)
      .sort((a, b) => a.sortOrder - b.sortOrder);

    const oldIndex = columnTasks.findIndex((t) => t.id === activeId);

    // If dropped on a column (empty area), put at end
    const isColumn = project.columns.some((c) => c.id === overId);
    let newIndex: number;
    if (isColumn) {
      newIndex = columnTasks.length - 1;
    } else {
      newIndex = columnTasks.findIndex((t) => t.id === overId);
      if (newIndex === -1) newIndex = columnTasks.length - 1;
    }

    if (oldIndex !== newIndex && oldIndex !== -1) {
      const reordered = arrayMove(columnTasks, oldIndex, newIndex);
      setProject((prev) => ({
        ...prev,
        tasks: prev.tasks.map((t) => {
          if (t.columnId !== columnId) return t;
          const idx = reordered.findIndex((r) => r.id === t.id);
          return idx !== -1 ? { ...t, sortOrder: idx } : t;
        }),
      }));
    }

    // Persist the reorder
    fetch(`/api/projects/${project.id}/tasks/reorder`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        taskId: activeId,
        destinationColumnId: columnId,
        newIndex: newIndex >= 0 ? newIndex : 0,
      }),
    });
  };

  // --- Task CRUD ---

  const handleAddTask = (columnId: string) => {
    setCreateColumnId(columnId);
    setCreateDialogOpen(true);
  };

  const handleTaskCreated = (task: Task) => {
    setProject((prev) => ({
      ...prev,
      tasks: [...prev.tasks, task],
    }));
    setCreateDialogOpen(false);
  };

  const handleTaskUpdated = (updated: Task) => {
    setProject((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => (t.id === updated.id ? updated : t)),
    }));
    setEditingTask(null);
  };

  const handleTaskDeleted = (taskId: string) => {
    setProject((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => t.id !== taskId),
    }));
    setEditingTask(null);
  };

  // --- Column CRUD ---

  const handleAddColumn = async () => {
    const title = prompt("Column name:");
    if (!title?.trim()) return;

    const res = await fetch(`/api/projects/${project.id}/columns`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: title.trim() }),
    });

    if (res.ok) {
      const column = await res.json();
      setProject((prev) => ({
        ...prev,
        columns: [...prev.columns, column],
      }));
    }
  };

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <ScrollArea className="flex-1">
          <div className="flex gap-4 pb-4" style={{ minHeight: "100%" }}>
            {project.columns
              .sort((a, b) => a.sortOrder - b.sortOrder)
              .map((column) => (
                <KanbanColumn
                  key={column.id}
                  column={column}
                  tasks={getColumnTasks(column.id)}
                  onAddTask={handleAddTask}
                  onEditTask={setEditingTask}
                />
              ))}
            <div className="flex w-[300px] shrink-0 items-start">
              <Button
                variant="outline"
                className="w-full border-dashed"
                onClick={handleAddColumn}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Column
              </Button>
            </div>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} isOverlay /> : null}
        </DragOverlay>
      </DndContext>

      <CreateTaskDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        projectId={project.id}
        columnId={createColumnId}
        columns={project.columns}
        onTaskCreated={handleTaskCreated}
      />

      <TaskDetailSheet
        task={editingTask}
        onClose={() => setEditingTask(null)}
        projectId={project.id}
        columns={project.columns}
        onTaskUpdated={handleTaskUpdated}
        onTaskDeleted={handleTaskDeleted}
      />
    </>
  );
}
