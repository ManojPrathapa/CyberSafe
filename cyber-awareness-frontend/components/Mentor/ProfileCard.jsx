"use client";
import { useEffect } from "react";
import { useState } from "react";
import { Pencil, Save, UploadCloud, User } from "lucide-react";
import { getToken } from "@/src/app/utils/auth";
import { getUser } from "@/src/app/utils/auth";
import { API_BASE_URL } from "@/src/app/utils/apiConfig";

export default function ProfileCard() {
  const [editable, setEditable] = useState(false);
  const [profile, setProfile] = useState({});

  const handleChange = (field, value) => {
    setProfile({ ...profile, [field]: value });
  };

  const Profile_Details = async () => {
    try {
      const token = getToken();
      if (!token) {
        console.error("No token found. Please log in.");
        return;
      }
      const user = getUser();
      console.log(user);
      const res = await fetch(`${API_BASE_URL}/api/profile/${user.id}`, {
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

      console.log(data);
      const grouped = {
        name: data.name,
        user_email: data.email,
        experience: data.experience,
        expertise: data.expertise,
      };
      setProfile(grouped);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      console.log("In Finally");
    }
  };

  const Edit_Profile_Details = async () => {
    try {
      const token = getToken();
      if (!token) {
        console.error("No token found. Please log in.");
        return;
      }
      const user = getUser();
      const res = await fetch(`${API_BASE_URL}/api/profile/mentor/edit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: user.id,
          username: profile.name,
          email: profile.user_email,
          expertise: profile.expertise,
          experience_years: profile.experience,
        }),
      });
      console.log("Inside Edit Profile");
      const data = await res.json();
    } catch (error) {
      console.error("Editing Profile Failed:", error);
    }
  };

  useEffect(() => {
    Profile_Details();
    console.log("Profile Details are fetched");
  }, []);

  return (
    <div className="bg-gradient-to-br from-indigo-100 to-purple-100 p-8 rounded-2xl shadow-xl max-w-2xl mx-auto text-gray-800">
      <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
        <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-purple-500 shadow-lg">
          <img
            src="/default-avatar.png"
            alt="Default Avatar"
            className="rounded-full"
          />

          <button className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow hover:bg-gray-100">
            <UploadCloud size={18} className="text-purple-600" />
          </button>
        </div>

        <div className="flex-1 space-y-3">
          <h2 className="text-3xl font-bold text-purple-700 flex items-center gap-2">
            <User /> Mentor Profile
          </h2>
          <p className="text-sm text-gray-600">
            Empowering students through cybersecurity education 🌐
          </p>
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
            value={profile.user_email}
            onChange={(e) => handleChange("user_email", e.target.value)}
            disabled={!editable}
            className="w-full px-4 py-2 border rounded bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-300"
          />
        </div>
        <div>
          <label className="block font-semibold text-purple-700">
            Expertise
          </label>
          <input
            type="text"
            value={profile.expertise}
            onChange={(e) => handleChange("expertise", e.target.value)}
            disabled={!editable}
            className="w-full px-4 py-2 border rounded bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-300"
          />
        </div>
        <div>
          <label className="block font-semibold text-purple-700">
            Experience
          </label>
          <input
            type="text"
            value={profile.experience}
            onChange={(e) => handleChange("experience", e.target.value)}
            disabled={!editable}
            className="w-full px-4 py-2 border rounded bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-300"
          />
        </div>

        <div className="mt-4 flex justify-end gap-4">
          <button
            onClick={() => setEditable(!editable)}
            className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <Pencil size={16} /> {editable ? "Cancel" : "Edit"}
          </button>
          {editable && (
            <button
              onClick={() => {
                setEditable(false), Edit_Profile_Details();
              }}
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
