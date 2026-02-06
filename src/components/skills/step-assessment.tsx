import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StepAssessmentProps {
  data: Record<string, string>;
  onUpdate: (key: string, value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const questions = [
  {
    key: "excel_frequency",
    label: "How often do you use Excel?",
    options: [
      { value: "daily", label: "Every day" },
      { value: "weekly", label: "A few times a week" },
      { value: "monthly", label: "A few times a month" },
      { value: "rarely", label: "Rarely" },
    ],
  },
  {
    key: "salesforce_usage",
    label: "What do you do in Salesforce?",
    options: [
      { value: "admin", label: "Full admin (users, reports, flows)" },
      { value: "reports", label: "Mostly reports and dashboards" },
      { value: "basic", label: "Basic data entry and viewing" },
      { value: "none", label: "I don't use Salesforce" },
    ],
  },
  {
    key: "pm_responsibilities",
    label: "What are your PM responsibilities?",
    options: [
      { value: "lead", label: "I lead multiple projects" },
      { value: "manage", label: "I manage one project at a time" },
      { value: "participate", label: "I participate but don't lead" },
      { value: "none", label: "No formal PM role" },
    ],
  },
  {
    key: "automation_experience",
    label: "Have you used AI or automation tools?",
    options: [
      { value: "experienced", label: "Yes, regularly" },
      { value: "some", label: "I've tried a few tools" },
      { value: "curious", label: "No, but I want to learn" },
      { value: "new", label: "This is all new to me" },
    ],
  },
];

export function StepAssessment({
  data,
  onUpdate,
  onNext,
  onBack,
}: StepAssessmentProps) {
  const allAnswered = questions.every((q) => data[q.key]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Role Assessment</CardTitle>
        <CardDescription>
          Tell us about your daily work so we can tailor your learning path.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {questions.map((q) => (
          <div key={q.key} className="space-y-2">
            <Label>{q.label}</Label>
            <Select
              value={data[q.key] || ""}
              onValueChange={(v) => onUpdate(q.key, v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an answer..." />
              </SelectTrigger>
              <SelectContent position="popper" className="max-h-60">
                {q.options.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}

        <div className="flex gap-3">
          <Button variant="outline" onClick={onBack} className="flex-1">
            Back
          </Button>
          <Button onClick={onNext} disabled={!allAnswered} className="flex-1">
            Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
