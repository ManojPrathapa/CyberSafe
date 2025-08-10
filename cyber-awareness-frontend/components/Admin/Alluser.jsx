"use client";

import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/src/app/utils/apiConfig";
import { getToken } from "@/src/app/utils/auth";

export default function AllUsers() {
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = getToken();
        if (!token) {
          console.error("No token found. Please log in.");
          return;
        }

        const res = await fetch(`${API_BASE_URL}/api/admin/users`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error(`Error: ${res.status}`);
        }

        const data = await res.json();

        // Group users by role
        const grouped = data.reduce((acc, user) => {
          if (!acc[user.role]) acc[user.role] = [];
          acc[user.role].push(user);
          return acc;
        }, {});

        setUsers(grouped);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Action buttons
  const handleWarn = (id) => {
    alert(`Warn user ID: ${id}`);
  };

  const handleBlock = async (id) => {
    try {
      const token = getToken();
      const res = await fetch(`${API_BASE_URL}/api/admin/block`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ user_id: id }),
      });

      const data = await res.json();
      alert(data.message);
    } catch (error) {
      console.error("Error blocking user:", error);
    }
  };

  const handleDelete = (id) => {
    alert(`Delete user ID: ${id}`);
  };

  if (loading) {
    return <p className="text-gray-500">Loading users...</p>;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-xl font-bold mb-4">All Users</h3>

      {Object.keys(users).length === 0 ? (
        <p>No users found.</p>
      ) : (
        Object.entries(users).map(([role, roleUsers]) => (
          <div key={role} className="mb-6">
            <h4 className="text-lg font-semibold text-blue-600 capitalize mb-3">
              {role}s
            </h4>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full border border-gray-200 rounded">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 text-left">ID</th>
                    <th className="p-2 text-left">Username</th>
                    <th className="p-2 text-left">Email</th>
                    <th className="p-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {roleUsers.map((user) => (
                    <tr key={user.id} className="border-t">
                      <td className="p-2">{user.id}</td>
                      <td className="p-2">{user.username}</td>
                      <td className="p-2">{user.email}</td>
                      <td className="p-2 space-x-2">
                        <button
                          onClick={() => handleWarn(user.id)}
                          className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                        >
                          Warn
                        </button>
                        <button
                          onClick={() => handleBlock(user.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                          Block
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {roleUsers.map((user) => (
                <div
                  key={user.id}
                  className="border rounded-lg p-3 shadow-sm bg-gray-50"
                >
                  <p className="text-sm">
                    <span className="font-bold">ID:</span> {user.id}
                  </p>
                  <p className="text-sm">
                    <span className="font-bold">Username:</span> {user.username}
                  </p>
                  <p className="text-sm">
                    <span className="font-bold">Email:</span> {user.email}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-2">
                    <button
                      onClick={() => handleWarn(user.id)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm"
                    >
                      Warn
                    </button>
                    <button
                      onClick={() => handleBlock(user.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                    >
                      Block
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
