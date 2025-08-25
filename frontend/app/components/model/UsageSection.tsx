import Section from "../ui/Section";
export default function UsageSection({ workflow }: { workflow?: string[] }) {
  if (!workflow || workflow.length === 0) return null;
  return (
    <Section title="🧭 Usage">
      <ol className="list-decimal list-inside space-y-1 text-gray-800 mb-4">
        {workflow.map((s, i) => (
          <li key={i}>{s}</li>
        ))}
      </ol>
    </Section>
  );
}
