import { NextResponse } from "next/server";
import { moveTask } from "@/lib/content/projects";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { taskId, destinationColumnId, newIndex } = await req.json();

  if (!taskId || !destinationColumnId || newIndex === undefined) {
    return NextResponse.json(
      { error: "taskId, destinationColumnId, and newIndex are required" },
      { status: 400 }
    );
  }

  const success = moveTask(id, taskId, destinationColumnId, newIndex);
  if (!success) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
