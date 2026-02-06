import { NextResponse } from "next/server";
import { addColumn, deleteColumn } from "@/lib/content/projects";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { title } = await req.json();

  if (!title) {
    return NextResponse.json(
      { error: "Title is required" },
      { status: 400 }
    );
  }

  const column = addColumn(id, title);
  if (!column) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  return NextResponse.json(column, { status: 201 });
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { columnId } = await req.json();

  const deleted = deleteColumn(id, columnId);
  if (!deleted) {
    return NextResponse.json(
      { error: "Column not found or has tasks" },
      { status: 400 }
    );
  }

  return NextResponse.json({ success: true });
}
