"use client";

import Link from "next/link";

export default function StudentHome() {
  const modules = [
    "Module 1",
    "Module 2",
    "Module 3",
    "Module 4",
    "Module 5",
    "Module 6"
  ];

  return (
    <div className="p-8 text-purple-900">
      <h2 className="text-3xl font-bold text-blue-700 mb-6">Welcome, Student!</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {modules.map((mod, index) => (
          <div
            key={index}
            className="border border-blue-300 p-6 rounded hover:bg-blue-100 hover:shadow-md transition-all duration-200"
          >
            <h3 className="font-semibold text-lg text-black">{mod}</h3>
            <p className="text-sm text-gray-700 mt-2">
              Learn key aspects of cybersecurity in {mod}.
            </p>
            <Link
              href={`/student/module/${index + 1}`}
              className="text-blue-600 text-sm mt-3 inline-block hover:underline"
            >
              Explore →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
