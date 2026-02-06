"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState, useRef, useEffect, type FormEvent } from "react";
import { Send, Square, Loader2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const contexts = [
  { value: "general", label: "General" },
  { value: "excel", label: "Excel / Spreadsheets" },
  { value: "salesforce", label: "Salesforce" },
  { value: "fishbowl", label: "Fishbowl" },
  { value: "documents", label: "Documents" },
  { value: "pm", label: "Project Management" },
];

const suggestedPrompts = [
  {
    category: "Excel",
    prompts: [
      "Write a VLOOKUP formula to match employee IDs across two sheets",
      "Create a VBA macro to format and clean imported data",
      "Build a pivot table summary formula for monthly user reports",
    ],
  },
  {
    category: "Salesforce",
    prompts: [
      "Write a SOQL query to find users who haven't logged in for 90 days",
      "Help me design a Flow for automatic case assignment",
      "Create a report showing opportunities by stage and owner",
    ],
  },
  {
    category: "Project Management",
    prompts: [
      "Help me create a project plan for a system migration",
      "Write a status report template for executive stakeholders",
      "Break down this project into a work breakdown structure",
    ],
  },
  {
    category: "Fishbowl",
    prompts: [
      "Help me plan an inventory audit process",
      "Write a data export script for Fishbowl inventory records",
      "Design a workflow for purchase order approvals",
    ],
  },
];

function getMessageText(message: { content?: string; parts?: Array<{ type: string; text?: string }> }): string {
  if (typeof message.content === "string" && message.content) {
    return message.content;
  }
  if (message.parts) {
    return message.parts
      .filter((p): p is { type: "text"; text: string } => p.type === "text" && typeof p.text === "string")
      .map((p) => p.text)
      .join("");
  }
  return "";
}

export function ChatInterface() {
  const [context, setContext] = useState("general");
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, stop, setMessages } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: { context },
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

  const handlePromptClick = (prompt: string) => {
    setInput(prompt);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      <div className="flex items-center justify-between border-b pb-3">
        <div className="flex items-center gap-3">
          <Select value={context} onValueChange={setContext}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select context" />
            </SelectTrigger>
            <SelectContent position="popper" className="max-h-60">
              {contexts.map((ctx) => (
                <SelectItem key={ctx.value} value={ctx.value}>
                  {ctx.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Badge variant="outline" className="text-xs">
            {contexts.find((c) => c.value === context)?.label} mode
          </Badge>
        </div>
        {messages.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMessages([])}
          >
            <RotateCcw className="mr-2 h-3 w-3" />
            New Chat
          </Button>
        )}
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto py-4">
        {messages.length === 0 ? (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold">
                How can I help you today, Galen?
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Ask me anything about Excel, Salesforce, Fishbowl, project
                management, or how to use Claude Code for your IT tasks.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {suggestedPrompts.map((category) => (
                <div key={category.category} className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    {category.category}
                  </p>
                  {category.prompts.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => handlePromptClick(prompt)}
                      className="w-full rounded-lg border p-3 text-left text-sm transition-colors hover:bg-accent"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-lg px-4 py-3 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  {message.role === "assistant" ? (
                    <div className="prose prose-sm dark:prose-invert max-w-none prose-pre:rounded-md prose-pre:bg-zinc-900 prose-pre:text-zinc-100 prose-code:text-sm">
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
                  <div className="flex items-center gap-2 rounded-lg bg-muted px-4 py-3 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Thinking...
                  </div>
                </div>
              )}
          </div>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex items-end gap-2 border-t pt-4"
      >
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask me anything about your IT tasks..."
          className="min-h-[44px] max-h-[200px] resize-none"
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
    </div>
  );
}
