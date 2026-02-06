import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CourseEditor } from "@/components/courses/course-editor";

export default function NewCoursePage() {
  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/my-courses">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to My Courses
        </Link>
      </Button>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Create New Course
        </h1>
        <p className="mt-2 text-muted-foreground">
          Write your own training material, process documentation, or reference
          guide. Use Markdown for formatting.
        </p>
      </div>

      <CourseEditor />
    </div>
  );
}
