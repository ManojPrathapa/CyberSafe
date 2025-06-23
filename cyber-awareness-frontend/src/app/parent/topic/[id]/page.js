"use client";

import { useParams } from "next/navigation";
import Link from "next/link";

export default function ParentTopicPage() {
  const { id } = useParams();

  const subtopics = [
    "Understanding online risks",
    "Monitoring children's digital activity",
    "Safe social media usage",
    "Parental control tools",
    "Building trust and awareness"
  ];

  return (
    <div className="p-8 text-purple-900">
      <h2 className="text-3xl font-bold text-purple-700 mb-6">Topic {id}</h2>

      {/* Subtopic Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
        {subtopics.map((sub, index) => (
          <div
            key={index}
            className="border border-purple-300 bg-white p-5 rounded shadow hover:shadow-md hover:bg-purple-50 transition"
          >
            <h4 className="font-semibold text-lg text-purple-900 mb-1">
              Topic {id}.{index + 1}
            </h4>
            <p className="text-sm text-gray-600">{sub}</p>
          </div>
        ))}
      </div>

      {/* Feedback Box */}
      <div className="border border-yellow-400 p-4 rounded bg-yellow-50 hover:bg-yellow-100 transition">
        <h4 className="font-semibold text-lg text-yellow-700">Have feedback?</h4>
        <p className="text-sm text-gray-700 mt-1">
          Share your thoughts to help us improve this topic.
        </p>
        <Link
          href={`/parent/topic/${id}/feedback`}
          className="inline-block mt-2 text-yellow-700 hover:underline text-sm"
        >
          Leave Feedback →
        </Link>
      </div>
    </div>
  );
}
