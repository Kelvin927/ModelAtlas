"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import { Model, RequiredColumn } from "@/app/components/types/model";
import ModelHeader from "@/app/components/model/ModelHeader";
import Section from "@/app/components/ui/Section";
import Badge from "@/app/components/ui/Badge";
import CodeBlock from "@/app/components/ui/CodeBlock";
import MathSection from "@/app/components/model/MathSection";
import HyperparamSection from "@/app/components/model/HyperparamSection";
import UsageSection from "@/app/components/model/UsageSection";
import EvaluationSection from "@/app/components/model/EvaluationSection";
import ProsConsSection from "@/app/components/model/ProsConsSection";
import ComparisonSection from "@/app/components/model/ComparisonSection";
import VisualizationSection from "@/app/components/model/VisualizationSection";
import ReferenceSection from "@/app/components/model/ReferenceSection";
import RunResult from "@/app/components/model/RunResult";
import ColumnMapper from "@/app/components/ui/ColumnMapper";

export default function ModelDetail() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : (params?.id as string | undefined);

  const [model, setModel] = useState<Model | null>(null);
  const [loading, setLoading] = useState(true);

  // run states
  const [runLoading, setRunLoading] = useState(false);
  const [editableCode, setEditableCode] = useState<string>("");
  const [files, setFiles] = useState<File[] | null>(null); // use File[] snapshot
  const [result, setResult] = useState<any>(null);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

  // csv mapping states
  const [csvColumns, setCsvColumns] = useState<string[]>([]);
  const [columnMap, setColumnMap] = useState<Record<string, string>>({}); // {"x":"lng","y":"lat"}

  useEffect(() => {
    async function fetchModel() {
      if (!id) return;
      setLoading(true);
      try {
        const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000";
        const res = await fetch(`${API_BASE}/models`, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: Model = await res.json();
        setModel(data);
        setEditableCode(data?.code?.python_sklearn || "");
      } catch (err) {
        console.error("Failed to fetch model:", err);
        setModel(null);
      } finally {
        setLoading(false);
      }
    }
    fetchModel();
  }, [id]);

  /**
   * When user selects files, read the header of the first CSV locally
   * to offer a column mapping UI. We also attempt a simple alias-based
   * auto-fill using model.required_columns.
   */
  const handleFilesSelected = (arr: File[]) => {
    setFiles(arr);
    setResult(null);
    setUploadMessage(arr?.length ? `✅ ${arr.length} file(s) selected` : null);

    setCsvColumns([]);
    setColumnMap({});
    if (arr && arr.length > 0) {
      const f = arr[0];
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const text = String(reader.result || "");
          const firstLine = text.split(/\r?\n/)[0] || "";
          const cols = firstLine.split(",").map((s) => s.trim()).filter(Boolean);
          setCsvColumns(cols);

          // simple auto-map by aliases or canonical equality
          if (model?.required_columns && cols.length > 0) {
            const initMap: Record<string, string> = {};
            for (const rc of model.required_columns as RequiredColumn[]) {
              const canon = rc.canonical || rc.name || rc.role || "";
              if (!canon) continue;
              const aliases = (rc.aliases || []).map((a) => a.toLowerCase());
              const hit =
                cols.find((c) => aliases.includes(c.toLowerCase())) ||
                cols.find((c) => c.toLowerCase() === canon.toLowerCase());
              if (hit) initMap[canon] = hit;
            }
            setColumnMap(initMap);
          }
        } catch {
          // ignore parse errors silently
        }
      };
      reader.readAsText(f);
    }
  };

  const handleRunCode = async () => {
    if (!editableCode) return;
    setRunLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("code", editableCode);
      formData.append("model_id", id || "");

      // send column_map only if the model declares required columns
      if (model?.required_columns && Object.keys(columnMap).length > 0) {
        formData.append("column_map", JSON.stringify(columnMap)); // {"x":"lng","y":"lat"}
      }

      if (files && files.length > 0) {
        files.forEach((f) => formData.append("files", f));
        setUploadMessage("✅ File(s) selected, sending to backend...");
      }

      const res = await fetch("http://127.0.0.1:8000/run-code", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setResult(data);

      if (files && files.length > 0) {
        if (data.stderr) {
          setUploadMessage("⚠️ File(s) uploaded but backend returned an error");
        } else {
          setUploadMessage("✅ File(s) processed by backend");
        }
      }
    } catch (err) {
      setResult({ stderr: "Failed to connect to backend." });
      setUploadMessage("❌ Upload failed, backend not reachable");
    } finally {
      setRunLoading(false);
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (!model) {
    return (
      <div className="p-6">
        <Link href="/" className="text-blue-600 hover:underline">
          ← Back to Home
        </Link>
        <p className="mt-4 text-red-600">Model not found.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
        ← Back to Home
      </Link>

      <ModelHeader
        name={model.name}
        category={model.category}
        level={model.level}
        lastUpdated={model.last_updated}
      />

      {model.summary && <p className="mb-6 text-gray-800">{model.summary}</p>}

      {/* Tags */}
      {model.tags && model.tags.length > 0 && (
        <Section title="🏷️ Tags">
          <div className="flex flex-wrap gap-2">
            {model.tags.map((tag, i) => (
              <Badge key={i}>#{tag}</Badge>
            ))}
          </div>
        </Section>
      )}

      {/* Scenarios */}
      {model.app_scenarios && model.app_scenarios.length > 0 && (
        <Section title="📌 Application Scenarios">
          <ul className="list-disc list-inside space-y-1 text-gray-800">
            {model.app_scenarios.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </Section>
      )}

      {/* Math */}
      <MathSection coreFormula={model.math?.core_formula} assumptions={model.math?.assumptions} />

      {/* Hyperparameters */}
      <HyperparamSection hyperparameters={model.hyperparameters} />

      {/* Required CSV Format (declaration) */}
      {model.required_columns && model.required_columns.length > 0 && (
        <Section title="⚠️ Required CSV Format">
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
            {model.required_columns.map((col: any, i: number) => {
              const canon = col.canonical || col.name || col.role;
              return (
                <li key={i}>
                  <code className="bg-gray-200 px-1 rounded">{canon}</code>
                  {col.description ? ` — ${col.description}` : ""}
                  {col.aliases?.length ? (
                    <span className="text-gray-500"> (aliases: {col.aliases.join(", ")})</span>
                  ) : null}
                  {col.dtype ? (
                    <span className="text-gray-500"> (dtype: {col.dtype})</span>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </Section>
      )}

      {/* Column mapping UI (visible after CSV is selected and we parsed its header) */}
      {model?.required_columns && model.required_columns.length > 0 && csvColumns.length > 0 && (
        <Section title="🗺️ Map CSV Columns">
          <ColumnMapper
            required={model.required_columns as RequiredColumn[]}
            csvColumns={csvColumns}
            value={columnMap}
            onChange={setColumnMap}
          />
        </Section>
      )}

      {/* Code + Run */}
      {editableCode && (
        <Section title="🐍 Code Example (scikit-learn)">
          {uploadMessage && <p className="text-sm mb-2">{uploadMessage}</p>}
          <CodeBlock
            code={editableCode}
            setCode={setEditableCode}
            onRun={handleRunCode}
            running={runLoading}
            onUpload={handleFilesSelected} // receives File[]
          />
          <RunResult
            stdout={result?.stdout}
            stderr={result?.stderr}
            images={result?.images}
            tables={result?.tables}
          />
        </Section>
      )}

      {/* Usage */}
      <UsageSection workflow={model.usage?.workflow} />

      {/* Evaluation */}
      <EvaluationSection metrics={model.evaluation?.metrics} validation={model.evaluation?.validation} />

      {/* Pros/Cons/Pitfalls */}
      <ProsConsSection strengths={model.strengths} weaknesses={model.weaknesses} pitfalls={model.pitfalls} />

      {/* Comparisons */}
      <ComparisonSection comparisons={model.comparisons} />

      {/* Visualizations */}
      <VisualizationSection items={model.visualizations} />

      {/* References */}
      <ReferenceSection refs={model.references} />
    </div>
  );
}
