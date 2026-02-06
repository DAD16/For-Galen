import { anthropic } from "@ai-sdk/anthropic";
import {
  streamText,
  convertToModelMessages,
  type UIMessage,
} from "ai";
import { BASE_SYSTEM_PROMPT } from "@/lib/ai/system-prompt";
import { getPersonaById, type PersonaId, PERSONAS } from "@/lib/ai/personas";

export async function POST(req: Request) {
  const {
    messages,
    personaId,
  }: { messages: UIMessage[]; personaId: string } = await req.json();

  if (!personaId || !(personaId in PERSONAS)) {
    return new Response("Invalid persona ID", { status: 400 });
  }

  const persona = getPersonaById(personaId as PersonaId);

  const systemPrompt =
    BASE_SYSTEM_PROMPT +
    `

CONTEXT: You are having a one-on-one conversation as ${persona.name}, ${persona.title}.
Galen is visiting your profile page and wants to ask you questions about your areas of expertise.
Your expertise areas include: ${persona.profile.expertise.map((e) => e.area).join(", ")}.
Draw on your deep experience and teaching style to provide helpful, practical answers.
If asked about topics outside your expertise, acknowledge it honestly and suggest which
of the other instructors on the platform might be a better fit.` +
    persona.systemPromptAddition;

  const result = streamText({
    model: anthropic("claude-sonnet-4-20250514"),
    system: systemPrompt,
    messages: await convertToModelMessages(messages),
    maxOutputTokens: 4096,
  });

  return result.toUIMessageStreamResponse();
}
