"use client";

import { useRef, useState } from "react";

export default function UploadButton({
  onFilesSelected,
  label = "📂 Upload CSV",
  accept = ".csv",
  multiple = true,
}: {
  onFilesSelected: (files: File[]) => void; // <-- File[]
  label?: string;
  accept?: string;
  multiple?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files ? Array.from(e.target.files) : [];
    onFilesSelected(picked); // <-- pass a stable snapshot
    setUploadMessage(
      picked.length > 0 ? `✅ ${picked.length} file(s) selected` : null
    );
    e.target.value = ""; // safe reset; our snapshot is preserved
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={handleClick}
        className="px-2 py-1 text-xs rounded bg-green-600 text-white hover:bg-green-700"
      >
        {label}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={handleChange}
      />
      {uploadMessage && <p className="text-xs text-green-600">{uploadMessage}</p>}
    </div>
  );
}
