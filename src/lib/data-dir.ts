import path from "path";

const isVercel = !!process.env.VERCEL;

const DATA_DIR = isVercel
  ? path.join("/tmp", "data")
  : path.join(process.cwd(), "data");

export function getDataFilePath(filename: string): string {
  return path.join(DATA_DIR, filename);
}
