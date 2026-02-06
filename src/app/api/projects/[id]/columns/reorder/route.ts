import { NextResponse } from "next/server";
import { reorderColumns } from "@/lib/content/projects";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { columnIds } = await req.json();

  if (!columnIds || !Array.isArray(columnIds)) {
    return NextResponse.json(
      { error: "columnIds array is required" },
      { status: 400 }
    );
  }

  const success = reorderColumns(id, columnIds);
  if (!success) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
