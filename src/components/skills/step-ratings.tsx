"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface StepRatingsProps {
  ratings: Record<string, number>;
  onUpdate: (key: string, value: number) => void;
  onNext: () => void;
  onBack: () => void;
}

const skillAreas = [
  { key: "excel", label: "Excel & Spreadsheets" },
  { key: "salesforce", label: "Salesforce" },
  { key: "fishbowl", label: "Fishbowl" },
  { key: "project-management", label: "Project Management" },
  { key: "ai-automation", label: "AI & Automation" },
  { key: "document-management", label: "Document Management" },
];

const levelLabels = ["Beginner", "Basic", "Intermediate", "Advanced", "Expert"];

export function StepRatings({
  ratings,
  onUpdate,
  onNext,
  onBack,
}: StepRatingsProps) {
  const allRated = skillAreas.every((s) => ratings[s.key] !== undefined);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rate Your Current Skills</CardTitle>
        <CardDescription>
          Be honest — this helps us find the right starting point for you. There
          are no wrong answers.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {skillAreas.map((skill) => {
          const value = ratings[skill.key] ?? 3;
          return (
            <div key={skill.key} className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">{skill.label}</Label>
                <span className="text-xs font-medium text-primary">
                  {levelLabels[value - 1]}
                </span>
              </div>
              <Slider
                value={[value]}
                onValueChange={([v]) => onUpdate(skill.key, v)}
                min={1}
                max={5}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>Beginner</span>
                <span>Expert</span>
              </div>
            </div>
          );
        })}

        <div className="flex gap-3 pt-2">
          <Button variant="outline" onClick={onBack} className="flex-1">
            Back
          </Button>
          <Button onClick={onNext} disabled={!allRated} className="flex-1">
            Generate My Learning Plan
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
