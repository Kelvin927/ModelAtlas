"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

// KaTeX for LaTeX rendering
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";

interface Model {
  id: number;
  name: string;
  category: string;
  description: string;
  formula?: string;
  example?: string;
  tags?: string[];
}

export default function ModelDetail() {
  const params = useParams();
  const { id } = params;
  const [model, setModel] = useState<Model | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchModel() {
      try {
        const res = await fetch(`http://127.0.0.1:8000/models/${id}`);
        if (res.ok) {
          const data = await res.json();
          setModel(data);
        }
      } catch (err) {
        console.error("Failed to fetch model:", err);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchModel();
  }, [id]);

  if (loading) return <p className="p-4">Loading...</p>;
  if (!model) return <p className="p-4 text-red-500">Model not found.</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Link href="/" className="text-blue-600 hover:underline mb-4 block">
        ← Back to Home
      </Link>

      <h1 className="text-3xl font-bold mb-2">{model.name}</h1>
      <p className="text-gray-600 mb-4">Category: {model.category}</p>
      <p className="mb-6">{model.description}</p>

      {/* Formula rendered with KaTeX */}
      {model.formula && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">📐 Formula</h2>
          <div className="bg-gray-100 p-3 rounded">
            <BlockMath math={model.formula} />
          </div>
        </div>
      )}

      {/* Python Example */}
      {model.example && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">🐍 Python Example</h2>
          <pre className="bg-gray-900 text-green-200 p-4 rounded overflow-x-auto">
            <code>{model.example}</code>
          </pre>
        </div>
      )}

      {/* Tags */}
      {model.tags && model.tags.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">🏷️ Tags</h2>
          <div className="flex flex-wrap gap-2">
            {model.tags.map((tag, idx) => (
              <span
                key={idx}
                className="bg-blue-100 text-blue-600 text-xs px-3 py-1 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
