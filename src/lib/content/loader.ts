import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content");

export interface TrackMeta {
  title: string;
  description: string;
  icon: string;
  authorId?: string;
  modules: ModuleMeta[];
}

export interface ModuleMeta {
  slug: string;
  title: string;
  description: string;
  estimatedMinutes: number;
  tags: string[];
  prerequisites: string[];
}

export interface LessonContent {
  meta: Record<string, unknown>;
  content: string;
  track: string;
  slug: string;
}

export function getTrackSlugs(): string[] {
  return fs
    .readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
}

export function getTrackMeta(track: string): TrackMeta {
  const metaPath = path.join(CONTENT_DIR, track, "_meta.json");
  const raw = fs.readFileSync(metaPath, "utf-8");
  return JSON.parse(raw);
}

export function getAllTracks(): { slug: string; meta: TrackMeta }[] {
  return getTrackSlugs().map((slug) => ({
    slug,
    meta: getTrackMeta(slug),
  }));
}

export function getLessonContent(
  track: string,
  slug: string
): LessonContent {
  const filePath = path.join(CONTENT_DIR, track, `${slug}.mdx`);
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return {
    meta: data,
    content,
    track,
    slug,
  };
}

export function getLessonSlugs(track: string): string[] {
  const trackDir = path.join(CONTENT_DIR, track);
  return fs
    .readdirSync(trackDir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""))
    .sort();
}
