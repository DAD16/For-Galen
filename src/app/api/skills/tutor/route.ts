import { anthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";
import { getAllTracks } from "@/lib/content/loader";

export async function POST(req: Request) {
  const { assessment, goals, ratings } = await req.json();

  const tracks = getAllTracks();
  const courseList = tracks
    .map((t) => {
      const modules = t.meta.modules
        .map((m) => `  - ${m.title} (~${m.estimatedMinutes} min): ${m.description}`)
        .join("\n");
      return `Track: ${t.meta.title}\nDescription: ${t.meta.description}\nModules:\n${modules}`;
    })
    .join("\n\n");

  const systemPrompt = `You are a learning path advisor for Galen, an IT Manager.
Your job is to create a personalized learning plan based on his assessment results.

Available courses:
${courseList}

Assessment results:
- Daily tasks: ${JSON.stringify(assessment)}
- Learning goals: ${JSON.stringify(goals)}
- Self-rated skill levels (1-5): ${JSON.stringify(ratings)}

Create a personalized learning path that:
1. Prioritizes courses aligned with his goals
2. Starts with areas where he rated himself lowest
3. Groups related modules together
4. Estimates total time commitment
5. Explains WHY each recommendation matters for his specific role

Format your response as a clear, actionable learning plan with numbered steps.
For each recommended course/module, include the estimated time.
Be encouraging and practical. End with a motivating summary.`;

  const result = streamText({
    model: anthropic("claude-sonnet-4-20250514"),
    prompt: systemPrompt,
    maxOutputTokens: 2048,
  });

  return result.toUIMessageStreamResponse();
}
