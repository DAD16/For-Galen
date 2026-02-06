"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import {
  MessageCircle,
  Send,
  Square,
  Loader2,
  RotateCcw,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const suggestedPrompts = [
  "Summarize the current status of this project",
  "Suggest tasks I should prioritize this week",
  "Help me break down the largest task into subtasks",
  "What risks do you see based on my current board?",
  "Draft a status update for stakeholders",
];

function getMessageText(message: {
  content?: string;
  parts?: Array<{ type: string; text?: string }>;
}): string {
  if (typeof message.content === "string" && message.content) {
    return message.content;
  }
  if (message.parts) {
    return message.parts
      .filter(
        (p): p is { type: "text"; text: string } =>
          p.type === "text" && typeof p.text === "string"
      )
      .map((p) => p.text)
      .join("");
  }
  return "";
}

interface ProjectCoachPanelProps {
  projectId: string;
}

export function ProjectCoachPanel({ projectId }: ProjectCoachPanelProps) {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, stop, setMessages } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat/project-coach",
      body: { projectId },
    }),
  });

  const isLoading = status === "streaming" || status === "submitted";

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e?: FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ text: input });
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          <MessageCircle className="mr-2 h-4 w-4" />
          AI Coach
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col sm:max-w-md p-0">
        <SheetHeader className="border-b px-6 py-4">
          <SheetTitle className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white">
              MR
            </div>
            Marcus Rivera &mdash; PM Coach
          </SheetTitle>
        </SheetHeader>

        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-4 py-4"
        >
          {messages.length === 0 ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Hi Galen! I can see your project board. Ask me for advice on
                prioritization, task breakdown, risk assessment, or status
                summaries.
              </p>
              <div className="grid gap-2">
                {suggestedPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => setInput(prompt)}
                    className="rounded-lg border p-2.5 text-left text-xs transition-colors hover:bg-accent"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[90%] rounded-lg px-3 py-2 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {message.role === "assistant" ? (
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {getMessageText(message)}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p className="text-sm whitespace-pre-wrap">
                        {getMessageText(message)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
              {isLoading &&
                messages.length > 0 &&
                messages[messages.length - 1]?.role !== "assistant" && (
                  <div className="flex justify-start">
                    <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Marcus is thinking...
                    </div>
                  </div>
                )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end border-t px-4 py-1">
          {messages.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMessages([])}
              className="text-xs"
            >
              <RotateCcw className="mr-1 h-3 w-3" />
              New Chat
            </Button>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex items-end gap-2 border-t p-4"
        >
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Marcus about your project..."
            className="min-h-[44px] max-h-[120px] resize-none text-sm"
            rows={1}
          />
          {isLoading ? (
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={() => stop()}
            >
              <Square className="h-4 w-4" />
            </Button>
          ) : (
            <Button type="submit" size="icon" disabled={!input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          )}
        </form>
      </SheetContent>
    </Sheet>
  );
}
