"use client";

import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/src/app/utils/apiConfig";
import { getToken } from "@/src/app/utils/auth";

export default function ContentApproval() {
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch pending contents
  useEffect(() => {
    const fetchContents = async () => {
      try {
        const token = getToken();
        if (!token) {
          console.error("No token found. Please log in.");
          return;
        }

        const res = await fetch(`${API_BASE_URL}/admin/contents/pending`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error(`Error: ${res.status}`);

        const data = await res.json();
        setContents(data);
      } catch (error) {
        console.error("Failed to fetch contents:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContents();
  }, []);

  // Approve Content
  const handleApprove = async (id) => {
    try {
      const token = getToken();
      const res = await fetch(`${API_BASE_URL}/admin/contents/approve/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error(`Error approving content: ${res.status}`);

      // ✅ Remove approved content from UI without reload
      setContents((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.error(error);
      alert("Failed to approve content");
    }
  };

  if (loading) {
    return <p className="text-gray-500">Loading pending contents...</p>;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-xl font-bold mb-4">Pending Content Approvals</h3>

      {contents.length === 0 ? (
        <p>No pending contents 🎉</p>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border border-gray-200 rounded">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-left">ID</th>
                  <th className="p-2 text-left">Title</th>
                  <th className="p-2 text-left">Uploader</th>
                  <th className="p-2 text-left">Module</th>
                  <th className="p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {contents.map((content) => (
                  <tr key={content.id} className="border-t">
                    <td className="p-2">{content.id}</td>
                    <td className="p-2">{content.title}</td>
                    <td className="p-2">{content.uploaded_by}</td>
                    <td className="p-2">{content.module_id}</td>
                    <td className="p-2 space-x-2">
                      <button
                        onClick={() => handleApprove(content.id)}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      >
                        Approve
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {contents.map((content) => (
              <div
                key={content.id}
                className="border rounded-lg p-3 shadow-sm bg-gray-50"
              >
                <p className="text-sm">
                  <span className="font-bold">ID:</span> {content.id}
                </p>
                <p className="text-sm">
                  <span className="font-bold">Title:</span> {content.title}
                </p>
                <p className="text-sm">
                  <span className="font-bold">Uploader:</span>{" "}
                  {content.uploaded_by}
                </p>
                <p className="text-sm">
                  <span className="font-bold">Module:</span> {content.module_id}
                </p>

                <div className="flex flex-wrap gap-2 mt-2">
                  <button
                    onClick={() => handleApprove(content.id)}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm"
                  >
                    Approve
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
