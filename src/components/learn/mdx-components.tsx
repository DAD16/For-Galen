import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CodeBlock } from "./code-block";

function Callout({
  type = "info",
  children,
}: {
  type?: "info" | "tip" | "warning";
  children: React.ReactNode;
}) {
  const styles = {
    info: "border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-100",
    tip: "border-green-200 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-950 dark:text-green-100",
    warning:
      "border-yellow-200 bg-yellow-50 text-yellow-900 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-100",
  };

  const labels = { info: "Info", tip: "Tip", warning: "Warning" };

  return (
    <div className={`my-4 rounded-lg border p-4 ${styles[type]}`}>
      <p className="mb-1 text-sm font-semibold">{labels[type]}</p>
      <div className="text-sm">{children}</div>
    </div>
  );
}

function StepByStep({ steps }: { steps: string[] }) {
  return (
    <ol className="my-4 space-y-3">
      {steps.map((step, i) => (
        <li key={i} className="flex gap-3">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
            {i + 1}
          </span>
          <span className="pt-0.5 text-sm">{step}</span>
        </li>
      ))}
    </ol>
  );
}

function Quiz({
  question,
  options,
  answer,
  explanation,
}: {
  question: string;
  options: string[];
  answer: number;
  explanation?: string;
}) {
  return (
    <Card className="my-6">
      <CardContent className="pt-6">
        <p className="mb-3 font-semibold">Knowledge Check</p>
        <p className="mb-4 text-sm">{question}</p>
        <div className="space-y-2">
          {options.map((opt, i) => (
            <div
              key={i}
              className={`rounded-md border p-3 text-sm ${
                i === answer
                  ? "border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-950"
                  : ""
              }`}
            >
              <span className="mr-2 font-medium">
                {String.fromCharCode(65 + i)}.
              </span>
              {opt}
              {i === answer && (
                <Badge variant="secondary" className="ml-2">
                  Correct
                </Badge>
              )}
            </div>
          ))}
        </div>
        {explanation && (
          <p className="mt-3 text-sm text-muted-foreground">{explanation}</p>
        )}
      </CardContent>
    </Card>
  );
}

export const mdxCustomComponents = {
  Callout,
  StepByStep,
  Quiz,
  pre: CodeBlock,
};
