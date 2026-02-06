import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CreateProjectForm } from "@/components/projects/create-project-form";

export default function NewProjectPage() {
  return (
    <div className="space-y-6">
      <Link
        href="/projects"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Projects
      </Link>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">New Project</h1>
        <p className="mt-2 text-muted-foreground">
          Create a new project with a kanban board to track your tasks.
        </p>
      </div>

      <CreateProjectForm />
    </div>
  );
}
