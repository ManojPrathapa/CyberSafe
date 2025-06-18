"use client";

import { useParams } from "next/navigation";

export default function ModuleQuiz() {
  const { id } = useParams();

  return (
    <div className="p-8 text-purple-900">
      <h2 className="text-3xl font-bold text-green-600 mb-6">Module {id} Quiz</h2>
      <p>🎯 This is where the quiz for Module {id} will appear.</p>
    </div>
  );
}
