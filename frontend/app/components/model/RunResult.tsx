"use client";

interface RunResultProps {
  output: string | null;
  error: string | null;
  imageBase64: string | null;
}

export default function RunResult({ output, error, imageBase64 }: RunResultProps) {
  if (!output && !error && !imageBase64) return null;

  const resolveImageSrc = (img: string) => {
    if (img.startsWith("/") || img.startsWith("http")) {
      // 如果后端返回 URL
      return img;
    }
    // 默认当成 Base64
    return `data:image/png;base64,${img}`;
  };

  return (
    <div className="mt-4 bg-gray-100 rounded-lg p-4">
      <h3 className="font-semibold mb-2">Execution Result:</h3>

      {output && (
        <pre className="bg-gray-200 text-black rounded-lg p-2 mb-2 overflow-x-auto">
          <code>{output}</code>
        </pre>
      )}
      {error && (
        <pre className="bg-red-100 text-red-800 rounded-lg p-2 overflow-x-auto">
          <code>{error}</code>
        </pre>
      )}
      {imageBase64 && (
        <div className="mt-4">
          <img
            src={resolveImageSrc(imageBase64)}
            alt="Execution plot"
            className="rounded-lg border shadow"
          />
        </div>
      )}
    </div>
  );
}
