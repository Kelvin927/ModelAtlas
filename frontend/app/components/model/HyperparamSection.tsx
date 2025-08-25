import Section from "../ui/Section";
import { Hyperparameter } from "../types/model";

export default function HyperparamSection({ hyperparameters }: { hyperparameters?: Hyperparameter[] }) {
  if (!hyperparameters || hyperparameters.length === 0) return null;
  return (
    <Section title="🎛️ Hyperparameters">
      <ul className="list-disc list-inside text-gray-800">
        {hyperparameters.map((hp, i) => (
          <li key={i}>
            <b>{hp.name}</b> (default={String(hp.default ?? "-")}) — {hp.tips}
          </li>
        ))}
      </ul>
    </Section>
  );
}
