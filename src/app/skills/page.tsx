import Link from "next/link";
import { GraduationCap, Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const skills = [
  {
    title: "Skill Tutor",
    description:
      "Take a quick assessment and get a personalized learning path tailored to your current skills and goals.",
    href: "/skills/tutor",
    icon: GraduationCap,
    badge: "Assessment",
    color: "text-violet-500",
  },
  {
    title: "Project Coach",
    description:
      "Get one-on-one project management coaching from Marcus Rivera, PMP. Plan projects, manage stakeholders, and apply Agile methods.",
    href: "/skills/coach",
    icon: Users,
    badge: "Chat",
    color: "text-emerald-500",
  },
];

export default function SkillsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Skills</h1>
        <p className="mt-2 text-muted-foreground">
          AI-powered tools to accelerate your learning and boost your
          productivity.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {skills.map((skill) => (
          <Card
            key={skill.href}
            className="transition-all hover:shadow-md hover:border-primary/30"
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <skill.icon className={`h-8 w-8 ${skill.color}`} />
                <Badge variant="secondary">{skill.badge}</Badge>
              </div>
              <CardTitle className="mt-3">{skill.title}</CardTitle>
              <CardDescription>{skill.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href={skill.href}>
                  {skill.badge === "Assessment"
                    ? "Start Assessment"
                    : "Start Coaching"}
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
