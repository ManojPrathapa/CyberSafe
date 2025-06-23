"use client";

import { useParams } from "next/navigation";
import { useState } from "react";

export default function ModuleFeedback() {
  const { id } = useParams();
  const [feedback, setFeedback] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Feedback for module", id, ":", feedback);
    alert("Feedback submitted!");
    setFeedback("");
  };

  return (
    <div className="p-8 text-purple-900 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold text-yellow-700 mb-4">
        Leave your feedback for Module {id}
      </h2>
      <form onSubmit={handleSubmit}>
        <textarea
          rows={6}
          className="w-full border border-yellow-400 rounded p-4 focus:outline-none focus:ring-2 focus:ring-yellow-300"
          placeholder="Type your feedback here..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          required
        />
        <button
          type="submit"
          className="mt-4 bg-yellow-500 text-white px-6 py-2 rounded hover:bg-yellow-600"
        >
          Submit Feedback
        </button>
      </form>
    </div>
  );
}
