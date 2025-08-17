"use client";

import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/src/app/utils/apiConfig";
import { getToken } from "@/src/app/utils/auth";

export default function AllUsers() {
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch all users
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

      if (!res.ok) throw new Error(`Error: ${res.status}`);
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

  useEffect(() => {
    fetchUsers();
  }, []);

  // Block or Unblock user
  const handleToggleBlock = async (id, isActive) => {
    try {
      const token = getToken();
      const endpoint = isActive
        ? `${API_BASE_URL}/api/admin/block`
        : `${API_BASE_URL}/api/admin/unblock`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ user_id: id }),
      });

      if (!res.ok) throw new Error(`Error: ${res.status}`);
      const data = await res.json();
      alert(data.message);

      // Update local state immediately
      setUsers((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach((role) => {
          updated[role] = updated[role].map((u) =>
            u.id === id ? { ...u, isActive: isActive ? 0 : 1 } : u
          );
        });
        return updated;
      });
    } catch (error) {
      console.error("Error updating block/unblock:", error);
    }
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

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full border border-gray-200 rounded">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 text-left">ID</th>
                    <th className="p-2 text-left">Username</th>
                    <th className="p-2 text-left">Email</th>
                    <th className="p-2 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {roleUsers.map((user) => (
                    <tr key={user.id} className="border-t">
                      <td className="p-2">{user.id}</td>
                      <td className="p-2">{user.username}</td>
                      <td className="p-2">{user.email}</td>
                      <td className="p-2">
                        <button
                          onClick={() =>
                            handleToggleBlock(user.id, user.isActive)
                          }
                          className={`${
                            user.isActive
                              ? "bg-red-500 hover:bg-red-600"
                              : "bg-green-500 hover:bg-green-600"
                          } text-white px-3 py-1 rounded`}
                        >
                          {user.isActive ? "Block" : "Unblock"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
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

                  <button
                    onClick={() => handleToggleBlock(user.id, user.isActive)}
                    className={`${
                      user.isActive
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-green-500 hover:bg-green-600"
                    } text-white px-3 py-1 rounded text-sm mt-2`}
                  >
                    {user.isActive ? "Block" : "Unblock"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
