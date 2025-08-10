"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { apiHelpers, handleApiError } from "../../src/app/utils/apiConfig";

export default function ParentHome() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [topics, setTopics] = useState([]);

  // Fetch tips from backend using API helpers
  const fetchTopics = async () => {
    try {
      const tipsData = await apiHelpers.get('/tips');
      return tipsData;
    } catch (error) {
      console.error('Error fetching topics:', error);
      // Return fallback topics if API fails
      return handleApiError(error, [
        "Protection from cyberattacks",
        "Maintaining confidentiality",
        "Ensuring data integrity",
        "System availability",
        "Tools: firewalls, anti-malware, etc.",
        "Cybersecurity policies",
        "Educating & training children"
      ]);
    }
  };

  // Load topics on component mount
  useEffect(() => {
    const loadTopics = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const topicsData = await fetchTopics();
        
        // Transform tips data to topics format
        if (Array.isArray(topicsData) && topicsData.length > 0) {
          // If we get structured tip data, extract titles/content
          const transformedTopics = topicsData.map(tip => 
            tip.title || tip.content || "Cybersecurity topic"
          );
          setTopics(transformedTopics);
        } else {
          // Fallback to default topics
          setTopics([
            "Protection from cyberattacks",
            "Maintaining confidentiality",
            "Ensuring data integrity",
            "System availability",
            "Tools: firewalls, anti-malware, etc.",
            "Cybersecurity policies",
            "Educating & training children"
          ]);
        }
      } catch (error) {
        console.error('Error loading topics:', error);
        setError('Failed to load topics. Please try again.');
        
        // Set fallback topics
        setTopics([
          "Protection from cyberattacks",
          "Maintaining confidentiality",
          "Ensuring data integrity",
          "System availability",
          "Tools: firewalls, anti-malware, etc.",
          "Cybersecurity policies",
          "Educating & training children"
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadTopics();
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-purple-900">
        <h2 className="text-3xl font-bold text-purple-700 mb-6">Welcome,</h2>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading cybersecurity topics...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-purple-900">
        <h2 className="text-3xl font-bold text-purple-700 mb-6">Welcome,</h2>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 text-purple-900">
      <h2 className="text-3xl font-bold text-purple-700 mb-6">Welcome,</h2>
      <p className="mb-6 text-gray-700">
        Empower yourself with knowledge to support your child's safe digital experience.
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
              href={`/parent`}
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
