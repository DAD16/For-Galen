"use client";

import { useState, useRef } from "react";
import { Check, Copy } from "lucide-react";

interface CodeBlockProps {
  children: React.ReactNode;
}

export function CodeBlock({ children, ...props }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const preRef = useRef<HTMLPreElement>(null);

  const handleCopy = () => {
    if (preRef.current) {
      const text = preRef.current.textContent || "";
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="not-prose group relative my-4">
      <button
        onClick={handleCopy}
        className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-md border border-zinc-700 bg-zinc-800 text-zinc-400 opacity-60 transition-all hover:bg-zinc-700 hover:text-zinc-200 hover:opacity-100"
        title="Copy to clipboard"
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-400" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </button>
      <pre
        ref={preRef}
        className="overflow-x-auto rounded-lg bg-zinc-900 px-4 py-4 pr-14 text-sm leading-relaxed text-zinc-100 [&>code]:bg-transparent [&>code]:p-0 [&>code]:text-inherit [&>code]:before:content-none [&>code]:after:content-none"
        {...props}
      >
        {children}
      </pre>
    </div>
  );
}
