"use client";

import { useState } from "react";
import { StepWelcome } from "./step-welcome";
import { StepAssessment } from "./step-assessment";
import { StepGoals } from "./step-goals";
import { StepRatings } from "./step-ratings";
import { StepPlan } from "./step-plan";

export interface TutorData {
  assessment: Record<string, string>;
  goals: string[];
  ratings: Record<string, number>;
}

const TOTAL_STEPS = 5;

export function TutorWizard() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<TutorData>({
    assessment: {},
    goals: [],
    ratings: {},
  });

  const updateAssessment = (key: string, value: string) => {
    setData((prev) => ({
      ...prev,
      assessment: { ...prev.assessment, [key]: value },
    }));
  };

  const updateGoals = (goals: string[]) => {
    setData((prev) => ({ ...prev, goals }));
  };

  const updateRatings = (key: string, value: number) => {
    setData((prev) => ({
      ...prev,
      ratings: { ...prev.ratings, [key]: value },
    }));
  };

  const next = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <div className="space-y-6">
      {/* Progress indicator */}
      <div className="flex items-center gap-2">
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <div
            key={i}
            className={`h-2 flex-1 rounded-full transition-colors ${
              i <= step ? "bg-primary" : "bg-muted"
            }`}
          />
        ))}
      </div>
      <p className="text-xs text-muted-foreground text-center">
        Step {step + 1} of {TOTAL_STEPS}
      </p>

      {step === 0 && <StepWelcome onNext={next} />}
      {step === 1 && (
        <StepAssessment
          data={data.assessment}
          onUpdate={updateAssessment}
          onNext={next}
          onBack={back}
        />
      )}
      {step === 2 && (
        <StepGoals
          selected={data.goals}
          onUpdate={updateGoals}
          onNext={next}
          onBack={back}
        />
      )}
      {step === 3 && (
        <StepRatings
          ratings={data.ratings}
          onUpdate={updateRatings}
          onNext={next}
          onBack={back}
        />
      )}
      {step === 4 && <StepPlan data={data} onBack={back} />}
    </div>
  );
}
