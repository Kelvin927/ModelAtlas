"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo / Title */}
        <Link href="/" className="text-2xl font-bold text-blue-600">
          📚 ModelAtlas
        </Link>

        {/* Navigation Links */}
        <div className="flex gap-6">
          <Link href="/" className="text-gray-700 hover:text-blue-600">
            Home
          </Link>
          <Link href="/about" className="text-gray-700 hover:text-blue-600">
            About
          </Link>
          <a
            href="https://github.com/Kelvin927/ModelAtlas"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 hover:text-blue-600"
          >
            GitHub
          </a>
        </div>
      </div>
    </nav>
  );
}
