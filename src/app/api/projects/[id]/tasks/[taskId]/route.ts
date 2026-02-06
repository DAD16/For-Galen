import { NextResponse } from "next/server";
import { updateTask, deleteTask } from "@/lib/content/projects";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string; taskId: string }> }
) {
  const { id, taskId } = await params;
  const body = await req.json();
  const updated = updateTask(id, taskId, body);
  if (!updated) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(updated);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string; taskId: string }> }
) {
  const { id, taskId } = await params;
  const deleted = deleteTask(id, taskId);
  if (!deleted) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
