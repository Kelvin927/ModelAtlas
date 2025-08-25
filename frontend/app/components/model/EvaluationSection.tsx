import Section from "../ui/Section";
export default function EvaluationSection({
  metrics,
  validation,
}: {
  metrics?: string[];
  validation?: string;
}) {
  if (!metrics && !validation) return null;
  return (
    <Section title="📊 Evaluation">
      {metrics && (
        <ul className="list-disc list-inside space-y-1 text-gray-800">
          {metrics.map((m, i) => (
            <li key={i}>{m}</li>
          ))}
        </ul>
      )}
      {validation && <p className="mt-2">Validation: {validation}</p>}
    </Section>
  );
}
