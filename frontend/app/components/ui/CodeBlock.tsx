"use client";
import CopyButton from "./CopyButton";
import UploadButton from "./UploadButton";

export default function CodeBlock({
  code,
  onRun,
  running,
  language = "python",
  setCode,
  onUpload,
}: {
  code: string;
  onRun?: () => void;
  running?: boolean;
  language?: string;
  setCode?: (val: string) => void;
  onUpload?: (files: File[]) => void; // <-- File[]
}) {
  return (
    <div className="rounded-lg overflow-hidden border border-gray-200 mb-3">
      <div className="flex items-center justify-between px-3 py-2 bg-gray-50">
        <span className="text-xs text-gray-600 uppercase">{language}</span>
        <div className="flex items-center gap-2">
          <CopyButton text={code} />
          {onRun && (
            <button
              onClick={onRun}
              disabled={running}
              className="px-2 py-1 text-xs rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {running ? "Running..." : "Run"}
            </button>
          )}
          {onUpload && (
            <UploadButton
              onFilesSelected={onUpload}
              label="Upload CSV"
              accept=".csv"
              multiple
            />
          )}
        </div>
      </div>

      {setCode ? (
        <textarea
          className="bg-gray-900 text-green-200 text-sm p-4 w-full h-64 font-mono"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
      ) : (
        <pre className="bg-gray-900 text-green-200 text-sm p-4 overflow-x-auto">
          <code>{code}</code>
        </pre>
      )}
    </div>
  );
}
