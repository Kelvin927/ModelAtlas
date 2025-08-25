import Section from "../ui/Section";
export default function VisualizationSection({ items }: { items?: string[] }) {
  if (!items || items.length === 0) return null;
  return (
    <Section title="📈 Visualizations">
      <ul className="list-disc list-inside text-gray-800">
        {items.map((v, i) => (
          <li key={i}>{v}</li>
        ))}
      </ul>
    </Section>
  );
}
