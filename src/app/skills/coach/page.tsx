import { CoachChat } from "@/components/skills/coach-chat";
import { getPersonaById } from "@/lib/ai/personas";
import { PersonaCard } from "@/components/ui/persona-card";

export default function CoachPage() {
  const marcus = getPersonaById("marcus-rivera");

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col gap-4">
      <PersonaCard persona={marcus} variant="full" />
      <CoachChat />
    </div>
  );
}
