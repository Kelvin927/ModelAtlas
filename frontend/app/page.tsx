"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Model {
  id: string;
  name?: string;
  category?: string;
  description?: string;
  tags?: string[];
}

/** Highlight matching search text */
function highlightText(text: string | undefined, query: string) {
  if (!text) return "";
  if (!query) return text;

  const regex = new RegExp(`(${query})`, "gi");
  const parts = text.split(regex);

  return parts.map((part, idx) =>
    regex.test(part) ? (
      <mark key={idx} className="bg-yellow-200 text-black rounded px-1">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

export default function HomePage() {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [jumpPage, setJumpPage] = useState("");
  const modelsPerPage = 9;

  // Fetch models from backend
  useEffect(() => {
    async function fetchModels() {
      try {
        const res = await fetch("http://127.0.0.1:8000/models");
        const data = await res.json();
        setModels(data);
      } catch (error) {
        console.error("Failed to load models:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchModels();
  }, []);

  // Extract unique categories
  const categories = ["All", ...new Set(models.map((m) => m.category || "Uncategorized"))];

  // Apply search and category filters
  const filteredModels = models.filter((m) => {
    const q = search.toLowerCase();

    const matchesSearch =
      (m.name?.toLowerCase() || "").includes(q) ||
      (m.description?.toLowerCase() || "").includes(q) ||
      (m.tags || []).some((tag) => (tag?.toLowerCase() || "").includes(q));

    const matchesCategory =
      categoryFilter === "All" || m.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredModels.length / modelsPerPage);
  const startIndex = (currentPage - 1) * modelsPerPage;
  const currentModels = filteredModels.slice(startIndex, startIndex + modelsPerPage);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, categoryFilter]);

  // Handle page jump input
  const handleJumpPage = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNum = parseInt(jumpPage, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
    setJumpPage("");
  };

  return (
    <div className="p-4">
      {loading ? (
        <p>Loading models...</p>
      ) : (
        <>
          {/* Search and category filter */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
            <input
              type="text"
              placeholder="🔍 Search models..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-1/2 px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            >
              {categories.map((cat, idx) => (
                <option key={idx} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Model cards */}
          {currentModels.length === 0 ? (
            <p className="text-gray-500">No models found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentModels.map((model) => (
                <Link
                  key={model.id}
                  href={`/models/${model.id}`}
                  className="block p-6 border rounded-2xl shadow hover:shadow-lg transition"
                >
                  <h2 className="text-xl font-bold mb-2">
                    {highlightText(model.name, search)}
                  </h2>
                  <p className="text-sm text-gray-500 mb-2">
                    Category: {highlightText(model.category, search)}
                  </p>
                  <p className="text-gray-700 mb-3">
                    {highlightText(model.description, search)}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {(model.tags || []).map((tag, idx) => (
                      <span
                        key={idx}
                        className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded"
                      >
                        #{highlightText(tag, search)}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8">
              {/* Numbered pagination */}
              <div className="flex gap-2 flex-wrap">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 border rounded-lg ${
                      page === currentPage
                        ? "bg-blue-500 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              {/* Jump to page input */}
              <form onSubmit={handleJumpPage} className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={totalPages}
                  value={jumpPage}
                  onChange={(e) => setJumpPage(e.target.value)}
                  className="w-20 px-2 py-1 border rounded-lg text-center"
                  placeholder="Page"
                />
                <button
                  type="submit"
                  className="px-4 py-2 border rounded-lg bg-gray-100 hover:bg-gray-200"
                >
                  Go
                </button>
              </form>
            </div>
          )}
        </>
      )}
    </div>
  );
}
