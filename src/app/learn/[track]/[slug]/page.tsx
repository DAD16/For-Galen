import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  getLessonContent,
  getTrackMeta,
  getTrackSlugs,
  getLessonSlugs,
} from "@/lib/content/loader";
import { LessonRenderer } from "@/components/learn/lesson-renderer";
import { LessonChat } from "@/components/learn/lesson-chat";
import { getPersonaForTrack } from "@/lib/ai/personas";
import { PersonaCard } from "@/components/ui/persona-card";

export function generateStaticParams() {
  const tracks = getTrackSlugs();
  const params: { track: string; slug: string }[] = [];
  for (const track of tracks) {
    const slugs = getLessonSlugs(track);
    for (const slug of slugs) {
      params.push({ track, slug });
    }
  }
  return params;
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ track: string; slug: string }>;
}) {
  const { track, slug } = await params;

  let lesson;
  let trackMeta;
  try {
    lesson = getLessonContent(track, slug);
    trackMeta = getTrackMeta(track);
  } catch {
    notFound();
  }

  const currentIndex = trackMeta.modules.findIndex((m) => m.slug === slug);
  const prevModule = currentIndex > 0 ? trackMeta.modules[currentIndex - 1] : null;
  const nextModule =
    currentIndex < trackMeta.modules.length - 1
      ? trackMeta.modules[currentIndex + 1]
      : null;

  const currentModule = trackMeta.modules[currentIndex];
  const persona = getPersonaForTrack(track);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href={`/learn/${track}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to {trackMeta.title}
          </Link>
        </Button>

        {currentModule && (
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <PersonaCard persona={persona} variant="badge" />
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              ~{currentModule.estimatedMinutes} min read
            </div>
            {currentModule.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>

      <LessonRenderer content={lesson.content} />

      <Separator className="my-8" />

      <div className="flex items-center justify-between">
        {prevModule ? (
          <Button variant="outline" asChild>
            <Link href={`/learn/${track}/${prevModule.slug}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {prevModule.title}
            </Link>
          </Button>
        ) : (
          <div />
        )}
        {nextModule ? (
          <Button asChild>
            <Link href={`/learn/${track}/${nextModule.slug}`}>
              {nextModule.title}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        ) : (
          <Button variant="outline" asChild>
            <Link href={`/learn/${track}`}>
              Back to {trackMeta.title}
            </Link>
          </Button>
        )}
      </div>

      <LessonChat
        lessonTitle={currentModule?.title || slug}
        lessonContent={lesson.content}
        trackSlug={track}
      />
    </div>
  );
}
