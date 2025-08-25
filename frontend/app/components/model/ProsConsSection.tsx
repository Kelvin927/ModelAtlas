import Section from "../ui/Section";

export default function ProsConsSection({
  strengths,
  weaknesses,
  pitfalls,
}: {
  strengths?: string[];
  weaknesses?: string[];
  pitfalls?: string[];
}) {
  if (!strengths && !weaknesses && !pitfalls) return null;
  return (
    <Section title="Pros / Cons / Pitfalls">
      <div className="grid md:grid-cols-3 gap-6">
        {strengths && strengths.length > 0 && (
          <div>
            <h3 className="font-semibold mb-2">Strengths</h3>
            <ul className="list-disc list-inside text-gray-800">
              {strengths.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        )}
        {weaknesses && weaknesses.length > 0 && (
          <div>
            <h3 className="font-semibold mb-2">Weaknesses</h3>
            <ul className="list-disc list-inside text-gray-800">
              {weaknesses.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        )}
        {pitfalls && pitfalls.length > 0 && (
          <div>
            <h3 className="font-semibold mb-2">Pitfalls</h3>
            <ul className="list-disc list-inside text-gray-800">
              {pitfalls.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Section>
  );
}
