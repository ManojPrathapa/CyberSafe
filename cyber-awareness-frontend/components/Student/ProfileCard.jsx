"use client";

import { useState } from "react";
import { Pencil, Save, UploadCloud, User } from "lucide-react";

export default function ProfileCard() {
  const [editable, setEditable] = useState(false);
  const [profile, setProfile] = useState({
    name: "Aathavan",
    email: "aathavan@example.com",
    // expertise: "Network Security",
    // experience: "4 Years"
  });

  const handleChange = (field, value) => {
    setProfile({ ...profile, [field]: value });
  };

  return (
    <div className="bg-gradient-to-br from-indigo-100 to-purple-100 p-8 rounded-2xl shadow-xl max-w-2xl mx-auto text-gray-800">
      <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
        <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-purple-500 shadow-lg">
        <img src="/default-avatar.png" alt="Default Avatar" className="rounded-full" />

          <button className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow hover:bg-gray-100">
            <UploadCloud size={18} className="text-purple-600" />
          </button>
        </div>

        <div className="flex-1 space-y-3">
          <h2 className="text-3xl font-bold text-purple-700 flex items-center gap-2">
            <User /> Student Profile
          </h2>
          {/* <p className="text-sm text-gray-600">Empowering students through cybersecurity education 🌐</p> */}
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-inner space-y-4">
        <div>
          <label className="block font-semibold text-purple-700">Name</label>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => handleChange("name", e.target.value)}
            disabled={!editable}
            className="w-full px-4 py-2 border rounded bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-300"
          />
        </div>
        <div>
          <label className="block font-semibold text-purple-700">Email</label>
          <input
            type="email"
            value={profile.email}
            onChange={(e) => handleChange("email", e.target.value)}
            disabled={!editable}
            className="w-full px-4 py-2 border rounded bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-300"
          />
        </div>
        {/* <div>
          <label className="block font-semibold text-purple-700">Expertise</label>
          <input
            type="text"
            value={profile.expertise}
            onChange={(e) => handleChange("expertise", e.target.value)}
            disabled={!editable}
            className="w-full px-4 py-2 border rounded bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-300"
          />
        </div>
        <div>
          <label className="block font-semibold text-purple-700">Experience</label>
          <input
            type="text"
            value={profile.experience}
            onChange={(e) => handleChange("experience", e.target.value)}
            disabled={!editable}
            className="w-full px-4 py-2 border rounded bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-300"
          />
        </div> */}

        <div className="mt-4 flex justify-end gap-4">
          <button
            onClick={() => setEditable(!editable)}
            className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <Pencil size={16} /> {editable ? "Cancel" : "Edit"}
          </button>
          {editable && (
            <button
              onClick={() => setEditable(false)}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2"
            >
              <Save size={16} /> Save
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
