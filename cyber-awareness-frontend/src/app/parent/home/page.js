"use client";

import Link from "next/link";

export default function ParentHome() {
  const topics = [
    "Protection from cyberattacks",
    "Maintaining confidentiality",
    "Ensuring data integrity",
    "System availability",
    "Tools: firewalls, anti-malware, etc.",
    "Cybersecurity policies",
    "Educating & training children"
  ];

  return (
    <div className="p-8 text-purple-900">
      <h2 className="text-3xl font-bold text-purple-700 mb-6">Welcome, Parents!</h2>
      <p className="mb-6 text-gray-700">
        Empower yourself with knowledge to support your child’s safe digital experience.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {topics.map((topic, index) => (
          <div
            key={index}
            className="border border-purple-300 bg-white p-6 rounded shadow hover:shadow-md hover:bg-purple-50 transition"
          >
            <h3 className="font-semibold text-lg text-black">{topic}</h3>
            <p className="text-sm text-gray-600 mt-2">
              Learn about: {topic}.
            </p>
            <Link
              href={`/parent/topic/${index + 1}`}
              className="text-purple-700 text-sm mt-3 inline-block hover:underline"
            >
              Explore →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
