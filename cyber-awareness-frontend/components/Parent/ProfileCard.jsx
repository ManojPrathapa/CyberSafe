"use client";

import { useState } from "react";
import Link from "next/link";

export default function ParentProfile() {
  const [name, setName] = useState("Parent_01");
  const [email, setEmail] = useState("parent@example.com");
  const [editingField, setEditingField] = useState(null);

  const [children, setChildren] = useState([
    { id: 1, name: "John", grade: "6" }
  ]);

  const handleRemoveChild = (id) => {
    setChildren(children.filter(child => child.id !== id));
  };

  const handleAddChild = () => {
    const newChild = {
      id: children.length + 1,
      name: `Child_${children.length + 1}`,
      grade: "7"
    };
    setChildren([...children, newChild]);
  };

  return (
    <div className="p-8 text-purple-900 min-h-screen">
      <h2 className="text-3xl font-bold text-purple-700 mb-6">👨‍👩‍👦 Your Profile</h2>

      {/* Profile Section */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
        {/* Profile Picture */}
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 rounded-full bg-purple-200 flex items-center justify-center text-purple-700 font-bold text-xl shadow">
            P
          </div>
          <button className="mt-2 text-sm text-blue-600 hover:underline">Change Picture</button>
        </div>

        {/* Info Boxes */}
        <div className="space-y-4 w-full md:w-2/3">
          {/* Name */}
          <div className="bg-white border border-purple-300 rounded p-4 shadow flex justify-between items-center">
            {editingField === "name" ? (
              <input
                type="text"
                className="flex-1 border px-2 py-1 rounded"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => setEditingField(null)}
              />
            ) : (
              <p><strong>Name:</strong> {name}</p>
            )}
            <button
              className="text-sm text-blue-600 hover:underline ml-4"
              onClick={() => setEditingField("name")}
            >
              Change
            </button>
          </div>

          {/* Email */}
          <div className="bg-white border border-purple-300 rounded p-4 shadow flex justify-between items-center">
            {editingField === "email" ? (
              <input
                type="email"
                className="flex-1 border px-2 py-1 rounded"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setEditingField(null)}
              />
            ) : (
              <p><strong>Email:</strong> {email}</p>
            )}
            <button
              className="text-sm text-blue-600 hover:underline ml-4"
              onClick={() => setEditingField("email")}
            >
              Change
            </button>
          </div>

          {/* Linked Children */}
          <div className="bg-white border border-purple-300 rounded p-4 shadow">
            <h3 className="text-lg font-semibold text-purple-700 mb-2">👶 Linked Children</h3>
            {children.map(child => (
              <div
                key={child.id}
                className="flex justify-between items-center text-sm bg-purple-50 p-2 rounded mb-2"
              >
                <p>
                  <strong>{child.name}</strong> – Grade {child.grade}
                </p>
                <button
                  onClick={() => handleRemoveChild(child.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-xs"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              onClick={handleAddChild}
              className="mt-2 text-sm bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
            >
              ➕ Add Child
            </button>
          </div>
        </div>
      </div>

      
    </div>
  );
}
