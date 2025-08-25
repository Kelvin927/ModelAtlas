"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import { Model } from "@/app/components/types/model";
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

export default function ModelDetail() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : (params?.id as string | undefined);

  const [model, setModel] = useState<Model | null>(null);
  const [loading, setLoading] = useState(true);

  // run states
  const [runLoading, setRunLoading] = useState(false);
  const [runOutput, setRunOutput] = useState<string | null>(null);
  const [runError, setRunError] = useState<string | null>(null);
  const [runImage, setRunImage] = useState<string | null>(null);
  const [editableCode, setEditableCode] = useState<string>("");

  useEffect(() => {
    async function fetchModel() {
      if (!id) return;
      setLoading(true);
      try {
        const res = await fetch(`http://127.0.0.1:8000/models/${id}`, { cache: "no-store" });
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

  const handleRunCode = async () => {
    if (!editableCode) return;
    setRunLoading(true);
    setRunOutput(null);
    setRunError(null);
    setRunImage(null);

    try {
      const res = await fetch("http://127.0.0.1:8000/run-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: editableCode }),
      });
      const data = await res.json();
      setRunOutput(data.output || "");
      setRunError(data.error || null);
      setRunImage(data.image || null);
    } catch (err) {
      setRunError("Failed to connect to backend.");
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

      {/* Code with run */}
      {editableCode && (
        <Section title="🐍 Code Example (scikit-learn)">
          <CodeBlock code={editableCode} setCode={setEditableCode} onRun={handleRunCode} running={runLoading} />
          <RunResult output={runOutput} error={runError} imageBase64={runImage} />
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
