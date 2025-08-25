import Section from "../ui/Section";
import { Reference } from "../types/model";

export default function ReferenceSection({ refs }: { refs?: Reference[] }) {
  if (!refs || refs.length === 0) return null;
  return (
    <Section title="🔗 References">
      <ul className="list-disc list-inside">
        {refs.map((r, i) => (
          <li key={i}>
            {r.url ? (
              <a
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline break-all"
              >
                {r.title || r.url}
              </a>
            ) : (
              <span>{r.title}</span>
            )}
            {r.note && <span className="text-gray-600"> — {r.note}</span>}
          </li>
        ))}
      </ul>
    </Section>
  );
}
