import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CourseEditor } from "@/components/courses/course-editor";
import { getCustomCourse } from "@/lib/content/custom-courses";

export const dynamic = "force-dynamic";

export default async function EditCoursePage({
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
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href={`/my-courses/${id}`}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Course
        </Link>
      </Button>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Course</h1>
        <p className="mt-2 text-muted-foreground">
          Update your course content, title, or tags.
        </p>
      </div>

      <CourseEditor
        initialData={{
          id: course.id,
          title: course.title,
          description: course.description,
          content: course.content,
          tags: course.tags,
        }}
      />
    </div>
  );
}
