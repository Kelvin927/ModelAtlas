"use client";

interface TablePreviewProps {
  name: string;
  preview: any[];
}

export default function TablePreview({ name, preview }: TablePreviewProps) {
  if (!preview || preview.length === 0) {
    return (
      <div className="mb-3">
        <p className="font-semibold">{name}</p>
        <p className="text-sm text-gray-500">No data</p>
      </div>
    );
  }

  const headers = Object.keys(preview[0]);

  return (
    <div className="mb-4">
      <p className="font-semibold mb-1">{name}</p>
      <div className="overflow-x-auto border rounded">
        <table className="min-w-full border-collapse text-sm">
          <thead className="bg-gray-100">
            <tr>
              {headers.map((h) => (
                <th key={h} className="px-2 py-1 border text-left font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {preview.map((row, i) => (
              <tr key={i} className="odd:bg-white even:bg-gray-50">
                {headers.map((h) => (
                  <td key={h} className="px-2 py-1 border">
                    {String(row[h])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
