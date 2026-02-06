import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  GraduationCap,
  Award,
  Briefcase,
  BookOpen,
  MessageCircle,
  Lightbulb,
  Wrench,
  MapPin,
  Clock,
  Star,
  Trophy,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  PERSONAS,
  type PersonaId,
} from "@/lib/ai/personas";
import { PersonaChat } from "@/components/instructors/persona-chat";

// Suggested questions per persona for the chat
const SUGGESTED_QUESTIONS: Record<string, string[]> = {
  "sarah-chen": [
    "What's the best way to start using Claude Code as a non-developer?",
    "How can I automate my weekly Excel reports with AI?",
    "What are the biggest mistakes people make when learning AI tools?",
    "Can you help me build an automation workflow for my IT tasks?",
  ],
  "marcus-rivera": [
    "How do I create a solid project plan for a system migration?",
    "What Agile methodology works best for small IT teams?",
    "How should I handle scope creep on an ongoing project?",
    "Can you help me write a project status report for my director?",
  ],
  "elena-kowalski": [
    "How do I optimize our Salesforce-Fishbowl integration?",
    "What are common pitfalls when configuring Salesforce Flows?",
    "How should I approach a data migration between CRM systems?",
    "Can you help me design an integration architecture for our tools?",
  ],
  "james-okafor": [
    "What's the best Excel formula for consolidating data from multiple sheets?",
    "How can I build an executive dashboard that actually gets used?",
    "What are your tips for cleaning messy data exports?",
    "Can you help me automate a monthly report generation process?",
  ],
  "priya-sharma": [
    "How do I transition from being a technical manager to a strategic leader?",
    "What's the best way to handle a difficult conversation with a team member?",
    "How should I manage my time when I'm constantly firefighting?",
    "Can you help me build a career development plan for the next 2 years?",
  ],
};

export function generateStaticParams() {
  return Object.keys(PERSONAS).map((id) => ({ id }));
}

export default async function InstructorProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!(id in PERSONAS)) {
    notFound();
  }

  const persona = PERSONAS[id as PersonaId];
  const { profile } = persona;
  const suggestedQuestions = SUGGESTED_QUESTIONS[id] || [];

  return (
    <div className="space-y-8 pb-12">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      {/* Hero Header */}
      <div className="rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start">
          <div
            className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-full ${persona.color} text-2xl font-bold text-white shadow-lg`}
          >
            {persona.initials}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight">
              {persona.name}
            </h1>
            <p className="mt-1 text-lg text-muted-foreground">
              {persona.title}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {profile.location}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {profile.yearsExperience}+ years experience
              </span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {persona.domains.map((domain) => (
                <Badge key={domain} variant="secondary">
                  {domain}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* About / Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-primary" />
            About
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {profile.summary}
          </p>
        </CardContent>
      </Card>

      {/* Two-column layout for expertise + education/certs */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Expertise - takes 2 columns */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-primary" />
              Areas of Expertise
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              {profile.expertise.map((exp) => (
                <div key={exp.area} className="rounded-lg border p-4">
                  <h4 className="font-medium">{exp.area}</h4>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Education & Certifications */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-primary" />
                Education
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {profile.education.map((edu) => (
                <div key={edu.degree}>
                  <p className="text-sm font-medium">{edu.degree}</p>
                  <p className="text-xs text-muted-foreground">
                    {edu.institution} &middot; {edu.year}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                Certifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {profile.certifications.map((cert) => (
                  <li key={cert} className="flex items-start gap-2 text-sm">
                    <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {cert}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Career Highlights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Career Highlights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {profile.careerHighlights.map((highlight) => (
              <li key={highlight} className="flex items-start gap-3 text-sm">
                <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary/60" />
                <span className="text-muted-foreground">{highlight}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Tools & Teaching Philosophy side by side */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5 text-primary" />
              Tools & Technologies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {profile.toolsAndTech.map((tool) => (
                <Badge key={tool} variant="outline" className="text-xs">
                  {tool}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              Teaching Philosophy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm italic leading-relaxed text-muted-foreground">
              &ldquo;{profile.teachingPhilosophy}&rdquo;
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Courses & Chat Contexts */}
      {(profile.courses.length > 0 || profile.chatContexts.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              On This Platform
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {profile.courses.length > 0 && (
              <div>
                <h4 className="mb-2 text-sm font-medium">Courses Taught</h4>
                <div className="grid gap-2 sm:grid-cols-2">
                  {profile.courses.map((course) => (
                    <Link
                      key={course.href}
                      href={course.href}
                      className="rounded-lg border p-3 transition-colors hover:bg-accent"
                    >
                      <p className="text-sm font-medium">{course.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {course.description}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            {profile.chatContexts.length > 0 && (
              <div>
                <h4 className="mb-2 text-sm font-medium">
                  Available In
                </h4>
                <div className="flex flex-wrap gap-2">
                  {profile.chatContexts.map((ctx) => (
                    <Link key={ctx.label} href={ctx.href}>
                      <Badge
                        variant="secondary"
                        className="cursor-pointer transition-colors hover:bg-accent"
                      >
                        <MessageCircle className="mr-1 h-3 w-3" />
                        {ctx.label}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Fun Fact */}
      <div className="rounded-lg border border-dashed p-4">
        <p className="text-sm">
          <span className="font-medium">Fun fact:</span>{" "}
          <span className="text-muted-foreground">{profile.funFact}</span>
        </p>
      </div>

      <Separator />

      {/* Chat Section */}
      <div>
        <h2 className="mb-4 text-2xl font-semibold tracking-tight flex items-center gap-2">
          <MessageCircle className="h-6 w-6 text-primary" />
          Ask {persona.name.split(" ")[0]} a Question
        </h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Chat directly with {persona.name.split(" ")[0]} about{" "}
          {persona.profile.expertise
            .slice(0, 3)
            .map((e) => e.area.toLowerCase())
            .join(", ")}
          , or anything else in their areas of expertise.
        </p>
        <PersonaChat persona={persona} suggestedQuestions={suggestedQuestions} />
      </div>
    </div>
  );
}
