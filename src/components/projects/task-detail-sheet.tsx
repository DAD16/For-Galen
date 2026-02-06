"use client";

import { useState, useEffect } from "react";
import { Loader2, Trash2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Column, Task, Priority } from "@/lib/content/projects";

interface TaskDetailSheetProps {
  task: Task | null;
  onClose: () => void;
  projectId: string;
  columns: Column[];
  onTaskUpdated: (task: Task) => void;
  onTaskDeleted: (taskId: string) => void;
}

export function TaskDetailSheet({
  task,
  onClose,
  projectId,
  columns,
  onTaskUpdated,
  onTaskDeleted,
}: TaskDetailSheetProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [columnId, setColumnId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [labelInput, setLabelInput] = useState("");
  const [labels, setLabels] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setPriority(task.priority);
      setColumnId(task.columnId);
      setDueDate(task.dueDate || "");
      setLabels([...task.labels]);
      setConfirmDelete(false);
    }
  }, [task]);

  const handleSave = async () => {
    if (!task || !title.trim()) return;
    setSaving(true);

    try {
      const res = await fetch(
        `/api/projects/${projectId}/tasks/${task.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: title.trim(),
            description: description.trim(),
            priority,
            columnId,
            dueDate: dueDate || null,
            labels,
          }),
        }
      );

      if (res.ok) {
        const updated = await res.json();
        onTaskUpdated(updated);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!task) return;
    setDeleting(true);

    try {
      const res = await fetch(
        `/api/projects/${projectId}/tasks/${task.id}`,
        { method: "DELETE" }
      );
      if (res.ok) {
        onTaskDeleted(task.id);
      }
    } finally {
      setDeleting(false);
    }
  };

  const handleAddLabel = () => {
    const tag = labelInput.trim().toLowerCase();
    if (tag && !labels.includes(tag)) {
      setLabels([...labels, tag]);
    }
    setLabelInput("");
  };

  return (
    <Sheet open={!!task} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Task Details</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Title</Label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-desc">Description</Label>
            <Textarea
              id="edit-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select
                value={priority}
                onValueChange={(v) => setPriority(v as Priority)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={columnId} onValueChange={setColumnId}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {columns
                    .sort((a, b) => a.sortOrder - b.sortOrder)
                    .map((col) => (
                      <SelectItem key={col.id} value={col.id}>
                        {col.title}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-due">Due Date</Label>
            <Input
              id="edit-due"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Labels</Label>
            <div className="flex gap-2">
              <Input
                value={labelInput}
                onChange={(e) => setLabelInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddLabel();
                  }
                }}
                placeholder="Add label..."
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddLabel}
                disabled={!labelInput.trim()}
              >
                Add
              </Button>
            </div>
            {labels.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-1">
                {labels.map((label) => (
                  <Badge
                    key={label}
                    variant="secondary"
                    className="cursor-pointer text-xs"
                    onClick={() =>
                      setLabels(labels.filter((l) => l !== label))
                    }
                  >
                    {label} &times;
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {task && (
            <div className="text-xs text-muted-foreground">
              Created {new Date(task.createdAt).toLocaleString()} &middot;
              Updated {new Date(task.updatedAt).toLocaleString()}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button onClick={handleSave} disabled={saving || !title.trim()}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>

          <Separator />

          <div>
            {confirmDelete ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-destructive">
                  Delete this task?
                </span>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  {deleting ? (
                    <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                  ) : (
                    <Trash2 className="mr-1 h-3 w-3" />
                  )}
                  Yes, delete
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setConfirmDelete(false)}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={() => setConfirmDelete(true)}
              >
                <Trash2 className="mr-2 h-3 w-3" />
                Delete Task
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
