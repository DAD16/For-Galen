import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, CheckCircle2, Circle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getTrackMeta, getTrackSlugs } from "@/lib/content/loader";
import { getPersonaForTrack } from "@/lib/ai/personas";
import { PersonaCard } from "@/components/ui/persona-card";

export function generateStaticParams() {
  return getTrackSlugs().map((track) => ({ track }));
}

export default async function TrackPage({
  params,
}: {
  params: Promise<{ track: string }>;
}) {
  const { track } = await params;
  let meta;
  try {
    meta = getTrackMeta(track);
  } catch {
    notFound();
  }

  const totalMinutes = meta.modules.reduce(
    (sum, m) => sum + m.estimatedMinutes,
    0
  );

  const persona = getPersonaForTrack(track);

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/learn">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Training Hub
          </Link>
        </Button>

        <h1 className="text-3xl font-bold tracking-tight">{meta.title}</h1>
        <p className="mt-2 text-muted-foreground">{meta.description}</p>
        <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
          <span>{meta.modules.length} modules</span>
          <span>~{totalMinutes} minutes total</span>
        </div>
      </div>

      <div className="rounded-lg border bg-muted/30 p-4">
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Your Instructor
        </p>
        <PersonaCard persona={persona} variant="compact" />
      </div>

      <div className="space-y-3">
        {meta.modules.map((mod, index) => (
          <Link
            key={mod.slug}
            href={`/learn/${track}/${mod.slug}`}
          >
            <Card className="transition-colors hover:border-primary/50 hover:shadow-sm">
              <CardContent className="flex items-start gap-4 py-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-muted-foreground">
                  <Circle className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium">
                        {index + 1}. {mod.title}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {mod.description}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {mod.estimatedMinutes} min
                    </div>
                  </div>
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
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
