"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import Link from "next/link";

interface Model {
  id: string;
  name: string;
  category: string;
  tags: string[];
  summary: string;
  formula?: string;
  code?: string;
}

export default function ModelDetail() {
  const { id } = useParams();
  const [model, setModel] = useState<Model | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/models/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setModel(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch model:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p className="p-8 text-lg">Loading...</p>;
  if (!model) return <p className="p-8 text-lg">Model not found.</p>;

  return (
    <main className="min-h-screen bg-gray-50 p-8">
        <Link href="/" className="inline-block mb-4 text-blue-600 hover:underline">
          ⬅ Back to Home
        </Link>
      <h1 className="text-4xl font-bold mb-4">{model.name}</h1>
      <p className="text-gray-600 mb-2">Category: {model.category}</p>
      <p className="text-lg mb-4">{model.summary}</p>

      {model.formula && (
        <div className="bg-gray-100 rounded-lg p-4 mb-4">
          <h2 className="font-semibold mb-2">📐 Formula</h2>
          <BlockMath math={model.formula} />
        </div>
      )}

      {model.code && (
        <div className="bg-gray-900 rounded-lg p-4">
          <h2 className="font-semibold mb-2 text-white">💻 Python Example</h2>
          <SyntaxHighlighter language="python" style={vscDarkPlus}>
            {model.code.replace(/\\n/g, "\n")}
          </SyntaxHighlighter>
        </div>
      )}
    </main>
  );
}
