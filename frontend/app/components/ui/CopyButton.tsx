"use client";
import { useState } from "react";

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1200);
        } catch {}
      }}
      className="px-2 py-1 text-xs rounded bg-gray-200 hover:bg-gray-300 active:scale-[0.98]"
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}
