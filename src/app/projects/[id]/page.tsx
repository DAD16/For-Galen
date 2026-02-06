import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Settings, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getProject } from "@/lib/content/projects";
import { KanbanBoard } from "@/components/projects/kanban-board";
import { DeleteProjectButton } from "@/components/projects/delete-project-button";
import { ProjectCoachPanel } from "@/components/projects/project-coach-panel";
import { ProjectSettingsDialog } from "@/components/projects/project-settings-dialog";

export const dynamic = "force-dynamic";

export default async function ProjectBoardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = getProject(id);
  if (!project) notFound();

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/projects"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold">{project.title}</h1>
            {project.description && (
              <p className="text-sm text-muted-foreground">
                {project.description}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ProjectCoachPanel projectId={project.id} />
          <ProjectSettingsDialog project={project} />
          <DeleteProjectButton projectId={project.id} />
        </div>
      </div>

      <KanbanBoard initialProject={project} />
    </div>
  );
}
