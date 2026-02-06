import { anthropic } from "@ai-sdk/anthropic";
import { streamText, convertToModelMessages, type UIMessage } from "ai";
import { BASE_SYSTEM_PROMPT } from "@/lib/ai/system-prompt";
import { CONTEXT_PROMPTS } from "@/lib/ai/context-prompts";
import { getPersonaForContext } from "@/lib/ai/personas";

export async function POST(req: Request) {
  const {
    messages,
    context = "general",
  }: {
    messages: UIMessage[];
    context?: string;
  } = await req.json();

  const persona = getPersonaForContext(context);
  const systemPrompt =
    BASE_SYSTEM_PROMPT +
    (CONTEXT_PROMPTS[context] || "") +
    persona.systemPromptAddition;

  const result = streamText({
    model: anthropic("claude-sonnet-4-20250514"),
    system: systemPrompt,
    messages: await convertToModelMessages(messages),
    maxOutputTokens: 4096,
  });

  return result.toUIMessageStreamResponse();
}
