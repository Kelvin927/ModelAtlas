"use client";
import "katex/dist/katex.min.css";
import katex from "katex";
import Section from "../ui/Section";
import { useMemo } from "react";

export default function MathSection({
  coreFormula,
  assumptions,
}: {
  coreFormula?: string;
  assumptions?: string[];
}) {
  const coreFormulaHTML = useMemo(() => {
    if (!coreFormula) return null;
    try {
      return katex.renderToString(coreFormula, {
        throwOnError: false,
        displayMode: true,
        output: "html",
      });
    } catch {
      return null;
    }
  }, [coreFormula]);

  if (!coreFormula) return null;

  return (
    <Section title="📐 Math">
      <div
        className="bg-gray-50 rounded-lg p-4 overflow-x-auto mb-4"
        dangerouslySetInnerHTML={{ __html: coreFormulaHTML || "" }}
      />
      {assumptions && assumptions.length > 0 && (
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Assumptions</h3>
          <ul className="list-disc list-inside text-gray-800">
            {assumptions.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      )}
    </Section>
  );
}
