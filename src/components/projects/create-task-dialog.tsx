"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import type { Column, Task, Priority } from "@/lib/content/projects";

interface CreateTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  columnId: string | null;
  columns: Column[];
  onTaskCreated: (task: Task) => void;
}

export function CreateTaskDialog({
  open,
  onOpenChange,
  projectId,
  columnId,
  columns,
  onTaskCreated,
}: CreateTaskDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [selectedColumnId, setSelectedColumnId] = useState(columnId || "");
  const [dueDate, setDueDate] = useState("");
  const [labelInput, setLabelInput] = useState("");
  const [labels, setLabels] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  // Sync columnId when it changes from parent
  const effectiveColumnId = selectedColumnId || columnId || columns[0]?.id || "";

  const handleAddLabel = () => {
    const tag = labelInput.trim().toLowerCase();
    if (tag && !labels.includes(tag)) {
      setLabels([...labels, tag]);
    }
    setLabelInput("");
  };

  const handleLabelKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddLabel();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);

    try {
      const res = await fetch(`/api/projects/${projectId}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          priority,
          labels,
          dueDate: dueDate || null,
          columnId: effectiveColumnId,
        }),
      });

      if (res.ok) {
        const task = await res.json();
        onTaskCreated(task);
        // Reset form
        setTitle("");
        setDescription("");
        setPriority("medium");
        setDueDate("");
        setLabels([]);
        setLabelInput("");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="task-title">Title</Label>
            <Input
              id="task-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              required
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="task-desc">Description (optional)</Label>
            <Textarea
              id="task-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details, links, or notes..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
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
              <Label>Column</Label>
              <Select
                value={effectiveColumnId}
                onValueChange={setSelectedColumnId}
              >
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
            <Label htmlFor="task-due">Due Date (optional)</Label>
            <Input
              id="task-due"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="task-labels">Labels</Label>
            <div className="flex gap-2">
              <Input
                id="task-labels"
                value={labelInput}
                onChange={(e) => setLabelInput(e.target.value)}
                onKeyDown={handleLabelKeyDown}
                placeholder="Type and press Enter"
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

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving || !title.trim()}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Task
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
