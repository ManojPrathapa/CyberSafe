"use client";

import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/src/app/utils/apiConfig";
import { getToken } from "@/src/app/utils/auth";

export default function TrainerApproval() {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch pending trainers
  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const token = getToken();
        if (!token) {
          console.error("No token found. Please log in.");
          return;
        }

        const res = await fetch(`${API_BASE_URL}/api/admin/trainers/pending`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error(`Error: ${res.status}`);

        const data = await res.json();
        setTrainers(data);
      } catch (error) {
        console.error("Failed to fetch trainers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainers();
  }, []);

  // Approve Trainer
  const handleApprove = async (id) => {
    alert(`Approve trainer ID: ${id}`);
    // You can POST to your backend approval endpoint here
  };

  // Reject Trainer
  const handleReject = async (id) => {
    alert(`Reject trainer ID: ${id}`);
    // You can POST to your backend rejection endpoint here
  };

  if (loading) {
    return <p className="text-gray-500">Loading pending trainers...</p>;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-xl font-bold mb-4">Pending Trainer Approvals</h3>

      {trainers.length === 0 ? (
        <p>No pending trainers.</p>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border border-gray-200 rounded">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-left">ID</th>
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Email</th>
                  <th className="p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {trainers.map((trainer) => (
                  <tr key={trainer.id} className="border-t">
                    <td className="p-2">{trainer.id}</td>
                    <td className="p-2">{trainer.username}</td>
                    <td className="p-2">{trainer.email}</td>
                    <td className="p-2 space-x-2">
                      <button
                        onClick={() => handleApprove(trainer.id)}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(trainer.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {trainers.map((trainer) => (
              <div
                key={trainer.id}
                className="border rounded-lg p-3 shadow-sm bg-gray-50"
              >
                <p className="text-sm">
                  <span className="font-bold">ID:</span> {trainer.id}
                </p>
                <p className="text-sm">
                  <span className="font-bold">Name:</span> {trainer.username}
                </p>
                <p className="text-sm">
                  <span className="font-bold">Email:</span> {trainer.email}
                </p>

                <div className="flex flex-wrap gap-2 mt-2">
                  <button
                    onClick={() => handleApprove(trainer.id)}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(trainer.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                  >
                    Reject
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
