import { FolderKanban, Plus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="mt-2 text-muted-foreground">
            Track and manage your IT projects with kanban boards, task lists, and timelines.
          </p>
        </div>
        <Button disabled>
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <FolderKanban className="h-12 w-12 text-muted-foreground/50" />
          <CardTitle className="mt-4 text-lg">Project management coming soon</CardTitle>
          <CardDescription className="mt-2 max-w-md text-center">
            In the next phase, you&apos;ll be able to create projects, manage tasks on kanban boards,
            and track progress with timeline views. For now, check out the training modules
            on project management fundamentals!
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}
