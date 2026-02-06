import { GraduationCap, Target, Clock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface StepWelcomeProps {
  onNext: () => void;
}

export function StepWelcome({ onNext }: StepWelcomeProps) {
  return (
    <Card>
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <GraduationCap className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-2xl">Welcome to the Skill Tutor</CardTitle>
        <CardDescription className="text-base">
          Let&apos;s build a personalized learning path just for you. This quick
          assessment takes about 2 minutes.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="flex flex-col items-center gap-2 rounded-lg border p-4 text-center">
            <Target className="h-5 w-5 text-muted-foreground" />
            <p className="text-sm font-medium">Set Your Goals</p>
            <p className="text-xs text-muted-foreground">
              Tell us what you want to achieve
            </p>
          </div>
          <div className="flex flex-col items-center gap-2 rounded-lg border p-4 text-center">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <p className="text-sm font-medium">Rate Your Skills</p>
            <p className="text-xs text-muted-foreground">
              Honest self-assessment of your level
            </p>
          </div>
          <div className="flex flex-col items-center gap-2 rounded-lg border p-4 text-center">
            <Sparkles className="h-5 w-5 text-muted-foreground" />
            <p className="text-sm font-medium">Get Your Plan</p>
            <p className="text-xs text-muted-foreground">
              AI-generated personalized path
            </p>
          </div>
        </div>

        <Button onClick={onNext} className="w-full" size="lg">
          Let&apos;s Get Started
        </Button>
      </CardContent>
    </Card>
  );
}
