"use client";

import { useMemo } from "react";
import type { RequiredColumn } from "@/app/components/types/model";

export default function ColumnMapper({
  required,
  csvColumns,
  value,
  onChange,
}: {
  required: RequiredColumn[];
  csvColumns: string[];
  value: Record<string, string>;        // {"x":"lng","y":"lat"}
  onChange: (v: Record<string, string>) => void;
}) {
  const canonList = useMemo(
    () =>
      required.map((c) => ({
        canon: c.canonical || c.name || c.role || "",
        label: c.role ? `${c.role} (${c.canonical || c.name || c.role})` : (c.canonical || c.name || ""),
        desc: c.description || "",
      })),
    [required]
  );

  return (
    <div className="border rounded-lg p-3 bg-orange-50">
      <h4 className="font-medium mb-2">Map CSV columns to required fields</h4>
      <div className="space-y-2">
        {canonList.map((c) => (
          <div key={c.canon} className="flex items-center gap-3">
            <div className="w-56">
              <div className="text-sm font-mono">{c.canon}</div>
              {c.desc && <div className="text-xs text-gray-600">{c.desc}</div>}
            </div>
            <select
              className="border rounded px-2 py-1 text-sm"
              value={value[c.canon] ?? ""}
              onChange={(e) => onChange({ ...value, [c.canon]: e.target.value })}
            >
              <option value="">-- select CSV column --</option>
              {csvColumns.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}
