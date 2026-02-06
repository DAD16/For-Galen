import { anthropic } from "@ai-sdk/anthropic";
import { streamText, convertToModelMessages, type UIMessage } from "ai";
import { BASE_SYSTEM_PROMPT } from "@/lib/ai/system-prompt";
import { getPersonaById } from "@/lib/ai/personas";
import { getProject } from "@/lib/content/projects";

export async function POST(req: Request) {
  const {
    messages,
    projectId,
  }: { messages: UIMessage[]; projectId: string } = await req.json();

  const marcus = getPersonaById("marcus-rivera");
  const project = projectId ? getProject(projectId) : null;

  let projectContext = "";
  if (project) {
    const tasksByColumn = project.columns
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((col) => {
        const tasks = project.tasks
          .filter((t) => t.columnId === col.id)
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map(
            (t) =>
              `  - [${t.priority.toUpperCase()}] ${t.title}${
                t.dueDate ? ` (due: ${t.dueDate})` : ""
              }${t.labels.length > 0 ? ` [${t.labels.join(", ")}]` : ""}`
          );
        return `${col.title} (${tasks.length} tasks):\n${
          tasks.length > 0 ? tasks.join("\n") : "  (empty)"
        }`;
      });

    projectContext = `

CURRENT PROJECT: "${project.title}"
${project.description ? `Description: ${project.description}` : ""}
Total Tasks: ${project.tasks.length}

BOARD STATUS:
${tasksByColumn.join("\n\n")}`;
  }

  const systemPrompt =
    BASE_SYSTEM_PROMPT +
    `

CONTEXT: You are acting as a Project Management Coach embedded in Galen's kanban board.
You have access to the current state of his project board. Help him with:
- Task prioritization and ordering
- Breaking down large tasks into smaller ones
- Setting realistic due dates and milestones
- Identifying blocked tasks or risks
- Suggesting next actions
- Writing task descriptions
- Status summaries for stakeholders

When Galen asks for task suggestions, format them clearly so he can easily add them to his board.
When providing a status summary, organize it by column/status.
When suggesting new tasks, include a recommended priority level.
${projectContext}` +
    marcus.systemPromptAddition;

  const result = streamText({
    model: anthropic("claude-sonnet-4-20250514"),
    system: systemPrompt,
    messages: await convertToModelMessages(messages),
    maxOutputTokens: 4096,
  });

  return result.toUIMessageStreamResponse();
}
