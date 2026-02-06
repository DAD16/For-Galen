import Link from "next/link";
import { Plus, FolderKanban, Clock, CheckCircle2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getAllProjects } from "@/lib/content/projects";

export const dynamic = "force-dynamic";

export default function ProjectsPage() {
  const projects = getAllProjects();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="mt-2 text-muted-foreground">
            Track and manage your IT projects with kanban boards.
          </p>
        </div>
        <Button asChild>
          <Link href="/projects/new">
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Link>
        </Button>
      </div>

      {projects.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FolderKanban className="h-12 w-12 text-muted-foreground/50" />
            <CardTitle className="mt-4 text-lg">No projects yet</CardTitle>
            <CardDescription className="mt-2 max-w-md text-center">
              Create your first project to start managing tasks with a kanban
              board. Drag and drop tasks between columns to track progress.
            </CardDescription>
            <Button asChild className="mt-4">
              <Link href="/projects/new">
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Project
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => {
            const totalTasks = project.tasks.length;
            const doneTasks = project.tasks.filter((t) => {
              const doneCol = project.columns.find(
                (c) => c.title === "Done"
              );
              return doneCol && t.columnId === doneCol.id;
            }).length;

            return (
              <Link key={project.id} href={`/projects/${project.id}`}>
                <Card className="h-full transition-all hover:border-primary/50 hover:shadow-md hover:-translate-y-0.5">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <FolderKanban className="h-4 w-4 text-primary" />
                      <Badge variant="outline" className="text-xs">
                        {project.columns.length} columns
                      </Badge>
                    </div>
                    <CardTitle className="text-base">
                      {project.title}
                    </CardTitle>
                    {project.description && (
                      <CardDescription className="line-clamp-2">
                        {project.description}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        {doneTasks}/{totalTasks} tasks
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Updated{" "}
                        {new Date(project.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                    {totalTasks > 0 && (
                      <div className="mt-2 h-1.5 w-full rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{
                            width: `${(doneTasks / totalTasks) * 100}%`,
                          }}
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
