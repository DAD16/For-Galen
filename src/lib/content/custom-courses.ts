import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const COURSES_FILE = path.join(DATA_DIR, "custom-courses.json");

export interface CustomCourse {
  id: string;
  title: string;
  description: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readCourses(): CustomCourse[] {
  ensureDataDir();
  if (!fs.existsSync(COURSES_FILE)) {
    return [];
  }
  const raw = fs.readFileSync(COURSES_FILE, "utf-8");
  return JSON.parse(raw);
}

function writeCourses(courses: CustomCourse[]) {
  ensureDataDir();
  fs.writeFileSync(COURSES_FILE, JSON.stringify(courses, null, 2));
}

export function getAllCustomCourses(): CustomCourse[] {
  return readCourses().sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

export function getCustomCourse(id: string): CustomCourse | undefined {
  return readCourses().find((c) => c.id === id);
}

export function createCustomCourse(
  data: Omit<CustomCourse, "id" | "createdAt" | "updatedAt">
): CustomCourse {
  const courses = readCourses();
  const now = new Date().toISOString();
  const course: CustomCourse = {
    ...data,
    id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: now,
    updatedAt: now,
  };
  courses.push(course);
  writeCourses(courses);
  return course;
}

export function updateCustomCourse(
  id: string,
  data: Partial<Omit<CustomCourse, "id" | "createdAt">>
): CustomCourse | null {
  const courses = readCourses();
  const index = courses.findIndex((c) => c.id === id);
  if (index === -1) return null;
  courses[index] = {
    ...courses[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  writeCourses(courses);
  return courses[index];
}

export function deleteCustomCourse(id: string): boolean {
  const courses = readCourses();
  const filtered = courses.filter((c) => c.id !== id);
  if (filtered.length === courses.length) return false;
  writeCourses(filtered);
  return true;
}
