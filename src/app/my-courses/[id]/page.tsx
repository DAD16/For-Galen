import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Edit, Trash2, BookOpen, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getCustomCourse, getAllCustomCourses } from "@/lib/content/custom-courses";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { LessonChat } from "@/components/learn/lesson-chat";
import { DeleteCourseButton } from "@/components/courses/delete-course-button";

export const dynamic = "force-dynamic";

export default async function CustomCoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const course = getCustomCourse(id);

  if (!course) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/my-courses">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to My Courses
          </Link>
        </Button>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/my-courses/${id}/edit`}>
              <Edit className="mr-2 h-3 w-3" />
              Edit
            </Link>
          </Button>
          <DeleteCourseButton courseId={id} />
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <Badge variant="outline">Custom Course</Badge>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">{course.title}</h1>
        {course.description && (
          <p className="mt-2 text-muted-foreground">{course.description}</p>
        )}
        <div className="mt-3 flex items-center gap-4">
          {course.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {course.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            Updated {new Date(course.updatedAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      <article className="prose prose-neutral dark:prose-invert max-w-none prose-headings:scroll-mt-20 prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:leading-relaxed prose-code:rounded prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm prose-code:before:content-[''] prose-code:after:content-[''] prose-pre:rounded-lg prose-pre:bg-zinc-900 prose-pre:text-zinc-100 prose-table:text-sm">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {course.content}
        </ReactMarkdown>
      </article>

      <LessonChat lessonTitle={course.title} lessonContent={course.content} />
    </div>
  );
}
