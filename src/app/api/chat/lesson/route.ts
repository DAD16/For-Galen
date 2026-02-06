import { anthropic } from "@ai-sdk/anthropic";
import { streamText, convertToModelMessages, type UIMessage } from "ai";
import { BASE_SYSTEM_PROMPT } from "@/lib/ai/system-prompt";
import { getPersonaForTrack } from "@/lib/ai/personas";

export async function POST(req: Request) {
  const {
    messages,
    lessonTitle,
    lessonContent,
    trackSlug,
  }: {
    messages: UIMessage[];
    lessonTitle?: string;
    lessonContent?: string;
    trackSlug?: string;
  } = await req.json();

  const persona = trackSlug
    ? getPersonaForTrack(trackSlug)
    : getPersonaForTrack("claude-code");

  const lessonContext = lessonTitle
    ? `

CONTEXT: Galen is currently reading a training lesson titled "${lessonTitle}".
Here is the full lesson content for reference:

---
${lessonContent || ""}
---

Answer his questions about this lesson. Reference specific sections when relevant.
If he asks about concepts mentioned in the lesson, expand on them with practical examples
related to his IT manager role. If he asks something unrelated to the lesson, still help
but gently note the connection (or lack thereof) to the current material.`
    : "";

  const systemPrompt =
    BASE_SYSTEM_PROMPT + lessonContext + persona.systemPromptAddition;

  const result = streamText({
    model: anthropic("claude-sonnet-4-20250514"),
    system: systemPrompt,
    messages: await convertToModelMessages(messages),
    maxOutputTokens: 4096,
  });

  return result.toUIMessageStreamResponse();
}
