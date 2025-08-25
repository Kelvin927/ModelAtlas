"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Model {
  id: string;
  name?: string;
  category?: string;
  summary?: string;
  description?: string;
  tags?: string[];
  last_updated?: string;
}

/** 高亮匹配的搜索内容 */
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

  // 从后端获取模型
  useEffect(() => {
    async function fetchModels() {
      try {
        const res = await fetch("http://127.0.0.1:8000/models", { cache: "no-store" });
        const data = await res.json();
        const arr = Array.isArray(data) ? data : data.models; // 兼容
        setModels(arr || []);
      } catch (error) {
        console.error("Failed to load models:", error);
        setModels([]);
      } finally {
        setLoading(false);
      }
    }
    fetchModels();
  }, []);

  // 提取唯一类别
  const categories = ["All", ...new Set(models.map((m) => m.category || "Uncategorized"))];

  // 搜索 + 分类过滤
  const filteredModels = models.filter((m) => {
    const q = search.toLowerCase();
    const matchesSearch =
      (m.name?.toLowerCase() || "").includes(q) ||
      (m.summary?.toLowerCase() || "").includes(q) ||
      (m.description?.toLowerCase() || "").includes(q) ||
      (m.tags || []).some((tag) => (tag?.toLowerCase() || "").includes(q));

    const matchesCategory =
      categoryFilter === "All" || m.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  // 分页逻辑
  const totalPages = Math.ceil(filteredModels.length / modelsPerPage);
  const startIndex = (currentPage - 1) * modelsPerPage;
  const currentModels = filteredModels.slice(startIndex, startIndex + modelsPerPage);

  // 当搜索或分类变化时重置页码
  useEffect(() => {
    setCurrentPage(1);
  }, [search, categoryFilter]);

  // 跳页
  const handleJumpPage = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNum = parseInt(jumpPage, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
    setJumpPage("");
  };

  // 页码按钮
  const getPagination = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="p-4">
      {loading ? (
        <p>Loading models...</p>
      ) : (
        <>
          {/* 搜索 + 分类过滤 */}
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

          {/* 模型卡片 */}
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
                    {highlightText(model.summary || model.description, search)}
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
                  {model.last_updated && (
                    <p className="text-xs text-gray-500 mt-2">
                      Updated: {model.last_updated}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          )}

          {/* 分页 */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8">
              <div className="flex gap-2 flex-wrap">
                {getPagination().map((p, idx) =>
                  typeof p === "number" ? (
                    <button
                      key={idx}
                      onClick={() => setCurrentPage(p)}
                      className={`px-4 py-2 border rounded-lg ${
                        p === currentPage
                          ? "bg-blue-500 text-white"
                          : "bg-white text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {p}
                    </button>
                  ) : (
                    <span key={idx} className="px-4 py-2 text-gray-500">
                      {p}
                    </span>
                  )
                )}
              </div>
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
