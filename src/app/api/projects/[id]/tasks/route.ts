import { NextResponse } from "next/server";
import { addTask } from "@/lib/content/projects";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const { title, description, priority, labels, dueDate, columnId } = body;

  if (!title || !columnId) {
    return NextResponse.json(
      { error: "Title and columnId are required" },
      { status: 400 }
    );
  }

  const task = addTask(id, {
    title,
    description,
    priority,
    labels,
    dueDate,
    columnId,
  });

  if (!task) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  return NextResponse.json(task, { status: 201 });
}
