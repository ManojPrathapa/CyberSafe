"use client";

import { useParams } from "next/navigation";
import Link from "next/link";

export default function ModulePage() {
  const { id } = useParams();

  const topics = [
    "Understanding threats",
    "Safe browsing habits",
    "Secure passwords",
    "Email & phishing",
    "Device protection"
  ];

  return (
    <div className="p-8 text-purple-900">
      <h2 className="text-3xl font-bold text-blue-700 mb-6">Module {id}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        {topics.map((topic, idx) => (
          <div
            key={idx}
            className="border border-gray-300 p-4 rounded shadow-sm hover:bg-purple-50 transition"
          >
            <h4 className="font-semibold text-lg">Topic {id}.{idx + 1}</h4>
            <p className="text-sm mt-2">{topic}</p>
          </div>
        ))}

        {/* Quiz Box */}
        <div className="border-2 border-green-500 p-4 rounded shadow hover:bg-green-50 transition">
          <h4 className="font-semibold text-lg text-green-600">Quiz</h4>
          <p className="text-sm mt-2">Test your knowledge after completing this module.</p>
          <Link
            href={`/student/module/${id}/quiz`}
            className="inline-block mt-2 text-green-600 hover:underline text-sm"
          >
            Start Quiz →
          </Link>
        </div>
      </div>

      {/* Feedback Box */}
      <div className="border border-yellow-400 p-4 rounded bg-yellow-50 hover:bg-yellow-100 transition">
        <h4 className="font-semibold text-lg text-yellow-700">Have feedback?</h4>
        <p className="text-sm text-gray-700 mt-1">
          Share your thoughts to help us improve this module.
        </p>
        <Link
          href={`/student/module/${id}/feedback`}
          className="inline-block mt-2 text-yellow-700 hover:underline text-sm"
        >
          Leave Feedback →
        </Link>
      </div>
    </div>
  );
}
