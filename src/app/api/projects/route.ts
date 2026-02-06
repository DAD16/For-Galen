import { NextResponse } from "next/server";
import { getAllProjects, createProject } from "@/lib/content/projects";

export async function GET() {
  const projects = getAllProjects();
  return NextResponse.json(projects);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { title, description } = body;

  if (!title) {
    return NextResponse.json(
      { error: "Title is required" },
      { status: 400 }
    );
  }

  const project = createProject({
    title,
    description: description || "",
  });

  return NextResponse.json(project, { status: 201 });
}
