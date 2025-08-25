export default function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">{children}</span>
  );
}
