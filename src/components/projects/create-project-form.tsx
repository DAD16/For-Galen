"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function CreateProjectForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), description: description.trim() }),
      });

      if (res.ok) {
        const project = await res.json();
        router.push(`/projects/${project.id}`);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Project Name</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Salesforce Migration, Network Upgrade..."
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description (optional)</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief description of the project goals and scope..."
          rows={3}
        />
      </div>
      <div className="flex gap-3">
        <Button type="submit" disabled={saving || !title.trim()}>
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Project
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push("/projects")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
