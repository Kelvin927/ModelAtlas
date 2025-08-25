import Badge from "../ui/Badge";

export default function ModelHeader({
  name,
  category,
  level,
  lastUpdated,
}: {
  name: string;
  category?: string;
  level?: string;
  lastUpdated?: string;
}) {
  return (
    <header className="mb-6">
      <h1 className="text-3xl font-bold">{name}</h1>
      <div className="flex flex-wrap items-center gap-2 mt-2 text-gray-600">
        {category && <span>Category: {category}</span>}
        {level && <Badge>{level}</Badge>}
        {lastUpdated && (
          <span className="text-xs text-gray-500">Last updated: {lastUpdated}</span>
        )}
      </div>
    </header>
  );
}
