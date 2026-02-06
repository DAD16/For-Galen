import type { Persona } from "@/lib/ai/personas";

interface PersonaCardProps {
  persona: Persona;
  variant?: "full" | "compact" | "badge";
}

export function PersonaCard({ persona, variant = "full" }: PersonaCardProps) {
  if (variant === "badge") {
    return (
      <div className="flex items-center gap-2">
        <div
          className={`flex h-6 w-6 items-center justify-center rounded-full ${persona.color} text-[10px] font-bold text-white`}
        >
          {persona.initials}
        </div>
        <span className="text-sm text-muted-foreground">{persona.name}</span>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className="flex items-center gap-3">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${persona.color} text-xs font-bold text-white`}
        >
          {persona.initials}
        </div>
        <div>
          <p className="text-sm font-medium">{persona.name}</p>
          <p className="text-xs text-muted-foreground">{persona.title}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-4 rounded-lg border p-4">
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${persona.color} text-sm font-bold text-white`}
      >
        {persona.initials}
      </div>
      <div>
        <p className="font-semibold">{persona.name}</p>
        <p className="text-sm text-muted-foreground">{persona.title}</p>
        <p className="mt-2 text-sm">{persona.bio}</p>
      </div>
    </div>
  );
}
