import Link from "next/link";
import { Plus, BookOpen, Clock } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getAllCustomCourses } from "@/lib/content/custom-courses";

export const dynamic = "force-dynamic";

export default function MyCoursesPage() {
  const courses = getAllCustomCourses();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Courses</h1>
          <p className="mt-2 text-muted-foreground">
            Create your own training materials, notes, and reference guides.
          </p>
        </div>
        <Button asChild>
          <Link href="/my-courses/new">
            <Plus className="mr-2 h-4 w-4" />
            Create Course
          </Link>
        </Button>
      </div>

      {courses.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <BookOpen className="h-12 w-12 text-muted-foreground/50" />
            <CardTitle className="mt-4 text-lg">No courses yet</CardTitle>
            <CardDescription className="mt-2 max-w-md text-center">
              Create your first custom course to document processes, build
              training materials, or take notes on topics you&apos;re learning.
            </CardDescription>
            <Button asChild className="mt-4">
              <Link href="/my-courses/new">
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Course
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Link key={course.id} href={`/my-courses/${course.id}`}>
              <Card className="h-full transition-colors hover:border-primary/50 hover:shadow-md">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <Badge variant="outline" className="text-xs">
                      Custom
                    </Badge>
                  </div>
                  <CardTitle className="text-base">{course.title}</CardTitle>
                  {course.description && (
                    <CardDescription className="line-clamp-2">
                      {course.description}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  {course.tags.length > 0 && (
                    <div className="mb-2 flex flex-wrap gap-1">
                      {course.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    Updated{" "}
                    {new Date(course.updatedAt).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
