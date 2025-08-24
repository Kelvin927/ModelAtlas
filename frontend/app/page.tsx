"use client";

import { useEffect, useState } from "react";

interface Model {
  id: string;
  name: string;
  category: string;
  tags: string[];
  summary: string;
}

export default function Home() {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/models")
      .then((res) => res.json())
      .then((data) => {
        setModels(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch models:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="p-8 text-lg">Loading models...</p>;

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-4xl font-bold mb-6">📚 ModelAtlas</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {models.map((model) => (
          <div
            key={model.id}
            className="rounded-2xl border bg-white p-6 shadow hover:shadow-lg transition"
          >
            <h2 className="text-2xl font-semibold mb-2">{model.name}</h2>
            <p className="text-sm text-gray-500 mb-2">Category: {model.category}</p>
            <p className="text-gray-700 mb-3">{model.summary}</p>
            <div className="flex flex-wrap gap-2">
              {model.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
