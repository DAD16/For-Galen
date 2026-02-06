import Link from "next/link";
import { Terminal, Kanban, Zap, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAllTracks } from "@/lib/content/loader";
import { getPersonaForTrack } from "@/lib/ai/personas";

const iconMap: Record<string, React.ReactNode> = {
  terminal: <Terminal className="h-8 w-8" />,
  kanban: <Kanban className="h-8 w-8" />,
  zap: <Zap className="h-8 w-8" />,
};

export default function LearnPage() {
  const tracks = getAllTracks();

  const mainTracks = tracks.filter((t) => t.slug !== "quick-wins");
  const quickWins = tracks.find((t) => t.slug === "quick-wins");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Training Hub</h1>
        <p className="mt-2 text-muted-foreground">
          Curated learning tracks designed for your role as an IT manager.
          Start with the fundamentals and work your way up.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {mainTracks.map((track) => {
          const totalMinutes = track.meta.modules.reduce(
            (sum, m) => sum + m.estimatedMinutes,
            0
          );
          const persona = getPersonaForTrack(track.slug);
          return (
            <Link key={track.slug} href={`/learn/${track.slug}`}>
              <Card className="h-full transition-all hover:border-primary/50 hover:shadow-md hover:-translate-y-0.5">
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    {iconMap[track.meta.icon] || (
                      <Terminal className="h-8 w-8" />
                    )}
                  </div>
                  <CardTitle className="text-xl">
                    {track.meta.title}
                  </CardTitle>
                  <CardDescription>{track.meta.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <Badge variant="outline">
                      {track.meta.modules.length} modules
                    </Badge>
                    <span>~{totalMinutes} min total</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {Array.from(
                      new Set(track.meta.modules.flatMap((m) => m.tags))
                    )
                      .slice(0, 5)
                      .map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                  </div>
                  <div className="mt-4 flex items-center gap-2 border-t pt-3">
                    <div
                      className={`flex h-6 w-6 items-center justify-center rounded-full ${persona.color} text-[10px] font-bold text-white`}
                    >
                      {persona.initials}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Taught by {persona.name}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {quickWins && (
        <div>
          <h2 className="mb-4 text-2xl font-semibold tracking-tight">
            Quick Wins
          </h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Short, standalone guides you can complete in 10 minutes or less.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {quickWins.meta.modules.map((mod) => (
              <Link key={mod.slug} href={`/learn/quick-wins/${mod.slug}`}>
                <Card className="h-full transition-all hover:border-primary/50 hover:shadow-md hover:-translate-y-0.5">
                  <CardHeader className="pb-2">
                    <div className="mb-1 flex items-center gap-2">
                      <Zap className="h-4 w-4 text-yellow-500" />
                      <span className="text-xs text-muted-foreground">
                        ~{mod.estimatedMinutes} min
                      </span>
                    </div>
                    <CardTitle className="text-base">{mod.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {mod.description}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {mod.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Create Your Own Course CTA */}
      <div className="rounded-lg border border-dashed p-6 text-center">
        <PlusCircle className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
        <h3 className="font-semibold">Want to learn something specific?</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Create your own course on any topic. Add notes, lessons, and build a personalized learning path.
        </p>
        <Button variant="outline" size="sm" asChild className="mt-4">
          <Link href="/my-courses/new">
            Create a Course
          </Link>
        </Button>
      </div>
    </div>
  );
}
