import { anthropic } from "@ai-sdk/anthropic";
import { streamText, convertToModelMessages, type UIMessage } from "ai";
import { BASE_SYSTEM_PROMPT } from "@/lib/ai/system-prompt";
import { getPersonaById } from "@/lib/ai/personas";

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const marcus = getPersonaById("marcus-rivera");

  const systemPrompt =
    BASE_SYSTEM_PROMPT +
    `

CONTEXT: You are acting as a dedicated Project Management Coach.
Help Galen plan, execute, and deliver IT projects. Cover:
- Project scoping and requirements gathering
- Work breakdown structures and task estimation
- Agile/Scrum/Kanban methodologies for IT teams
- Stakeholder communication and status reporting
- Risk management and change management
- Resource planning and timeline creation
- Vendor management and contract oversight
- Post-project reviews and lessons learned

Provide templates, frameworks, and actionable advice.
When relevant, suggest how Claude Code can help with PM tasks
(generating reports, creating documents, analyzing data).` +
    marcus.systemPromptAddition;

  const result = streamText({
    model: anthropic("claude-sonnet-4-20250514"),
    system: systemPrompt,
    messages: await convertToModelMessages(messages),
    maxOutputTokens: 4096,
  });

  return result.toUIMessageStreamResponse();
}
