import Section from "../ui/Section";
import { Comparison } from "../types/model";

export default function ComparisonSection({ comparisons }: { comparisons?: Comparison[] }) {
  if (!comparisons || comparisons.length === 0) return null;
  return (
    <Section title="🔄 Comparisons">
      <ul className="list-disc list-inside text-gray-800">
        {comparisons.map((c, i) => (
          <li key={i}>
            <b>{c.with}:</b> {c.differences?.join(", ")}
          </li>
        ))}
      </ul>
    </Section>
  );
}
