import { NextResponse } from "next/server";
import {
  getAllCustomCourses,
  createCustomCourse,
} from "@/lib/content/custom-courses";

export async function GET() {
  const courses = getAllCustomCourses();
  return NextResponse.json(courses);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { title, description, content, tags } = body;

  if (!title || !content) {
    return NextResponse.json(
      { error: "Title and content are required" },
      { status: 400 }
    );
  }

  const course = createCustomCourse({
    title,
    description: description || "",
    content,
    tags: tags || [],
  });

  return NextResponse.json(course, { status: 201 });
}
