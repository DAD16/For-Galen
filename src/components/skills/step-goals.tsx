"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface StepGoalsProps {
  selected: string[];
  onUpdate: (goals: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

const goalOptions = [
  {
    id: "automate-reports",
    label: "Automate repetitive reports",
    description: "Stop manually building the same Excel reports every week",
  },
  {
    id: "learn-claude-code",
    label: "Learn Claude Code",
    description: "Use AI to speed up IT tasks and write scripts",
  },
  {
    id: "improve-pm",
    label: "Improve project management skills",
    description: "Plan, track, and deliver IT projects more effectively",
  },
  {
    id: "streamline-salesforce",
    label: "Streamline Salesforce workflows",
    description: "Build better reports, flows, and automation in Salesforce",
  },
  {
    id: "better-documents",
    label: "Better document workflows",
    description: "Create templates, SOPs, and documentation more efficiently",
  },
  {
    id: "fishbowl-optimization",
    label: "Optimize Fishbowl operations",
    description: "Improve inventory management and warehouse workflows",
  },
];

export function StepGoals({
  selected,
  onUpdate,
  onNext,
  onBack,
}: StepGoalsProps) {
  const toggleGoal = (goalId: string) => {
    if (selected.includes(goalId)) {
      onUpdate(selected.filter((g) => g !== goalId));
    } else {
      onUpdate([...selected, goalId]);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>What do you want to achieve?</CardTitle>
        <CardDescription>
          Select all that apply. This helps us prioritize your learning path.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {goalOptions.map((goal) => (
          <div
            key={goal.id}
            className="flex items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-accent/50 cursor-pointer"
            onClick={() => toggleGoal(goal.id)}
          >
            <Checkbox
              id={goal.id}
              checked={selected.includes(goal.id)}
              onCheckedChange={() => toggleGoal(goal.id)}
              className="mt-0.5"
            />
            <div className="flex-1">
              <Label htmlFor={goal.id} className="cursor-pointer font-medium">
                {goal.label}
              </Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                {goal.description}
              </p>
            </div>
          </div>
        ))}

        <div className="flex gap-3 pt-2">
          <Button variant="outline" onClick={onBack} className="flex-1">
            Back
          </Button>
          <Button
            onClick={onNext}
            disabled={selected.length === 0}
            className="flex-1"
          >
            Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
