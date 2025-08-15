"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiHelpers, handleApiError, isAuthenticated } from "../../src/app/utils/apiConfig";

export default function ParentHome() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [topics, setTopics] = useState([]);
  const router = useRouter();

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
      
      // Check if user is authenticated
      if (!isAuthenticated()) {
        console.log('ParentHome: User not authenticated, showing fallback topics');
        setTopics([
          { title: "Protection from cyberattacks", content: "Learn about protecting against various cyber threats." },
          { title: "Maintaining confidentiality", content: "Understand how to keep information secure." },
          { title: "Ensuring data integrity", content: "Learn about data protection and validation." },
          { title: "System availability", content: "Understand system security and uptime." },
          { title: "Tools: firewalls, anti-malware", content: "Learn about security tools and software." },
          { title: "Cybersecurity policies", content: "Understand organizational security policies." },
          { title: "Educating & training children", content: "Learn how to teach children about online safety." }
        ]);
        setLoading(false);
        return;
      }
      
      try {
        const topicsData = await fetchTopics();
        
        // Transform tips data to topics format
        if (Array.isArray(topicsData) && topicsData.length > 0) {
          // If we get structured tip data, use the tips directly
          setTopics(topicsData);
        } else {
                  // Fallback to default topics
        setTopics([
          { title: "Protection from cyberattacks", content: "Learn about protecting against various cyber threats." },
          { title: "Maintaining confidentiality", content: "Understand how to keep information secure." },
          { title: "Ensuring data integrity", content: "Learn about data protection and validation." },
          { title: "System availability", content: "Understand system security and uptime." },
          { title: "Tools: firewalls, anti-malware", content: "Learn about security tools and software." },
          { title: "Cybersecurity policies", content: "Understand organizational security policies." },
          { title: "Educating & training children", content: "Learn how to teach children about online safety." }
        ]);
        }
      } catch (error) {
        console.error('Error loading topics:', error);
        setError('Failed to load topics. Please try again.');
        
        // Set fallback topics
        setTopics([
          { title: "Protection from cyberattacks", content: "Learn about protecting against various cyber threats." },
          { title: "Maintaining confidentiality", content: "Understand how to keep information secure." },
          { title: "Ensuring data integrity", content: "Learn about data protection and validation." },
          { title: "System availability", content: "Understand system security and uptime." },
          { title: "Tools: firewalls, anti-malware", content: "Learn about security tools and software." },
          { title: "Cybersecurity policies", content: "Understand organizational security policies." },
          { title: "Educating & training children", content: "Learn how to teach children about online safety." }
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
            <h3 className="font-semibold text-lg text-black">{topic.title || topic}</h3>
            <p className="text-sm text-gray-600 mt-2">
              {topic.content || `Learn about: ${topic.title || topic}.`}
            </p>
        
              Explore →
      
          </div>
        ))}
      </div>
    </div>
  );
}
