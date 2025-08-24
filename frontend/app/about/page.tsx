export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-4xl font-bold mb-6">ℹ️ About ModelAtlas</h1>

      <p className="text-lg text-gray-700 mb-4">
        <strong>ModelAtlas</strong> is an open-source knowledge base of statistical 
        and mathematical models, designed for students, researchers, and competition 
        participants. It provides formulas, Python code snippets, application notes, 
        and interactive demos for better understanding and quick reference.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">🚀 Roadmap</h2>
      <ul className="list-disc pl-6 text-gray-700 space-y-2">
        <li>Add 50+ commonly used models across statistics, ML, and optimization</li>
        <li>Export models to LaTeX for direct use in CUMCM/MCM papers</li>
        <li>Support interactive demos (regression plots, SIR epidemic simulations, etc.)</li>
        <li>User accounts with favorites, notes, and contributions</li>
        <li>Deploy as a full-stack app (Frontend: Vercel, Backend: Render/Fly.io)</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">🤝 Contributing</h2>
      <p className="text-gray-700">
        Contributions are welcome! Feel free to add new models, improve existing 
        implementations, or create interactive demos. Check out the project on{" "}
        <a
          href="https://github.com/Kelvin927/ModelAtlas"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          GitHub
        </a>.
      </p>
    </main>
  );
}
