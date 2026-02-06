import Link from "next/link";
import {
  GraduationCap,
  MessageSquare,
  FolderKanban,
  ArrowRight,
  Terminal,
  Kanban,
  Zap,
  Clock,
  Sparkles,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getAllTracks } from "@/lib/content/loader";
import { getAllPersonas } from "@/lib/ai/personas";

const iconMap: Record<string, React.ReactNode> = {
  terminal: <Terminal className="h-5 w-5" />,
  kanban: <Kanban className="h-5 w-5" />,
  zap: <Zap className="h-5 w-5" />,
};

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function DashboardPage() {
  const tracks = getAllTracks();
  const personas = getAllPersonas();

  const totalModules = tracks.reduce(
    (sum, t) => sum + t.meta.modules.length,
    0
  );

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border p-8">
        <h1 className="text-3xl font-bold tracking-tight">
          {getGreeting()}, Galen
        </h1>
        <p className="mt-2 max-w-xl text-muted-foreground">
          Your personalized IT manager training hub. Build skills in AI
          automation, project management, and the enterprise tools you use
          every day.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/learn/claude-code/01-getting-started">
              Start Learning
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/skills/tutor">
              <Sparkles className="mr-2 h-4 w-4" />
              Take Skill Assessment
            </Link>
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link href="/learn">
          <Card className="transition-all hover:border-primary/50 hover:shadow-md hover:-translate-y-0.5">
            <CardHeader className="flex flex-row items-center gap-3 pb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-base">Browse Courses</CardTitle>
                <CardDescription className="text-xs">
                  {totalModules} modules available
                </CardDescription>
              </div>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/skills">
          <Card className="transition-all hover:border-primary/50 hover:shadow-md hover:-translate-y-0.5">
            <CardHeader className="flex flex-row items-center gap-3 pb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-base">Skills</CardTitle>
                <CardDescription className="text-xs">
                  Tutor & Coach
                </CardDescription>
              </div>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/ask">
          <Card className="transition-all hover:border-primary/50 hover:shadow-md hover:-translate-y-0.5">
            <CardHeader className="flex flex-row items-center gap-3 pb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-base">Ask Claude</CardTitle>
                <CardDescription className="text-xs">
                  Get help with any task
                </CardDescription>
              </div>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/projects">
          <Card className="transition-all hover:border-primary/50 hover:shadow-md hover:-translate-y-0.5">
            <CardHeader className="flex flex-row items-center gap-3 pb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300">
                <FolderKanban className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-base">Projects</CardTitle>
                <CardDescription className="text-xs">
                  Manage IT projects
                </CardDescription>
              </div>
            </CardHeader>
          </Card>
        </Link>
      </div>

      {/* Learning Tracks */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">
            Your Learning Tracks
          </h2>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/learn">
              View all
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tracks.map((track) => {
            const totalMin = track.meta.modules.reduce(
              (s, m) => s + m.estimatedMinutes,
              0
            );
            return (
              <Link key={track.slug} href={`/learn/${track.slug}`}>
                <Card className="h-full transition-all hover:border-primary/50 hover:shadow-md hover:-translate-y-0.5">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                        {iconMap[track.meta.icon] || (
                          <Terminal className="h-4 w-4" />
                        )}
                      </div>
                      <CardTitle className="text-base">
                        {track.meta.title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-3 text-sm text-muted-foreground line-clamp-2">
                      {track.meta.description}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{track.meta.modules.length} modules</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        ~{totalMin} min
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Your Instructors */}
      <div>
        <h2 className="mb-4 text-2xl font-semibold tracking-tight">
          Your Instructors
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {personas.map((persona) => (
            <Link
              key={persona.id}
              href={`/instructors/${persona.id}`}
              className="flex items-center gap-3 rounded-lg border p-4 transition-all hover:border-primary/50 hover:shadow-md hover:-translate-y-0.5"
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${persona.color} text-xs font-bold text-white`}
              >
                {persona.initials}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{persona.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {persona.title}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
