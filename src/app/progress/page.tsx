import { BarChart3 } from "lucide-react";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";

export default function ProgressPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Progress</h1>
        <p className="mt-2 text-muted-foreground">
          Track your learning journey across all training modules.
        </p>
      </div>

      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <BarChart3 className="h-12 w-12 text-muted-foreground/50" />
          <CardTitle className="mt-4 text-lg">Progress tracking coming soon</CardTitle>
          <CardDescription className="mt-2 max-w-md text-center">
            In the next phase, you&apos;ll see completion stats, activity calendars,
            skill radar charts, and your full learning history. Start completing
            lessons now and your progress will be tracked automatically!
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}
