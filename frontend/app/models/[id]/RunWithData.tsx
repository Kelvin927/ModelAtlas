"use client";
import { useState } from "react";
import UploadButton from "@/app/components/ui/UploadButton";

export default function RunWithData() {
  const [code, setCode] = useState(
    "import pandas as pd\nprint('Hello CSV')"
  );
  const [files, setFiles] = useState<File[] | null>(null); // <-- File[]
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const run = async () => {
    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("code", code);
    if (files && files.length > 0) {
      files.forEach((f) => formData.append("files", f));
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/run-code`, {
        method: "POST",
        body: formData,
      });
      setResult(await res.json());
    } catch (err) {
      setResult({ stderr: "Failed to connect to backend." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="w-full h-40 border p-2 font-mono"
      />

      <div className="flex items-center gap-2">
        <UploadButton onFilesSelected={setFiles} /> {/* returns File[] */}
        <button
          onClick={run}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          {loading ? "Running..." : "Run"}
        </button>
      </div>

      {result && (
        <div className="mt-4 space-y-4">
          {result.stdout && (
            <div>
              <h3 className="font-semibold">Stdout</h3>
              <pre className="whitespace-pre-wrap bg-gray-100 p-2 rounded">{result.stdout}</pre>
            </div>
          )}
          {result.stderr && (
            <div>
              <h3 className="font-semibold text-red-600">Stderr</h3>
              <pre className="whitespace-pre-wrap bg-red-50 p-2 rounded text-red-600">{result.stderr}</pre>
            </div>
          )}
          {result.tables?.map((t: any) => (
            <div key={t.name}>
              <h4 className="font-semibold">{t.name}</h4>
              <pre className="text-sm bg-gray-50 p-2 rounded overflow-x-auto">
                {JSON.stringify(t.preview, null, 2)}
              </pre>
            </div>
          ))}
          {result.images?.map((url: string) => (
            <img
              key={url}
              src={`${process.env.NEXT_PUBLIC_API_BASE}${url}`}
              className="mt-2 border rounded"
              alt="Output"
            />
          ))}
        </div>
      )}
    </div>
  );
}
