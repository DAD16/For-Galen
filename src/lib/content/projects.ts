import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const PROJECTS_FILE = path.join(DATA_DIR, "projects.json");

export type Priority = "low" | "medium" | "high" | "urgent";

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  labels: string[];
  dueDate: string | null;
  columnId: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Column {
  id: string;
  title: string;
  sortOrder: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  columns: Column[];
  tasks: Task[];
  createdAt: string;
  updatedAt: string;
}

const DEFAULT_COLUMNS = [
  { title: "To Do", sortOrder: 0 },
  { title: "In Progress", sortOrder: 1 },
  { title: "Review", sortOrder: 2 },
  { title: "Done", sortOrder: 3 },
];

function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readProjects(): Project[] {
  ensureDataDir();
  if (!fs.existsSync(PROJECTS_FILE)) {
    return [];
  }
  const raw = fs.readFileSync(PROJECTS_FILE, "utf-8");
  return JSON.parse(raw);
}

function writeProjects(projects: Project[]) {
  ensureDataDir();
  fs.writeFileSync(PROJECTS_FILE, JSON.stringify(projects, null, 2));
}

// --- Project CRUD ---

export function getAllProjects(): Project[] {
  return readProjects().sort(
    (a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

export function getProject(id: string): Project | undefined {
  return readProjects().find((p) => p.id === id);
}

export function createProject(data: {
  title: string;
  description: string;
}): Project {
  const projects = readProjects();
  const now = new Date().toISOString();
  const project: Project = {
    id: generateId("proj"),
    title: data.title,
    description: data.description,
    columns: DEFAULT_COLUMNS.map((col) => ({
      ...col,
      id: generateId("col"),
    })),
    tasks: [],
    createdAt: now,
    updatedAt: now,
  };
  projects.push(project);
  writeProjects(projects);
  return project;
}

export function updateProject(
  id: string,
  data: Partial<Pick<Project, "title" | "description">>
): Project | null {
  const projects = readProjects();
  const index = projects.findIndex((p) => p.id === id);
  if (index === -1) return null;
  projects[index] = {
    ...projects[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  writeProjects(projects);
  return projects[index];
}

export function deleteProject(id: string): boolean {
  const projects = readProjects();
  const filtered = projects.filter((p) => p.id !== id);
  if (filtered.length === projects.length) return false;
  writeProjects(filtered);
  return true;
}

// --- Column Operations ---

export function addColumn(
  projectId: string,
  title: string
): Column | null {
  const projects = readProjects();
  const project = projects.find((p) => p.id === projectId);
  if (!project) return null;
  const maxOrder = Math.max(...project.columns.map((c) => c.sortOrder), -1);
  const column: Column = {
    id: generateId("col"),
    title,
    sortOrder: maxOrder + 1,
  };
  project.columns.push(column);
  project.updatedAt = new Date().toISOString();
  writeProjects(projects);
  return column;
}

export function deleteColumn(
  projectId: string,
  columnId: string
): boolean {
  const projects = readProjects();
  const project = projects.find((p) => p.id === projectId);
  if (!project) return false;
  const hasTasksInColumn = project.tasks.some((t) => t.columnId === columnId);
  if (hasTasksInColumn) return false;
  project.columns = project.columns.filter((c) => c.id !== columnId);
  project.updatedAt = new Date().toISOString();
  writeProjects(projects);
  return true;
}

export function reorderColumns(
  projectId: string,
  columnIds: string[]
): boolean {
  const projects = readProjects();
  const project = projects.find((p) => p.id === projectId);
  if (!project) return false;
  columnIds.forEach((id, index) => {
    const col = project.columns.find((c) => c.id === id);
    if (col) col.sortOrder = index;
  });
  project.updatedAt = new Date().toISOString();
  writeProjects(projects);
  return true;
}

// --- Task CRUD ---

export function addTask(
  projectId: string,
  data: {
    title: string;
    description?: string;
    priority?: Priority;
    labels?: string[];
    dueDate?: string | null;
    columnId: string;
  }
): Task | null {
  const projects = readProjects();
  const project = projects.find((p) => p.id === projectId);
  if (!project) return null;
  const columnTasks = project.tasks.filter(
    (t) => t.columnId === data.columnId
  );
  const maxOrder = Math.max(...columnTasks.map((t) => t.sortOrder), -1);
  const now = new Date().toISOString();
  const task: Task = {
    id: generateId("task"),
    title: data.title,
    description: data.description || "",
    priority: data.priority || "medium",
    labels: data.labels || [],
    dueDate: data.dueDate || null,
    columnId: data.columnId,
    sortOrder: maxOrder + 1,
    createdAt: now,
    updatedAt: now,
  };
  project.tasks.push(task);
  project.updatedAt = now;
  writeProjects(projects);
  return task;
}

export function updateTask(
  projectId: string,
  taskId: string,
  data: Partial<Omit<Task, "id" | "createdAt">>
): Task | null {
  const projects = readProjects();
  const project = projects.find((p) => p.id === projectId);
  if (!project) return null;
  const taskIndex = project.tasks.findIndex((t) => t.id === taskId);
  if (taskIndex === -1) return null;
  project.tasks[taskIndex] = {
    ...project.tasks[taskIndex],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  project.updatedAt = new Date().toISOString();
  writeProjects(projects);
  return project.tasks[taskIndex];
}

export function deleteTask(projectId: string, taskId: string): boolean {
  const projects = readProjects();
  const project = projects.find((p) => p.id === projectId);
  if (!project) return false;
  const len = project.tasks.length;
  project.tasks = project.tasks.filter((t) => t.id !== taskId);
  if (project.tasks.length === len) return false;
  project.updatedAt = new Date().toISOString();
  writeProjects(projects);
  return true;
}

// --- Drag-and-Drop Reorder ---

export function moveTask(
  projectId: string,
  taskId: string,
  destinationColumnId: string,
  newIndex: number
): boolean {
  const projects = readProjects();
  const project = projects.find((p) => p.id === projectId);
  if (!project) return false;

  const task = project.tasks.find((t) => t.id === taskId);
  if (!task) return false;

  const sourceColumnId = task.columnId;

  // Remove from source column ordering
  const sourceTasks = project.tasks
    .filter((t) => t.columnId === sourceColumnId && t.id !== taskId)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  // Update task's column
  task.columnId = destinationColumnId;
  task.updatedAt = new Date().toISOString();

  // Get destination column tasks (excluding the moved task)
  const destTasks = project.tasks
    .filter((t) => t.columnId === destinationColumnId && t.id !== taskId)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  // Insert at new position
  destTasks.splice(newIndex, 0, task);

  // Reassign sort orders
  sourceTasks.forEach((t, i) => {
    t.sortOrder = i;
  });
  destTasks.forEach((t, i) => {
    t.sortOrder = i;
  });

  project.updatedAt = new Date().toISOString();
  writeProjects(projects);
  return true;
}
